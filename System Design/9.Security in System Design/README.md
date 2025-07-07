# Security in System Design

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Encryption](#encryption)
3. [Rate Limiting & Web Application Firewalls](#rate-limiting--web-application-firewalls)
4. [Secure Credential Storage](#secure-credential-storage)

---

## 1. Authentication & Authorization

Authentication and authorization are fundamental security mechanisms that verify user identity and control access to system resources.

### OAuth2

OAuth2 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service.

#### OAuth2 Flow Types

##### Authorization Code Flow
- **Use Case**: Server-side web applications
- **Security**: Most secure flow type
- **Process**: Client redirects user to authorization server, receives authorization code, exchanges code for access token

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant AuthServer
    participant ResourceServer
    
    User->>Client: 1. Access protected resource
    Client->>User: 2. Redirect to authorization server
    User->>AuthServer: 3. Login and grant permission
    AuthServer->>Client: 4. Return authorization code
    Client->>AuthServer: 5. Exchange code for access token
    AuthServer->>Client: 6. Return access token
    Client->>ResourceServer: 7. Request resource with token
    ResourceServer->>Client: 8. Return protected resource
```

##### Implicit Flow
- **Use Case**: Single-page applications (SPAs)
- **Security**: Less secure, tokens exposed in browser
- **Process**: Direct token return without intermediate authorization code

##### Client Credentials Flow
- **Use Case**: Server-to-server communication
- **Security**: No user context, machine-to-machine
- **Process**: Direct token exchange using client credentials

##### Resource Owner Password Credentials Flow
- **Use Case**: Trusted applications only
- **Security**: Least secure, requires user credentials
- **Process**: Direct username/password exchange for token

#### OAuth2 Implementation Example

```python
# OAuth2 Authorization Server Implementation
from flask import Flask, request, jsonify, redirect
import jwt
import secrets
import time

class OAuth2Server:
    def __init__(self):
        self.clients = {
            'client123': {
                'secret': 'secret456',
                'redirect_uris': ['https://app.example.com/callback'],
                'scopes': ['read', 'write']
            }
        }
        self.authorization_codes = {}
        self.access_tokens = {}
    
    def generate_authorization_code(self, client_id, user_id, scopes):
        code = secrets.token_urlsafe(32)
        self.authorization_codes[code] = {
            'client_id': client_id,
            'user_id': user_id,
            'scopes': scopes,
            'expires_at': time.time() + 600  # 10 minutes
        }
        return code
    
    def exchange_code_for_token(self, code, client_id, client_secret):
        if code not in self.authorization_codes:
            return None
        
        auth_data = self.authorization_codes[code]
        
        # Validate client credentials
        if (auth_data['client_id'] != client_id or 
            self.clients.get(client_id, {}).get('secret') != client_secret):
            return None
        
        # Check expiration
        if time.time() > auth_data['expires_at']:
            del self.authorization_codes[code]
            return None
        
        # Generate access token
        access_token = jwt.encode({
            'user_id': auth_data['user_id'],
            'client_id': client_id,
            'scopes': auth_data['scopes'],
            'exp': time.time() + 3600  # 1 hour
        }, 'secret_key', algorithm='HS256')
        
        # Clean up authorization code
        del self.authorization_codes[code]
        
        return {
            'access_token': access_token,
            'token_type': 'Bearer',
            'expires_in': 3600,
            'scope': ' '.join(auth_data['scopes'])
        }

# OAuth2 Client Implementation
import requests

class OAuth2Client:
    def __init__(self, client_id, client_secret, auth_url, token_url):
        self.client_id = client_id
        self.client_secret = client_secret
        self.auth_url = auth_url
        self.token_url = token_url
    
    def get_authorization_url(self, redirect_uri, scopes, state=None):
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes),
            'state': state or secrets.token_urlsafe(16)
        }
        
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{self.auth_url}?{query_string}"
    
    def exchange_code_for_token(self, code, redirect_uri):
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        }
        
        response = requests.post(self.token_url, data=data)
        return response.json()
```

### JWT (JSON Web Tokens)

JWT is a compact, URL-safe means of representing claims between two parties.

#### JWT Structure

```
Header.Payload.Signature
```

- **Header**: Token type and signing algorithm
- **Payload**: Claims (user data, permissions, expiration)
- **Signature**: Verification of token integrity

#### JWT Implementation

```python
import jwt
import time
from datetime import datetime, timedelta

class JWTManager:
    def __init__(self, secret_key, algorithm='HS256'):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def generate_token(self, user_id, roles=None, expires_in_hours=24):
        """Generate a JWT token for a user"""
        now = datetime.utcnow()
        
        payload = {
            'user_id': user_id,
            'roles': roles or [],
            'iat': now,  # Issued at
            'exp': now + timedelta(hours=expires_in_hours),  # Expiration
            'nbf': now,  # Not before
            'jti': secrets.token_urlsafe(16)  # JWT ID for revocation
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token):
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm],
                options={
                    'verify_exp': True,
                    'verify_iat': True,
                    'verify_nbf': True
                }
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")
    
    def refresh_token(self, token, new_expires_in_hours=24):
        """Refresh a JWT token with new expiration"""
        try:
            # Decode without verifying expiration
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm],
                options={'verify_exp': False}
            )
            
            # Update timestamps
            now = datetime.utcnow()
            payload['iat'] = now
            payload['exp'] = now + timedelta(hours=new_expires_in_hours)
            payload['jti'] = secrets.token_urlsafe(16)
            
            return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        except jwt.InvalidTokenError:
            raise Exception("Cannot refresh invalid token")

# JWT Middleware for Flask
from functools import wraps
from flask import request, jsonify

def jwt_required(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            
            # Get token from Authorization header
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            
            if not token:
                return jsonify({'error': 'Token is missing'}), 401
            
            try:
                jwt_manager = JWTManager('your-secret-key')
                payload = jwt_manager.verify_token(token)
                
                # Check roles if specified
                if roles:
                    user_roles = payload.get('roles', [])
                    if not any(role in user_roles for role in roles):
                        return jsonify({'error': 'Insufficient permissions'}), 403
                
                # Add user info to request context
                request.current_user = payload
                
            except Exception as e:
                return jsonify({'error': str(e)}), 401
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage example
@app.route('/protected')
@jwt_required(roles=['admin', 'user'])
def protected_route():
    user_id = request.current_user['user_id']
    return jsonify({'message': f'Hello user {user_id}'})
```

### API Keys

API keys are simple authentication tokens used to identify and authenticate API clients.

#### API Key Management System

```python
import secrets
import hashlib
import time
from datetime import datetime, timedelta

class APIKeyManager:
    def __init__(self, database):
        self.db = database
    
    def generate_api_key(self, user_id, name, scopes=None, expires_in_days=None):
        """Generate a new API key for a user"""
        # Generate a secure random key
        api_key = f"ak_{secrets.token_urlsafe(32)}"
        
        # Hash the key for storage
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        # Calculate expiration
        expires_at = None
        if expires_in_days:
            expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        # Store in database
        key_data = {
            'key_hash': key_hash,
            'user_id': user_id,
            'name': name,
            'scopes': scopes or [],
            'created_at': datetime.utcnow(),
            'expires_at': expires_at,
            'last_used': None,
            'is_active': True
        }
        
        self.db.api_keys.insert(key_data)
        
        return api_key
    
    def validate_api_key(self, api_key):
        """Validate an API key and return associated user data"""
        if not api_key or not api_key.startswith('ak_'):
            return None
        
        # Hash the provided key
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        # Look up in database
        key_data = self.db.api_keys.find_one({
            'key_hash': key_hash,
            'is_active': True
        })
        
        if not key_data:
            return None
        
        # Check expiration
        if key_data['expires_at'] and datetime.utcnow() > key_data['expires_at']:
            return None
        
        # Update last used timestamp
        self.db.api_keys.update_one(
            {'key_hash': key_hash},
            {'$set': {'last_used': datetime.utcnow()}}
        )
        
        return {
            'user_id': key_data['user_id'],
            'scopes': key_data['scopes'],
            'key_name': key_data['name']
        }
    
    def revoke_api_key(self, key_hash):
        """Revoke an API key"""
        self.db.api_keys.update_one(
            {'key_hash': key_hash},
            {'$set': {'is_active': False, 'revoked_at': datetime.utcnow()}}
        )
    
    def list_user_keys(self, user_id):
        """List all API keys for a user"""
        return list(self.db.api_keys.find(
            {'user_id': user_id, 'is_active': True},
            {'key_hash': 0}  # Don't return the hash
        ))

# API Key Middleware
def api_key_required(scopes=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            api_key = request.headers.get('X-API-Key')
            
            if not api_key:
                return jsonify({'error': 'API key is required'}), 401
            
            api_key_manager = APIKeyManager(database)
            key_data = api_key_manager.validate_api_key(api_key)
            
            if not key_data:
                return jsonify({'error': 'Invalid API key'}), 401
            
            # Check scopes if specified
            if scopes:
                key_scopes = key_data.get('scopes', [])
                if not any(scope in key_scopes for scope in scopes):
                    return jsonify({'error': 'Insufficient API key permissions'}), 403
            
            request.api_key_data = key_data
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

---

## 2. Encryption

Encryption protects data confidentiality by transforming readable data into an unreadable format using cryptographic algorithms.

### TLS (Transport Layer Security)

TLS secures data transmission between clients and servers over networks.

#### TLS Handshake Process

1. **Client Hello**: Client sends supported cipher suites and TLS version
2. **Server Hello**: Server selects cipher suite and sends certificate
3. **Certificate Verification**: Client validates server certificate
4. **Key Exchange**: Parties establish shared encryption keys
5. **Finished**: Both parties confirm successful handshake

#### TLS Implementation

```python
import ssl
import socket
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import datetime

class TLSManager:
    def __init__(self):
        self.ca_cert = None
        self.ca_key = None
    
    def generate_ca_certificate(self):
        """Generate a Certificate Authority (CA) certificate"""
        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        
        # Create certificate
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "CA"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "San Francisco"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "My Company"),
            x509.NameAttribute(NameOID.COMMON_NAME, "My CA"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=3650)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
            ]),
            critical=False,
        ).add_extension(
            x509.BasicConstraints(ca=True, path_length=None),
            critical=True,
        ).sign(private_key, hashes.SHA256())
        
        self.ca_cert = cert
        self.ca_key = private_key
        
        return cert, private_key
    
    def generate_server_certificate(self, hostname):
        """Generate a server certificate signed by CA"""
        if not self.ca_cert or not self.ca_key:
            raise ValueError("CA certificate not generated")
        
        # Generate server private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        
        # Create server certificate
        subject = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "CA"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "San Francisco"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "My Company"),
            x509.NameAttribute(NameOID.COMMON_NAME, hostname),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            self.ca_cert.issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName(hostname),
            ]),
            critical=False,
        ).sign(self.ca_key, hashes.SHA256())
        
        return cert, private_key
    
    def create_ssl_context(self, cert_file, key_file, ca_file=None):
        """Create SSL context for secure connections"""
        context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
        
        # Load server certificate and key
        context.load_cert_chain(cert_file, key_file)
        
        # Load CA certificate if provided
        if ca_file:
            context.load_verify_locations(ca_file)
        
        # Security settings
        context.check_hostname = True
        context.verify_mode = ssl.CERT_REQUIRED
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        
        # Disable weak ciphers
        context.set_ciphers('ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS')
        
        return context

# HTTPS Server Implementation
from http.server import HTTPServer, BaseHTTPRequestHandler

class SecureHTTPServer:
    def __init__(self, host, port, cert_file, key_file):
        self.host = host
        self.port = port
        self.cert_file = cert_file
        self.key_file = key_file
    
    def start_server(self):
        """Start HTTPS server with TLS"""
        httpd = HTTPServer((self.host, self.port), BaseHTTPRequestHandler)
        
        # Wrap socket with SSL
        context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        context.load_cert_chain(self.cert_file, self.key_file)
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        print(f"HTTPS Server running on https://{self.host}:{self.port}")
        httpd.serve_forever()
```

### Encryption at Rest

Encryption at rest protects stored data from unauthorized access.

#### Database Encryption

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class DatabaseEncryption:
    def __init__(self, password):
        self.password = password.encode()
        self.salt = os.urandom(16)
        self.key = self._derive_key()
        self.cipher_suite = Fernet(self.key)
    
    def _derive_key(self):
        """Derive encryption key from password"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=self.salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(self.password))
        return key
    
    def encrypt_field(self, plaintext):
        """Encrypt a database field"""
        if plaintext is None:
            return None
        
        encrypted_data = self.cipher_suite.encrypt(plaintext.encode())
        # Prepend salt for storage
        return base64.b64encode(self.salt + encrypted_data).decode()
    
    def decrypt_field(self, encrypted_data):
        """Decrypt a database field"""
        if encrypted_data is None:
            return None
        
        try:
            # Decode and separate salt from encrypted data
            data = base64.b64decode(encrypted_data.encode())
            stored_salt = data[:16]
            encrypted_content = data[16:]
            
            # Derive key with stored salt
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=stored_salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(self.password))
            cipher_suite = Fernet(key)
            
            # Decrypt
            decrypted_data = cipher_suite.decrypt(encrypted_content)
            return decrypted_data.decode()
        
        except Exception as e:
            raise ValueError(f"Decryption failed: {e}")

# Usage with SQLAlchemy
from sqlalchemy import Column, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TypeDecorator, TEXT

class EncryptedType(TypeDecorator):
    impl = TEXT
    
    def __init__(self, secret_key, **kwargs):
        self.secret_key = secret_key
        super().__init__(**kwargs)
    
    def process_bind_param(self, value, dialect):
        if value is not None:
            encryptor = DatabaseEncryption(self.secret_key)
            return encryptor.encrypt_field(value)
        return value
    
    def process_result_value(self, value, dialect):
        if value is not None:
            encryptor = DatabaseEncryption(self.secret_key)
            return encryptor.decrypt_field(value)
        return value

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(EncryptedType('your-secret-key'), nullable=False)
    ssn = Column(EncryptedType('your-secret-key'), nullable=True)
```

### Encryption in Transit

Protecting data during transmission between systems.

#### Message-Level Encryption

```python
import json
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

class MessageEncryption:
    def __init__(self):
        self.private_key = None
        self.public_key = None
    
    def generate_key_pair(self):
        """Generate RSA key pair for asymmetric encryption"""
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        self.public_key = self.private_key.public_key()
        
        return self.private_key, self.public_key
    
    def encrypt_message(self, message, recipient_public_key):
        """Encrypt message with recipient's public key"""
        # For large messages, use hybrid encryption
        # Generate symmetric key
        symmetric_key = Fernet.generate_key()
        cipher_suite = Fernet(symmetric_key)
        
        # Encrypt message with symmetric key
        encrypted_message = cipher_suite.encrypt(message.encode())
        
        # Encrypt symmetric key with recipient's public key
        encrypted_key = recipient_public_key.encrypt(
            symmetric_key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return {
            'encrypted_key': base64.b64encode(encrypted_key).decode(),
            'encrypted_message': base64.b64encode(encrypted_message).decode()
        }
    
    def decrypt_message(self, encrypted_data):
        """Decrypt message with private key"""
        encrypted_key = base64.b64decode(encrypted_data['encrypted_key'])
        encrypted_message = base64.b64decode(encrypted_data['encrypted_message'])
        
        # Decrypt symmetric key
        symmetric_key = self.private_key.decrypt(
            encrypted_key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        # Decrypt message
        cipher_suite = Fernet(symmetric_key)
        decrypted_message = cipher_suite.decrypt(encrypted_message)
        
        return decrypted_message.decode()
    
    def sign_message(self, message):
        """Sign message with private key"""
        signature = self.private_key.sign(
            message.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return base64.b64encode(signature).decode()
    
    def verify_signature(self, message, signature, sender_public_key):
        """Verify message signature"""
        try:
            signature_bytes = base64.b64decode(signature)
            sender_public_key.verify(
                signature_bytes,
                message.encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False
```

---

## 3. Rate Limiting & Web Application Firewalls

Rate limiting and WAFs protect applications from abuse and malicious attacks.

### Rate Limiting Implementation

```python
import time
import redis
from collections import defaultdict
from datetime import datetime, timedelta
import threading

class RateLimiter:
    def __init__(self, redis_client=None):
        self.redis = redis_client
        self.local_cache = defaultdict(list)
        self.lock = threading.Lock()
    
    def is_allowed(self, identifier, limit, window_seconds, use_redis=True):
        """Check if request is within rate limit"""
        if use_redis and self.redis:
            return self._redis_rate_limit(identifier, limit, window_seconds)
        else:
            return self._memory_rate_limit(identifier, limit, window_seconds)
    
    def _redis_rate_limit(self, identifier, limit, window_seconds):
        """Redis-based distributed rate limiting"""
        key = f"rate_limit:{identifier}"
        now = time.time()
        pipeline = self.redis.pipeline()
        
        # Remove expired entries
        pipeline.zremrangebyscore(key, 0, now - window_seconds)
        
        # Count current requests
        pipeline.zcard(key)
        
        # Add current request
        pipeline.zadd(key, {str(now): now})
        
        # Set expiration
        pipeline.expire(key, window_seconds)
        
        results = pipeline.execute()
        current_requests = results[1]
        
        return current_requests < limit
    
    def _memory_rate_limit(self, identifier, limit, window_seconds):
        """In-memory rate limiting"""
        with self.lock:
            now = time.time()
            
            # Clean old requests
            self.local_cache[identifier] = [
                req_time for req_time in self.local_cache[identifier]
                if now - req_time < window_seconds
            ]
            
            # Check limit
            if len(self.local_cache[identifier]) >= limit:
                return False
            
            # Add current request
            self.local_cache[identifier].append(now)
            return True

# Advanced Rate Limiting with Multiple Tiers
class TieredRateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.tiers = {
            'basic': {'requests': 100, 'window': 3600},      # 100/hour
            'premium': {'requests': 1000, 'window': 3600},   # 1000/hour
            'enterprise': {'requests': 10000, 'window': 3600} # 10000/hour
        }
    
    def get_user_tier(self, user_id):
        """Get user's rate limit tier from database"""
        # Implementation depends on your user system
        return 'basic'  # Default tier
    
    def check_rate_limit(self, user_id, endpoint=None):
        """Check rate limit with user tier and endpoint-specific limits"""
        user_tier = self.get_user_tier(user_id)
        tier_config = self.tiers[user_tier]
        
        # Global user rate limit
        global_key = f"rate_limit:user:{user_id}"
        global_allowed = self._check_limit(
            global_key, 
            tier_config['requests'], 
            tier_config['window']
        )
        
        if not global_allowed:
            return False, "Global rate limit exceeded"
        
        # Endpoint-specific rate limit
        if endpoint:
            endpoint_key = f"rate_limit:endpoint:{endpoint}:{user_id}"
            endpoint_limit = tier_config['requests'] // 10  # 10% of global limit per endpoint
            endpoint_allowed = self._check_limit(
                endpoint_key, 
                endpoint_limit, 
                tier_config['window']
            )
            
            if not endpoint_allowed:
                return False, f"Endpoint rate limit exceeded for {endpoint}"
        
        return True, "Request allowed"
    
    def _check_limit(self, key, limit, window):
        """Check individual rate limit"""
        now = time.time()
        pipeline = self.redis.pipeline()
        
        pipeline.zremrangebyscore(key, 0, now - window)
        pipeline.zcard(key)
        pipeline.zadd(key, {str(now): now})
        pipeline.expire(key, window)
        
        results = pipeline.execute()
        current_requests = results[1]
        
        return current_requests < limit

# Rate Limiting Middleware for Flask
from flask import request, jsonify
from functools import wraps

def rate_limit(requests_per_hour=100, per_endpoint=False):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get user identifier
            user_id = getattr(request, 'current_user', {}).get('user_id')
            if not user_id:
                # Use IP address for anonymous users
                user_id = request.remote_addr
            
            # Get endpoint if per_endpoint is True
            endpoint = request.endpoint if per_endpoint else None
            
            # Check rate limit
            rate_limiter = TieredRateLimiter(redis_client)
            allowed, message = rate_limiter.check_rate_limit(user_id, endpoint)
            
            if not allowed:
                return jsonify({
                    'error': message,
                    'retry_after': 3600  # seconds
                }), 429
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage
@app.route('/api/data')
@rate_limit(requests_per_hour=1000, per_endpoint=True)
def get_data():
    return jsonify({'data': 'your data here'})
```

### Web Application Firewall (WAF)

```python
import re
import ipaddress
from urllib.parse import unquote
import json

class WebApplicationFirewall:
    def __init__(self):
        self.blocked_ips = set()
        self.allowed_ips = set()
        self.sql_injection_patterns = [
            r"(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)",
            r"\b(select|insert|update|delete|drop|create|alter)\b.*\b(from|into|set|table)\b",
            r"(\bor\b|\band\b).*=.*(\bor\b|\band\b)",
            r"(\'|\"|`|;|\-\-|\/\*|\*\/)",
            r"\b(exec|execute|sp_|xp_)\b",
        ]
        self.xss_patterns = [
            r"<script[^>]*>.*?</script>",
            r"javascript:",
            r"on\w+\s*=",
            r"<iframe[^>]*>.*?</iframe>",
            r"<object[^>]*>.*?</object>",
        ]
        self.path_traversal_patterns = [
            r"\.\.[\\/]",
            r"[\\/]\.\.[\\/]",
            r"\.\.%2f",
            r"%2e%2e%2f",
        ]
    
    def check_ip_whitelist(self, ip_address):
        """Check if IP is in whitelist"""
        try:
            ip = ipaddress.ip_address(ip_address)
            
            # Check if IP is in allowed list
            for allowed_ip in self.allowed_ips:
                if ip in ipaddress.ip_network(allowed_ip, strict=False):
                    return True
            
            # If whitelist exists and IP not in it, block
            if self.allowed_ips:
                return False
            
            return True
        except ValueError:
            return False
    
    def check_ip_blacklist(self, ip_address):
        """Check if IP is in blacklist"""
        try:
            ip = ipaddress.ip_address(ip_address)
            
            for blocked_ip in self.blocked_ips:
                if ip in ipaddress.ip_network(blocked_ip, strict=False):
                    return False
            
            return True
        except ValueError:
            return False
    
    def detect_sql_injection(self, input_data):
        """Detect SQL injection attempts"""
        if not input_data:
            return False
        
        # URL decode the input
        decoded_input = unquote(str(input_data).lower())
        
        for pattern in self.sql_injection_patterns:
            if re.search(pattern, decoded_input, re.IGNORECASE):
                return True
        
        return False
    
    def detect_xss(self, input_data):
        """Detect XSS attempts"""
        if not input_data:
            return False
        
        decoded_input = unquote(str(input_data))
        
        for pattern in self.xss_patterns:
            if re.search(pattern, decoded_input, re.IGNORECASE):
                return True
        
        return False
    
    def detect_path_traversal(self, input_data):
        """Detect path traversal attempts"""
        if not input_data:
            return False
        
        decoded_input = unquote(str(input_data))
        
        for pattern in self.path_traversal_patterns:
            if re.search(pattern, decoded_input, re.IGNORECASE):
                return True
        
        return False
    
    def validate_request(self, request_data):
        """Validate entire request against WAF rules"""
        violations = []
        
        # Check IP address
        client_ip = request_data.get('client_ip')
        if client_ip:
            if not self.check_ip_whitelist(client_ip):
                violations.append("IP not in whitelist")
            
            if not self.check_ip_blacklist(client_ip):
                violations.append("IP in blacklist")
        
        # Check all input data
        all_inputs = []
        
        # Add query parameters
        if 'query_params' in request_data:
            for key, value in request_data['query_params'].items():
                all_inputs.extend([key, value])
        
        # Add form data
        if 'form_data' in request_data:
            for key, value in request_data['form_data'].items():
                all_inputs.extend([key, value])
        
        # Add headers
        if 'headers' in request_data:
            for key, value in request_data['headers'].items():
                all_inputs.extend([key, value])
        
        # Add URL path
        if 'path' in request_data:
            all_inputs.append(request_data['path'])
        
        # Check each input against all patterns
        for input_data in all_inputs:
            if self.detect_sql_injection(input_data):
                violations.append(f"SQL injection detected: {input_data[:100]}")
            
            if self.detect_xss(input_data):
                violations.append(f"XSS detected: {input_data[:100]}")
            
            if self.detect_path_traversal(input_data):
                violations.append(f"Path traversal detected: {input_data[:100]}")
        
        return len(violations) == 0, violations

# WAF Middleware for Flask
from flask import request, jsonify, abort

class WAFMiddleware:
    def __init__(self, app):
        self.app = app
        self.waf = WebApplicationFirewall()
        
        # Add some default blocked IPs (example)
        self.waf.blocked_ips.add('192.168.1.100/32')
        
        # Process each request
        app.before_request(self.process_request)
    
    def process_request(self):
        """Process each incoming request through WAF"""
        request_data = {
            'client_ip': request.remote_addr,
            'path': request.path,
            'query_params': dict(request.args),
            'form_data': dict(request.form) if request.form else {},
            'headers': dict(request.headers),
        }
        
        # Add JSON data if present
        if request.is_json:
            try:
                request_data['json_data'] = request.get_json()
            except:
                pass
        
        is_valid, violations = self.waf.validate_request(request_data)
        
        if not is_valid:
            # Log the violation
            self.log_violation(request_data, violations)
            
            # Block the request
            return jsonify({
                'error': 'Request blocked by WAF',
                'request_id': self.generate_request_id()
            }), 403
    
    def log_violation(self, request_data, violations):
        """Log WAF violations"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'client_ip': request_data.get('client_ip'),
            'path': request_data.get('path'),
            'violations': violations,
            'user_agent': request_data.get('headers', {}).get('User-Agent'),
        }
        
        # Log to file, database, or security system
        print(f"WAF Violation: {json.dumps(log_entry)}")
    
    def generate_request_id(self):
        """Generate unique request ID for tracking"""
        import uuid
        return str(uuid.uuid4())

# Usage
app = Flask(__name__)
waf_middleware = WAFMiddleware(app)
```

---

## 4. Secure Credential Storage

Secure credential storage protects sensitive authentication data from unauthorized access.

### HashiCorp Vault Integration

```python
import hvac
import json
from datetime import datetime, timedelta

class VaultManager:
    def __init__(self, vault_url, vault_token=None):
        self.client = hvac.Client(url=vault_url, token=vault_token)
        
        if not self.client.is_authenticated():
            raise Exception("Failed to authenticate with Vault")
    
    def setup_database_secrets_engine(self, mount_point='database'):
        """Setup database secrets engine"""
        # Enable database secrets engine
        self.client.sys.enable_secrets_engine(
            backend_type='database',
            path=mount_point
        )
        
        # Configure database connection
        self.client.secrets.database.configure(
            name='postgresql-db',
            plugin_name='postgresql-database-plugin',
            connection_url='postgresql://{{username}}:{{password}}@localhost:5432/myapp',
            allowed_roles=['readonly', 'readwrite'],
            username='vault-admin',
            password='vault-admin-password'
        )
    
    def create_database_role(self, role_name, db_name, creation_statements):
        """Create a database role for dynamic credential generation"""
        self.client.secrets.database.create_role(
            name=role_name,
            db_name=db_name,
            creation_statements=creation_statements,
            default_ttl='1h',
            max_ttl='24h'
        )
    
    def get_database_credentials(self, role_name):
        """Get dynamic database credentials"""
        response = self.client.secrets.database.generate_credentials(name=role_name)
        return {
            'username': response['data']['username'],
            'password': response['data']['password'],
            'lease_id': response['lease_id'],
            'lease_duration': response['lease_duration']
        }
    
    def store_static_secret(self, path, secret_data):
        """Store static secret in Vault"""
        self.client.secrets.kv.v2.create_or_update_secret(
            path=path,
            secret=secret_data
        )
    
    def retrieve_secret(self, path):
        """Retrieve secret from Vault"""
        try:
            response = self.client.secrets.kv.v2.read_secret_version(path=path)
            return response['data']['data']
        except hvac.exceptions.InvalidPath:
            return None
    
    def create_policy(self, policy_name, policy_rules):
        """Create Vault policy"""
        self.client.sys.create_or_update_policy(
            name=policy_name,
            policy=policy_rules
        )
    
    def create_app_role(self, role_name, policies, secret_id_ttl='24h'):
        """Create AppRole for application authentication"""
        # Enable AppRole auth method
        try:
            self.client.sys.enable_auth_method('approle')
        except hvac.exceptions.InvalidRequest:
            pass  # Already enabled
        
        # Create the role
        self.client.auth.approle.create_or_update_approle(
            role_name=role_name,
            token_policies=policies,
            secret_id_ttl=secret_id_ttl,
            token_ttl='1h',
            token_max_ttl='4h'
        )
        
        # Get role ID
        role_id = self.client.auth.approle.read_role_id(role_name=role_name)['data']['role_id']
        
        # Generate secret ID
        secret_id = self.client.auth.approle.generate_secret_id(role_name=role_name)['data']['secret_id']
        
        return role_id, secret_id
    
    def authenticate_with_approle(self, role_id, secret_id):
        """Authenticate using AppRole"""
        response = self.client.auth.approle.login(
            role_id=role_id,
            secret_id=secret_id
        )
        
        # Set the client token
        self.client.token = response['auth']['client_token']
        
        return response['auth']['client_token']

# Application integration with Vault
class SecureApplication:
    def __init__(self, vault_url, role_id, secret_id):
        self.vault_manager = VaultManager(vault_url)
        
        # Authenticate with Vault using AppRole
        self.vault_manager.authenticate_with_approle(role_id, secret_id)
        
        # Cache for credentials
        self.credential_cache = {}
    
    def get_database_connection(self, role_name='readwrite'):
        """Get database connection with dynamic credentials"""
        # Check cache first
        cache_key = f"db_creds_{role_name}"
        
        if cache_key in self.credential_cache:
            creds = self.credential_cache[cache_key]
            # Check if credentials are still valid (with some buffer)
            if datetime.now() < creds['expires_at'] - timedelta(minutes=5):
                return creds
        
        # Get new credentials from Vault
        db_creds = self.vault_manager.get_database_credentials(role_name)
        
        # Cache with expiration
        self.credential_cache[cache_key] = {
            'username': db_creds['username'],
            'password': db_creds['password'],
            'expires_at': datetime.now() + timedelta(seconds=db_creds['lease_duration'])
        }
        
        return self.credential_cache[cache_key]
    
    def get_api_key(self, service_name):
        """Get API key for external service"""
        secret_path = f"api-keys/{service_name}"
        secret_data = self.vault_manager.retrieve_secret(secret_path)
        
        if secret_data:
            return secret_data.get('api_key')
        
        return None
    
    def rotate_credentials(self):
        """Rotate all cached credentials"""
        self.credential_cache.clear()
```

### AWS Secrets Manager Integration

```python
import boto3
import json
import base64
from botocore.exceptions import ClientError

class AWSSecretsManager:
    def __init__(self, region_name='us-east-1'):
        self.client = boto3.client('secretsmanager', region_name=region_name)
        self.region_name = region_name
    
    def create_secret(self, secret_name, secret_value, description=""):
        """Create a new secret in AWS Secrets Manager"""
        try:
            if isinstance(secret_value, dict):
                secret_value = json.dumps(secret_value)
            
            response = self.client.create_secret(
                Name=secret_name,
                Description=description,
                SecretString=secret_value
            )
            
            return response['ARN']
        
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceExistsException':
                # Secret already exists, update it instead
                return self.update_secret(secret_name, secret_value)
            else:
                raise e
    
    def get_secret(self, secret_name):
        """Retrieve secret from AWS Secrets Manager"""
        try:
            response = self.client.get_secret_value(SecretId=secret_name)
            
            # Handle both string and binary secrets
            if 'SecretString' in response:
                secret_data = response['SecretString']
                try:
                    return json.loads(secret_data)
                except json.JSONDecodeError:
                    return secret_data
            else:
                return base64.b64decode(response['SecretBinary'])
        
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                return None
            else:
                raise e
    
    def update_secret(self, secret_name, new_secret_value):
        """Update existing secret"""
        try:
            if isinstance(new_secret_value, dict):
                new_secret_value = json.dumps(new_secret_value)
            
            response = self.client.update_secret(
                SecretId=secret_name,
                SecretString=new_secret_value
            )
            
            return response['ARN']
        
        except ClientError as e:
            raise e
    
    def rotate_secret(self, secret_name, lambda_function_arn):
        """Setup automatic rotation for a secret"""
        try:
            response = self.client.rotate_secret(
                SecretId=secret_name,
                RotationLambdaARN=lambda_function_arn,
                RotationRules={
                    'AutomaticallyAfterDays': 30
                }
            )
            
            return response
        
        except ClientError as e:
            raise e
    
    def delete_secret(self, secret_name, force_delete=False):
        """Delete a secret"""
        try:
            if force_delete:
                # Immediate deletion (cannot be recovered)
                response = self.client.delete_secret(
                    SecretId=secret_name,
                    ForceDeleteWithoutRecovery=True
                )
            else:
                # Schedule deletion (can be recovered within recovery window)
                response = self.client.delete_secret(
                    SecretId=secret_name,
                    RecoveryWindowInDays=7
                )
            
            return response
        
        except ClientError as e:
            raise e

# Database connection manager with AWS Secrets Manager
import psycopg2
from sqlalchemy import create_engine

class SecureDatabaseManager:
    def __init__(self, secret_name, region_name='us-east-1'):
        self.secrets_manager = AWSSecretsManager(region_name)
        self.secret_name = secret_name
        self._connection_cache = None
        self._credentials_cache = None
        self._cache_timestamp = None
        self.cache_ttl = 300  # 5 minutes
    
    def _get_credentials(self):
        """Get database credentials from Secrets Manager"""
        current_time = time.time()
        
        # Check cache
        if (self._credentials_cache and self._cache_timestamp and 
            current_time - self._cache_timestamp < self.cache_ttl):
            return self._credentials_cache
        
        # Fetch from Secrets Manager
        credentials = self.secrets_manager.get_secret(self.secret_name)
        
        if not credentials:
            raise ValueError(f"Secret {self.secret_name} not found")
        
        # Cache credentials
        self._credentials_cache = credentials
        self._cache_timestamp = current_time
        
        return credentials
    
    def get_connection(self):
        """Get database connection using credentials from Secrets Manager"""
        creds = self._get_credentials()
        
        try:
            connection = psycopg2.connect(
                host=creds['host'],
                port=creds['port'],
                database=creds['dbname'],
                user=creds['username'],
                password=creds['password']
            )
            
            return connection
        
        except psycopg2.Error as e:
            # If connection fails, clear cache and retry once
            self._credentials_cache = None
            self._cache_timestamp = None
            
            creds = self._get_credentials()
            
            return psycopg2.connect(
                host=creds['host'],
                port=creds['port'],
                database=creds['dbname'],
                user=creds['username'],
                password=creds['password']
            )
    
    def get_sqlalchemy_engine(self):
        """Get SQLAlchemy engine with Secrets Manager credentials"""
        creds = self._get_credentials()
        
        connection_string = (
            f"postgresql://{creds['username']}:{creds['password']}"
            f"@{creds['host']}:{creds['port']}/{creds['dbname']}"
        )
        
        return create_engine(connection_string)

# Usage example
def setup_application_secrets():
    """Setup application secrets in AWS Secrets Manager"""
    secrets_manager = AWSSecretsManager()
    
    # Database credentials
    db_credentials = {
        'host': 'my-database.amazonaws.com',
        'port': 5432,
        'dbname': 'myapp',
        'username': 'myapp_user',
        'password': 'super_secure_password'
    }
    
    secrets_manager.create_secret(
        'myapp/database/credentials',
        db_credentials,
        'Database credentials for MyApp'
    )
    
    # API keys
    api_keys = {
        'stripe_api_key': 'sk_live_...',
        'sendgrid_api_key': 'SG....',
        'google_api_key': 'AIza...'
    }
    
    secrets_manager.create_secret(
        'myapp/api/keys',
        api_keys,
        'External API keys for MyApp'
    )
    
    # JWT secret
    jwt_secret = {
        'secret_key': 'your-super-secret-jwt-key',
        'algorithm': 'HS256'
    }
    
    secrets_manager.create_secret(
        'myapp/jwt/config',
        jwt_secret,
        'JWT configuration for MyApp'
    )

# Application configuration with secrets
class ApplicationConfig:
    def __init__(self):
        self.secrets_manager = AWSSecretsManager()
        self._config_cache = {}
    
    def get_database_config(self):
        """Get database configuration"""
        if 'database' not in self._config_cache:
            self._config_cache['database'] = self.secrets_manager.get_secret(
                'myapp/database/credentials'
            )
        return self._config_cache['database']
    
    def get_api_keys(self):
        """Get API keys"""
        if 'api_keys' not in self._config_cache:
            self._config_cache['api_keys'] = self.secrets_manager.get_secret(
                'myapp/api/keys'
            )
        return self._config_cache['api_keys']
    
    def get_jwt_config(self):
        """Get JWT configuration"""
        if 'jwt' not in self._config_cache:
            self._config_cache['jwt'] = self.secrets_manager.get_secret(
                'myapp/jwt/config'
            )
        return self._config_cache['jwt']
```

---

## Summary

This comprehensive guide covers the essential aspects of security in system design:

### Key Security Components

1. **Authentication & Authorization**
   - OAuth2 flows for secure authorization
   - JWT tokens for stateless authentication
   - API keys for service-to-service communication

2. **Encryption**
   - TLS for securing data in transit
   - Encryption at rest for protecting stored data
   - Message-level encryption for end-to-end security

3. **Rate Limiting & WAF**
   - Rate limiting to prevent abuse and DoS attacks
   - Web Application Firewalls to block malicious requests
   - Multi-tier protection strategies

4. **Secure Credential Storage**
   - HashiCorp Vault for dynamic secrets management
   - AWS Secrets Manager for cloud-native secret storage
   - Best practices for credential rotation and access control

### Security Best Practices

- **Defense in Depth**: Implement multiple layers of security
- **Principle of Least Privilege**: Grant minimal necessary permissions
- **Zero Trust Architecture**: Verify every request and user
- **Regular Security Audits**: Continuously assess and improve security posture
- **Incident Response Planning**: Prepare for security breaches
- **Security by Design**: Integrate security from the beginning of development

Each security mechanism should be implemented based on your specific threat model and compliance requirements.