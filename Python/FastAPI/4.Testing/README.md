# 🧪 FastAPI Testing Documentation

## Overview

Testing is a crucial part of building robust FastAPI applications. FastAPI provides excellent testing capabilities through its integration with popular testing frameworks and its built-in `TestClient` class.

## ✅ How do you test FastAPI applications?

FastAPI applications can be tested using several approaches:

### 1. **Unit Testing with TestClient**

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# Create test client
client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_read_item():
    response = client.get("/items/42?q=test")
    assert response.status_code == 200
    assert response.json() == {"item_id": 42, "q": "test"}
```

### 2. **Testing with Pytest**

```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def test_client():
    """Create a test client fixture"""
    return TestClient(app)

def test_create_item(test_client):
    response = test_client.post(
        "/items/",
        json={"name": "Test Item", "price": 10.5, "is_offer": True}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Item"

def test_read_items(test_client):
    response = test_client.get("/items/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### 3. **Testing Authentication Endpoints**

```python
def test_login():
    response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    # Test protected endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/protected", headers=headers)
    assert response.status_code == 200

def test_unauthorized_access():
    response = client.get("/protected")
    assert response.status_code == 401
```

### 4. **Testing File Uploads**

```python
def test_file_upload():
    with open("test_file.txt", "w") as f:
        f.write("test content")
    
    with open("test_file.txt", "rb") as f:
        response = client.post(
            "/upload/",
            files={"file": ("test_file.txt", f, "text/plain")}
        )
    assert response.status_code == 200
    assert "filename" in response.json()
```

## ✅ What is the role of TestClient in FastAPI?

**TestClient** is FastAPI's built-in testing utility that provides a simple interface for testing FastAPI applications without running an actual server.

### Key Features of TestClient:

#### 1. **ASGI Test Client**
```python
from fastapi.testclient import TestClient
from myapp import app

client = TestClient(app)

# TestClient handles async operations automatically
def test_async_endpoint():
    response = client.get("/async-endpoint")
    assert response.status_code == 200
```

#### 2. **Request Methods Support**
```python
# GET requests
response = client.get("/items/1")

# POST requests with JSON
response = client.post("/items/", json={"name": "item"})

# PUT requests
response = client.put("/items/1", json={"name": "updated"})

# DELETE requests
response = client.delete("/items/1")

# PATCH requests
response = client.patch("/items/1", json={"name": "patched"})
```

#### 3. **Headers and Cookies**
```python
# Custom headers
headers = {"X-Token": "coneofsilence"}
response = client.get("/protected/", headers=headers)

# Cookies
cookies = {"session_id": "test123"}
response = client.get("/dashboard/", cookies=cookies)
```

#### 4. **Query Parameters**
```python
# Query parameters
response = client.get("/items/?skip=0&limit=10")

# Or using params
response = client.get("/items/", params={"skip": 0, "limit": 10})
```

#### 5. **Form Data**
```python
# Form data
response = client.post("/login/", data={"username": "user", "password": "pass"})

# File uploads
files = {"upload_file": open("test.txt", "rb")}
response = client.post("/upload/", files=files)
```

### Complete TestClient Example:

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()
security = HTTPBearer()

class Item(BaseModel):
    name: str
    price: float

items = []

def get_current_user(token: str = Depends(security)):
    if token.credentials != "valid_token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return {"username": "testuser"}

@app.post("/items/")
def create_item(item: Item, current_user: dict = Depends(get_current_user)):
    items.append(item)
    return item

@app.get("/items/")
def read_items():
    return items

# Testing
client = TestClient(app)

def test_create_item_authenticated():
    headers = {"Authorization": "Bearer valid_token"}
    response = client.post(
        "/items/",
        json={"name": "Test Item", "price": 10.5},
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Item"

def test_create_item_unauthenticated():
    response = client.post(
        "/items/",
        json={"name": "Test Item", "price": 10.5}
    )
    assert response.status_code == 403
```

## ✅ How do you mock dependencies in FastAPI tests?

FastAPI provides excellent dependency injection capabilities, and you can easily mock dependencies during testing.

### 1. **Basic Dependency Mocking**

```python
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient

app = FastAPI()

# Original dependency
def get_db():
    # This would normally connect to a real database
    return {"db": "real_database"}

@app.get("/users/")
def read_users(db: dict = Depends(get_db)):
    return {"users": ["user1", "user2"], "db": db["db"]}

# Mock dependency
def get_db_mock():
    return {"db": "mock_database"}

# Testing with mocked dependency
client = TestClient(app)

def test_read_users_with_mock():
    # Override the dependency
    app.dependency_overrides[get_db] = get_db_mock
    
    response = client.get("/users/")
    assert response.status_code == 200
    assert response.json()["db"] == "mock_database"
    
    # Clean up
    app.dependency_overrides = {}
```

### 2. **Mocking Database Dependencies**

```python
from sqlalchemy.orm import Session
from fastapi import Depends

# Original database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock database for testing
class MockDB:
    def query(self, model):
        return MockQuery()
    
    def add(self, instance):
        pass
    
    def commit(self):
        pass

class MockQuery:
    def filter(self, *args):
        return self
    
    def first(self):
        return {"id": 1, "name": "test_user"}
    
    def all(self):
        return [{"id": 1, "name": "test_user"}]

def get_db_mock():
    return MockDB()

# Test with mocked database
def test_get_user():
    app.dependency_overrides[get_db] = get_db_mock
    
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json()["name"] == "test_user"
    
    app.dependency_overrides = {}
```

### 3. **Mocking Authentication Dependencies**

```python
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

# Original auth dependency
def get_current_user(token: str = Depends(security)):
    # This would normally validate the token
    if not verify_token(token.credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return get_user_from_token(token.credentials)

# Mock auth dependency
def get_current_user_mock():
    return {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
    }

@app.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

# Test without authentication
def test_get_profile():
    app.dependency_overrides[get_current_user] = get_current_user_mock
    
    response = client.get("/profile")
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    
    app.dependency_overrides = {}
```

### 4. **Using Pytest Fixtures for Dependency Mocking**

```python
import pytest
from unittest.mock import Mock

@pytest.fixture
def mock_db():
    """Mock database fixture"""
    mock = Mock()
    mock.query.return_value.filter.return_value.first.return_value = {
        "id": 1, "name": "test_user"
    }
    return mock

@pytest.fixture
def mock_auth_user():
    """Mock authenticated user fixture"""
    return {"id": 1, "username": "testuser"}

@pytest.fixture
def client_with_mocks(mock_db, mock_auth_user):
    """Test client with all dependencies mocked"""
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: mock_auth_user
    
    client = TestClient(app)
    yield client
    
    # Cleanup
    app.dependency_overrides = {}

def test_protected_endpoint(client_with_mocks):
    response = client_with_mocks.get("/protected-users/")
    assert response.status_code == 200
```

### 5. **Mocking External Services**

```python
import httpx
from unittest.mock import AsyncMock, patch

# Original service
async def get_external_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.external.com/data")
        return response.json()

@app.get("/external")
async def external_endpoint():
    data = await get_external_data()
    return data

# Mock external service
@patch('main.get_external_data')
def test_external_endpoint(mock_get_external_data):
    mock_get_external_data.return_value = {"mocked": "data"}
    
    response = client.get("/external")
    assert response.status_code == 200
    assert response.json() == {"mocked": "data"}
```

## ✅ What testing frameworks do you commonly use with FastAPI?

### 1. **Pytest (Most Popular)**

Pytest is the most commonly used testing framework with FastAPI due to its powerful features and FastAPI's excellent integration.

#### Installation:
```bash
pip install pytest pytest-asyncio
```

#### Basic Pytest Structure:
```python
# conftest.py
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_user():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }

# test_main.py
import pytest

def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_async_endpoint(client):
    response = client.get("/async-endpoint")
    assert response.status_code == 200

class TestUserEndpoints:
    def test_create_user(self, client, sample_user):
        response = client.post("/users/", json=sample_user)
        assert response.status_code == 201
    
    def test_get_user(self, client):
        response = client.get("/users/1")
        assert response.status_code == 200
```

#### Pytest with Parametrization:
```python
@pytest.mark.parametrize("item_id,expected", [
    (1, 200),
    (999, 404),
    (-1, 422),
])
def test_get_item_status_codes(client, item_id, expected):
    response = client.get(f"/items/{item_id}")
    assert response.status_code == expected

@pytest.mark.parametrize("data,status_code", [
    ({"name": "valid", "price": 10}, 200),
    ({"name": "", "price": 10}, 422),
    ({"name": "valid", "price": -1}, 422),
])
def test_create_item_validation(client, data, status_code):
    response = client.post("/items/", json=data)
    assert response.status_code == status_code
```

### 2. **Unittest (Python Standard Library)**

```python
import unittest
from fastapi.testclient import TestClient
from main import app

class TestFastAPIApp(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
    
    def test_read_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello World"})
    
    def test_create_item(self):
        item_data = {"name": "Test Item", "price": 10.5}
        response = self.client.post("/items/", json=item_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())

if __name__ == "__main__":
    unittest.main()
```

### 3. **Testing with Database (SQLAlchemy + Pytest)**

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides = {}

def test_create_user_db(client, db_session):
    user_data = {"username": "testuser", "email": "test@example.com"}
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    
    # Verify in database
    from models import User
    user = db_session.query(User).filter(User.username == "testuser").first()
    assert user is not None
    assert user.email == "test@example.com"
```

### 4. **Integration Testing with Docker**

```python
# docker-compose.test.yml
version: '3.8'
services:
  test_db:
    image: postgres:13
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_pass
    ports:
      - "5433:5432"

# test_integration.py
import pytest
import psycopg2
from fastapi.testclient import TestClient

@pytest.fixture(scope="session")
def test_db():
    """Setup test database"""
    # Start docker container or connect to test DB
    # Run migrations
    yield
    # Cleanup

def test_full_user_workflow(client, test_db):
    # Test complete user registration and login flow
    user_data = {"username": "integrationuser", "password": "testpass"}
    
    # Register
    response = client.post("/register", json=user_data)
    assert response.status_code == 201
    
    # Login
    response = client.post("/login", data=user_data)
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    # Access protected resource
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/profile", headers=headers)
    assert response.status_code == 200
```

### 5. **Performance Testing**

```python
import time
import pytest
from concurrent.futures import ThreadPoolExecutor

def test_endpoint_performance(client):
    start_time = time.time()
    response = client.get("/heavy-computation")
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 2.0  # Should complete in under 2 seconds

def test_concurrent_requests(client):
    def make_request():
        return client.get("/")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(100)]
        responses = [future.result() for future in futures]
    
    assert all(response.status_code == 200 for response in responses)
```

## 🛠️ Best Practices for FastAPI Testing

### 1. **Test Structure**
```
tests/
├── __init__.py
├── conftest.py              # Shared fixtures
├── test_auth.py            # Authentication tests
├── test_users.py           # User endpoint tests
├── test_items.py           # Item endpoint tests
├── integration/
│   ├── __init__.py
│   └── test_user_flow.py   # Integration tests
└── unit/
    ├── __init__.py
    ├── test_services.py    # Service layer tests
    └── test_models.py      # Model tests
```

### 2. **Use Fixtures Effectively**
```python
@pytest.fixture(scope="session")
def test_app():
    """Create test app once per session"""
    return FastAPI()

@pytest.fixture(scope="function")
def client(test_app):
    """Create fresh client for each test"""
    return TestClient(test_app)

@pytest.fixture
def auth_headers():
    """Authenticated headers for protected endpoints"""
    return {"Authorization": "Bearer test_token"}
```

### 3. **Test Coverage**
```bash
pip install pytest-cov

# Run tests with coverage
pytest --cov=app --cov-report=html

# Coverage with missing lines
pytest --cov=app --cov-report=term-missing
```

### 4. **Environment-Specific Testing**
```python
import os
import pytest

@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment variables"""
    os.environ["TESTING"] = "true"
    os.environ["DATABASE_URL"] = "sqlite:///./test.db"
    yield
    # Cleanup after test
```

This comprehensive testing documentation covers all the essential aspects of testing FastAPI applications, from basic unit tests to complex integration scenarios. The examples provided should give you a solid foundation for implementing robust testing strategies in your FastAPI projects.