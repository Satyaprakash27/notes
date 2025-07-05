# Testing & Debugging in Python

## Table of Contents
1. [Introduction](#introduction)
2. [Testing Fundamentals](#testing-fundamentals)
3. [Testing Frameworks](#testing-frameworks)
4. [Debugging Techniques](#debugging-techniques)
5. [Code Quality & Best Practices](#code-quality--best-practices)
6. [Performance Testing](#performance-testing)
7. [Advanced Testing Concepts](#advanced-testing-concepts)
8. [Real-world Examples](#real-world-examples)
9. [Interview Questions](#interview-questions)
10. [Common Pitfalls](#common-pitfalls)
11. [Resources](#resources)

## Introduction

Testing and debugging are crucial skills for any Python developer. This guide covers comprehensive strategies for writing reliable, maintainable code through effective testing practices and debugging techniques.

### Why Testing and Debugging Matter
- **Reliability**: Ensure code works as expected
- **Maintainability**: Catch regressions when making changes
- **Documentation**: Tests serve as living documentation
- **Confidence**: Deploy with assurance
- **Debugging**: Systematic approach to finding and fixing issues

## Testing Fundamentals

### Types of Testing

#### 1. Unit Testing
Testing individual components in isolation.

```python
import unittest

class Calculator:
    def add(self, a, b):
        return a + b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()
    
    def test_add(self):
        self.assertEqual(self.calc.add(2, 3), 5)
        self.assertEqual(self.calc.add(-1, 1), 0)
    
    def test_divide(self):
        self.assertEqual(self.calc.divide(6, 2), 3)
        with self.assertRaises(ValueError):
            self.calc.divide(5, 0)

if __name__ == '__main__':
    unittest.main()
```

#### 2. Integration Testing
Testing component interactions.

```python
import unittest
from unittest.mock import patch, MagicMock

class DatabaseService:
    def get_user(self, user_id):
        # Simulate database call
        pass

class UserService:
    def __init__(self, db_service):
        self.db = db_service
    
    def get_user_profile(self, user_id):
        user = self.db.get_user(user_id)
        if user:
            return f"Profile for {user['name']}"
        return "User not found"

class TestUserService(unittest.TestCase):
    @patch('__main__.DatabaseService')
    def test_get_user_profile_success(self, mock_db):
        # Setup mock
        mock_db.get_user.return_value = {'name': 'John Doe'}
        
        service = UserService(mock_db)
        result = service.get_user_profile(1)
        
        self.assertEqual(result, "Profile for John Doe")
        mock_db.get_user.assert_called_once_with(1)
```

#### 3. Functional Testing
Testing complete workflows.

```python
import requests
import unittest

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = "http://localhost:8000"
    
    def test_user_registration_flow(self):
        # Test complete user registration
        user_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        # Register user
        response = requests.post(f"{self.base_url}/register", json=user_data)
        self.assertEqual(response.status_code, 201)
        
        # Login user
        response = requests.post(f"{self.base_url}/login", json=user_data)
        self.assertEqual(response.status_code, 200)
        token = response.json()['token']
        
        # Access protected resource
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{self.base_url}/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
```

## Testing Frameworks

### unittest (Built-in)

```python
import unittest
from unittest.mock import Mock, patch

class TestExample(unittest.TestCase):
    def setUp(self):
        """Run before each test method"""
        self.data = [1, 2, 3, 4, 5]
    
    def tearDown(self):
        """Run after each test method"""
        self.data = None
    
    def test_list_length(self):
        self.assertEqual(len(self.data), 5)
    
    def test_list_contains(self):
        self.assertIn(3, self.data)
        self.assertNotIn(6, self.data)
    
    def test_exception_handling(self):
        with self.assertRaises(ZeroDivisionError):
            1 / 0
    
    @patch('random.randint')
    def test_with_mock(self, mock_randint):
        mock_randint.return_value = 42
        import random
        self.assertEqual(random.randint(1, 100), 42)
```

### pytest (Popular Third-party)

```python
import pytest
from unittest.mock import Mock

# Simple test
def test_addition():
    assert 1 + 1 == 2

# Parametrized test
@pytest.mark.parametrize("input,expected", [
    (2, 4),
    (3, 9),
    (4, 16),
    (5, 25)
])
def test_square(input, expected):
    assert input ** 2 == expected

# Fixture usage
@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_with_fixture(sample_data):
    assert len(sample_data) == 5
    assert sum(sample_data) == 15

# Exception testing
def test_division_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

# Mocking
def test_external_api_call(mocker):
    mock_response = Mock()
    mock_response.json.return_value = {"status": "success"}
    mocker.patch('requests.get', return_value=mock_response)
    
    import requests
    response = requests.get("http://example.com")
    assert response.json()["status"] == "success"
```

### doctest (Documentation Testing)

```python
def factorial(n):
    """
    Calculate factorial of n.
    
    >>> factorial(5)
    120
    >>> factorial(0)
    1
    >>> factorial(1)
    1
    >>> factorial(-1)
    Traceback (most recent call last):
        ...
    ValueError: Factorial not defined for negative numbers
    """
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n <= 1:
        return 1
    return n * factorial(n - 1)

if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

## Debugging Techniques

### Python Debugger (pdb)

```python
import pdb

def complex_function(data):
    result = []
    for item in data:
        # Set breakpoint
        pdb.set_trace()
        
        processed = item * 2
        if processed > 10:
            result.append(processed)
    
    return result

# Usage
data = [1, 2, 3, 4, 5, 6, 7, 8]
result = complex_function(data)
```

### Advanced Debugging with pdb

```python
import pdb

class DebugExample:
    def __init__(self):
        self.data = []
    
    def process_data(self, items):
        for i, item in enumerate(items):
            try:
                # Conditional breakpoint
                if i == 3:
                    pdb.set_trace()
                
                result = self.calculate(item)
                self.data.append(result)
            except Exception as e:
                # Debug on exception
                pdb.post_mortem()
                raise
    
    def calculate(self, value):
        return value ** 2 + 2 * value + 1

# pdb commands:
# n (next line)
# s (step into)
# c (continue)
# l (list code)
# p <variable> (print variable)
# pp <variable> (pretty print)
# w (where - stack trace)
# u (up stack frame)
# d (down stack frame)
```

### Logging for Debugging

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('debug.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def process_user_data(users):
    logger.info(f"Processing {len(users)} users")
    
    for i, user in enumerate(users):
        logger.debug(f"Processing user {i}: {user['name']}")
        
        try:
            result = validate_user(user)
            logger.info(f"User {user['name']} validated successfully")
        except ValueError as e:
            logger.error(f"Validation failed for {user['name']}: {e}")
            continue
        except Exception as e:
            logger.critical(f"Unexpected error processing {user['name']}: {e}")
            raise
    
    logger.info("User processing completed")

def validate_user(user):
    required_fields = ['name', 'email', 'age']
    for field in required_fields:
        if field not in user:
            raise ValueError(f"Missing required field: {field}")
    
    if user['age'] < 0:
        raise ValueError("Age cannot be negative")
    
    return True
```

### Debugging with IDE Tools

```python
# Visual Studio Code debugging configuration
# .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Python: Debug Tests",
            "type": "python",
            "request": "launch",
            "module": "pytest",
            "args": ["-v"],
            "console": "integratedTerminal",
            "justMyCode": false
        }
    ]
}
```

## Code Quality & Best Practices

### Test-Driven Development (TDD)

```python
# 1. Write failing test
import unittest

class TestStringProcessor(unittest.TestCase):
    def test_reverse_string(self):
        processor = StringProcessor()
        result = processor.reverse("hello")
        self.assertEqual(result, "olleh")

# 2. Write minimal code to pass
class StringProcessor:
    def reverse(self, s):
        return s[::-1]

# 3. Refactor and improve
class StringProcessor:
    def reverse(self, s):
        if not isinstance(s, str):
            raise TypeError("Input must be a string")
        return s[::-1]
    
    def is_palindrome(self, s):
        cleaned = s.lower().replace(' ', '')
        return cleaned == cleaned[::-1]
```

### Code Coverage

```python
# Install coverage: pip install coverage
# Run tests with coverage: coverage run -m pytest
# Generate report: coverage report
# Generate HTML report: coverage html

# .coveragerc configuration
[run]
source = .
omit = 
    */tests/*
    */venv/*
    */migrations/*
    setup.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
```

### Assertion Techniques

```python
import unittest

class TestAssertions(unittest.TestCase):
    def test_basic_assertions(self):
        # Equality
        self.assertEqual(2 + 2, 4)
        self.assertNotEqual(2 + 2, 5)
        
        # Truth values
        self.assertTrue(True)
        self.assertFalse(False)
        
        # None checks
        self.assertIsNone(None)
        self.assertIsNotNone("hello")
        
        # Container checks
        self.assertIn(1, [1, 2, 3])
        self.assertNotIn(4, [1, 2, 3])
        
        # Type checks
        self.assertIsInstance(42, int)
        self.assertNotIsInstance("hello", int)
        
        # Numeric comparisons
        self.assertGreater(5, 3)
        self.assertLess(3, 5)
        self.assertGreaterEqual(5, 5)
        self.assertLessEqual(3, 5)
        
        # Float comparisons
        self.assertAlmostEqual(0.1 + 0.2, 0.3, places=7)
        
        # Regex matching
        self.assertRegex("hello world", r"hello.*world")
        
        # Exception testing
        with self.assertRaises(ValueError):
            int("not a number")
            
        with self.assertRaisesRegex(ValueError, "invalid literal"):
            int("not a number")
```

## Performance Testing

### Timing and Profiling

```python
import time
import cProfile
import timeit
from functools import wraps

# Timing decorator
def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "done"

# Using timeit
def test_list_creation():
    # Test different approaches
    time1 = timeit.timeit("list(range(100))", number=10000)
    time2 = timeit.timeit("[i for i in range(100)]", number=10000)
    
    print(f"list(range(100)): {time1:.6f}")
    print(f"[i for i in range(100)]: {time2:.6f}")

# Profiling
def profile_function():
    cProfile.run('slow_function()', 'profile_stats')
    
    # Analyze results
    import pstats
    stats = pstats.Stats('profile_stats')
    stats.sort_stats('cumulative')
    stats.print_stats(10)  # Top 10 functions
```

### Memory Profiling

```python
import tracemalloc
import psutil
import os

# Memory usage tracking
def memory_usage():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # MB

# Memory profiling with tracemalloc
def profile_memory():
    tracemalloc.start()
    
    # Code to profile
    data = [i for i in range(1000000)]
    
    current, peak = tracemalloc.get_traced_memory()
    print(f"Current memory usage: {current / 1024 / 1024:.2f} MB")
    print(f"Peak memory usage: {peak / 1024 / 1024:.2f} MB")
    
    tracemalloc.stop()

# Memory-efficient testing
class MemoryEfficientTest(unittest.TestCase):
    def setUp(self):
        self.initial_memory = memory_usage()
    
    def tearDown(self):
        final_memory = memory_usage()
        memory_diff = final_memory - self.initial_memory
        if memory_diff > 10:  # Alert if memory increase > 10MB
            print(f"Warning: Memory increased by {memory_diff:.2f} MB")
```

## Advanced Testing Concepts

### Property-Based Testing

```python
from hypothesis import given, strategies as st

class TestStringOperations:
    @given(st.text())
    def test_reverse_twice_is_identity(self, s):
        # Property: reversing twice should give original string
        assert s == s[::-1][::-1]
    
    @given(st.lists(st.integers()))
    def test_sort_is_idempotent(self, lst):
        # Property: sorting twice should be same as sorting once
        sorted_once = sorted(lst)
        sorted_twice = sorted(sorted_once)
        assert sorted_once == sorted_twice
    
    @given(st.integers(min_value=0))
    def test_factorial_properties(self, n):
        def factorial(x):
            return 1 if x <= 1 else x * factorial(x - 1)
        
        # Property: factorial is always positive
        assert factorial(n) > 0
        
        # Property: factorial is monotonic for positive integers
        if n > 0:
            assert factorial(n) >= factorial(n - 1)
```

### Mocking and Patching

```python
from unittest.mock import Mock, patch, MagicMock, PropertyMock
import unittest

class ExternalService:
    def get_data(self):
        # Simulate external API call
        import requests
        response = requests.get("https://api.example.com/data")
        return response.json()

class DataProcessor:
    def __init__(self, service):
        self.service = service
    
    def process(self):
        data = self.service.get_data()
        return [item['value'] * 2 for item in data]

class TestDataProcessor(unittest.TestCase):
    def test_process_with_mock(self):
        # Create mock service
        mock_service = Mock()
        mock_service.get_data.return_value = [
            {'value': 1},
            {'value': 2},
            {'value': 3}
        ]
        
        processor = DataProcessor(mock_service)
        result = processor.process()
        
        self.assertEqual(result, [2, 4, 6])
        mock_service.get_data.assert_called_once()
    
    @patch('requests.get')
    def test_external_service(self, mock_get):
        # Mock external API call
        mock_response = Mock()
        mock_response.json.return_value = [{'value': 5}]
        mock_get.return_value = mock_response
        
        service = ExternalService()
        result = service.get_data()
        
        self.assertEqual(result, [{'value': 5}])
        mock_get.assert_called_once_with("https://api.example.com/data")
```

### Testing Async Code

```python
import asyncio
import unittest
from unittest.mock import AsyncMock, patch

class AsyncService:
    async def fetch_data(self, url):
        # Simulate async HTTP request
        await asyncio.sleep(0.1)
        return {"data": "test"}
    
    async def process_urls(self, urls):
        tasks = [self.fetch_data(url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

class TestAsyncService(unittest.IsolatedAsyncioTestCase):
    async def test_fetch_data(self):
        service = AsyncService()
        result = await service.fetch_data("http://example.com")
        self.assertEqual(result, {"data": "test"})
    
    @patch.object(AsyncService, 'fetch_data')
    async def test_process_urls_with_mock(self, mock_fetch):
        mock_fetch.return_value = {"data": "mocked"}
        
        service = AsyncService()
        urls = ["http://example.com", "http://test.com"]
        results = await service.process_urls(urls)
        
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0], {"data": "mocked"})
        self.assertEqual(mock_fetch.call_count, 2)
```

## Real-world Examples

### Testing a Web Application

```python
import unittest
from unittest.mock import patch, Mock
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/users/<int:user_id>')
def get_user(user_id):
    # Simulate database lookup
    user = db.get_user(user_id)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    user = db.create_user(data)
    return jsonify(user), 201

class TestWebApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    @patch('__main__.db')
    def test_get_user_success(self, mock_db):
        mock_db.get_user.return_value = {"id": 1, "name": "John"}
        
        response = self.app.get('/users/1')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"id": 1, "name": "John"})
        mock_db.get_user.assert_called_once_with(1)
    
    @patch('__main__.db')
    def test_get_user_not_found(self, mock_db):
        mock_db.get_user.return_value = None
        
        response = self.app.get('/users/999')
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "User not found"})
    
    @patch('__main__.db')
    def test_create_user_success(self, mock_db):
        mock_db.create_user.return_value = {"id": 1, "name": "Jane"}
        
        response = self.app.post('/users', 
                                json={"name": "Jane"})
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {"id": 1, "name": "Jane"})
    
    def test_create_user_invalid_data(self):
        response = self.app.post('/users', json={})
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Name is required"})
```

### Testing File Operations

```python
import tempfile
import os
import unittest
from unittest.mock import patch, mock_open

class FileProcessor:
    def read_config(self, filepath):
        with open(filepath, 'r') as f:
            return f.read()
    
    def write_report(self, data, filepath):
        with open(filepath, 'w') as f:
            f.write(f"Report: {data}")
    
    def process_file(self, input_path, output_path):
        content = self.read_config(input_path)
        processed = content.upper()
        self.write_report(processed, output_path)

class TestFileProcessor(unittest.TestCase):
    def test_with_temporary_files(self):
        processor = FileProcessor()
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as input_file:
            input_file.write("hello world")
            input_path = input_file.name
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as output_file:
            output_path = output_file.name
        
        try:
            processor.process_file(input_path, output_path)
            
            with open(output_path, 'r') as f:
                result = f.read()
            
            self.assertEqual(result, "Report: HELLO WORLD")
        finally:
            os.unlink(input_path)
            os.unlink(output_path)
    
    @patch('builtins.open', new_callable=mock_open, read_data="test data")
    def test_read_config_with_mock(self, mock_file):
        processor = FileProcessor()
        result = processor.read_config("config.txt")
        
        self.assertEqual(result, "test data")
        mock_file.assert_called_once_with("config.txt", 'r')
    
    @patch('builtins.open', new_callable=mock_open)
    def test_write_report_with_mock(self, mock_file):
        processor = FileProcessor()
        processor.write_report("test", "report.txt")
        
        mock_file.assert_called_once_with("report.txt", 'w')
        mock_file().write.assert_called_once_with("Report: test")
```

## Interview Questions

### Basic Testing Questions

1. **What is the difference between unit testing and integration testing?**
   - Unit testing: Tests individual components in isolation
   - Integration testing: Tests interaction between components

2. **Explain the testing pyramid.**
   - Unit tests (base): Fast, isolated, many
   - Integration tests (middle): Test component interaction
   - End-to-end tests (top): Test complete user workflows, fewer

3. **What is mocking and when would you use it?**
   - Mocking replaces dependencies with fake objects
   - Used to isolate code under test, control external dependencies

### Advanced Testing Questions

4. **How would you test a function that depends on the current time?**
   ```python
   from unittest.mock import patch
   from datetime import datetime
   
   @patch('datetime.datetime')
   def test_time_dependent_function(self, mock_datetime):
       mock_datetime.now.return_value = datetime(2023, 1, 1, 12, 0, 0)
       # Test function that uses datetime.now()
   ```

5. **What is test-driven development (TDD)?**
   - Red: Write failing test
   - Green: Write minimal code to pass
   - Refactor: Improve code while keeping tests passing

6. **How would you test exception handling?**
   ```python
   def test_exception_handling(self):
       with self.assertRaises(ValueError):
           function_that_raises_error()
   ```

### Debugging Questions

7. **What debugging tools are available in Python?**
   - pdb (Python debugger)
   - IDE debuggers
   - Logging
   - Print statements (basic)
   - Profilers (cProfile, line_profiler)

8. **How would you debug a performance issue?**
   - Use profilers to identify bottlenecks
   - Check algorithm complexity
   - Monitor memory usage
   - Analyze database queries
   - Use timing decorators

9. **What's the difference between logging and print statements for debugging?**
   - Logging: Configurable levels, persistent, production-ready
   - Print: Simple, temporary, not suitable for production

### Code Quality Questions

10. **What is code coverage and what's a good coverage target?**
    - Measures percentage of code executed by tests
    - 80-90% is generally good, 100% not always necessary
    - Focus on critical paths and edge cases

11. **How would you handle flaky tests?**
    - Identify root cause (timing, external dependencies)
    - Add retries for acceptable flakiness
    - Use mocking to control external factors
    - Improve test isolation

12. **What makes a good test?**
    - Fast execution
    - Independent and isolated
    - Repeatable results
    - Clear and readable
    - Tests one thing at a time

## Common Pitfalls

### Testing Pitfalls

1. **Testing Implementation Instead of Behavior**
   ```python
   # Bad: Testing internal implementation
   def test_bad_example(self):
       obj = MyClass()
       obj.method()
       self.assertEqual(obj._internal_counter, 1)
   
   # Good: Testing behavior
   def test_good_example(self):
       obj = MyClass()
       result = obj.method()
       self.assertEqual(result, expected_value)
   ```

2. **Over-mocking**
   ```python
   # Bad: Mocking everything
   @patch('module.function1')
   @patch('module.function2')
   @patch('module.function3')
   def test_over_mocked(self, mock1, mock2, mock3):
       # Test becomes meaningless
   
   # Good: Mock only external dependencies
   @patch('requests.get')
   def test_well_mocked(self, mock_get):
       # Test actual logic, mock external calls
   ```

3. **Test Dependencies**
   ```python
   # Bad: Tests that depend on each other
   class BadTestClass(unittest.TestCase):
       def test_1_create_user(self):
           self.user_id = create_user()
       
       def test_2_update_user(self):
           update_user(self.user_id)  # Depends on test_1
   
   # Good: Independent tests
   class GoodTestClass(unittest.TestCase):
       def test_create_user(self):
           user_id = create_user()
           self.assertIsNotNone(user_id)
       
       def test_update_user(self):
           user_id = create_user()  # Create fresh data
           result = update_user(user_id)
           self.assertTrue(result)
   ```

### Debugging Pitfalls

4. **Debugging in Production**
   ```python
   # Bad: Debug code in production
   def production_function():
       print("Debug: entering function")  # Remove before deploy
       result = complex_calculation()
       import pdb; pdb.set_trace()  # Never leave in production
       return result
   
   # Good: Use logging with appropriate levels
   import logging
   logger = logging.getLogger(__name__)
   
   def production_function():
       logger.debug("Entering function")
       result = complex_calculation()
       logger.info(f"Calculation completed: {result}")
       return result
   ```

5. **Not Handling Exceptions in Tests**
   ```python
   # Bad: Exceptions crash tests
   def test_function(self):
       result = might_raise_exception()
       self.assertEqual(result, expected)
   
   # Good: Explicit exception handling
   def test_function(self):
       try:
           result = might_raise_exception()
           self.assertEqual(result, expected)
       except SpecificException:
           self.fail("Function raised unexpected exception")
   ```

## Resources

### Books
- "Test-Driven Development with Python" by Harry Percival
- "Python Testing with pytest" by Brian Okken
- "Effective Python" by Brett Slatkin (debugging tips)

### Documentation
- [unittest documentation](https://docs.python.org/3/library/unittest.html)
- [pytest documentation](https://docs.pytest.org/)
- [Python debugging documentation](https://docs.python.org/3/library/pdb.html)

### Tools
- **pytest**: Modern testing framework
- **coverage.py**: Code coverage measurement
- **hypothesis**: Property-based testing
- **mock**: Mocking library (built into unittest.mock)
- **pdb**: Python debugger
- **ipdb**: Enhanced debugger
- **pytest-mock**: pytest plugin for mocking

### Online Resources
- [Python Testing 101](https://realpython.com/python-testing/)
- [pytest official tutorial](https://docs.pytest.org/en/stable/getting-started.html)
- [Python debugging guide](https://realpython.com/python-debugging-pdb/)

---

*This guide provides a comprehensive foundation for testing and debugging in Python. Practice these concepts with real projects to build confidence and expertise.*
