## 🛠️ 2️⃣ API Development

### ✅ How do you define a simple route/endpoint in FastAPI?

```python
from fastapi import FastAPI

app = FastAPI()

# Basic GET endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Different HTTP methods
@app.post("/items/")
async def create_item():
    return {"message": "Item created"}

@app.put("/items/{item_id}")
async def update_item(item_id: int):
    return {"message": f"Item {item_id} updated"}

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted"}

# Multiple HTTP methods for same endpoint
@app.api_route("/items/{item_id}", methods=["GET", "POST"])
async def handle_item(item_id: int):
    return {"item_id": item_id}

# Route with tags and metadata
@app.get("/users/", tags=["users"], summary="Get all users")
async def get_users():
    """
    Retrieve all users from the database.
    
    This endpoint returns a list of all users with their basic information.
    """
    return [{"id": 1, "name": "John"}]
```

### ✅ How do you define query parameters in FastAPI?

```python
from fastapi import FastAPI, Query
from typing import Optional, List

app = FastAPI()

# Basic query parameters
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Optional query parameters
@app.get("/items/search")
async def search_items(
    q: Optional[str] = None,
    category: Optional[str] = None
):
    items = {"q": q, "category": category}
    return items

# Query parameters with validation
@app.get("/items/")
async def read_items(
    q: Optional[str] = Query(None, min_length=3, max_length=50),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return {"q": q, "skip": skip, "limit": limit}

# List query parameters
@app.get("/items/")
async def read_items(tags: List[str] = Query([])):
    return {"tags": tags}

# Query parameters with metadata
@app.get("/items/")
async def read_items(
    q: Optional[str] = Query(
        None,
        title="Query string",
        description="Query string for the items to search",
        min_length=3,
        max_length=50,
        regex="^[a-zA-Z0-9 ]+$"
    )
):
    return {"q": q}

# Boolean query parameters
@app.get("/items/")
async def read_items(active: bool = True):
    return {"active": active}
```

### ✅ How do you define path parameters in FastAPI?

```python
from fastapi import FastAPI, Path
from enum import Enum

app = FastAPI()

# Basic path parameters
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# Multiple path parameters
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(user_id: int, item_id: int):
    return {"user_id": user_id, "item_id": item_id}

# Path parameters with validation
@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(..., title="The ID of the item", ge=1, le=1000)
):
    return {"item_id": item_id}

# String path parameters
@app.get("/users/{user_name}")
async def read_user(user_name: str):
    return {"user_name": user_name}

# Enum path parameters
class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name == ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}
    return {"model_name": model_name, "message": "Have some residuals"}

# File path parameters
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}

# Path parameters with regex
@app.get("/items/{item_id}")
async def read_item(
    item_id: str = Path(..., regex=r"^[a-zA-Z0-9_-]+$")
):
    return {"item_id": item_id}
```

### ✅ How do you handle request bodies in FastAPI?

```python
from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Basic request body with Pydantic model
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
async def create_item(item: Item):
    return item

# Multiple request bodies
class User(BaseModel):
    username: str
    email: str

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, user: User):
    return {"item_id": item_id, "item": item, "user": user}

# Request body with singular values
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    importance: int = Body(...)
):
    return {"item_id": item_id, "item": item, "importance": importance}

# Nested models
class Image(BaseModel):
    url: str
    name: str

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None
    tags: List[str] = []
    images: Optional[List[Image]] = None

@app.post("/items/")
async def create_item(item: Item):
    return item

# Request body with additional data
@app.post("/items/")
async def create_item(
    item: Item,
    metadata: dict = Body(...)
):
    return {"item": item, "metadata": metadata}

# Embedded single values
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item = Body(..., embed=True)
):
    return {"item_id": item_id, "item": item}
```

### ✅ What are the advantages of using Pydantic models for request and response bodies?

**Advantages of Pydantic Models:**

1. **Automatic Validation**: Input data is automatically validated
2. **Type Safety**: Ensures data types are correct
3. **Documentation**: Auto-generates API documentation
4. **Serialization**: Automatic JSON serialization/deserialization
5. **IDE Support**: Better code completion and error detection
6. **Custom Validation**: Custom validators and constraints

```python
from pydantic import BaseModel, validator, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    age: int = Field(..., gt=0, le=120)

    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.isalnum(), 'Username must be alphanumeric'
        return v

    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # For SQLAlchemy integration

# Usage in endpoints
@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate):
    # user is automatically validated
    # Response is automatically serialized according to UserResponse model
    db_user = User(**user.dict())
    # ... save to database
    return db_user
```

### ✅ How do you validate incoming data in FastAPI?

```python
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, validator, Field, ValidationError
from typing import Optional, List
import re

app = FastAPI()

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: int = Field(..., gt=0, le=120)
    password: str = Field(..., min_length=8)
    confirm_password: str

    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v

    @validator('password')
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain digit')
        return v

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

# Custom validation with dependency
from fastapi import Depends

def validate_user_exists(username: str):
    # Check if user exists in database
    if user_exists(username):
        raise HTTPException(status_code=400, detail="Username already exists")
    return username

@app.post("/users/")
async def create_user(
    user: User,
    validated_username: str = Depends(validate_user_exists)
):
    return {"message": "User created successfully"}

# Manual validation
@app.post("/items/")
async def create_item(item_data: dict = Body(...)):
    try:
        # Manual validation
        if "name" not in item_data:
            raise HTTPException(status_code=422, detail="Name is required")
        
        if len(item_data["name"]) < 3:
            raise HTTPException(status_code=422, detail="Name too short")
        
        return {"message": "Item created"}
    
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

# Query parameter validation
from fastapi import Query

@app.get("/items/")
async def read_items(
    q: Optional[str] = Query(None, min_length=3, max_length=50),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tags: List[str] = Query([])
):
    return {"q": q, "skip": skip, "limit": limit, "tags": tags}
```

### ✅ How do you handle file uploads in FastAPI?

```python
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from typing import List
import shutil
import os

app = FastAPI()

# Basic file upload
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename, "content_type": file.content_type}

# Multiple file uploads
@app.post("/upload-multiple/")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    return [{"filename": file.filename} for file in files]

# File upload with form data
@app.post("/upload-with-form/")
async def upload_with_form(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...)
):
    return {
        "filename": file.filename,
        "name": name,
        "description": description
    }

# File upload with validation
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Validate file size (e.g., max 5MB)
    if file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "size": file.size}

# Streaming file upload for large files
@app.post("/upload-large/")
async def upload_large_file(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    
    with open(file_path, "wb") as f:
        while contents := await file.read(1024):  # Read in chunks
            f.write(contents)
    
    return {"filename": file.filename, "message": "Upload successful"}

# File download
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"uploads/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path, filename=filename)

# Advanced file upload with metadata
from pydantic import BaseModel

class FileMetadata(BaseModel):
    title: str
    description: str
    tags: List[str] = []

@app.post("/upload-advanced/")
async def upload_with_metadata(
    file: UploadFile = File(...),
    metadata: str = Form(...)  # JSON string
):
    import json
    
    try:
        metadata_obj = FileMetadata.parse_raw(metadata)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid metadata")
    
    # Process file and metadata
    return {
        "filename": file.filename,
        "metadata": metadata_obj.dict()
    }
```

### ✅ How do you implement API versioning in FastAPI?

```python
from fastapi import FastAPI, APIRouter

# Method 1: URL Path Versioning
app = FastAPI()

# Version 1
v1_router = APIRouter(prefix="/api/v1", tags=["v1"])

@v1_router.get("/users/")
async def get_users_v1():
    return {"version": "1.0", "users": []}

@v1_router.get("/users/{user_id}")
async def get_user_v1(user_id: int):
    return {"version": "1.0", "user_id": user_id}

# Version 2
v2_router = APIRouter(prefix="/api/v2", tags=["v2"])

@v2_router.get("/users/")
async def get_users_v2():
    return {"version": "2.0", "users": [], "total_count": 0}

@v2_router.get("/users/{user_id}")
async def get_user_v2(user_id: int):
    return {
        "version": "2.0", 
        "user": {"id": user_id, "created_at": "2023-01-01"}
    }

# Include routers
app.include_router(v1_router)
app.include_router(v2_router)

# Method 2: Header-based versioning
from fastapi import Header, HTTPException

async def get_api_version(x_api_version: str = Header("1.0")):
    if x_api_version not in ["1.0", "2.0"]:
        raise HTTPException(status_code=400, detail="Unsupported API version")
    return x_api_version

@app.get("/users/")
async def get_users(version: str = Depends(get_api_version)):
    if version == "1.0":
        return {"version": "1.0", "users": []}
    elif version == "2.0":
        return {"version": "2.0", "users": [], "pagination": {}}

# Method 3: Query Parameter Versioning
@app.get("/users/")
async def get_users(version: str = "1.0"):
    if version == "1.0":
        return {"version": "1.0", "users": []}
    elif version == "2.0":
        return {"version": "2.0", "users": [], "metadata": {}}
    else:
        raise HTTPException(status_code=400, detail="Unsupported version")

# Method 4: Separate FastAPI apps
app_v1 = FastAPI(title="API V1", version="1.0.0")
app_v2 = FastAPI(title="API V2", version="2.0.0")

@app_v1.get("/users/")
async def get_users_v1():
    return {"version": "1.0", "users": []}

@app_v2.get("/users/")
async def get_users_v2():
    return {"version": "2.0", "users": [], "enhanced_features": True}

# Mount sub-applications
main_app = FastAPI()
main_app.mount("/v1", app_v1)
main_app.mount("/v2", app_v2)

# Method 5: Version-specific models
from pydantic import BaseModel

class UserV1(BaseModel):
    id: int
    name: str

class UserV2(BaseModel):
    id: int
    name: str
    email: str
    created_at: str

@app.get("/v1/users/{user_id}", response_model=UserV1)
async def get_user_v1(user_id: int):
    return UserV1(id=user_id, name="John")

@app.get("/v2/users/{user_id}", response_model=UserV2)
async def get_user_v2(user_id: int):
    return UserV2(
        id=user_id, 
        name="John", 
        email="john@example.com",
        created_at="2023-01-01"
    )
```

### ✅ How do you implement CORS in FastAPI?

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Basic CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Production CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://localhost:8080",  # Vue development server
        "https://myapp.com",      # Production frontend
        "https://www.myapp.com",  # Production frontend with www
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Environment-based CORS
import os

origins = []

if os.getenv("ENVIRONMENT") == "development":
    origins = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:3001",
    ]
else:
    origins = [
        "https://myapp.com",
        "https://www.myapp.com",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Manual CORS handling
from fastapi import Request
from fastapi.responses import Response

@app.middleware("http")
async def cors_handler(request: Request, call_next):
    response = await call_next(request)
    
    origin = request.headers.get("origin")
    
    if origin in ["http://localhost:3000", "https://myapp.com"]:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# Preflight request handling
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.get("/")
async def main():
    return {"message": "Hello World"}
```