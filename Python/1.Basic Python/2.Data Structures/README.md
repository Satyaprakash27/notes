# Python Data Structures

## Introduction
Data structures are fundamental constructs that allow you to store, organize, and manipulate data efficiently. Python provides several built-in data structures, each with unique properties and methods. Understanding the theoretical foundations, time complexity, and practical applications of these data structures is crucial for writing efficient and scalable code.

## Theory and Performance
- **Time Complexity**: The computational complexity of operations (Big O notation)
- **Space Complexity**: Memory usage efficiency
- **Access Patterns**: How data is accessed and modified
- **Use Cases**: Real-world applications and scenarios

---

## Core Data Structures

### 1. Lists
- **Properties**:
  - Ordered (maintains insertion order)
  - Mutable (can be modified after creation)
  - Allows duplicate elements
  - Dynamic size (can grow/shrink during runtime)
  - Indexed access (O(1) access time)

- **Time Complexity**:
  - Access: O(1)
  - Search: O(n)
  - Insertion: O(1) at end, O(n) at beginning/middle
  - Deletion: O(1) at end, O(n) at beginning/middle

- **Theory**: Lists are implemented as dynamic arrays (resizable arrays) in Python. They store references to objects, not the objects themselves. When the list grows beyond its current capacity, Python allocates a new, larger array and copies all elements.

- **Common Methods**:
  ```python
  # Creating and basic operations
  fruits = ["apple", "banana", "cherry"]
  numbers = [1, 2, 3, 4, 5]
  
  # Adding elements
  fruits.append("orange")           # O(1) - Add to end
  fruits.insert(1, "grape")         # O(n) - Insert at index
  fruits.extend(["kiwi", "mango"])  # O(k) - Add multiple elements
  
  # Removing elements
  fruits.remove("banana")           # O(n) - Remove first occurrence
  last_fruit = fruits.pop()         # O(1) - Remove and return last
  second_fruit = fruits.pop(1)      # O(n) - Remove at index
  
  # Modifying
  fruits.sort()                     # O(n log n) - Sort in place
  fruits.reverse()                  # O(n) - Reverse in place
  
  # Accessing and searching
  print(fruits[0])                  # O(1) - Access by index
  print(fruits.index("apple"))      # O(n) - Find index
  print(fruits.count("apple"))      # O(n) - Count occurrences
  
  # List comprehension (Pythonic way)
  squared = [x**2 for x in numbers]
  even_numbers = [x for x in numbers if x % 2 == 0]
  ```

- **Practical Examples**:
  ```python
  # Example 1: Managing a to-do list
  todo_list = []
  todo_list.append("Buy groceries")
  todo_list.append("Walk the dog")
  todo_list.insert(0, "Wake up")  # High priority task
  completed = todo_list.pop(0)    # Complete first task
  
  # Example 2: Processing data
  temperatures = [23.5, 25.1, 24.8, 26.2, 22.9]
  average_temp = sum(temperatures) / len(temperatures)
  hot_days = [temp for temp in temperatures if temp > 25]
  
  # Example 3: Stack implementation
  stack = []
  stack.append(1)  # Push
  stack.append(2)
  value = stack.pop()  # Pop
  ```

- **Usage**:
  Lists are versatile and commonly used for:
  - Dynamic arrays where size changes frequently
  - Implementing stacks and queues
  - Storing ordered collections of heterogeneous data
  - When you need indexed access to elements
  - Building other data structures

---

### 2. Tuples
- **Properties**:
  - Ordered (maintains insertion order)
  - Immutable (cannot be changed after creation)
  - Allows duplicate elements
  - Hashable (can be used as dictionary keys)
  - Memory efficient compared to lists

- **Time Complexity**:
  - Access: O(1)
  - Search: O(n)
  - No insertion/deletion (immutable)

- **Theory**: Tuples are implemented as fixed-size arrays in Python. Since they're immutable, Python can optimize memory usage and access patterns. The immutability makes them hashable, allowing them to be used as dictionary keys or set elements.

- **Common Methods**:
  ```python
  # Creating tuples
  coordinates = (10, 20, 30)
  single_item = (42,)  # Note the comma for single-item tuple
  empty_tuple = ()
  
  # Accessing elements
  x, y, z = coordinates  # Tuple unpacking
  print(coordinates[0])  # Access by index
  
  # Searching
  print(coordinates.count(10))    # Count occurrences
  print(coordinates.index(20))    # Find index of first occurrence
  
  # Advanced operations
  nested_tuple = ((1, 2), (3, 4), (5, 6))
  flattened = [item for subtuple in nested_tuple for item in subtuple]
  ```

- **Practical Examples**:
  ```python
  # Example 1: Representing coordinates
  point_2d = (10, 20)
  point_3d = (10, 20, 30)
  
  def distance(p1, p2):
      return ((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)**0.5
  
  # Example 2: Function returning multiple values
  def get_name_age():
      return "Alice", 25
  
  name, age = get_name_age()  # Tuple unpacking
  
  # Example 3: Dictionary with tuple keys
  chess_board = {
      (0, 0): "rook",
      (0, 1): "knight",
      (0, 2): "bishop"
  }
  
  # Example 4: Configuration settings
  DATABASE_CONFIG = (
      "localhost",
      5432,
      "mydb",
      "user",
      "password"
  )
  ```

- **Usage**:
  Tuples are ideal for:
  - Fixed collections of related data (coordinates, RGB values)
  - Function return values (multiple values)
  - Dictionary keys (when you need composite keys)
  - Configuration settings that shouldn't change
  - Data integrity (immutability prevents accidental modification)

---

### 3. Dictionaries
- **Properties**:
  - Ordered (Python 3.7+ maintains insertion order)
  - Mutable (can be modified after creation)
  - Key-value pairs
  - Keys must be immutable and hashable
  - No duplicate keys (values can be duplicated)

- **Time Complexity**:
  - Access: O(1) average, O(n) worst case
  - Search: O(1) average, O(n) worst case
  - Insertion: O(1) average, O(n) worst case
  - Deletion: O(1) average, O(n) worst case

- **Theory**: Dictionaries are implemented using hash tables. Python uses open addressing with random probing to handle collisions. The hash function converts keys to indices, allowing for fast lookups. The dictionary automatically resizes when the load factor becomes too high.

- **Common Methods**:
  ```python
  # Creating dictionaries
  student = {"name": "Alice", "age": 25, "grade": "A"}
  empty_dict = {}
  dict_from_pairs = dict([("a", 1), ("b", 2)])
  
  # Accessing and modifying
  student["major"] = "Computer Science"  # Add/update key-value pair
  age = student.get("age", 0)            # Safe access with default
  age = student.setdefault("age", 0)     # Get or set default
  
  # Removing elements
  removed_grade = student.pop("grade")      # Remove and return value
  last_item = student.popitem()            # Remove and return last item
  del student["age"]                       # Delete key-value pair
  
  # Bulk operations
  student.update({"age": 26, "city": "NYC"})  # Update multiple pairs
  student.clear()                              # Remove all elements
  
  # Views and iteration
  keys = student.keys()      # Get all keys
  values = student.values()  # Get all values
  items = student.items()    # Get all key-value pairs
  
  # Dictionary comprehension
  squared = {x: x**2 for x in range(5)}
  filtered = {k: v for k, v in student.items() if len(k) > 3}
  ```

- **Practical Examples**:
  ```python
  # Example 1: Counting occurrences
  def count_words(text):
      word_count = {}
      for word in text.split():
          word_count[word] = word_count.get(word, 0) + 1
      return word_count
  
  text = "hello world hello python world"
  counts = count_words(text)  # {'hello': 2, 'world': 2, 'python': 1}
  
  # Example 2: Caching/Memoization
  def fibonacci_memo():
      cache = {}
      def fib(n):
          if n in cache:
              return cache[n]
          if n <= 1:
              return n
          cache[n] = fib(n-1) + fib(n-2)
          return cache[n]
      return fib
  
  # Example 3: Configuration management
  config = {
      "database": {
          "host": "localhost",
          "port": 5432,
          "name": "myapp"
      },
      "api": {
          "version": "v1",
          "timeout": 30
      }
  }
  
  # Example 4: Grouping data
  def group_by_grade(students):
      groups = {}
      for student in students:
          grade = student["grade"]
          if grade not in groups:
              groups[grade] = []
          groups[grade].append(student)
      return groups
  ```

- **Usage**:
  Dictionaries are essential for:
  - Mapping relationships (user ID to user data)
  - Caching and memoization
  - Configuration settings
  - Counting and grouping operations
  - Implementing other data structures (graphs, trees)
  - Fast lookups and data retrieval

---

### 4. Sets
- **Properties**:
  - Unordered (no indexing)
  - Mutable (can be modified after creation)
  - No duplicate elements (uniqueness enforced)
  - Elements must be immutable and hashable
  - Fast membership testing

- **Time Complexity**:
  - Access: O(1) average, O(n) worst case
  - Search: O(1) average, O(n) worst case
  - Insertion: O(1) average, O(n) worst case
  - Deletion: O(1) average, O(n) worst case

- **Theory**: Sets are implemented using hash tables, similar to dictionaries but storing only keys (no values). They use the same hashing mechanism for fast lookups. Python provides both mutable sets and immutable frozensets.

- **Common Methods**:
  ```python
  # Creating sets
  unique_numbers = {1, 2, 3, 4, 5}
  empty_set = set()  # Note: {} creates an empty dict, not set
  set_from_list = set([1, 2, 2, 3, 3])  # Duplicates removed
  
  # Adding and removing elements
  unique_numbers.add(6)         # Add single element
  unique_numbers.update([7, 8]) # Add multiple elements
  unique_numbers.remove(3)      # Remove element (raises KeyError if not found)
  unique_numbers.discard(10)    # Remove element (no error if not found)
  popped = unique_numbers.pop() # Remove and return arbitrary element
  
  # Set operations
  set_a = {1, 2, 3, 4}
  set_b = {3, 4, 5, 6}
  
  # Union (all elements from both sets)
  union = set_a | set_b  # or set_a.union(set_b)
  
  # Intersection (common elements)
  intersection = set_a & set_b  # or set_a.intersection(set_b)
  
  # Difference (elements in set_a but not in set_b)
  difference = set_a - set_b  # or set_a.difference(set_b)
  
  # Symmetric difference (elements in either set, but not both)
  sym_diff = set_a ^ set_b  # or set_a.symmetric_difference(set_b)
  
  # Subset and superset operations
  is_subset = {1, 2}.issubset(set_a)
  is_superset = set_a.issuperset({1, 2})
  is_disjoint = set_a.isdisjoint({7, 8, 9})
  
  # Set comprehension
  squared_set = {x**2 for x in range(10)}
  even_set = {x for x in range(20) if x % 2 == 0}
  ```

- **Practical Examples**:
  ```python
  # Example 1: Removing duplicates from a list
  numbers = [1, 2, 2, 3, 3, 4, 5, 5]
  unique_numbers = list(set(numbers))  # [1, 2, 3, 4, 5]
  
  # Example 2: Finding common elements
  def find_common_interests(person1_interests, person2_interests):
      set1 = set(person1_interests)
      set2 = set(person2_interests)
      return set1 & set2
  
  alice_interests = ["reading", "hiking", "cooking", "music"]
  bob_interests = ["music", "sports", "cooking", "gaming"]
  common = find_common_interests(alice_interests, bob_interests)
  
  # Example 3: Membership testing
  valid_extensions = {".jpg", ".png", ".gif", ".bmp"}
  filename = "image.jpg"
  extension = filename[filename.rfind('.'):]
  if extension in valid_extensions:  # O(1) lookup
      print("Valid image file")
  
  # Example 4: Set operations for data analysis
  yesterday_visitors = {"user1", "user2", "user3", "user4"}
  today_visitors = {"user2", "user3", "user5", "user6"}
  
  new_visitors = today_visitors - yesterday_visitors
  returning_visitors = today_visitors & yesterday_visitors
  all_visitors = today_visitors | yesterday_visitors
  
  # Example 5: Frozenset for immutable sets
  immutable_set = frozenset([1, 2, 3, 4])
  # Can be used as dictionary keys or set elements
  nested_sets = {frozenset([1, 2]), frozenset([3, 4])}
  ```

- **Usage**:
  Sets are perfect for:
  - Removing duplicates from collections
  - Fast membership testing
  - Set operations (union, intersection, difference)
  - Mathematical set operations
  - Tracking unique items
  - Finding relationships between datasets

---

### 5. Strings
- **Properties**:
  - Ordered (maintains character sequence)
  - Immutable (cannot be changed after creation)
  - Sequence of Unicode characters
  - Indexable and sliceable
  - Iterable

- **Time Complexity**:
  - Access: O(1)
  - Search: O(n)
  - Slicing: O(k) where k is slice length
  - Concatenation: O(n + m) where n, m are string lengths

- **Theory**: Strings in Python are immutable sequences of Unicode characters. They are implemented as arrays of character codes. Since they're immutable, operations that appear to modify strings actually create new string objects. Python uses string interning for small strings to optimize memory usage.

- **Common Methods**:
  ```python
  # Creating strings
  text = "Hello, World!"
  multiline = """This is a
  multiline string"""
  raw_string = r"C:\Users\name\file.txt"  # Raw string (no escaping)
  
  # Case operations
  print(text.lower())        # Convert to lowercase
  print(text.upper())        # Convert to uppercase
  print(text.title())        # Title case
  print(text.capitalize())   # Capitalize first letter
  print(text.swapcase())     # Swap case
  
  # Searching and checking
  print(text.find("World"))     # Find substring index (-1 if not found)
  print(text.index("World"))    # Find substring index (raises ValueError)
  print(text.count("l"))        # Count occurrences
  print(text.startswith("Hello"))  # Check prefix
  print(text.endswith("!"))     # Check suffix
  
  # Splitting and joining
  words = text.split(",")       # Split by delimiter
  lines = text.splitlines()     # Split by line breaks
  joined = "-".join(words)      # Join with delimiter
  
  # Formatting and cleaning
  messy = "  hello world  "
  clean = messy.strip()         # Remove leading/trailing whitespace
  padded = text.center(20, "*") # Center with padding
  formatted = "Name: {}, Age: {}".format("Alice", 25)
  f_string = f"Name: {'Alice'}, Age: {25}"  # f-string (Python 3.6+)
  
  # String validation
  print("123".isdigit())     # Check if all digits
  print("abc".isalpha())     # Check if all letters
  print("abc123".isalnum())  # Check if alphanumeric
  print("   ".isspace())     # Check if all whitespace
  
  # Advanced operations
  replaced = text.replace("World", "Python")  # Replace substring
  encoded = text.encode('utf-8')              # Encode to bytes
  decoded = encoded.decode('utf-8')           # Decode from bytes
  ```

- **Practical Examples**:
  ```python
  # Example 1: Text processing and validation
  def validate_email(email):
      return "@" in email and "." in email.split("@")[-1]
  
  def clean_phone(phone):
      return "".join(char for char in phone if char.isdigit())
  
  # Example 2: String formatting
  def format_currency(amount):
      return f"${amount:,.2f}"
  
  def create_report(name, score, total):
      percentage = (score / total) * 100
      return f"{name}: {score}/{total} ({percentage:.1f}%)"
  
  # Example 3: Text analysis
  def analyze_text(text):
      words = text.lower().split()
      word_count = len(words)
      char_count = len(text)
      sentence_count = text.count('.') + text.count('!') + text.count('?')
      
      return {
          'words': word_count,
          'characters': char_count,
          'sentences': sentence_count,
          'avg_word_length': sum(len(word) for word in words) / word_count if words else 0
      }
  
  # Example 4: String manipulation
  def snake_to_camel(snake_str):
      components = snake_str.split('_')
      return components[0] + ''.join(x.title() for x in components[1:])
  
  def camel_to_snake(camel_str):
      import re
      return re.sub('([a-z0-9])([A-Z])', r'\1_\2', camel_str).lower()
  
  # Example 5: Template processing
  def simple_template(template, **kwargs):
      for key, value in kwargs.items():
          template = template.replace(f"{{{key}}}", str(value))
      return template
  
  template = "Hello {name}, you have {count} new messages."
  message = simple_template(template, name="Alice", count=5)
  ```

- **Usage**:
  Strings are fundamental for:
  - Text processing and manipulation
  - User input validation
  - File path handling
  - Configuration and templating
  - Data serialization
  - Regular expression operations
  - Internationalization and localization

---

---

## Advanced Data Structures

### 6. Deques (Double-ended Queues)
- **Properties**:
  - Ordered
  - Mutable
  - Efficient insertion/deletion at both ends
  - Thread-safe for append/pop operations

- **Time Complexity**:
  - Access: O(n)
  - Insertion/Deletion at ends: O(1)
  - Insertion/Deletion in middle: O(n)

- **Theory**: Deques are implemented as doubly-linked lists of blocks. Each block contains multiple elements, providing better cache locality than pure linked lists while maintaining O(1) operations at both ends.

- **Common Methods**:
  ```python
  from collections import deque
  
  # Creating deques
  dq = deque([1, 2, 3])
  dq = deque(maxlen=5)  # Bounded deque
  
  # Adding elements
  dq.append(4)      # Add to right end
  dq.appendleft(0)  # Add to left end
  dq.extend([5, 6]) # Add multiple to right
  dq.extendleft([-1, -2])  # Add multiple to left
  
  # Removing elements
  right = dq.pop()       # Remove from right end
  left = dq.popleft()    # Remove from left end
  
  # Other operations
  dq.rotate(1)    # Rotate right
  dq.rotate(-1)   # Rotate left
  dq.clear()      # Remove all elements
  ```

- **Practical Examples**:
  ```python
  # Example 1: Sliding window maximum
  from collections import deque
  
  def sliding_window_max(arr, k):
      dq = deque()
      result = []
      
      for i in range(len(arr)):
          # Remove elements outside window
          while dq and dq[0] <= i - k:
              dq.popleft()
          
          # Remove smaller elements
          while dq and arr[dq[-1]] <= arr[i]:
              dq.pop()
          
          dq.append(i)
          
          if i >= k - 1:
              result.append(arr[dq[0]])
      
      return result
  
  # Example 2: Undo/Redo functionality
  class UndoRedoManager:
      def __init__(self, max_size=100):
          self.undo_stack = deque(maxlen=max_size)
          self.redo_stack = deque(maxlen=max_size)
      
      def execute_action(self, action, undo_action):
          action()
          self.undo_stack.append(undo_action)
          self.redo_stack.clear()
      
      def undo(self):
          if self.undo_stack:
              undo_action = self.undo_stack.pop()
              self.redo_stack.append(undo_action)
              undo_action()
  ```

### 7. Queues
- **Properties**:
  - FIFO (First In, First Out) ordering
  - Thread-safe operations
  - Blocking operations available

- **Time Complexity**:
  - Enqueue: O(1)
  - Dequeue: O(1)
  - Size check: O(1)

- **Theory**: Python's queue module provides thread-safe queue implementations. They use locks to ensure thread safety and can block when empty (get) or full (put).

- **Common Methods**:
  ```python
  from queue import Queue, LifoQueue, PriorityQueue
  import threading
  
  # Standard FIFO queue
  q = Queue(maxsize=10)  # Optional size limit
  q.put(1)               # Add element (blocks if full)
  q.put(2, timeout=5)    # Add with timeout
  item = q.get()         # Remove element (blocks if empty)
  item = q.get_nowait()  # Remove without blocking
  q.task_done()          # Mark task as done
  q.join()               # Wait for all tasks to complete
  
  # Priority queue (min-heap)
  pq = PriorityQueue()
  pq.put((1, "high priority"))
  pq.put((5, "low priority"))
  pq.put((3, "medium priority"))
  
  # LIFO queue (stack)
  stack = LifoQueue()
  stack.put(1)
  stack.put(2)
  item = stack.get()  # Returns 2
  ```

- **Practical Examples**:
  ```python
  # Example 1: Producer-Consumer pattern
  import queue
  import threading
  import time
  
  def producer(q):
      for i in range(5):
          item = f"item_{i}"
          q.put(item)
          print(f"Produced: {item}")
          time.sleep(1)
  
  def consumer(q):
      while True:
          item = q.get()
          if item is None:
              break
          print(f"Consumed: {item}")
          q.task_done()
  
  # Example 2: Task scheduling
  class TaskScheduler:
      def __init__(self):
          self.task_queue = Queue()
          self.workers = []
      
      def add_task(self, task):
          self.task_queue.put(task)
      
      def worker(self):
          while True:
              task = self.task_queue.get()
              if task is None:
                  break
              task()
              self.task_queue.task_done()
  ```

### 8. Stacks
- **Properties**:
  - LIFO (Last In, First Out) ordering
  - Simple operations: push, pop, peek
  - Can be implemented using lists or deques

- **Time Complexity**:
  - Push: O(1)
  - Pop: O(1)
  - Peek: O(1)

- **Theory**: Stacks are abstract data types that follow LIFO principle. Python lists provide efficient stack operations, though deques can be used for thread-safe operations.

- **Common Methods**:
  ```python
  # Using list as stack
  stack = []
  stack.append(1)    # Push
  stack.append(2)
  top = stack[-1]    # Peek (without removing)
  item = stack.pop() # Pop
  
  # Using deque for thread-safe operations
  from collections import deque
  stack = deque()
  stack.append(1)    # Push
  item = stack.pop() # Pop
  ```

- **Practical Examples**:
  ```python
  # Example 1: Balanced parentheses checker
  def is_balanced(expression):
      stack = []
      pairs = {'(': ')', '[': ']', '{': '}'}
      
      for char in expression:
          if char in pairs:
              stack.append(char)
          elif char in pairs.values():
              if not stack or pairs[stack.pop()] != char:
                  return False
      
      return len(stack) == 0
  
  # Example 2: Expression evaluation
  def evaluate_postfix(expression):
      stack = []
      operators = {'+', '-', '*', '/'}
      
      for token in expression.split():
          if token in operators:
              b = stack.pop()
              a = stack.pop()
              if token == '+':
                  result = a + b
              elif token == '-':
                  result = a - b
              elif token == '*':
                  result = a * b
              elif token == '/':
                  result = a / b
              stack.append(result)
          else:
              stack.append(float(token))
      
      return stack[0]
  
  # Example 3: Function call stack simulation
  class CallStack:
      def __init__(self):
          self.stack = []
      
      def call_function(self, func_name, args):
          frame = {'function': func_name, 'args': args, 'locals': {}}
          self.stack.append(frame)
          return frame
      
      def return_from_function(self):
          if self.stack:
              return self.stack.pop()
          return None
      
      def current_frame(self):
          return self.stack[-1] if self.stack else None
  ```

### 9. Arrays
- **Properties**:
  - Homogeneous data (all elements same type)
  - More memory efficient than lists
  - Fixed type ensures type safety
  - Supports all numeric types

- **Time Complexity**:
  - Access: O(1)
  - Search: O(n)
  - Insertion: O(n)
  - Deletion: O(n)

- **Theory**: Arrays store elements of the same type in contiguous memory locations. They're more memory-efficient than lists because they don't store type information for each element.

- **Common Methods**:
  ```python
  from array import array
  
  # Creating arrays
  int_array = array('i', [1, 2, 3, 4])  # 'i' for signed int
  float_array = array('f', [1.0, 2.0, 3.0])  # 'f' for float
  
  # Type codes: 'b', 'B', 'h', 'H', 'i', 'I', 'l', 'L', 'q', 'Q', 'f', 'd'
  
  # Operations
  int_array.append(5)         # Add element
  int_array.insert(0, 0)      # Insert at index
  int_array.remove(2)         # Remove first occurrence
  popped = int_array.pop()    # Remove last element
  int_array.reverse()         # Reverse in place
  
  # Conversion
  list_data = int_array.tolist()      # Convert to list
  bytes_data = int_array.tobytes()    # Convert to bytes
  new_array = array('i')
  new_array.frombytes(bytes_data)     # Create from bytes
  ```

- **Practical Examples**:
  ```python
  # Example 1: Numeric computations
  from array import array
  import math
  
  def compute_statistics(numbers):
      arr = array('f', numbers)
      n = len(arr)
      
      # Mean
      mean = sum(arr) / n
      
      # Standard deviation
      variance = sum((x - mean) ** 2 for x in arr) / n
      std_dev = math.sqrt(variance)
      
      return {'mean': mean, 'std_dev': std_dev}
  
  # Example 2: Signal processing
  def moving_average(signal, window_size):
      if len(signal) < window_size:
          return signal
      
      result = array('f')
      for i in range(len(signal) - window_size + 1):
          avg = sum(signal[i:i+window_size]) / window_size
          result.append(avg)
      
      return result
  
  # Example 3: Memory-efficient data storage
  class DataLogger:
      def __init__(self, data_type='f'):
          self.data = array(data_type)
          self.timestamps = array('d')  # double precision for timestamps
      
      def log_data(self, value, timestamp):
          self.data.append(value)
          self.timestamps.append(timestamp)
      
      def get_memory_usage(self):
          return (self.data.buffer_info()[1] * self.data.itemsize + 
                  self.timestamps.buffer_info()[1] * self.timestamps.itemsize)
  ```

- **Usage**:
  Advanced data structures are used for:
  - **Deques**: Sliding window algorithms, undo/redo functionality
  - **Queues**: Multi-threading, task scheduling, producer-consumer patterns
  - **Stacks**: Expression evaluation, function calls, backtracking algorithms
  - **Arrays**: Numeric computations, signal processing, memory-efficient storage

---

## Performance Comparison

| Operation | List | Tuple | Dict | Set | Deque | Array |
|-----------|------|-------|------|-----|-------|-------|
| Access by index | O(1) | O(1) | O(1) | N/A | O(n) | O(1) |
| Search | O(n) | O(n) | O(1) | O(1) | O(n) | O(n) |
| Insert at end | O(1) | N/A | O(1) | O(1) | O(1) | O(n) |
| Insert at beginning | O(n) | N/A | O(1) | O(1) | O(1) | O(n) |
| Delete | O(n) | N/A | O(1) | O(1) | O(1) | O(n) |
| Memory usage | High | Low | Medium | Medium | Medium | Low |

## Conclusion
Python's built-in data structures provide powerful tools for organizing and manipulating data. Understanding their theoretical foundations, performance characteristics, and practical applications is essential for writing efficient and effective code. Choose the right data structure based on your specific needs: access patterns, performance requirements, and memory constraints.