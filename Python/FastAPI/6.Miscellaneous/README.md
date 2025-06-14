# 🔧 FastAPI Miscellaneous Topics

## ✅ How does FastAPI generate OpenAPI and Swagger docs?

FastAPI automatically generates OpenAPI (formerly Swagger) documentation based on your code, type hints, and Pydantic models. This happens through introspection of your endpoints, models, and metadata.

### Automatic Documentation Generation

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="My API",
    description="A sample API with automatic documentation",
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "API Support",
        "url": "http://www.example.com/contact/",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/", tags=["items"], summary="Create an item")
async def create_item(item: Item):
    """
    Create an item with all the information:
    
    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    """
    return item

@app.get("/items/{item_id}", tags=["items"])
async def read_item(item_id: int, q: Optional[str] = None):
    """Get an item by ID"""
    return {"item_id": item_id, "q": q}
```

### Customizing OpenAPI Schema

```python
from fastapi import FastAPI, Query, Path
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html

app = FastAPI()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Custom API",
        version="2.5.0",
        description="This is a very custom OpenAPI schema",
        routes=app.routes,
    )
    
    # Add custom extensions
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(..., title="The ID of the item", ge=1, le=1000),
    q: str = Query(None, min_length=3, max_length=50, regex="^[a-zA-Z ]+$")
):
    return {"item_id": item_id, "q": q}

# Custom docs endpoint
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )
```

### Advanced OpenAPI Customization

```python
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI()

class ErrorResponse(BaseModel):
    detail: str
    error_code: int

class ItemResponse(BaseModel):
    id: int = Field(..., description="The item ID")
    name: str = Field(..., description="The item name", example="Laptop")
    price: float = Field(..., description="Price in USD", example=999.99)

@app.post(
    "/items/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {
            "description": "Item created successfully",
            "content": {
                "application/json": {
                    "example": {"id": 1, "name": "Laptop", "price": 999.99}
                }
            }
        },
        422: {
            "description": "Validation Error",
            "model": ErrorResponse,
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid input", "error_code": 4001}
                }
            }
        }
    },
    operation_id="create_item_endpoint"
)
async def create_item(item: dict):
    """Create a new item in the system"""
    return ItemResponse(id=1, name=item["name"], price=item["price"])
```

## ✅ What is the difference between Depends and middleware?

**Depends** and **middleware** serve different purposes in FastAPI and operate at different levels of the request lifecycle.

### Depends (Dependency Injection)

Depends is used for dependency injection at the endpoint level. It's executed per endpoint and can be used for specific route requirements.

```python
from fastapi import FastAPI, Depends, HTTPException
from typing import Optional

app = FastAPI()

# Database dependency
def get_db():
    db = {"connection": "active"}
    try:
        yield db
    finally:
        print("Closing database connection")

# Authentication dependency
def get_current_user(token: str = None):
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    return {"user_id": 1, "username": "john_doe"}

# Authorization dependency
def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return current_user

# Endpoint-specific dependencies
@app.get("/users/")
async def get_users(
    db: dict = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return {"users": [], "requested_by": current_user["username"]}

@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user: dict = Depends(require_admin),
    db: dict = Depends(get_db)
):
    return {"message": f"User {user_id} deleted by {admin_user['username']}"}

# Sub-dependencies
def get_pagination(skip: int = 0, limit: int = 100):
    return {"skip": skip, "limit": limit}

def get_filtered_items(
    db: dict = Depends(get_db),
    pagination: dict = Depends(get_pagination)
):
    return {
        "items": ["item1", "item2"],
        "pagination": pagination
    }

@app.get("/items/")
async def list_items(items: dict = Depends(get_filtered_items)):
    return items
```

### Middleware (Global Request Processing)

Middleware operates at the application level and processes every request/response globally.

```python
import time
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()

# Timing middleware
class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

# Logging middleware
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        print(f"Response: {response.status_code}")
        return response

# Security headers middleware
class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

# Add middleware (order matters - last added executes first)
app.add_middleware(TimingMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityMiddleware)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Key Differences Summary

| Aspect | Depends | Middleware |
|--------|---------|------------|
| **Scope** | Endpoint-specific | Application-wide |
| **Execution** | Per-dependency, per-endpoint | Every request/response |
| **Purpose** | Dependency injection, validation | Request/response processing |
| **Flexibility** | Conditional based on endpoint | Global for all requests |
| **Error Handling** | Can raise HTTPExceptions | Must handle errors carefully |
| **Performance** | Only when dependency is used | Every request |

## ✅ What is the role of ResponseModel in FastAPI?

ResponseModel (specified as `response_model`) defines the structure and validation of API responses. It serves multiple purposes in FastAPI applications.

### Basic Response Model Usage

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI()

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Database simulation
fake_users_db = [
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "password": "secret123",
        "is_active": True,
        "created_at": datetime.now()
    }
]

@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate):
    # Password won't be included in response due to response_model
    db_user = {**user.dict(), "id": len(fake_users_db) + 1, 
               "is_active": True, "created_at": datetime.now()}
    fake_users_db.append(db_user)
    return db_user

@app.get("/users/", response_model=List[UserResponse])
async def get_users():
    return fake_users_db

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    user = next((u for u in fake_users_db if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### Advanced Response Model Features

```python
from pydantic import BaseModel, validator
from typing import Union
from enum import Enum

class StatusEnum(str, Enum):
    success = "success"
    error = "error"
    pending = "pending"

class BaseResponse(BaseModel):
    status: StatusEnum
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)

class DataResponse(BaseResponse):
    data: dict

class ErrorResponse(BaseResponse):
    error_code: int
    details: Optional[str] = None

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    has_next: bool
    
    @validator('has_next', always=True)
    def calculate_has_next(cls, v, values):
        if 'total' in values and 'page' in values and 'size' in values:
            return (values['page'] * values['size']) < values['total']
        return False

# Multiple response models for different status codes
@app.get(
    "/data/{item_id}",
    response_model=Union[DataResponse, ErrorResponse],
    responses={
        200: {"model": DataResponse, "description": "Success response"},
        404: {"model": ErrorResponse, "description": "Item not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def get_data(item_id: int):
    if item_id == 404:
        return ErrorResponse(
            status=StatusEnum.error,
            message="Item not found",
            error_code=404,
            details=f"No item found with ID {item_id}"
        )
    
    return DataResponse(
        status=StatusEnum.success,
        message="Data retrieved successfully",
        data={"item_id": item_id, "name": "Sample Item"}
    )
```

### Response Model Configuration

```python
from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    
    class Config:
        # Include fields from ORM models
        from_attributes = True
        
        # Exclude fields with None values
        exclude_none = True
        
        # Custom field aliases
        fields = {
            "full_name": "fullName"
        }

# Exclude specific fields from response
@app.get("/users/{user_id}", response_model=UserResponse, response_model_exclude={"email"})
async def get_user_public(user_id: int):
    return fake_users_db[0]

# Include only specific fields
@app.get("/users/{user_id}/summary", response_model=UserResponse, response_model_include={"id", "username"})
async def get_user_summary(user_id: int):
    return fake_users_db[0]

# Exclude unset fields (useful for partial updates)
@app.patch("/users/{user_id}", response_model=UserResponse, response_model_exclude_unset=True)
async def update_user(user_id: int, user_update: dict):
    # Only return fields that were actually set
    return {**fake_users_db[0], **user_update}
```

## ✅ What is the use of Depends and Security utilities?

Depends and Security utilities in FastAPI provide powerful dependency injection capabilities for handling authentication, authorization, and other cross-cutting concerns.

### Basic Depends Usage

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timedelta

app = FastAPI()
security = HTTPBearer()

# Configuration dependency
def get_settings():
    return {
        "database_url": "postgresql://localhost/mydb",
        "secret_key": "your-secret-key",
        "algorithm": "HS256"
    }

# Database dependency
def get_database_connection(settings: dict = Depends(get_settings)):
    # Simulate database connection
    return {"connection": f"Connected to {settings['database_url']}"}

# Authentication dependency
def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    settings: dict = Depends(get_settings)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings["secret_key"],
            algorithms=[settings["algorithm"]]
        )
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return {"username": username, "token": credentials.credentials}
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

# Role-based authorization dependency
def require_role(required_role: str):
    def role_dependency(current_user: dict = Depends(verify_token)):
        # In real app, you'd get user roles from database
        user_roles = ["user", "admin"]  # Mock user roles
        if required_role not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role} required"
            )
        return current_user
    return role_dependency

@app.get("/profile")
async def get_profile(current_user: dict = Depends(verify_token)):
    return {"username": current_user["username"]}

@app.get("/admin")
async def admin_only(admin_user: dict = Depends(require_role("admin"))):
    return {"message": "Welcome admin!", "user": admin_user["username"]}
```

### Security Utilities

```python
from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import (
    HTTPBasic, HTTPBasicCredentials,
    HTTPBearer, HTTPAuthorizationCredentials,
    OAuth2PasswordBearer, OAuth2PasswordRequestForm,
    APIKeyHeader, APIKeyQuery, APIKeyCookie
)
import secrets
import hashlib

app = FastAPI()

# HTTP Basic Authentication
security_basic = HTTPBasic()

def verify_basic_auth(credentials: HTTPBasicCredentials = Depends(security_basic)):
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "secret")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Bearer Token Authentication
security_bearer = HTTPBearer()

def verify_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)):
    if credentials.credentials != "valid-bearer-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid bearer token"
        )
    return {"token": credentials.credentials}

# OAuth2 Password Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_oauth_token(token: str = Depends(oauth2_scheme)):
    # Verify JWT token here
    if token != "valid-oauth-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OAuth token"
        )
    return {"token": token}

# API Key Authentication
api_key_header = APIKeyHeader(name="X-API-Key")
api_key_query = APIKeyQuery(name="api_key")
api_key_cookie = APIKeyCookie(name="api_key")

def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != "valid-api-key":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    return {"api_key": api_key}

# Multiple authentication methods
def verify_api_key_flexible(
    header_key: str = Depends(api_key_header),
    query_key: str = Depends(api_key_query),
    cookie_key: str = Depends(api_key_cookie)
):
    valid_key = "valid-api-key"
    if header_key == valid_key or query_key == valid_key or cookie_key == valid_key:
        return {"authenticated": True}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid API key"
    )

# Endpoints using different auth methods
@app.get("/basic-auth")
async def basic_auth_endpoint(username: str = Depends(verify_basic_auth)):
    return {"message": f"Hello {username}!"}

@app.get("/bearer-auth")
async def bearer_auth_endpoint(token_data: dict = Depends(verify_bearer_token)):
    return {"message": "Authenticated with bearer token", "token": token_data["token"]}

@app.get("/oauth-auth")
async def oauth_auth_endpoint(token_data: dict = Depends(verify_oauth_token)):
    return {"message": "Authenticated with OAuth", "token": token_data["token"]}

@app.get("/api-key-auth")
async def api_key_auth_endpoint(api_data: dict = Depends(verify_api_key)):
    return {"message": "Authenticated with API key"}
```

### Advanced Dependency Patterns

```python
from functools import lru_cache
from typing import Generator, Optional

# Cached dependencies
@lru_cache()
def get_expensive_computation():
    # Expensive operation that should be cached
    print("Performing expensive computation...")
    return {"result": "computed_value"}

# Generator dependencies (with cleanup)
def get_db_session() -> Generator:
    session = create_db_session()
    try:
        yield session
    finally:
        session.close()

# Conditional dependencies
def get_user_service(use_cache: bool = True):
    if use_cache:
        return CachedUserService()
    return DatabaseUserService()

# Class-based dependencies
class UserService:
    def __init__(self, db_session=Depends(get_db_session)):
        self.db = db_session
    
    def get_user(self, user_id: int):
        return {"id": user_id, "name": "John Doe"}

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    user_service: UserService = Depends()
):
    return user_service.get_user(user_id)

# Global dependencies (applied to all routes)
app = FastAPI(dependencies=[Depends(verify_api_key)])
```

## ✅ How do you stream large responses in FastAPI?

Streaming responses in FastAPI is essential for handling large files, real-time data, or memory-efficient data transfer.

### Basic File Streaming

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, FileResponse
import io
import csv
from typing import Iterator
import os

app = FastAPI()

@app.get("/download-large-file")
async def download_large_file():
    def generate_large_csv():
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(["id", "name", "email", "data"])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)
        
        # Generate large dataset
        for i in range(100000):
            writer.writerow([i, f"User {i}", f"user{i}@example.com", f"data_{i}"])
            if i % 1000 == 0:  # Yield every 1000 rows
                yield output.getvalue()
                output.seek(0)
                output.truncate(0)
        
        # Yield remaining data
        if output.tell():
            yield output.getvalue()

    return StreamingResponse(
        generate_large_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=large_data.csv"}
    )

@app.get("/stream-file/{file_path}")
async def stream_file(file_path: str):
    def file_generator(file_path: str):
        with open(file_path, "rb") as file:
            while chunk := file.read(8192):  # Read in 8KB chunks
                yield chunk
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return StreamingResponse(
        file_generator(file_path),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={os.path.basename(file_path)}"}
    )
```

### Streaming JSON Data

```python
import json
from typing import AsyncGenerator

@app.get("/stream-json-array")
async def stream_json_array():
    async def generate_json_array():
        yield "["
        
        for i in range(10000):
            item = {
                "id": i,
                "name": f"Item {i}",
                "description": f"Description for item {i}",
                "data": [j for j in range(100)]  # Large data
            }
            
            if i > 0:
                yield ","
            yield json.dumps(item)
        
        yield "]"
    
    return StreamingResponse(
        generate_json_array(),
        media_type="application/json"
    )

@app.get("/stream-json-lines")
async def stream_json_lines():
    async def generate_json_lines():
        for i in range(10000):
            item = {
                "timestamp": datetime.now().isoformat(),
                "id": i,
                "data": f"Data point {i}"
            }
            yield json.dumps(item) + "\n"
    
    return StreamingResponse(
        generate_json_lines(),
        media_type="application/x-ndjson",
        headers={"Content-Disposition": "attachment; filename=data.jsonl"}
    )
```

### Database Streaming

```python
from sqlalchemy.orm import Session
from sqlalchemy import text

@app.get("/stream-database-results")
async def stream_database_results(db: Session = Depends(get_db)):
    def stream_query_results():
        # Use server-side cursor for large datasets
        query = text("SELECT * FROM large_table ORDER BY id")
        result = db.execute(query)
        
        # Stream results in batches
        batch_size = 1000
        while True:
            rows = result.fetchmany(batch_size)
            if not rows:
                break
            
            for row in rows:
                yield json.dumps(dict(row)) + "\n"
    
    return StreamingResponse(
        stream_query_results(),
        media_type="application/x-ndjson"
    )

@app.get("/stream-paginated-data")
async def stream_paginated_data(db: Session = Depends(get_db)):
    async def generate_paginated_data():
        page = 0
        page_size = 100
        
        while True:
            offset = page * page_size
            query = db.query(User).offset(offset).limit(page_size)
            users = query.all()
            
            if not users:
                break
            
            for user in users:
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
                yield json.dumps(user_data) + "\n"
            
            page += 1
    
    return StreamingResponse(
        generate_paginated_data(),
        media_type="application/x-ndjson"
    )
```

### Server-Sent Events (SSE)

```python
import asyncio
from sse_starlette.sse import EventSourceResponse

@app.get("/events")
async def stream_events():
    async def event_generator():
        counter = 0
        while True:
            # Check if client is still connected
            if await request.is_disconnected():
                break
            
            # Send event data
            data = {
                "timestamp": datetime.now().isoformat(),
                "counter": counter,
                "message": f"Event {counter}"
            }
            
            yield {
                "event": "update",
                "data": json.dumps(data)
            }
            
            counter += 1
            await asyncio.sleep(1)  # Send event every second
    
    return EventSourceResponse(event_generator())

@app.get("/real-time-logs")
async def stream_logs():
    async def log_generator():
        log_file = "app.log"
        
        with open(log_file, "r") as file:
            # Send existing log content
            file.seek(0, 2)  # Go to end of file
            
            while True:
                line = file.readline()
                if line:
                    yield {
                        "event": "log",
                        "data": line.strip()
                    }
                else:
                    await asyncio.sleep(0.1)  # Wait for new log entries
    
    return EventSourceResponse(log_generator())
```

### Streaming with Progress Updates

```python
@app.post("/process-large-dataset")
async def process_large_dataset():
    async def process_with_progress():
        total_items = 10000
        processed = 0
        
        # Send initial status
        yield json.dumps({
            "status": "started",
            "total": total_items,
            "processed": 0,
            "progress": 0
        }) + "\n"
        
        for i in range(total_items):
            # Simulate processing
            await asyncio.sleep(0.001)
            processed += 1
            
            # Send progress updates every 100 items
            if processed % 100 == 0:
                progress = (processed / total_items) * 100
                yield json.dumps({
                    "status": "processing",
                    "total": total_items,
                    "processed": processed,
                    "progress": round(progress, 2)
                }) + "\n"
        
        # Send completion status
        yield json.dumps({
            "status": "completed",
            "total": total_items,
            "processed": processed,
            "progress": 100
        }) + "\n"
    
    return StreamingResponse(
        process_with_progress(),
        media_type="application/x-ndjson"
    )
```

### Memory-Efficient File Upload Processing

```python
from fastapi import UploadFile, File

@app.post("/process-upload-stream")
async def process_upload_stream(file: UploadFile = File(...)):
    async def process_file_stream():
        line_count = 0
        
        # Process file line by line without loading into memory
        async for line in file:
            line_count += 1
            
            # Process line (e.g., parse CSV, validate data)
            processed_data = {
                "line_number": line_count,
                "content": line.decode().strip(),
                "length": len(line)
            }
            
            yield json.dumps(processed_data) + "\n"
            
            # Send progress every 1000 lines
            if line_count % 1000 == 0:
                progress_data = {
                    "status": "processing",
                    "lines_processed": line_count
                }
                yield json.dumps(progress_data) + "\n"
    
    return StreamingResponse(
        process_file_stream(),
        media_type="application/x-ndjson"
    )
```

These examples demonstrate various streaming techniques in FastAPI, from basic file downloads to real-time event streaming and memory-efficient data processing. Choose the appropriate method based on your specific use case and requirements.