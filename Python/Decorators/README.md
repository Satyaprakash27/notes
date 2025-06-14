# Python Decorators: Complete Interview Guide

## Table of Contents
1. [Basic Decorator Questions](#basic-decorator-questions)
2. [Intermediate Decorator Questions](#intermediate-decorator-questions)
3. [Advanced/FastAPI-Related Questions](#advanced-fastapi-related-questions)
4. [Real-World Examples](#real-world-examples)
5. [Common Pitfalls and Best Practices](#common-pitfalls-and-best-practices)
6. [Performance Considerations](#performance-considerations)

---

## ✅ Basic Decorator Questions

### 1. What is a decorator in Python?

**Answer:** A decorator is a function that takes another function as an argument, adds some functionality, and returns it. Decorators allow you to modify or enhance functions without permanently modifying their code.

**Key Concepts:**
- **Higher-order functions**: Functions that operate on other functions
- **Wrapper pattern**: Encapsulating functionality around existing code
- **Syntactic sugar**: The `@` symbol provides a clean syntax

```python
# Without decorator syntax
def greet():
    print("Hello!")

greet = my_decorator(greet)

# With decorator syntax (equivalent)
@my_decorator
def greet():
    print("Hello!")
```

### 2. How do you define a simple decorator?

```python
def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello")

# Usage
say_hello()
# Output:
# Before function call
# Hello
# After function call
```

**Explanation:**
- `my_decorator` is the decorator function
- `wrapper` is the inner function that adds new behavior
- The original function `func` is called within the wrapper
- The decorator returns the wrapper function

### 3. What is the purpose of @ syntax in Python?

**Answer:** The `@` symbol is syntactic sugar for applying decorators. It makes code more readable and follows the DRY principle.

```python
# These are equivalent:

# Method 1: Using @ syntax
@my_decorator
def function():
    pass

# Method 2: Manual application
def function():
    pass
function = my_decorator(function)
```

**Benefits of @ syntax:**
- **Readability**: Clear indication that a function is decorated
- **Proximity**: Decorator is right above the function definition
- **Multiple decorators**: Easy to stack multiple decorators

### 4. What are common use cases for decorators?

**Real-world applications:**

#### Logging
```python
import functools
import logging

def log_function_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        logging.info(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_function_call
def calculate_total(price, tax_rate):
    return price * (1 + tax_rate)
```

#### Authorization/Authentication
```python
def require_auth(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            raise PermissionError("Authentication required")
        return func(*args, **kwargs)
    return wrapper

@require_auth
def delete_user(user_id):
    # Only authenticated users can delete
    pass
```

#### Caching
```python
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args in cache:
            return cache[args]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

#### Timing/Performance Profiling
```python
import time

def measure_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@measure_time
def slow_function():
    time.sleep(1)
    return "Done"
```

#### Retry Logic
```python
import random
import time

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def unreliable_api_call():
    if random.random() < 0.7:  # 70% chance of failure
        raise Exception("API Error")
    return "Success"
```

#### Input/Output Validation
```python
def validate_types(**expected_types):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Get function signature
            import inspect
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            bound_args.apply_defaults()
            
            # Validate types
            for param_name, expected_type in expected_types.items():
                if param_name in bound_args.arguments:
                    value = bound_args.arguments[param_name]
                    if not isinstance(value, expected_type):
                        raise TypeError(f"{param_name} must be {expected_type.__name__}")
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_types(name=str, age=int)
def create_user(name, age):
    return f"User {name}, age {age}"
```

---

## 🔄 Intermediate Decorator Questions

### 5. How do you pass arguments to a decorator?

**Answer:** Create a decorator factory - a function that returns a decorator.

```python
def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result  # Return last execution result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Output:
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

**Advanced example with multiple parameters:**

```python
def rate_limit(max_calls, time_window):
    def decorator(func):
        calls = []
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            # Remove old calls outside time window
            calls[:] = [call_time for call_time in calls if now - call_time < time_window]
            
            if len(calls) >= max_calls:
                raise Exception(f"Rate limit exceeded: {max_calls} calls per {time_window}s")
            
            calls.append(now)
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(max_calls=5, time_window=60)  # 5 calls per minute
def api_call():
    return "API response"
```

### 6. How do you write a decorator that accepts arguments for the inner function?

**Answer:** Use `*args` and `**kwargs` in the wrapper to handle any number of arguments.

```python
def debug(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_repr = [repr(a) for a in args]
        kwargs_repr = [f"{k}={v!r}" for k, v in kwargs.items()]
        signature = ", ".join(args_repr + kwargs_repr)
        print(f"Calling {func.__name__}({signature})")
        
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result!r}")
        return result
    return wrapper

@debug
def add(x, y, operation="sum"):
    return x + y

add(5, 3, operation="addition")
# Output:
# Calling add(5, 3, operation='addition')
# add returned 8
```

### 7. What does functools.wraps do and why is it important?

**Answer:** `functools.wraps` preserves the metadata (name, docstring, annotations) of the original function after decoration.

```python
from functools import wraps

# Without @wraps
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        """This is the wrapper function"""
        return func(*args, **kwargs)
    return wrapper

# With @wraps
def good_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """This is the wrapper function"""
        return func(*args, **kwargs)
    return wrapper

def original_function():
    """This is the original function"""
    return "Hello"

# Comparison
@bad_decorator
def func1():
    """Original docstring"""
    pass

@good_decorator
def func2():
    """Original docstring"""
    pass

print(func1.__name__)      # wrapper
print(func1.__doc__)       # This is the wrapper function

print(func2.__name__)      # func2
print(func2.__doc__)       # Original docstring
```

**Why it matters:**
- **Debugging**: Proper function names in stack traces
- **Documentation**: Preserves docstrings for help()
- **Introspection**: Tools can access original function metadata
- **Testing**: Test frameworks rely on function names

### 8. Can you apply multiple decorators to a function?

**Answer:** Yes, decorators are applied from bottom to top (inside-out).

```python
def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return f"<b>{result}</b>"
    return wrapper

def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return f"<i>{result}</i>"
    return wrapper

@bold
@italic
def say_hello():
    return "Hello World"

print(say_hello())  # <b><i>Hello World</i></b>

# Equivalent to:
# say_hello = bold(italic(say_hello))
```

**Practical example with timing and logging:**

```python
@measure_time
@log_function_call
@retry(max_attempts=3)
def complex_operation(data):
    # Some complex operation
    return process_data(data)

# Execution order:
# 1. retry decorator (outermost)
# 2. log_function_call decorator
# 3. measure_time decorator (innermost)
# 4. Original function
```

### 9. What is a class-based decorator?

**Answer:** A class that implements `__call__` method can be used as a decorator.

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
        # Preserve function metadata
        functools.update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call {self.count} to {self.func.__name__}")
        return self.func(*args, **kwargs)
    
    def reset_count(self):
        self.count = 0

@CountCalls
def greet(name):
    return f"Hello, {name}!"

greet("Alice")  # Call 1 to greet
greet("Bob")    # Call 2 to greet
print(greet.count)  # 2
greet.reset_count()
```

**Class decorator with parameters:**

```python
class RateLimit:
    def __init__(self, max_calls, time_window):
        self.max_calls = max_calls
        self.time_window = time_window
        
    def __call__(self, func):
        self.func = func
        self.calls = []
        functools.update_wrapper(self, func)
        return self
    
    def __call__(self, *args, **kwargs):
        now = time.time()
        # Remove old calls
        self.calls = [t for t in self.calls if now - t < self.time_window]
        
        if len(self.calls) >= self.max_calls:
            raise Exception("Rate limit exceeded")
        
        self.calls.append(now)
        return self.func(*args, **kwargs)

@RateLimit(max_calls=3, time_window=60)
def api_endpoint():
    return "Response"
```

### 10. What's the difference between function-based and class-based decorators?

| Feature | Function Decorator | Class Decorator |
|---------|-------------------|-----------------|
| **Simplicity** | Easier to write and understand | More complex setup |
| **State Management** | Stateless (unless using closures) | Can maintain state between calls |
| **Memory Usage** | Lower overhead | Higher overhead (object creation) |
| **Flexibility** | Limited to closure variables | Full OOP capabilities |
| **Reusability** | Good for simple, stateless operations | Better for complex, stateful operations |
| **Performance** | Faster (function calls) | Slightly slower (method calls) |

**When to use each:**

```python
# Use function decorator for simple, stateless operations
@measure_time
def simple_operation():
    pass

# Use class decorator for complex, stateful operations
@CountCalls  # Maintains call count
def tracked_operation():
    pass
```

---

## 🔐 Advanced/FastAPI-Related Decorator Questions

### 11. How does FastAPI use decorators internally?

**Answer:** FastAPI uses decorators like `@app.get()`, `@app.post()` to register routes and associate them with handler functions.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

# The decorator does several things:
# 1. Registers the route path and HTTP method
# 2. Extracts type hints for automatic validation
# 3. Generates OpenAPI/Swagger documentation
# 4. Handles request/response serialization
```

**Under the hood, FastAPI decorators:**

```python
# Simplified version of what @app.get() does
def get(path: str):
    def decorator(func):
        # Extract function signature
        signature = inspect.signature(func)
        
        # Generate OpenAPI schema
        openapi_schema = generate_schema(signature)
        
        # Register route
        app.router.add_route(
            path=path,
            endpoint=func,
            methods=["GET"],
            openapi_schema=openapi_schema
        )
        
        return func
    return decorator
```

### 12. How can you implement a custom authentication decorator in FastAPI?

**Answer:** While FastAPI prefers dependencies for auth, you can create custom decorators:

#### Method 1: Simple Decorator Approach
```python
from functools import wraps
from fastapi import HTTPException

def require_auth(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Extract request from kwargs (FastAPI injects it)
        request = kwargs.get('request')
        
        if not request:
            raise HTTPException(status_code=400, detail="Request object not found")
        
        # Check authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid token")
        
        token = auth_header.split(" ")[1]
        user = verify_token(token)  # Your token verification logic
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Add user to kwargs
        kwargs['current_user'] = user
        return await func(*args, **kwargs)
    
    return wrapper

@app.get("/protected")
@require_auth
async def protected_route(request: Request, current_user: dict = None):
    return {"user": current_user["username"], "message": "Access granted"}
```

#### Method 2: FastAPI Dependency Approach (Recommended)
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = verify_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/secure/")
async def secure_route(current_user: dict = Depends(get_current_user)):
    return {"user": current_user["username"], "message": "Secure data"}
```

#### Method 3: Role-Based Access Control
```python
def require_role(required_role: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            if current_user.get('role') != required_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

@app.delete("/admin/users/{user_id}")
@require_auth
@require_role("admin")
async def delete_user(user_id: int, request: Request, current_user: dict = None):
    # Only admin users can access this endpoint
    return {"message": f"User {user_id} deleted"}
```

### 13. Can you decorate a method in a class?

**Answer:** Yes, but be cautious about `self` parameter and method binding.

```python
class UserService:
    def __init__(self):
        self.users = {}
    
    @measure_time
    def create_user(self, name: str, email: str):
        user_id = len(self.users) + 1
        self.users[user_id] = {"name": name, "email": email}
        return user_id
    
    @log_function_call
    def get_user(self, user_id: int):
        return self.users.get(user_id)

# Usage
service = UserService()
user_id = service.create_user("John", "john@email.com")  # Timing will be logged
user = service.get_user(user_id)  # Function call will be logged
```

**Common pitfall with method decorators:**

```python
# Problematic: Decorator doesn't handle 'self' properly
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        # This might not work correctly with instance methods
        return func(*args, **kwargs)
    return wrapper

# Better: Use functools.wraps and handle methods properly
def method_decorator(func):
    @functools.wraps(func)
    def wrapper(self, *args, **kwargs):
        print(f"Calling {func.__name__} on {self.__class__.__name__}")
        return func(self, *args, **kwargs)
    return wrapper
```

### 14. How do decorators help with DRY principles?

**Answer:** Decorators encapsulate reusable logic (like logging, security, validation), keeping core functions clean and focused.

**Example: Cross-cutting concerns**

```python
# Without decorators - repetitive code
def create_user(name, email):
    start_time = time.time()
    logger.info(f"Creating user: {name}")
    
    if not current_user.is_admin:
        raise PermissionError("Admin access required")
    
    # Core business logic
    user = User(name=name, email=email)
    user.save()
    
    logger.info(f"User created successfully: {user.id}")
    end_time = time.time()
    logger.info(f"Operation took {end_time - start_time:.2f}s")
    return user

def update_user(user_id, name, email):
    start_time = time.time()
    logger.info(f"Updating user: {user_id}")
    
    if not current_user.is_admin:
        raise PermissionError("Admin access required")
    
    # Core business logic
    user = User.get(user_id)
    user.name = name
    user.email = email
    user.save()
    
    logger.info(f"User updated successfully: {user.id}")
    end_time = time.time()
    logger.info(f"Operation took {end_time - start_time:.2f}s")
    return user

# With decorators - DRY principle applied
@measure_time
@log_function_call
@require_admin
def create_user(name, email):
    # Only core business logic
    user = User(name=name, email=email)
    user.save()
    return user

@measure_time
@log_function_call
@require_admin
def update_user(user_id, name, email):
    # Only core business logic
    user = User.get(user_id)
    user.name = name
    user.email = email
    user.save()
    return user
```

### 15. What's the difference between decorator and middleware in FastAPI?

| Aspect | Decorator | Middleware |
|--------|-----------|------------|
| **Scope** | Applied to specific routes | Applied to all routes |
| **Granularity** | Fine-grained control | Global behavior |
| **Use Cases** | Authentication, validation, rate limiting for specific endpoints | CORS, logging, error handling for entire app |
| **Performance** | Lower overhead (only for decorated routes) | Higher overhead (runs for every request) |
| **Flexibility** | Can be parameterized per route | Same logic for all routes |

**Decorator Example:**
```python
@app.get("/api/admin/users")
@require_admin  # Only applies to this route
async def get_admin_users():
    return admin_users

@app.get("/api/public/status")
async def get_status():  # No authentication required
    return {"status": "ok"}
```

**Middleware Example:**
```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # This runs for EVERY request
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {process_time:.4f}s")
    
    return response
```

**When to use which:**
- **Use decorators** for route-specific concerns (auth, validation, rate limiting)
- **Use middleware** for cross-cutting concerns (logging, CORS, error handling)

---

## 🛠️ Real-World Examples

### 1. API Rate Limiting with Redis

```python
import redis
import time
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def rate_limit_redis(max_requests: int, window_seconds: int):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get user identifier (IP, user_id, etc.)
            request = kwargs.get('request')
            user_id = get_user_identifier(request)
            
            key = f"rate_limit:{func.__name__}:{user_id}"
            
            # Check current request count
            current_requests = redis_client.get(key)
            
            if current_requests is None:
                # First request in window
                redis_client.setex(key, window_seconds, 1)
            else:
                current_count = int(current_requests)
                if current_count >= max_requests:
                    raise HTTPException(
                        status_code=429,
                        detail=f"Rate limit exceeded. Max {max_requests} requests per {window_seconds} seconds"
                    )
                redis_client.incr(key)
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

@app.get("/api/data")
@rate_limit_redis(max_requests=100, window_seconds=3600)  # 100 requests per hour
async def get_data(request: Request):
    return {"data": "sensitive information"}
```

### 2. Database Transaction Decorator

```python
from sqlalchemy.orm import Session
from contextlib import contextmanager

def transactional(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Assume first argument is database session
        db_session = args[0] if args else kwargs.get('db')
        
        if not isinstance(db_session, Session):
            raise ValueError("First argument must be database session")
        
        try:
            result = func(*args, **kwargs)
            db_session.commit()
            return result
        except Exception as e:
            db_session.rollback()
            raise e
    return wrapper

@transactional
def transfer_money(db: Session, from_account: int, to_account: int, amount: float):
    # Debit from source account
    source = db.query(Account).filter(Account.id == from_account).first()
    source.balance -= amount
    
    # Credit to destination account
    dest = db.query(Account).filter(Account.id == to_account).first()
    dest.balance += amount
    
    # If any exception occurs, transaction will be rolled back automatically
    return {"status": "success", "amount": amount}
```

### 3. Circuit Breaker Pattern

```python
import time
from enum import Enum
from dataclasses import dataclass

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

@dataclass
class CircuitBreakerConfig:
    failure_threshold: int = 5
    timeout: int = 60
    expected_exception: type = Exception

class CircuitBreaker:
    def __init__(self, config: CircuitBreakerConfig):
        self.config = config
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = None
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if self.state == CircuitState.OPEN:
                if time.time() - self.last_failure_time < self.config.timeout:
                    raise Exception("Circuit breaker is OPEN")
                else:
                    self.state = CircuitState.HALF_OPEN
            
            try:
                result = func(*args, **kwargs)
                self._on_success()
                return result
            except self.config.expected_exception as e:
                self._on_failure()
                raise e
        
        return wrapper
    
    def _on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.config.failure_threshold:
            self.state = CircuitState.OPEN

# Usage
config = CircuitBreakerConfig(failure_threshold=3, timeout=30)
circuit_breaker = CircuitBreaker(config)

@circuit_breaker
def external_api_call():
    # This function will be circuit-broken if it fails 3 times
    response = requests.get("https://unreliable-api.com/data")
    response.raise_for_status()
    return response.json()
```

---

## ⚠️ Common Pitfalls and Best Practices

### 1. Forgetting to Use functools.wraps

```python
# Bad: Loses function metadata
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# Good: Preserves function metadata
def good_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### 2. Not Handling Arguments Properly

```python
# Bad: Doesn't handle all argument types
def bad_decorator(func):
    def wrapper(arg1, arg2):  # Fixed arguments
        return func(arg1, arg2)
    return wrapper

# Good: Handles any arguments
def good_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### 3. Creating Memory Leaks with Class Decorators

```python
# Bad: Potential memory leak
class BadDecorator:
    def __init__(self, func):
        self.func = func
        self.cache = {}  # This might grow indefinitely
    
    def __call__(self, *args, **kwargs):
        key = str(args) + str(kwargs)
        if key not in self.cache:
            self.cache[key] = self.func(*args, **kwargs)
        return self.cache[key]

# Good: Implement cache cleanup
class GoodDecorator:
    def __init__(self, func, max_cache_size=100):
        self.func = func
        self.cache = {}
        self.max_cache_size = max_cache_size
    
    def __call__(self, *args, **kwargs):
        key = str(args) + str(kwargs)
        
        if key not in self.cache:
            if len(self.cache) >= self.max_cache_size:
                # Remove oldest entry
                oldest_key = next(iter(self.cache))
                del self.cache[oldest_key]
            
            self.cache[key] = self.func(*args, **kwargs)
        
        return self.cache[key]
```

### 4. Decorator Order Matters

```python
@decorator_a
@decorator_b
@decorator_c
def my_function():
    pass

# Equivalent to:
# my_function = decorator_a(decorator_b(decorator_c(my_function)))
# Execution order: decorator_a -> decorator_b -> decorator_c -> function
```

---

## 📊 Performance Considerations

### 1. Decorator Overhead

```python
import time

def measure_decorator_overhead():
    def simple_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapper
    
    def simple_function():
        return 42
    
    @simple_decorator
    def decorated_function():
        return 42
    
    # Measure execution time
    iterations = 1000000
    
    # Undecorated function
    start = time.time()
    for _ in range(iterations):
        simple_function()
    undecorated_time = time.time() - start
    
    # Decorated function
    start = time.time()
    for _ in range(iterations):
        decorated_function()
    decorated_time = time.time() - start
    
    overhead = decorated_time - undecorated_time
    print(f"Decorator overhead: {overhead:.6f}s for {iterations} calls")
    print(f"Average overhead per call: {overhead/iterations*1000000:.2f} microseconds")

# Results typically show ~0.1-0.2 microseconds overhead per call
```

### 2. Memory Usage with Decorators

```python
import sys

def memory_usage_example():
    def counting_decorator(func):
        count = 0  # This creates a closure
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal count
            count += 1
            return func(*args, **kwargs)
        
        wrapper.call_count = lambda: count
        return wrapper
    
    @counting_decorator
    def test_function():
        return "test"
    
    # Each decorated function creates its own closure
    # Multiple decorations = multiple closures = more memory
    print(f"Function object size: {sys.getsizeof(test_function)} bytes")
```

### 3. Optimizing Decorator Performance

```python
# Slow: Creates new objects on each call
def slow_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()  # Creates new float object
        result = func(*args, **kwargs)
        end_time = time.time()    # Creates new float object
        print(f"Execution time: {end_time - start_time}")
        return result
    return wrapper

# Faster: Minimize object creation
def fast_decorator(func):
    # Pre-compile format string
    format_string = f"Execution time for {func.__name__}: {{:.6f}}s"
    
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()  # More precise timing
        result = func(*args, **kwargs)
        execution_time = time.perf_counter() - start_time
        print(format_string.format(execution_time))
        return result
    return wrapper
```

---

*This comprehensive guide covers all aspects of Python decorators from basic concepts to advanced real-world applications, making you well-prepared for any decorator-related interview questions.*
