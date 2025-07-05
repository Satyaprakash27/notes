# FastAPI: Comprehensive Guide

## Table of Contents
- [What is FastAPI?](#what-is-fastapi)
- [FastAPI vs Other Frameworks](#fastapi-vs-other-frameworks)
- [Common Use Cases](#common-use-cases)
- [Building REST APIs with FastAPI](#building-rest-apis-with-fastapi)
- [AI Model Endpoints](#ai-model-endpoints)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Real-World Examples](#real-world-examples)

## What is FastAPI?

**FastAPI** is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It was created by Sebastian Ramirez and has become one of the most popular Python web frameworks for API development.

### Key Features:
- **High Performance**: One of the fastest Python frameworks available, comparable to NodeJS and Go
- **Type Safety**: Built-in support for Python type hints with automatic validation
- **Automatic Documentation**: Interactive API documentation (Swagger UI and ReDoc) generated automatically
- **Standards-based**: Based on OpenAPI (formerly Swagger) and JSON Schema
- **Async Support**: Native support for async/await for handling concurrent requests
- **Easy to Learn**: Intuitive and easy to use, with great developer experience
- **Production Ready**: Used by major companies like Microsoft, Uber, and Netflix

### Core Concepts:

#### 1. **ASGI Framework**
FastAPI is built on top of Starlette for the web parts and Pydantic for the data parts, making it an ASGI (Asynchronous Server Gateway Interface) framework.

#### 2. **Type Hints Integration**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = False

@app.post("/items/")
async def create_item(item: Item):
    return item
```

#### 3. **Automatic Validation**
FastAPI automatically validates request data, query parameters, and path parameters based on type hints.

#### 4. **Dependency Injection**
Built-in dependency injection system for code reusability and testing.

## FastAPI vs Other Frameworks

### FastAPI vs Flask vs Django

| Feature | FastAPI | Flask | Django |
|---------|---------|-------|--------|
| **Performance** | Very High (ASGI) | Medium (WSGI) | Medium (WSGI) |
| **Type Safety** | Built-in | Manual | Manual |
| **Documentation** | Auto-generated | Manual | Manual |
| **Learning Curve** | Easy | Easy | Steep |
| **Async Support** | Native | Limited | Limited |
| **API Development** | Excellent | Good | Good |
| **Full-stack** | API-focused | Flexible | Full-featured |
| **Database ORM** | Optional | Optional | Built-in |
| **Admin Interface** | No | No | Built-in |
| **Microservices** | Excellent | Good | Overkill |

### Detailed Comparison:

#### **FastAPI Advantages:**
- **Speed**: Up to 2-3x faster than Flask due to ASGI and async support
- **Type Safety**: Automatic request/response validation using Pydantic
- **Documentation**: Interactive docs (Swagger UI) generated automatically
- **Modern Python**: Built for Python 3.7+ with full async/await support
- **Standards Compliance**: OpenAPI and JSON Schema out of the box
- **Editor Support**: Great IDE support with autocompletion and error detection

#### **When to Use Each:**

**Use FastAPI when:**
- Building APIs (REST, GraphQL)
- High-performance requirements
- Microservices architecture
- AI/ML model serving
- Real-time applications
- Type safety is important

**Use Flask when:**
- Simple web applications
- Prototyping
- Learning web development
- Need maximum flexibility
- Existing Flask ecosystem

**Use Django when:**
- Full-stack web applications
- Rapid development with admin interface
- Traditional web apps with templates
- Built-in user authentication needed
- Large, complex applications

## Common Use Cases

### 1. **Backend Development**

#### **Microservices Architecture**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx

app = FastAPI(title="User Service")

class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    # Simulate database call
    if user_id == 1:
        return User(id=1, name="John Doe", email="john@example.com")
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/users/")
async def create_user(user: User):
    # Simulate user creation
    return {"message": "User created", "user": user}
```

#### **Database Integration**
```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)
```

### 2. **AI/ML Pipelines**

#### **Model Serving**
```python
from fastapi import FastAPI, File, UploadFile
import joblib
import pandas as pd
from io import StringIO

app = FastAPI(title="ML Model API")

# Load pre-trained model
model = joblib.load("model.pkl")

class PredictionRequest(BaseModel):
    features: List[float]

@app.post("/predict")
async def predict(request: PredictionRequest):
    prediction = model.predict([request.features])
    return {"prediction": prediction[0]}

@app.post("/predict-csv")
async def predict_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode('utf-8')))
    predictions = model.predict(df)
    return {"predictions": predictions.tolist()}
```

#### **Computer Vision API**
```python
from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from PIL import Image
import io

app = FastAPI(title="Computer Vision API")

@app.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert to OpenCV format
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Perform object detection (placeholder)
    # results = your_object_detection_model(cv_image)
    
    return {
        "filename": file.filename,
        "objects_detected": 5,  # placeholder
        "confidence": 0.95
    }
```

### 3. **Real-time Applications**

#### **WebSocket Support**
```python
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")

@app.get("/")
async def get():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
        <head>
            <title>Chat</title>
        </head>
        <body>
            <h1>WebSocket Chat</h1>
            <form action="" onsubmit="sendMessage(event)">
                <input type="text" id="messageText" autocomplete="off"/>
                <button>Send</button>
            </form>
            <ul id='messages'>
            </ul>
            <script>
                var ws = new WebSocket("ws://localhost:8000/ws");
                ws.onmessage = function(event) {
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                };
                function sendMessage(event) {
                    var input = document.getElementById("messageText")
                    ws.send(input.value)
                    input.value = ''
                    event.preventDefault()
                }
            </script>
        </body>
    </html>
    """)
```

### 4. **API Gateway and Proxy**
```python
from fastapi import FastAPI, Request
import httpx

app = FastAPI(title="API Gateway")

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(service: str, path: str, request: Request):
    service_urls = {
        "users": "http://user-service:8001",
        "orders": "http://order-service:8002",
        "products": "http://product-service:8003"
    }
    
    if service not in service_urls:
        return {"error": "Service not found"}
    
    url = f"{service_urls[service]}/{path}"
    
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=url,
            params=request.query_params,
            content=await request.body()
        )
    
    return response.json()
```

## Building REST APIs with FastAPI

### Basic REST API Structure

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Task Management API", version="1.0.0")

# Models
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str
    
    class Config:
        orm_mode = True

# In-memory storage (use database in production)
tasks_db = {}

# CRUD Operations
@app.post("/tasks/", response_model=Task, status_code=201)
async def create_task(task: TaskCreate):
    task_id = str(uuid.uuid4())
    new_task = Task(id=task_id, **task.dict())
    tasks_db[task_id] = new_task
    return new_task

@app.get("/tasks/", response_model=List[Task])
async def read_tasks(skip: int = 0, limit: int = 100):
    tasks = list(tasks_db.values())
    return tasks[skip:skip + limit]

@app.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskCreate):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    updated_task = Task(id=task_id, **task_update.dict())
    tasks_db[task_id] = updated_task
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del tasks_db[task_id]
    return {"message": "Task deleted successfully"}
```

### Advanced Features

#### **Authentication and Authorization**
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

app = FastAPI()
security = HTTPBearer()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/protected")
async def protected_route(current_user: str = Depends(verify_token)):
    return {"message": f"Hello {current_user}"}
```

#### **Request Validation and Error Handling**
```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import http_exception_handler
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator

app = FastAPI()

class UserCreate(BaseModel):
    username: str
    email: str
    age: int
    
    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v
    
    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"message": f"Validation error: {str(exc)}"}
    )

@app.post("/users/")
async def create_user(user: UserCreate):
    return {"message": "User created", "user": user}
```

## AI Model Endpoints

### Complete AI Model Serving Example

```python
from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import joblib
import pandas as pd
from PIL import Image
import io
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Model Serving API",
    description="REST API for serving machine learning models",
    version="1.0.0"
)

# Load models at startup
@app.on_event("startup")
async def load_models():
    global text_classifier, image_classifier, regression_model
    try:
        text_classifier = joblib.load("models/text_classifier.pkl")
        # image_classifier = load_model("models/image_model.h5")  # TensorFlow/Keras
        regression_model = joblib.load("models/regression_model.pkl")
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {e}")

# Pydantic models for request/response
class TextClassificationRequest(BaseModel):
    text: str
    model_version: Optional[str] = "v1"

class TextClassificationResponse(BaseModel):
    text: str
    predicted_class: str
    confidence: float
    model_version: str

class RegressionRequest(BaseModel):
    features: List[float]

class RegressionResponse(BaseModel):
    prediction: float
    features_used: List[float]

class BatchPredictionRequest(BaseModel):
    texts: List[str]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "text_classifier": "text_classifier" in globals(),
            "regression_model": "regression_model" in globals()
        }
    }

# Text classification endpoint
@app.post("/predict/text", response_model=TextClassificationResponse)
async def predict_text(request: TextClassificationRequest):
    try:
        # Preprocess text (example)
        processed_text = request.text.lower().strip()
        
        # Make prediction
        prediction = text_classifier.predict([processed_text])[0]
        probabilities = text_classifier.predict_proba([processed_text])[0]
        confidence = float(max(probabilities))
        
        return TextClassificationResponse(
            text=request.text,
            predicted_class=prediction,
            confidence=confidence,
            model_version=request.model_version
        )
    except Exception as e:
        logger.error(f"Text prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

# Batch text classification
@app.post("/predict/text/batch")
async def predict_text_batch(request: BatchPredictionRequest):
    try:
        predictions = []
        for text in request.texts:
            processed_text = text.lower().strip()
            prediction = text_classifier.predict([processed_text])[0]
            probabilities = text_classifier.predict_proba([processed_text])[0]
            confidence = float(max(probabilities))
            
            predictions.append({
                "text": text,
                "predicted_class": prediction,
                "confidence": confidence
            })
        
        return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")

# Regression endpoint
@app.post("/predict/regression", response_model=RegressionResponse)
async def predict_regression(request: RegressionRequest):
    try:
        # Validate input features
        if len(request.features) != regression_model.n_features_in_:
            raise HTTPException(
                status_code=400, 
                detail=f"Expected {regression_model.n_features_in_} features, got {len(request.features)}"
            )
        
        # Make prediction
        features_array = np.array([request.features])
        prediction = regression_model.predict(features_array)[0]
        
        return RegressionResponse(
            prediction=float(prediction),
            features_used=request.features
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Regression prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

# Image classification endpoint
@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Resize image (example: 224x224 for many CNN models)
        image = image.resize((224, 224))
        
        # Convert to array and normalize
        image_array = np.array(image) / 255.0
        
        # Add batch dimension
        image_batch = np.expand_dims(image_array, axis=0)
        
        # Make prediction (placeholder - replace with actual model)
        # prediction = image_classifier.predict(image_batch)
        # predicted_class = np.argmax(prediction[0])
        # confidence = float(np.max(prediction[0]))
        
        # Placeholder response
        return {
            "filename": file.filename,
            "predicted_class": "cat",  # placeholder
            "confidence": 0.95,
            "image_shape": image_array.shape
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image prediction error: {e}")
        raise HTTPException(status_code=500, detail="Image prediction failed")

# Async prediction with background task
def process_large_dataset(data: List[dict], task_id: str):
    """Background task for processing large datasets"""
    try:
        # Simulate long-running process
        import time
        time.sleep(10)  # Replace with actual processing
        
        # Store results (use database/cache in production)
        results_cache[task_id] = {
            "status": "completed",
            "results": [{"processed": True} for _ in data]
        }
    except Exception as e:
        results_cache[task_id] = {
            "status": "failed",
            "error": str(e)
        }

# In-memory cache for background tasks (use Redis in production)
results_cache = {}

@app.post("/predict/async")
async def predict_async(
    data: List[dict], 
    background_tasks: BackgroundTasks
):
    task_id = str(uuid.uuid4())
    
    # Start background task
    background_tasks.add_task(process_large_dataset, data, task_id)
    
    # Initialize task status
    results_cache[task_id] = {"status": "processing"}
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Task started. Check status using task_id"
    }

@app.get("/predict/async/{task_id}")
async def get_async_result(task_id: str):
    if task_id not in results_cache:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return results_cache[task_id]

# Model management endpoints
@app.post("/models/reload")
async def reload_models():
    """Reload all models (useful for model updates)"""
    try:
        await load_models()
        return {"message": "Models reloaded successfully"}
    except Exception as e:
        logger.error(f"Model reload error: {e}")
        raise HTTPException(status_code=500, detail="Model reload failed")

@app.get("/models/info")
async def get_model_info():
    """Get information about loaded models"""
    return {
        "text_classifier": {
            "loaded": "text_classifier" in globals(),
            "classes": getattr(text_classifier, 'classes_', None)
        },
        "regression_model": {
            "loaded": "regression_model" in globals(),
            "n_features": getattr(regression_model, 'n_features_in_', None)
        }
    }

# Error handling middleware
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.3f}s")
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Best Practices

### 1. **Project Structure**
```
fastapi_project/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── users.py
│   │   └── items.py
│   ├── dependencies.py
│   ├── database.py
│   └── config.py
├── tests/
├── requirements.txt
└── README.md
```

### 2. **Configuration Management**
```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    database_url: str
    secret_key: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 3. **Database Integration with SQLAlchemy**
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 4. **Testing**
```python
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_item():
    response = client.post("/items/", json={"name": "Test", "price": 10.5})
    assert response.status_code == 201
    assert response.json()["name"] == "Test"
```

## Performance Optimization

### 1. **Async/Await Best Practices**
```python
import asyncio
import httpx

@app.get("/external-data")
async def get_external_data():
    async with httpx.AsyncClient() as client:
        response1 = client.get("https://api1.example.com/data")
        response2 = client.get("https://api2.example.com/data")
        
        # Wait for both requests concurrently
        results = await asyncio.gather(response1, response2)
        
        return {
            "api1_data": results[0].json(),
            "api2_data": results[1].json()
        }
```

### 2. **Caching with Redis**
```python
import redis
from fastapi import FastAPI
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/cached-data/{item_id}")
async def get_cached_data(item_id: int):
    # Try to get from cache first
    cached_data = redis_client.get(f"item:{item_id}")
    if cached_data:
        return json.loads(cached_data)
    
    # If not in cache, fetch from database
    data = await fetch_from_database(item_id)
    
    # Store in cache for 1 hour
    redis_client.setex(f"item:{item_id}", 3600, json.dumps(data))
    
    return data
```

### 3. **Rate Limiting**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/limited")
@limiter.limit("5/minute")
async def limited_endpoint(request: Request):
    return {"message": "This endpoint is rate limited"}
```

## Deployment

### 1. **Docker Deployment**
```dockerfile
FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

### 2. **Production Server Configuration**
```python
# gunicorn_config.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
keepalive = 2
```

### 3. **Environment Variables**
```bash
# .env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=["*"]
```

## Conclusion

FastAPI is an excellent choice for building modern, high-performance APIs, especially for:
- **AI/ML Applications**: Easy model serving with automatic documentation
- **Microservices**: Fast, lightweight, and scalable
- **Real-time Applications**: Native async support
- **API-first Development**: Automatic OpenAPI documentation

Its combination of performance, developer experience, and modern Python features makes it ideal for contemporary web development and AI pipelines.