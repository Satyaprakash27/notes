## 🌟 Enhanced FastAPI Basics Documentation

### ✅ What is FastAPI? How does it compare to Flask or Django?

**FastAPI** is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

**Comparison:**

| Feature             | FastAPI                  | Flask                  | Django                 |
|---------------------|--------------------------|------------------------|------------------------|
| **Performance**     | Very High (comparable to NodeJS) | Medium                 | Medium                 |
| **Learning Curve**  | Easy                    | Easy                   | Steep                  |
| **Auto Documentation** | Built-in (OpenAPI/Swagger) | Manual                 | Manual                 |
| **Type Hints**      | Built-in support        | Manual validation      | Manual validation      |
| **Async Support**   | Native async/await      | Limited                | Limited                |
| **Validation**      | Automatic (Pydantic)    | Manual                 | Django Forms/Serializers |
| **Use Case**        | APIs, Microservices     | Small to medium apps   | Full-stack web apps    |

```python
# FastAPI Example
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int

@app.post("/users/")
async def create_user(user: User):
    return {"message": f"User {user.name} created"}

# Flask Example (for comparison)
from flask import Flask, request
app = Flask(__name__)

@app.route("/users/", methods=["POST"])
def create_user():
    data = request.get_json()
    # Manual validation needed
    return {"message": f"User {data['name']} created"}
```

### ✅ What are the main advantages of FastAPI?

1. **High Performance**: One of the fastest Python frameworks available.
2. **Easy to Learn**: Intuitive design based on Python type hints.
3. **Automatic API Documentation**: Interactive docs with Swagger UI and ReDoc.
4. **Type Safety**: Built-in validation using Pydantic models.
5. **Modern Python**: Full support for async/await.
6. **Standards-based**: Based on OpenAPI and JSON Schema.
7. **Production Ready**: Used by companies like Microsoft, Uber, Netflix.

```python
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel, EmailStr

app = FastAPI(
    title="My API",
    description="A sample API built with FastAPI",
    version="1.0.0"
)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None

@app.post("/users/", response_model=UserCreate)
async def create_user(user: UserCreate):
    # Automatic validation, serialization, and documentation
    return user
```

### ✅ How do you install FastAPI?

```bash
# Basic installation
pip install fastapi

# With all optional dependencies
pip install "fastapi[all]"

# Production installation (minimal)
pip install fastapi uvicorn

# With specific dependencies
pip install fastapi uvicorn[standard] python-multipart
```

**Development requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic[email]==2.4.2
```

### ✅ How do you run a FastAPI application?

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Running the application:**

```bash
# Method 1: Using uvicorn directly
uvicorn main:app --reload

# Method 2: With host and port
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Method 3: Python script
python main.py

# Method 4: Production (no reload)
uvicorn main:app --workers 4
```

### ✅ What is Uvicorn? Why is it used with FastAPI?

**Uvicorn** is a lightning-fast ASGI server implementation, using uvloop and httptools.

**Why Uvicorn with FastAPI:**
- **ASGI Compatibility**: FastAPI is an ASGI application.
- **High Performance**: Built on uvloop for maximum speed.
- **Async Support**: Native support for async/await.
- **Auto-reload**: Development-friendly features.
- **Production Ready**: Can handle high loads.

```python
# Different Uvicorn configurations

# Development
uvicorn main:app --reload --log-level debug

# Production
uvicorn main:app --workers 4 --host 0.0.0.0 --port 80

# With SSL
uvicorn main:app --ssl-keyfile key.pem --ssl-certfile cert.pem

# Programmatic configuration
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
        log_level="info"
    )
```

### ✅ What is ASGI? How is it different from WSGI?

**ASGI (Asynchronous Server Gateway Interface)** is a spiritual successor to WSGI, designed to support both synchronous and asynchronous Python apps.

**Key Differences:**

| Aspect          | WSGI          | ASGI          |
|-----------------|---------------|---------------|
| **Concurrency** | Synchronous only | Async + Sync |
| **Protocols**   | HTTP only     | HTTP, WebSocket, etc. |
| **Performance** | Limited       | High (async I/O) |
| **Python Version** | Any         | 3.5+          |
| **Examples**    | Flask, Django | FastAPI, Starlette |

```python
# WSGI Application (Flask)
def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return [b'Hello World']

# ASGI Application (FastAPI)
async def application(scope, receive, send):
    assert scope['type'] == 'http'
    
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [[b'content-type', b'text/plain']],
    })
    
    await send({
        'type': 'http.response.body',
        'body': b'Hello World',
    })
```

### ✅ Explain the concept of dependency injection in FastAPI

**Dependency Injection** in FastAPI allows you to declare dependencies that will be automatically resolved and injected into your path operations.

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

app = FastAPI()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication dependency
def get_current_user(token: str = Depends(get_token)):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Using dependencies
@app.get("/users/me")
async def read_users_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return current_user

# Dependency with parameters
def common_parameters(q: str = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons
```

**Advanced Dependency Patterns:**

```python
# Class-based dependencies
class CommonQueryParams:
    def __init__(self, q: str = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(commons: CommonQueryParams = Depends()):
    return commons

# Sub-dependencies
def get_token_header(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")
    return x_token

def get_query_token(token: str):
    if token != "jessica":
        raise HTTPException(status_code=400, detail="No Jessica token provided")
    return token

@app.get("/items/")
async def read_items(
    token: str = Depends(get_token_header),
    query_token: str = Depends(get_query_token)
):
    return {"token": token, "query_token": query_token}
```

### ✅ How does FastAPI achieve high performance?

FastAPI achieves high performance through several key design decisions:

1. **Starlette Foundation**: Built on Starlette, a high-performance ASGI framework.
2. **Pydantic Validation**: Fast validation using Cython-compiled code.
3. **Async/Await**: Native support for asynchronous operations.
4. **Type Hints**: Compile-time optimizations.
5. **Minimal Overhead**: Efficient request/response cycle.

```python
# Performance optimizations in FastAPI

# 1. Async endpoints for I/O operations
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # Non-blocking database query
    user = await db.execute(select(User).where(User.id == user_id))
    return user.scalar_one_or_none()

# 2. Response models for serialization optimization
@app.get("/users/", response_model=List[UserResponse])
async def list_users():
    # Pydantic handles fast serialization
    return users

# 3. Background tasks for non-blocking operations
@app.post("/send-email/")
async def send_email(email: EmailSchema, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_notification, email)
    return {"message": "Email sent in background"}

# 4. Streaming responses for large data
@app.get("/large-file")
async def download_large_file():
    def generate():
        for chunk in read_large_file():
            yield chunk
    return StreamingResponse(generate(), media_type="application/octet-stream")
```

### ✅ What is automatic API documentation in FastAPI?

FastAPI automatically generates interactive API documentation using OpenAPI specification.

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="My API",
    description="This is a very fancy project, with auto docs for the API",
    version="2.5.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Deadpoolio the Amazing",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

class Item(BaseModel):
    """Item model for the API"""
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/", response_model=Item, tags=["items"])
async def create_item(item: Item):
    """
    Create an item with all the information:
    
    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    """
    return item

# Access documentation at:
# - Swagger UI: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
# - OpenAPI JSON: http://localhost:8000/openapi.json
```

### ✅ What is Pydantic? How is it used in FastAPI?

**Pydantic** is a data validation library that uses Python type hints to validate, serialize, and deserialize data.

```python
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime

class Address(BaseModel):
    street: str
    city: str
    country: str

class User(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(..., gt=0, le=150)
    is_active: bool = True
    addresses: List[Address] = []
    created_at: datetime = Field(default_factory=datetime.now)

    @validator('name')
    def name_must_contain_space(cls, v):
        if ' ' not in v:
            raise ValueError('Name must contain a space')
        return v.title()

    @validator('age')
    def validate_age(cls, v):
        if v < 18:
            raise ValueError('Must be at least 18 years old')
        return v

    class Config:
        # Enable ORM mode for SQLAlchemy integration
        from_attributes = True
        # Example values for documentation
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "age": 25
            }
        }

# Using in FastAPI
@app.post("/users/", response_model=User)
async def create_user(user: User):
    # Automatic validation and serialization
    return user
```