# 🚀 Python Async Programming: Comprehensive Guide

## 📚 Table of Contents
- [What is Async Programming in Python?](#what-is-async-programming-in-python)
- [Async/Await Syntax Under the Hood](#asyncawait-syntax-under-the-hood)
- [Real-World Use Cases](#real-world-use-cases)
- [Implementing Async FastAPI Endpoints](#implementing-async-fastapi-endpoints)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Advanced Concepts](#advanced-concepts)
- [Performance Comparison](#performance-comparison)

## 🎯 What is Async Programming in Python?

**Asynchronous programming** in Python is a programming paradigm that allows your program to handle multiple tasks concurrently without blocking the execution of other tasks. It's particularly useful for I/O-bound operations like network requests, file operations, or database queries.

### 🔄 Key Concepts

#### Synchronous vs Asynchronous
- **Synchronous**: Tasks are executed one after another, blocking until each completes
- **Asynchronous**: Tasks can be paused and resumed, allowing other tasks to run in between

#### Core Components
1. **Event Loop**: The heart of async programming that manages and executes async tasks
2. **Coroutines**: Special functions defined with `async def` that can be paused and resumed
3. **Tasks**: Wrapped coroutines that can be scheduled and executed by the event loop
4. **Awaitables**: Objects that can be used with the `await` keyword

### 📊 How It Works

```python
import asyncio
import time

# Synchronous version
def sync_task(name, duration):
    print(f"Task {name} starting...")
    time.sleep(duration)  # Blocking operation
    print(f"Task {name} completed!")
    return f"Result from {name}"

# Asynchronous version
async def async_task(name, duration):
    print(f"Task {name} starting...")
    await asyncio.sleep(duration)  # Non-blocking operation
    print(f"Task {name} completed!")
    return f"Result from {name}"

# Running synchronously (takes 6 seconds total)
def run_sync():
    start = time.time()
    sync_task("A", 2)
    sync_task("B", 2)
    sync_task("C", 2)
    print(f"Total time: {time.time() - start:.2f} seconds")

# Running asynchronously (takes ~2 seconds total)
async def run_async():
    start = time.time()
    await asyncio.gather(
        async_task("A", 2),
        async_task("B", 2),
        async_task("C", 2)
    )
    print(f"Total time: {time.time() - start:.2f} seconds")

# Execute
if __name__ == "__main__":
    print("=== Synchronous Execution ===")
    run_sync()
    
    print("\n=== Asynchronous Execution ===")
    asyncio.run(run_async())
```

## ⚙️ Async/Await Syntax Under the Hood

### 🔍 What Happens When You Use async/await?

When you use `async/await`, Python transforms your code using several mechanisms:

#### 1. Coroutine Objects
```python
async def my_coroutine():
    await asyncio.sleep(1)
    return "Hello"

# This creates a coroutine object, not the result
coro = my_coroutine()
print(type(coro))  # <class 'coroutine'>

# To get the result, you need to await it or run it
result = asyncio.run(coro)
```

#### 2. State Machine Generation
Python converts async functions into state machines that can be paused and resumed:

```python
# This async function...
async def example():
    print("Step 1")
    await asyncio.sleep(1)
    print("Step 2")
    await asyncio.sleep(1)
    print("Step 3")
    return "Done"

# ...is conceptually transformed into a state machine like this:
class ExampleStateMachine:
    def __init__(self):
        self.state = 0
        
    def __await__(self):
        while True:
            if self.state == 0:
                print("Step 1")
                self.state = 1
                yield from asyncio.sleep(1).__await__()
            elif self.state == 1:
                print("Step 2")
                self.state = 2
                yield from asyncio.sleep(1).__await__()
            elif self.state == 2:
                print("Step 3")
                return "Done"
```

#### 3. Event Loop Integration
```python
import asyncio

async def demonstrate_event_loop():
    # Get the current event loop
    loop = asyncio.get_event_loop()
    print(f"Current loop: {loop}")
    
    # Schedule a callback
    loop.call_later(1, lambda: print("Callback executed!"))
    
    # Create and schedule a task
    task = loop.create_task(asyncio.sleep(0.5))
    await task
    
    # Wait for the callback
    await asyncio.sleep(1.1)

asyncio.run(demonstrate_event_loop())
```

#### 4. Generator-Based Coroutines (Legacy)
Before async/await, coroutines were created using generators:

```python
import asyncio

# Old way (Python 3.4-3.6)
@asyncio.coroutine
def old_style_coroutine():
    print("Starting...")
    yield from asyncio.sleep(1)
    print("Finished!")
    return "Result"

# New way (Python 3.7+)
async def new_style_coroutine():
    print("Starting...")
    await asyncio.sleep(1)
    print("Finished!")
    return "Result"
```

### 🔧 Behind the Scenes: await Keyword

When you use `await`, several things happen:

1. **Suspension Point**: The coroutine pauses execution
2. **Control Return**: Control returns to the event loop
3. **Task Scheduling**: The event loop can schedule other tasks
4. **Resumption**: When the awaited operation completes, execution resumes

```python
import asyncio
import inspect

async def detailed_await_example():
    print("Before await")
    
    # This is what happens under the hood when you await
    sleep_coro = asyncio.sleep(1)  # Creates a coroutine
    
    # The await essentially does this:
    # 1. Get the coroutine's __await__ method
    # 2. Iterate through it until completion
    # 3. Return the final value
    
    result = await sleep_coro
    print("After await")
    return result

# You can even see the coroutine structure
async def inspect_coroutine():
    coro = asyncio.sleep(1)
    print(f"Coroutine: {coro}")
    print(f"Is coroutine: {inspect.iscoroutine(coro)}")
    print(f"Coroutine state: {inspect.getcoroutinestate(coro)}")
    
    await coro

asyncio.run(inspect_coroutine())
```

## 🌍 Real-World Use Cases

### 1. 🌐 Web Scraping and API Calls

```python
import asyncio
import aiohttp
import time

async def fetch_url(session, url):
    """Fetch a single URL asynchronously"""
    try:
        async with session.get(url) as response:
            return await response.text()
    except Exception as e:
        return f"Error fetching {url}: {e}"

async def scrape_multiple_urls():
    """Scrape multiple URLs concurrently"""
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/3",
        "https://httpbin.org/delay/1"
    ]
    
    start_time = time.time()
    
    async with aiohttp.ClientSession() as session:
        # Fetch all URLs concurrently
        results = await asyncio.gather(
            *[fetch_url(session, url) for url in urls]
        )
    
    end_time = time.time()
    print(f"Fetched {len(urls)} URLs in {end_time - start_time:.2f} seconds")
    return results

# Compare with synchronous version
import requests

def sync_scrape_multiple_urls():
    """Scrape multiple URLs synchronously"""
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2", 
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/3",
        "https://httpbin.org/delay/1"
    ]
    
    start_time = time.time()
    results = []
    
    for url in urls:
        try:
            response = requests.get(url)
            results.append(response.text)
        except Exception as e:
            results.append(f"Error fetching {url}: {e}")
    
    end_time = time.time()
    print(f"Fetched {len(urls)} URLs in {end_time - start_time:.2f} seconds")
    return results

# Run comparison
if __name__ == "__main__":
    print("=== Async Version ===")
    asyncio.run(scrape_multiple_urls())
    
    print("\n=== Sync Version ===")
    sync_scrape_multiple_urls()
```

### 2. 🗄️ Database Operations

```python
import asyncio
import asyncpg
import aiosqlite

class AsyncDatabaseManager:
    def __init__(self):
        self.pg_pool = None
        self.sqlite_conn = None
    
    async def setup_postgres(self, connection_string):
        """Setup PostgreSQL connection pool"""
        self.pg_pool = await asyncpg.create_pool(connection_string)
    
    async def setup_sqlite(self, db_path):
        """Setup SQLite connection"""
        self.sqlite_conn = await aiosqlite.connect(db_path)
    
    async def batch_insert_postgres(self, data):
        """Batch insert data into PostgreSQL"""
        async with self.pg_pool.acquire() as conn:
            await conn.executemany(
                "INSERT INTO users (name, email) VALUES ($1, $2)",
                data
            )
    
    async def batch_query_postgres(self, user_ids):
        """Query multiple users concurrently"""
        async with self.pg_pool.acquire() as conn:
            tasks = [
                conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
                for user_id in user_ids
            ]
            return await asyncio.gather(*tasks)
    
    async def concurrent_operations(self):
        """Perform multiple database operations concurrently"""
        # These operations can run concurrently
        task1 = self.batch_insert_postgres([("Alice", "alice@example.com")])
        task2 = self.batch_query_postgres([1, 2, 3, 4, 5])
        task3 = self.update_user_stats()
        
        await asyncio.gather(task1, task2, task3)
    
    async def update_user_stats(self):
        """Update user statistics"""
        async with self.pg_pool.acquire() as conn:
            await conn.execute("UPDATE user_stats SET last_updated = NOW()")
    
    async def close(self):
        """Close database connections"""
        if self.pg_pool:
            await self.pg_pool.close()
        if self.sqlite_conn:
            await self.sqlite_conn.close()

# Usage example
async def database_example():
    db_manager = AsyncDatabaseManager()
    
    try:
        # Setup connections
        await db_manager.setup_postgres("postgresql://user:pass@localhost/db")
        
        # Perform concurrent operations
        await db_manager.concurrent_operations()
        
    finally:
        await db_manager.close()
```

### 3. 📁 File I/O Operations

```python
import asyncio
import aiofiles
import os

async def read_file_async(filepath):
    """Read a file asynchronously"""
    async with aiofiles.open(filepath, 'r') as file:
        content = await file.read()
        return content

async def write_file_async(filepath, content):
    """Write to a file asynchronously"""
    async with aiofiles.open(filepath, 'w') as file:
        await file.write(content)

async def process_multiple_files():
    """Process multiple files concurrently"""
    files_to_read = [
        "file1.txt", "file2.txt", "file3.txt", 
        "file4.txt", "file5.txt"
    ]
    
    # Read all files concurrently
    contents = await asyncio.gather(
        *[read_file_async(f) for f in files_to_read],
        return_exceptions=True
    )
    
    # Process contents and write results concurrently
    write_tasks = []
    for i, content in enumerate(contents):
        if isinstance(content, Exception):
            print(f"Error reading file {files_to_read[i]}: {content}")
            continue
            
        processed_content = content.upper()  # Simple processing
        output_file = f"processed_{files_to_read[i]}"
        write_tasks.append(write_file_async(output_file, processed_content))
    
    await asyncio.gather(*write_tasks)
    print(f"Processed {len(write_tasks)} files")

# File monitoring example
async def monitor_file_changes(filepath, check_interval=1):
    """Monitor a file for changes asynchronously"""
    last_modified = None
    
    while True:
        try:
            current_modified = os.path.getmtime(filepath)
            
            if last_modified is None:
                last_modified = current_modified
            elif current_modified != last_modified:
                print(f"File {filepath} was modified!")
                last_modified = current_modified
                
                # Process the file change
                content = await read_file_async(filepath)
                print(f"New content length: {len(content)} characters")
        
        except FileNotFoundError:
            print(f"File {filepath} not found")
        
        await asyncio.sleep(check_interval)

# Usage
async def file_operations_example():
    # Create some test files
    test_files = ["file1.txt", "file2.txt", "file3.txt"]
    
    # Write test data
    write_tasks = [
        write_file_async(f, f"Content of {f}")
        for f in test_files
    ]
    await asyncio.gather(*write_tasks)
    
    # Process files
    await process_multiple_files()
    
    # Monitor file changes (runs indefinitely)
    # await monitor_file_changes("file1.txt")
```

### 4. 🌐 Real-time Communication

```python
import asyncio
import websockets
import json

class AsyncChatServer:
    def __init__(self):
        self.clients = set()
        self.rooms = {}
    
    async def register_client(self, websocket, room_id):
        """Register a new client to a room"""
        self.clients.add(websocket)
        
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        
        print(f"Client joined room {room_id}. Total clients: {len(self.clients)}")
    
    async def unregister_client(self, websocket, room_id):
        """Unregister a client from a room"""
        self.clients.discard(websocket)
        
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        
        print(f"Client left room {room_id}. Total clients: {len(self.clients)}")
    
    async def broadcast_to_room(self, room_id, message, sender=None):
        """Broadcast a message to all clients in a room"""
        if room_id not in self.rooms:
            return
        
        # Create list of tasks to send message to all clients
        tasks = []
        for client in self.rooms[room_id].copy():
            if client != sender:  # Don't send to sender
                tasks.append(self.send_safe(client, message))
        
        # Send to all clients concurrently
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def send_safe(self, websocket, message):
        """Safely send a message to a client"""
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosed:
            # Client disconnected, remove from clients
            self.clients.discard(websocket)
    
    async def handle_client(self, websocket, path):
        """Handle a client connection"""
        room_id = path.strip('/')
        if not room_id:
            room_id = "general"
        
        await self.register_client(websocket, room_id)
        
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    msg_type = data.get('type', 'message')
                    
                    if msg_type == 'message':
                        # Broadcast message to room
                        await self.broadcast_to_room(
                            room_id, 
                            json.dumps({
                                'type': 'message',
                                'content': data.get('content', ''),
                                'sender': data.get('sender', 'Anonymous')
                            }),
                            sender=websocket
                        )
                    
                    elif msg_type == 'ping':
                        # Respond to ping
                        await websocket.send(json.dumps({'type': 'pong'}))
                
                except json.JSONDecodeError:
                    await websocket.send(json.dumps({
                        'type': 'error',
                        'message': 'Invalid JSON format'
                    }))
        
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister_client(websocket, room_id)

# WebSocket client example
async def chat_client_example():
    """Example WebSocket client"""
    uri = "ws://localhost:8765/room1"
    
    async with websockets.connect(uri) as websocket:
        # Send a message
        await websocket.send(json.dumps({
            'type': 'message',
            'content': 'Hello from async client!',
            'sender': 'AsyncBot'
        }))
        
        # Listen for messages
        try:
            async for message in websocket:
                data = json.loads(message)
                print(f"Received: {data}")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")

# Server startup
async def start_chat_server():
    chat_server = AsyncChatServer()
    
    # Start server
    server = await websockets.serve(
        chat_server.handle_client,
        "localhost",
        8765
    )
    
    print("Chat server started on ws://localhost:8765")
    await server.wait_closed()

# Usage
if __name__ == "__main__":
    # Start the server
    asyncio.run(start_chat_server())
```

## 🚀 Implementing Async FastAPI Endpoints

### 1. 📊 Handling Long-Running Tasks

```python
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
import asyncio
import uuid
from datetime import datetime
from typing import Dict, Optional
import time

app = FastAPI(title="Async FastAPI Example")

# In-memory task storage (use Redis in production)
task_storage: Dict[str, Dict] = {}

class TaskManager:
    """Manages long-running async tasks"""
    
    @staticmethod
    async def simulate_long_task(task_id: str, duration: int):
        """Simulate a long-running task"""
        start_time = time.time()
        
        # Update task status
        task_storage[task_id].update({
            "status": "running",
            "started_at": datetime.utcnow().isoformat(),
            "progress": 0
        })
        
        try:
            # Simulate work with progress updates
            for i in range(duration):
                await asyncio.sleep(1)  # Non-blocking sleep
                
                # Update progress
                progress = int((i + 1) / duration * 100)
                task_storage[task_id]["progress"] = progress
                
                # Simulate some work
                result = await TaskManager.do_some_work(i)
                
            # Task completed
            task_storage[task_id].update({
                "status": "completed",
                "completed_at": datetime.utcnow().isoformat(),
                "progress": 100,
                "result": f"Task completed in {time.time() - start_time:.2f} seconds",
                "execution_time": time.time() - start_time
            })
            
        except Exception as e:
            # Task failed
            task_storage[task_id].update({
                "status": "failed",
                "error": str(e),
                "failed_at": datetime.utcnow().isoformat()
            })
    
    @staticmethod
    async def do_some_work(iteration: int):
        """Simulate some actual work"""
        # Simulate API call or database operation
        await asyncio.sleep(0.1)
        return f"Work result for iteration {iteration}"
    
    @staticmethod
    async def process_data_batch(data_batch: list):
        """Process a batch of data asynchronously"""
        tasks = []
        for item in data_batch:
            # Create async task for each item
            task = asyncio.create_task(TaskManager.process_single_item(item))
            tasks.append(task)
        
        # Process all items concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results
    
    @staticmethod
    async def process_single_item(item):
        """Process a single data item"""
        # Simulate processing time
        await asyncio.sleep(0.5)
        return f"Processed: {item}"

@app.post("/tasks/start")
async def start_long_task(duration: int = 10):
    """Start a long-running task asynchronously"""
    task_id = str(uuid.uuid4())
    
    # Initialize task record
    task_storage[task_id] = {
        "id": task_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
        "duration": duration
    }
    
    # Start the task in the background
    asyncio.create_task(TaskManager.simulate_long_task(task_id, duration))
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": f"Task started with duration {duration} seconds"
    }

@app.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get the status of a running task"""
    if task_id not in task_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task_storage[task_id]

@app.get("/tasks")
async def list_all_tasks():
    """List all tasks"""
    return {
        "tasks": list(task_storage.values()),
        "total": len(task_storage)
    }

@app.delete("/tasks/{task_id}")
async def cancel_task(task_id: str):
    """Cancel a running task"""
    if task_id not in task_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = task_storage[task_id]
    if task["status"] == "running":
        task["status"] = "cancelled"
        task["cancelled_at"] = datetime.utcnow().isoformat()
    
    return {"message": f"Task {task_id} cancelled"}
```

### 2. 🔄 Concurrent Request Processing

```python
@app.post("/process/batch")
async def process_batch(items: list[str]):
    """Process multiple items concurrently"""
    start_time = time.time()
    
    # Process items concurrently
    results = await TaskManager.process_data_batch(items)
    
    processing_time = time.time() - start_time
    
    return {
        "results": results,
        "total_items": len(items),
        "processing_time": processing_time,
        "items_per_second": len(items) / processing_time if processing_time > 0 else 0
    }

@app.get("/api/multiple-sources")
async def fetch_from_multiple_sources():
    """Fetch data from multiple sources concurrently"""
    import aiohttp
    
    urls = [
        "https://jsonplaceholder.typicode.com/posts/1",
        "https://jsonplaceholder.typicode.com/posts/2",
        "https://jsonplaceholder.typicode.com/posts/3",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2"
    ]
    
    async def fetch_url(session, url):
        try:
            async with session.get(url, timeout=5) as response:
                if url.startswith("https://jsonplaceholder"):
                    return await response.json()
                else:
                    return {"url": url, "status": response.status}
        except Exception as e:
            return {"url": url, "error": str(e)}
    
    start_time = time.time()
    
    async with aiohttp.ClientSession() as session:
        # Fetch all URLs concurrently
        results = await asyncio.gather(
            *[fetch_url(session, url) for url in urls],
            return_exceptions=True
        )
    
    return {
        "results": results,
        "total_requests": len(urls),
        "total_time": time.time() - start_time
    }
```

### 3. 🔄 WebSocket Support

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import List

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        # Send message to all connected clients concurrently
        tasks = [
            connection.send_text(message) 
            for connection in self.active_connections
        ]
        await asyncio.gather(*tasks, return_exceptions=True)

manager = WebSocketManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            # Echo back to sender
            await manager.send_personal_message(
                f"You wrote: {data}", websocket
            )
            
            # Broadcast to all other clients
            await manager.broadcast(f"Client {client_id} says: {data}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client {client_id} left the chat")

@app.post("/broadcast")
async def broadcast_message(message: str):
    """Broadcast a message to all WebSocket connections"""
    await manager.broadcast(f"Server announcement: {message}")
    return {"message": "Broadcasted successfully"}
```

### 4. 🔧 Background Tasks and Scheduled Jobs

```python
from fastapi import BackgroundTasks
import asyncio
from datetime import datetime, timedelta

# Background job scheduler
scheduled_jobs = {}

async def cleanup_old_tasks():
    """Background job to cleanup old completed tasks"""
    while True:
        current_time = datetime.utcnow()
        cutoff_time = current_time - timedelta(hours=1)  # Keep for 1 hour
        
        # Remove old completed tasks
        tasks_to_remove = []
        for task_id, task_data in task_storage.items():
            if task_data.get("status") in ["completed", "failed", "cancelled"]:
                completed_at = task_data.get("completed_at") or task_data.get("failed_at")
                if completed_at:
                    task_time = datetime.fromisoformat(completed_at)
                    if task_time < cutoff_time:
                        tasks_to_remove.append(task_id)
        
        for task_id in tasks_to_remove:
            del task_storage[task_id]
        
        if tasks_to_remove:
            print(f"Cleaned up {len(tasks_to_remove)} old tasks")
        
        # Wait for 10 minutes before next cleanup
        await asyncio.sleep(600)

@app.on_event("startup")
async def startup_event():
    """Start background tasks when the app starts"""
    # Start cleanup job
    asyncio.create_task(cleanup_old_tasks())

@app.post("/send-email")
async def send_email_endpoint(
    email: str, 
    subject: str, 
    body: str, 
    background_tasks: BackgroundTasks
):
    """Send email in the background"""
    
    async def send_email_task(email: str, subject: str, body: str):
        # Simulate email sending
        print(f"Sending email to {email}...")
        await asyncio.sleep(2)  # Simulate email provider delay
        print(f"Email sent to {email} with subject: {subject}")
    
    # Add task to background
    background_tasks.add_task(send_email_task, email, subject, body)
    
    return {"message": "Email queued for sending"}

@app.post("/process-file")
async def process_file_endpoint(
    filename: str,
    background_tasks: BackgroundTasks
):
    """Process a file in the background"""
    
    async def process_file_task(filename: str):
        print(f"Starting to process file: {filename}")
        
        # Simulate file processing
        for i in range(10):
            await asyncio.sleep(1)
            print(f"Processing {filename}: {(i+1)*10}% complete")
        
        print(f"File {filename} processed successfully")
    
    background_tasks.add_task(process_file_task, filename)
    
    return {"message": f"File {filename} queued for processing"}

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🎯 Best Practices

### 1. ✅ Do's

- **Use async for I/O-bound operations**: Database queries, API calls, file operations
- **Avoid blocking operations**: Use `asyncio.sleep()` instead of `time.sleep()`
- **Handle exceptions properly**: Use try-except blocks in async functions
- **Use connection pooling**: For database and HTTP connections
- **Limit concurrency**: Use `asyncio.Semaphore` to prevent overwhelming resources

```python
import asyncio
from asyncio import Semaphore

class BestPracticesExample:
    def __init__(self, max_concurrent=10):
        self.semaphore = Semaphore(max_concurrent)
    
    async def rate_limited_operation(self, item):
        """Rate-limited async operation"""
        async with self.semaphore:
            # Only max_concurrent operations will run simultaneously
            await self.process_item(item)
    
    async def process_item(self, item):
        """Process a single item"""
        await asyncio.sleep(1)  # Simulate work
        return f"Processed {item}"
    
    async def process_batch_with_limit(self, items):
        """Process items with concurrency limit"""
        tasks = [
            self.rate_limited_operation(item) 
            for item in items
        ]
        return await asyncio.gather(*tasks)

# Exception handling
async def safe_async_operation():
    """Proper exception handling in async functions"""
    try:
        result = await risky_async_operation()
        return result
    except SpecificException as e:
        logger.error(f"Specific error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return None

async def risky_async_operation():
    """Simulated risky operation"""
    await asyncio.sleep(1)
    if random.random() < 0.3:  # 30% chance of failure
        raise ValueError("Random failure")
    return "Success"
```

### 2. ❌ Don'ts

```python
# DON'T: Use blocking operations in async functions
async def bad_example():
    time.sleep(1)  # ❌ Blocks the entire event loop
    requests.get("http://example.com")  # ❌ Blocking HTTP request

# DO: Use async alternatives
async def good_example():
    await asyncio.sleep(1)  # ✅ Non-blocking
    async with aiohttp.ClientSession() as session:
        async with session.get("http://example.com") as response:
            return await response.text()  # ✅ Non-blocking HTTP request

# DON'T: Forget to await async functions
async def another_bad_example():
    result = async_function()  # ❌ Creates coroutine object, doesn't execute
    return result

# DO: Always await async functions
async def another_good_example():
    result = await async_function()  # ✅ Actually executes the function
    return result
```

## ⚠️ Common Pitfalls

### 1. 🔄 Blocking the Event Loop

```python
import asyncio
import time
import requests

# ❌ Bad: Blocking operations
async def blocking_example():
    time.sleep(2)  # Blocks entire event loop
    response = requests.get("https://httpbin.org/delay/1")  # Blocking HTTP call
    with open("large_file.txt", "r") as f:  # Blocking file I/O
        content = f.read()
    return content

# ✅ Good: Non-blocking operations
async def non_blocking_example():
    await asyncio.sleep(2)  # Non-blocking sleep
    
    async with aiohttp.ClientSession() as session:
        async with session.get("https://httpbin.org/delay/1") as response:
            data = await response.text()  # Non-blocking HTTP call
    
    async with aiofiles.open("large_file.txt", "r") as f:
        content = await f.read()  # Non-blocking file I/O
    
    return content
```

### 2. 🔧 Not Handling Exceptions

```python
# ❌ Bad: Unhandled exceptions can crash the event loop
async def risky_operations():
    tasks = [
        risky_async_function(i) 
        for i in range(10)
    ]
    results = await asyncio.gather(*tasks)  # If one fails, all fail
    return results

# ✅ Good: Handle exceptions properly
async def safe_operations():
    tasks = [
        risky_async_function(i) 
        for i in range(10)
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Process results and exceptions separately
    successful_results = []
    errors = []
    
    for result in results:
        if isinstance(result, Exception):
            errors.append(result)
        else:
            successful_results.append(result)
    
    return successful_results, errors
```

### 3. 🔄 Creating Too Many Tasks

```python
# ❌ Bad: Creating thousands of concurrent tasks
async def too_many_tasks():
    urls = [f"https://httpbin.org/delay/1" for _ in range(1000)]
    tasks = [fetch_url(url) for url in urls]
    return await asyncio.gather(*tasks)  # May overwhelm the server

# ✅ Good: Limit concurrency
async def controlled_concurrency():
    urls = [f"https://httpbin.org/delay/1" for _ in range(1000)]
    semaphore = asyncio.Semaphore(50)  # Limit to 50 concurrent requests
    
    async def fetch_with_limit(url):
        async with semaphore:
            return await fetch_url(url)
    
    tasks = [fetch_with_limit(url) for url in urls]
    return await asyncio.gather(*tasks)
```

## 🔬 Advanced Concepts

### 1. 🏗️ Custom Async Context Managers

```python
import asyncio
import aiofiles

class AsyncDatabaseConnection:
    """Custom async context manager for database connections"""
    
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connection = None
    
    async def __aenter__(self):
        """Async enter method"""
        print("Connecting to database...")
        await asyncio.sleep(0.1)  # Simulate connection time
        self.connection = f"Connected to {self.connection_string}"
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async exit method"""
        print("Closing database connection...")
        await asyncio.sleep(0.1)  # Simulate cleanup time
        self.connection = None
        
        # Handle exceptions if needed
        if exc_type:
            print(f"Exception occurred: {exc_val}")
        
        return False  # Don't suppress exceptions
    
    async def query(self, sql):
        """Execute a query"""
        if not self.connection:
            raise RuntimeError("Not connected to database")
        
        await asyncio.sleep(0.1)  # Simulate query time
        return f"Result for: {sql}"

# Usage
async def use_custom_context_manager():
    async with AsyncDatabaseConnection("postgresql://localhost/mydb") as db:
        result = await db.query("SELECT * FROM users")
        print(result)
```

### 2. 🎭 Async Generators

```python
import asyncio
import aiohttp

async def async_number_generator(start, end, delay=1):
    """Generate numbers asynchronously"""
    for i in range(start, end):
        await asyncio.sleep(delay)
        yield i

async def fetch_pages_generator(base_url, pages):
    """Generator that fetches pages asynchronously"""
    async with aiohttp.ClientSession() as session:
        for page in range(1, pages + 1):
            url = f"{base_url}?page={page}"
            try:
                async with session.get(url) as response:
                    content = await response.text()
                    yield {
                        "page": page,
                        "content_length": len(content),
                        "status": response.status
                    }
            except Exception as e:
                yield {
                    "page": page,
                    "error": str(e)
                }

# Usage
async def use_async_generators():
    # Async number generator
    async for number in async_number_generator(1, 5, 0.5):
        print(f"Generated: {number}")
    
    # Async page fetcher
    async for page_data in fetch_pages_generator("https://httpbin.org/get", 3):
        print(f"Page data: {page_data}")
```

### 3. 🔧 Async Iterators

```python
class AsyncFileLineReader:
    """Async iterator for reading file lines"""
    
    def __init__(self, filepath):
        self.filepath = filepath
        self.file = None
    
    def __aiter__(self):
        return self
    
    async def __anext__(self):
        if self.file is None:
            self.file = await aiofiles.open(self.filepath, 'r')
        
        line = await self.file.readline()
        if line:
            return line.strip()
        else:
            await self.file.close()
            raise StopAsyncIteration

# Usage
async def read_file_lines():
    async for line in AsyncFileLineReader("large_file.txt"):
        print(f"Line: {line}")
        # Process line asynchronously
        await process_line(line)

async def process_line(line):
    """Process a single line"""
    await asyncio.sleep(0.1)  # Simulate processing
    return line.upper()
```

## 📊 Performance Comparison

### Benchmark: Sync vs Async

```python
import asyncio
import aiohttp
import requests
import time
from concurrent.futures import ThreadPoolExecutor

async def benchmark_async_requests(urls, num_iterations=5):
    """Benchmark async HTTP requests"""
    times = []
    
    for _ in range(num_iterations):
        start_time = time.time()
        
        async with aiohttp.ClientSession() as session:
            tasks = [
                session.get(url) 
                for url in urls
            ]
            responses = await asyncio.gather(*tasks)
            
            # Close responses
            for response in responses:
                response.close()
        
        end_time = time.time()
        times.append(end_time - start_time)
    
    return {
        "method": "async",
        "avg_time": sum(times) / len(times),
        "min_time": min(times),
        "max_time": max(times),
        "num_requests": len(urls),
        "iterations": num_iterations
    }

def benchmark_sync_requests(urls, num_iterations=5):
    """Benchmark synchronous HTTP requests"""
    times = []
    
    for _ in range(num_iterations):
        start_time = time.time()
        
        for url in urls:
            response = requests.get(url)
            response.close()
        
        end_time = time.time()
        times.append(end_time - start_time)
    
    return {
        "method": "sync",
        "avg_time": sum(times) / len(times),
        "min_time": min(times),
        "max_time": max(times),
        "num_requests": len(urls),
        "iterations": num_iterations
    }

def benchmark_threaded_requests(urls, num_iterations=5, max_workers=10):
    """Benchmark threaded HTTP requests"""
    times = []
    
    def fetch_url(url):
        response = requests.get(url)
        response.close()
        return response.status_code
    
    for _ in range(num_iterations):
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(fetch_url, url) for url in urls]
            results = [future.result() for future in futures]
        
        end_time = time.time()
        times.append(end_time - start_time)
    
    return {
        "method": "threaded",
        "avg_time": sum(times) / len(times),
        "min_time": min(times),
        "max_time": max(times),
        "num_requests": len(urls),
        "iterations": num_iterations,
        "max_workers": max_workers
    }

# Run benchmarks
async def run_benchmarks():
    test_urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1", 
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/1"
    ]
    
    print("Running performance benchmarks...\n")
    
    # Async benchmark
    async_results = await benchmark_async_requests(test_urls)
    print(f"Async Results: {async_results}")
    
    # Sync benchmark
    sync_results = benchmark_sync_requests(test_urls)
    print(f"Sync Results: {sync_results}")
    
    # Threaded benchmark
    threaded_results = benchmark_threaded_requests(test_urls)
    print(f"Threaded Results: {threaded_results}")
    
    # Performance comparison
    print(f"\nPerformance Comparison:")
    print(f"Async was {sync_results['avg_time'] / async_results['avg_time']:.2f}x faster than sync")
    print(f"Async was {threaded_results['avg_time'] / async_results['avg_time']:.2f}x faster than threaded")

if __name__ == "__main__":
    asyncio.run(run_benchmarks())
```

## 🚀 Getting Started

### Installation

```bash
# Basic async programming
pip install asyncio

# For HTTP requests
pip install aiohttp aiofiles

# For FastAPI
pip install fastapi uvicorn

# For database operations
pip install asyncpg aiosqlite  # PostgreSQL and SQLite

# For WebSocket support
pip install websockets
```

### Running Examples

```python
# Basic async example
import asyncio

async def main():
    print("Starting async program...")
    await asyncio.sleep(1)
    print("Async program completed!")

# Run the async function
asyncio.run(main())
```

This comprehensive guide covers the essential aspects of Python async programming, from basic concepts to advanced implementations. The key is to understand when to use async programming (I/O-bound operations) and how to properly implement it without blocking the event loop.