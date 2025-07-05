## 🔒 3️⃣ Security

### ✅ How do you implement authentication in FastAPI?

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# User model
from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

# Fake database
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": pwd_context.hash("secret"),
        "is_active": True,
    }
}

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return UserInDB(**user_dict)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user(username=username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Login endpoint
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Protected endpoints
@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/protected")
async def protected_route(current_user: User = Depends(get_current_active_user)):
    return {"message": f"Hello {current_user.username}!"}
```

### ✅ What are OAuth2 and JWT? How can they be used with FastAPI?

**OAuth2** is an authorization framework that enables applications to obtain limited access to user accounts.

**JWT (JSON Web Tokens)** are compact, URL-safe tokens for representing claims securely between parties.

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel

app = FastAPI()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT settings
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    username: str = None

class User(BaseModel):
    username: str
    email: str
    full_name: str = None
    disabled: bool = None

class UserInDB(User):
    hashed_password: str

# Fake database
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return UserInDB(**user_dict)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# OAuth2 endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# Advanced JWT with refresh tokens
refresh_tokens = {}

def create_refresh_token(username: str):
    refresh_token = jwt.encode(
        {"sub": username, "type": "refresh"},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    refresh_tokens[refresh_token] = username
    return refresh_token

@app.post("/token/refresh")
async def refresh_access_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        username = payload.get("sub")
        if refresh_token not in refresh_tokens:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
```

### ✅ How do you implement role-based authorization in FastAPI?

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from enum import Enum
from typing import List
import jwt

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Define roles
class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

# User model with roles
class User(BaseModel):
    username: str
    email: str
    roles: List[Role] = []
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

# Fake database with roles
fake_users_db = {
    "admin": {
        "username": "admin",
        "email": "admin@example.com",
        "hashed_password": "hashed_password_here",
        "roles": [Role.ADMIN],
        "is_active": True,
    },
    "user": {
        "username": "user",
        "email": "user@example.com",
        "hashed_password": "hashed_password_here",
        "roles": [Role.USER],
        "is_active": True,
    },
    "moderator": {
        "username": "moderator",
        "email": "mod@example.com",
        "hashed_password": "hashed_password_here",
        "roles": [Role.USER, Role.MODERATOR],
        "is_active": True,
    }
}

# Get current user (implementation from previous examples)
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # JWT decode logic here
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    user_dict = fake_users_db.get(username)
    if user_dict:
        return User(**user_dict)
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Role-based authorization dependencies
def require_roles(allowed_roles: List[Role]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if not any(role in current_user.roles for role in allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return role_checker

# Alternative: Single role requirement
def require_role(required_role: Role):
    def role_checker(current_user: User = Depends(get_current_user)):
        if required_role not in current_user.roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role} required"
            )
        return current_user
    return role_checker

# Admin-only endpoints
@app.get("/admin/users")
async def get_all_users(
    current_user: User = Depends(require_role(Role.ADMIN))
):
    return {"users": list(fake_users_db.keys())}

@app.delete("/admin/users/{username}")
async def delete_user(
    username: str,
    current_user: User = Depends(require_role(Role.ADMIN))
):
    if username in fake_users_db:
        del fake_users_db[username]
        return {"message": f"User {username} deleted"}
    raise HTTPException(status_code=404, detail="User not found")

# Moderator or Admin endpoints
@app.post("/moderate/content/{content_id}")
async def moderate_content(
    content_id: int,
    current_user: User = Depends(require_roles([Role.ADMIN, Role.MODERATOR]))
):
    return {"message": f"Content {content_id} moderated by {current_user.username}"}

# User endpoints (any authenticated user)
@app.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Advanced role-based authorization with permissions
class Permission(str, Enum):
    READ_USERS = "read:users"
    WRITE_USERS = "write:users"
    DELETE_USERS = "delete:users"
    MODERATE_CONTENT = "moderate:content"

# Role-permission mapping
ROLE_PERMISSIONS = {
    Role.USER: [Permission.READ_USERS],
    Role.MODERATOR: [Permission.READ_USERS, Permission.MODERATE_CONTENT],
    Role.ADMIN: [Permission.READ_USERS, Permission.WRITE_USERS, Permission.DELETE_USERS, Permission.MODERATE_CONTENT]
}

def require_permission(required_permission: Permission):
    def permission_checker(current_user: User = Depends(get_current_user)):
        user_permissions = []
        for role in current_user.roles:
            user_permissions.extend(ROLE_PERMISSIONS.get(role, []))
        
        if required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission {required_permission} required"
            )
        return current_user
    return permission_checker

@app.get("/users")
async def list_users(
    current_user: User = Depends(require_permission(Permission.READ_USERS))
):
    return {"users": list(fake_users_db.keys())}

@app.post("/users")
async def create_user(
    user_data: dict,
    current_user: User = Depends(require_permission(Permission.WRITE_USERS))
):
    return {"message": "User created", "created_by": current_user.username}

# Resource-based authorization
@app.get("/users/{username}/profile")
async def get_user_profile(
    username: str,
    current_user: User = Depends(get_current_user)
):
    # Users can only access their own profile unless they're admin
    if current_user.username != username and Role.ADMIN not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only access your own profile"
        )
    
    user_profile = fake_users_db.get(username)
    if not user_profile:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"profile": user_profile}
```

### ✅ How do you handle password hashing in FastAPI?

```python
from fastapi import FastAPI, Depends, HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel, validator
import secrets
import hashlib
import bcrypt

app = FastAPI()

# Password hashing with passlib (recommended)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        return v

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserLogin(BaseModel):
    username: str
    password: str

# Password hashing functions
def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against provided password."""
    return pwd_context.verify(plain_password, hashed_password)

# Alternative hashing methods
def hash_password_manual(password: str, salt: bytes = None) -> tuple:
    """Manual password hashing with salt."""
    if salt is None:
        salt = secrets.token_bytes(32)
    
    pwdhash = hashlib.pbkdf2_hmac('sha256', 
                                 password.encode('utf-8'), 
                                 salt, 
                                 100000)  # 100,000 iterations
    return salt, pwdhash

def verify_password_manual(password: str, salt: bytes, pwdhash: bytes) -> bool:
    """Verify manually hashed password."""
    return hashlib.pbkdf2_hmac('sha256',
                              password.encode('utf-8'),
                              salt,
                              100000) == pwdhash

# Bcrypt directly (alternative to passlib)
def hash_password_bcrypt(password: str) -> str:
    """Hash password using bcrypt directly."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password_bcrypt(password: str, hashed: str) -> bool:
    """Verify bcrypt hashed password."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# User registration endpoint
@app.post("/register")
async def register_user(user: UserCreate):
    # Check if user already exists
    if user.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Store user (in real app, save to database)
    fake_users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "is_active": True
    }
    
    return {"message": "User registered successfully"}

# User login endpoint
@app.post("/login")
async def login_user(user: UserLogin):
    # Get user from database
    db_user = fake_users_db.get(user.username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Generate and return token (implementation from previous examples)
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Password change endpoint
class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

    @validator('confirm_new_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('New passwords do not match')
        return v

@app.put("/change-password")
async def change_password(
    passwords: PasswordChange,
    current_user: User = Depends(get_current_user)
):
    # Verify current password
    db_user = fake_users_db.get(current_user.username)
    if not verify_password(passwords.current_password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    new_hashed_password = get_password_hash(passwords.new_password)
    
    # Update password in database
    fake_users_db[current_user.username]["hashed_password"] = new_hashed_password
    
    return {"message": "Password changed successfully"}

# Password reset (with token)
password_reset_tokens = {}

@app.post("/forgot-password")
async def forgot_password(email: str):
    # Find user by email
    user = None
    for username, user_data in fake_users_db.items():
        if user_data["email"] == email:
            user = user_data
            break
    
    if not user:
        # Don't reveal if email exists
        return {"message": "If email exists, reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    password_reset_tokens[reset_token] = {
        "username": user["username"],
        "expires": datetime.utcnow() + timedelta(hours=1)
    }
    
    # In real app, send email with reset link
    return {"message": "Password reset link sent", "reset_token": reset_token}

class PasswordReset(BaseModel):
    token: str
    new_password: str
    confirm_password: str

@app.post("/reset-password")
async def reset_password(reset_data: PasswordReset):
    # Verify reset token
    token_data = password_reset_tokens.get(reset_data.token)
    if not token_data or token_data["expires"] < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Hash new password
    new_hashed_password = get_password_hash(reset_data.new_password)
    
    # Update password
    username = token_data["username"]
    fake_users_db[username]["hashed_password"] = new_hashed_password
    
    # Remove used token
    del password_reset_tokens[reset_data.token]
    
    return {"message": "Password reset successfully"}
```
