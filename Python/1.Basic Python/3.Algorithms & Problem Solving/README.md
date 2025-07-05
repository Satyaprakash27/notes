# Algorithms & Problem Solving

## Introduction
This comprehensive guide covers essential algorithms, problem-solving techniques, and coding interview preparation using Python. Master the art of algorithmic thinking and develop skills to tackle complex programming challenges efficiently.

## Table of Contents
1. [Algorithmic Thinking](#algorithmic-thinking)
2. [Time and Space Complexity](#time-and-space-complexity)
3. [Basic Algorithms](#basic-algorithms)
4. [Data Structure Algorithms](#data-structure-algorithms)
5. [Advanced Algorithms](#advanced-algorithms)
6. [Problem-Solving Strategies](#problem-solving-strategies)
7. [Interview Preparation](#interview-preparation)
8. [Practice Problems](#practice-problems)

---

## Algorithmic Thinking

### What is Algorithmic Thinking?
Algorithmic thinking is the process of breaking down complex problems into smaller, manageable steps that can be solved systematically. It's a fundamental skill that combines logical reasoning, pattern recognition, and systematic problem-solving approaches.

**Core Definition**: An algorithm is a finite sequence of well-defined, computer-implementable instructions for solving a problem or performing a computation.

### Theoretical Foundation

#### Computational Thinking Framework
1. **Decomposition**: Breaking down complex problems into smaller, more manageable sub-problems
2. **Pattern Recognition**: Identifying similarities and patterns among problems
3. **Abstraction**: Focusing on essential features while ignoring irrelevant details
4. **Algorithm Design**: Creating step-by-step solutions that can be implemented

#### Properties of Good Algorithms
- **Correctness**: Produces the correct output for all valid inputs
- **Efficiency**: Uses computational resources (time and space) optimally
- **Clarity**: Easy to understand and implement
- **Generality**: Works for a wide range of inputs
- **Robustness**: Handles edge cases and invalid inputs gracefully

### Algorithm Design Paradigms

#### 1. Brute Force
- **Theory**: Exhaustively search all possible solutions
- **When to use**: Small input sizes, when correctness is more important than efficiency
- **Example**: Checking all possible passwords

#### 2. Divide and Conquer
- **Theory**: Break problem into smaller subproblems, solve recursively, combine results
- **Mathematical foundation**: T(n) = aT(n/b) + f(n) (Master Theorem)
- **Examples**: Merge Sort, Quick Sort, Binary Search

#### 3. Dynamic Programming
- **Theory**: Solve complex problems by breaking them down into simpler subproblems and storing results
- **Principle**: Optimal substructure + overlapping subproblems
- **Types**: 
  - Memoization (top-down)
  - Tabulation (bottom-up)

#### 4. Greedy Algorithms
- **Theory**: Make locally optimal choices at each step
- **When it works**: Problems with greedy choice property and optimal substructure
- **Limitation**: Doesn't always lead to global optimum

#### 5. Backtracking
- **Theory**: Systematic trial and error, undoing choices that lead to dead ends
- **Template**: Choose → Explore → Unchoose
- **Applications**: Constraint satisfaction problems

### Problem-Solving Process
```python
def problem_solving_framework():
    """
    1. Understand the problem
    2. Identify constraints and edge cases
    3. Choose appropriate data structures
    4. Design the algorithm
    5. Implement the solution
    6. Test and optimize
    """
    pass
```

---

## Time and Space Complexity

### Theoretical Foundation

#### What is Complexity Analysis?
Complexity analysis is the practice of determining how the running time and space requirements of an algorithm scale with the size of the input. It helps us:
- Compare different algorithms objectively
- Predict performance on large inputs
- Identify bottlenecks in code
- Make informed decisions about algorithm selection

#### Asymptotic Notation
**Big O Notation (O)**: Upper bound - worst-case scenario
- Describes the maximum time/space an algorithm will take
- Most commonly used in practice

**Big Omega (Ω)**: Lower bound - best-case scenario
- Describes the minimum time/space an algorithm will take

**Big Theta (Θ)**: Tight bound - average case
- When upper and lower bounds are the same

#### Mathematical Foundation
For functions f(n) and g(n):
- f(n) = O(g(n)) if there exist constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀
- This means f(n) grows no faster than g(n)

#### Why Asymptotic Analysis?
1. **Hardware Independence**: Results don't depend on specific machine
2. **Scalability**: Focus on how algorithm behaves with large inputs
3. **Simplicity**: Ignore constant factors and lower-order terms

### Complexity Hierarchy (from best to worst)
1. **O(1)** - Constant: Array access, hash table lookup
2. **O(log n)** - Logarithmic: Binary search, balanced tree operations
3. **O(n)** - Linear: Array traversal, linear search
4. **O(n log n)** - Linearithmic: Efficient sorting (merge sort, heap sort)
5. **O(n²)** - Quadratic: Nested loops, bubble sort
6. **O(n³)** - Cubic: Triple nested loops, naive matrix multiplication
7. **O(2ⁿ)** - Exponential: Recursive fibonacci, subset generation
8. **O(n!)** - Factorial: Traveling salesman (brute force), permutations

### Space Complexity Theory
**Types of Space Usage**:
1. **Input Space**: Space used to store input (usually not counted)
2. **Auxiliary Space**: Extra space used by algorithm (what we measure)
3. **Output Space**: Space used to store output

**Common Space Patterns**:
- **Recursive algorithms**: O(depth of recursion) due to call stack
- **Dynamic programming**: O(size of memoization table)
- **Iterative algorithms**: Often O(1) if no extra data structures

### Big O Notation
Understanding algorithmic efficiency is crucial for writing scalable code.

#### Common Time Complexities
```python
# O(1) - Constant Time
def constant_time_example(arr):
    return arr[0] if arr else None

# O(log n) - Logarithmic Time
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# O(n) - Linear Time
def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

# O(n log n) - Linearithmic Time
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# O(n²) - Quadratic Time
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# O(2^n) - Exponential Time (avoid when possible)
def fibonacci_naive(n):
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)
```

#### Space Complexity Examples
```python
# O(1) - Constant Space
def reverse_string_inplace(s):
    s_list = list(s)
    left, right = 0, len(s_list) - 1
    while left < right:
        s_list[left], s_list[right] = s_list[right], s_list[left]
        left += 1
        right -= 1
    return ''.join(s_list)

# O(n) - Linear Space
def fibonacci_memoized(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memoized(n - 1, memo) + fibonacci_memoized(n - 2, memo)
    return memo[n]
```

---

## Basic Algorithms

### Searching Algorithms Theory

#### What is Searching?
Searching is the process of finding a specific element in a collection of data. The efficiency of searching depends on:
- **Data structure organization** (sorted vs unsorted)
- **Search algorithm used**
- **Size of the dataset**

#### Search Algorithm Classification
1. **Sequential Search**: Examine elements one by one
2. **Interval Search**: Use data structure properties to eliminate portions
3. **Probabilistic Search**: Use randomization or heuristics

#### Trade-offs in Search Algorithms
- **Time vs Space**: Some algorithms use extra space for better time complexity
- **Preprocessing vs Query Time**: Sorting data takes time but enables faster searches
- **Worst-case vs Average-case**: Some algorithms have poor worst-case but good average performance

### Searching Algorithms

#### Linear Search Theory
**Concept**: Sequentially check each element until target is found or list ends
**Best Case**: O(1) - element is first
**Worst Case**: O(n) - element is last or not present
**Average Case**: O(n/2) ≈ O(n)
**Space**: O(1) - no extra space needed
**When to use**: Small datasets, unsorted data, simplicity is important

#### Linear Search
```python
def linear_search(arr, target):
    """
    Search for target in unsorted array
    Time: O(n), Space: O(1)
    """
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print(linear_search(numbers, 22))  # Output: 4
```

#### Binary Search Theory
**Concept**: Divide and conquer approach for sorted arrays
**Prerequisites**: Array must be sorted
**How it works**: 
1. Compare target with middle element
2. If equal, found; if target < middle, search left half
3. If target > middle, search right half
4. Repeat until found or search space is empty

**Mathematical Analysis**:
- Each comparison eliminates half the remaining elements
- Maximum comparisons: ⌊log₂(n)⌋ + 1
- Recurrence relation: T(n) = T(n/2) + O(1)

**Invariant**: If target exists, it's always in the current search interval [left, right]

**Time Complexity**: O(log n) - logarithmic
**Space Complexity**: O(1) iterative, O(log n) recursive
**When to use**: Large sorted datasets, frequent searches
```python
def binary_search(arr, target):
    """
    Search for target in sorted array
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Recursive implementation
def binary_search_recursive(arr, target, left=0, right=None):
    """
    Recursive binary search
    Time: O(log n), Space: O(log n) due to recursion
    """
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# Example usage
sorted_numbers = [11, 12, 22, 25, 34, 64, 90]
print(binary_search(sorted_numbers, 25))  # Output: 3
```

### Sorting Algorithms Theory

#### What is Sorting?
Sorting is the process of arranging elements in a specific order (ascending or descending). It's fundamental because:
- **Search optimization**: Binary search requires sorted data
- **Data organization**: Makes patterns and relationships visible
- **Algorithm preprocessing**: Many algorithms work better on sorted data

#### Sorting Algorithm Classification

**By Stability**:
- **Stable**: Maintains relative order of equal elements (Merge Sort, Insertion Sort)
- **Unstable**: May change relative order of equal elements (Quick Sort, Heap Sort)

**By Method**:
- **Comparison-based**: Compare elements to determine order
- **Non-comparison**: Use properties of data (Counting Sort, Radix Sort)

**By Memory Usage**:
- **In-place**: O(1) extra space (Quick Sort, Heap Sort)
- **Out-of-place**: O(n) extra space (Merge Sort)

**By Adaptability**:
- **Adaptive**: Performs better on partially sorted data (Insertion Sort)
- **Non-adaptive**: Performance independent of input order (Heap Sort)

#### Theoretical Lower Bound
For comparison-based sorting: **Ω(n log n)**
- Proof: Decision tree has n! leaves (all permutations)
- Tree height ≥ log₂(n!) ≈ n log n
- Therefore, any comparison-based sort needs at least n log n comparisons

### Sorting Algorithms

#### Bubble Sort Theory
**Concept**: Repeatedly swap adjacent elements if they're in wrong order
**How it works**: 
1. Compare adjacent elements
2. Swap if they're in wrong order
3. Repeat until no swaps needed

**Properties**:
- **Stable**: Equal elements maintain relative order
- **In-place**: O(1) extra space
- **Adaptive**: Can detect if array is already sorted

**Time Complexity**: 
- Best: O(n) - already sorted with optimization
- Average/Worst: O(n²)
**Space**: O(1)
**When to use**: Educational purposes, very small datasets

#### Bubble Sort
```python
def bubble_sort(arr):
    """
    Simple comparison-based sorting
    Time: O(n²), Space: O(1)
    """
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # Optimization: if no swapping occurred, array is sorted
        if not swapped:
            break
    
    return arr
```

#### Selection Sort Theory
**Concept**: Find minimum element and place it at the beginning
**How it works**:
1. Find minimum element in unsorted portion
2. Swap it with first element of unsorted portion
3. Move boundary of unsorted portion

**Properties**:
- **Unstable**: Can change relative order of equal elements
- **In-place**: O(1) extra space
- **Non-adaptive**: Always performs same number of comparisons

**Invariant**: After i iterations, first i elements are sorted and in final position

**Time Complexity**: O(n²) - always, regardless of input
**Space**: O(1)
**When to use**: Memory is limited, small datasets
```python
def selection_sort(arr):
    """
    Find minimum element and place it at the beginning
    Time: O(n²), Space: O(1)
    """
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr
```

#### Insertion Sort Theory
**Concept**: Build sorted array one element at a time by inserting each element into its correct position
**How it works**:
1. Start with second element (assume first is sorted)
2. Compare with elements in sorted portion
3. Shift elements to make room and insert

**Properties**:
- **Stable**: Equal elements maintain relative order
- **In-place**: O(1) extra space
- **Adaptive**: O(n) on nearly sorted data
- **Online**: Can sort list as it receives it

**Invariant**: After i iterations, first i+1 elements are sorted (but not necessarily in final position)

**Mathematical Analysis**:
- Best case: Array already sorted, O(n) comparisons
- Worst case: Array reverse sorted, O(n²) comparisons
- Average case: O(n²/4) ≈ O(n²)

**Time Complexity**: 
- Best: O(n) - already sorted
- Average/Worst: O(n²)
**Space**: O(1)
**When to use**: Small datasets, nearly sorted data, online algorithms
```python
def insertion_sort(arr):
    """
    Build sorted array one element at a time
    Time: O(n²), Space: O(1)
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    
    return arr
```

#### Quick Sort Theory
**Concept**: Divide-and-conquer algorithm that partitions array around a pivot
**How it works**:
1. Choose a pivot element
2. Partition array so elements < pivot are on left, elements > pivot on right
3. Recursively sort left and right subarrays

**Pivot Selection Strategies**:
- **First element**: Simple but can lead to O(n²) on sorted arrays
- **Last element**: Similar issues as first
- **Random**: Good average case, prevents worst-case on specific inputs
- **Median-of-three**: Choose median of first, middle, last elements

**Partitioning Schemes**:
- **Lomuto partition**: Simpler implementation
- **Hoare partition**: Fewer swaps, slightly more efficient

**Properties**:
- **Unstable**: Can change relative order of equal elements
- **In-place**: O(log n) space due to recursion stack
- **Not adaptive**: Performance doesn't improve on sorted data

**Mathematical Analysis**:
- Best/Average: T(n) = 2T(n/2) + O(n) = O(n log n)
- Worst: T(n) = T(n-1) + O(n) = O(n²)
- Worst case occurs when pivot is always smallest or largest

**Time Complexity**:
- Best/Average: O(n log n)
- Worst: O(n²)
**Space**: O(log n) average, O(n) worst case
**When to use**: General purpose, when average performance matters more than worst-case
```python
def quick_sort(arr):
    """
    Divide-and-conquer sorting algorithm
    Average Time: O(n log n), Worst Time: O(n²), Space: O(log n)
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# In-place implementation
def quick_sort_inplace(arr, low=0, high=None):
    """
    In-place quick sort implementation
    """
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_index - 1)
        quick_sort_inplace(arr, pivot_index + 1, high)

def partition(arr, low, high):
    """
    Partition function for quick sort
    """
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

#### Merge Sort Theory
**Concept**: Divide-and-conquer algorithm that splits array into halves, sorts them, then merges
**How it works**:
1. Divide array into two halves
2. Recursively sort each half
3. Merge the sorted halves

**Properties**:
- **Stable**: Equal elements maintain relative order
- **Not in-place**: Requires O(n) extra space
- **Not adaptive**: Always performs same operations
- **Predictable**: Always O(n log n) time

**Mathematical Analysis**:
- Recurrence: T(n) = 2T(n/2) + O(n)
- By Master Theorem: T(n) = O(n log n)
- Height of recursion tree: log n
- Work at each level: O(n)

**Merge Process**:
- Compare elements from two sorted arrays
- Take smaller element and advance pointer
- Continue until one array is exhausted
- Copy remaining elements

**Time Complexity**: O(n log n) - always
**Space**: O(n) - for temporary arrays
**When to use**: When stability is required, predictable performance needed, external sorting
```python
def merge_sort(arr):
    """
    Stable divide-and-conquer sorting
    Time: O(n log n), Space: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    """
    Merge two sorted arrays
    """
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

---

## Data Structure Algorithms

### Array Algorithm Theory

#### Arrays as Data Structures
Arrays are contiguous memory locations that store elements of the same type. Key properties:
- **Random access**: O(1) access to any element by index
- **Cache-friendly**: Elements stored contiguously in memory
- **Fixed size**: Cannot grow/shrink dynamically (in most languages)

#### Common Array Patterns

**Two Pointers Technique Theory**:
- **Concept**: Use two pointers to traverse array from different positions
- **When to use**: 
  - Array is sorted
  - Need to find pairs with certain property
  - Need to reverse or rearrange elements
- **Types**:
  - **Opposite ends**: Start from beginning and end, move toward center
  - **Same direction**: Both pointers move in same direction at different speeds
  - **Fast-slow**: One pointer moves faster than the other

**Mathematical Foundation**:
- Reduces time complexity from O(n²) to O(n) for many problems
- Space complexity remains O(1) - no extra data structures needed

### Array Algorithms

#### Two Pointers Technique
```python
def two_sum_sorted(arr, target):
    """
    Find two numbers that add up to target in sorted array
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []

def reverse_array(arr):
    """
    Reverse array using two pointers
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr
```

#### Sliding Window Technique Theory
**Concept**: Maintain a window of fixed or variable size over array elements
**How it works**:
1. Establish initial window
2. Slide window by removing leftmost element and adding new rightmost element
3. Update result based on current window

**Types of Sliding Windows**:
- **Fixed size**: Window size remains constant
- **Variable size**: Window size changes based on condition

**When to use**:
- Finding subarray with specific property
- Optimization problems over contiguous elements
- Pattern matching in strings

**Advantages**:
- Reduces time complexity from O(n²) to O(n)
- Avoids redundant calculations
- Memory efficient

**Mathematical Foundation**:
- Instead of recalculating sum for each subarray: O(n²)
- Slide window by removing one element and adding another: O(n)

#### Sliding Window Technique
```python
def max_sum_subarray(arr, k):
    """
    Find maximum sum of subarray of size k
    Time: O(n), Space: O(1)
    """
    if len(arr) < k:
        return None
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

def longest_substring_k_distinct(s, k):
    """
    Find longest substring with at most k distinct characters
    Time: O(n), Space: O(k)
    """
    if k == 0:
        return 0
    
    char_count = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Add character to window
        char_count[s[right]] = char_count.get(s[right], 0) + 1
        
        # Shrink window if more than k distinct characters
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

### String Algorithm Theory

#### String Matching Fundamentals
String matching is the process of finding occurrences of a pattern within a text. Applications include:
- **Text search**: Finding words in documents
- **DNA analysis**: Finding genetic sequences
- **Compiler design**: Lexical analysis
- **Data validation**: Pattern matching in input

#### String Matching Complexity
- **Naive approach**: O(nm) where n = text length, m = pattern length
- **Efficient algorithms**: 
  - KMP (Knuth-Morris-Pratt): O(n + m)
  - Boyer-Moore: O(n/m) best case, O(nm) worst case
  - Rabin-Karp: O(n + m) average, O(nm) worst case

#### String Properties
- **Palindrome**: Reads same forwards and backwards
- **Subsequence**: Derived sequence by deleting some elements without changing order
- **Substring**: Contiguous sequence of characters within a string

### String Algorithms

#### Pattern Matching Theory
**Naive Pattern Matching**:
- **Concept**: Check pattern at every position in text
- **Sliding**: Move pattern one position at a time
- **Comparison**: Compare characters one by one

**Limitations**:
- Doesn't learn from previous mismatches
- Redundant comparisons
- Poor performance on repetitive patterns

#### Pattern Matching
```python
def naive_pattern_search(text, pattern):
    """
    Naive pattern matching algorithm
    Time: O(nm), Space: O(1)
    """
    matches = []
    n, m = len(text), len(pattern)
    
    for i in range(n - m + 1):
        j = 0
        while j < m and text[i + j] == pattern[j]:
            j += 1
        if j == m:
            matches.append(i)
    
    return matches

def is_palindrome(s):
    """
    Check if string is palindrome (ignoring case and non-alphanumeric)
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

### Tree Algorithm Theory

#### Tree Fundamentals
A tree is a hierarchical data structure with the following properties:
- **Acyclic**: No cycles exist
- **Connected**: Path exists between any two nodes
- **Rooted**: Has a designated root node
- **Recursive structure**: Each subtree is also a tree

#### Tree Terminology
- **Node**: Basic unit containing data
- **Edge**: Connection between nodes
- **Root**: Top node with no parent
- **Leaf**: Node with no children
- **Height**: Length of longest path from root to leaf
- **Depth**: Length of path from root to specific node
- **Level**: All nodes at same depth

#### Tree Traversal Theory
Tree traversal is the process of visiting each node exactly once in a systematic way.

**Depth-First Search (DFS)**:
- **Concept**: Explore as far as possible before backtracking
- **Implementation**: Uses stack (explicitly or recursion)
- **Space complexity**: O(h) where h is height of tree

**Breadth-First Search (BFS)**:
- **Concept**: Explore all nodes at current level before moving to next level
- **Implementation**: Uses queue
- **Space complexity**: O(w) where w is maximum width of tree

#### Binary Tree Properties
- **Complete**: All levels filled except possibly last (filled left to right)
- **Perfect**: All internal nodes have two children, all leaves at same level
- **Balanced**: Height difference between left and right subtrees ≤ 1

### Tree Algorithms

#### Binary Tree Traversal Theory
**Inorder (Left-Root-Right)**:
- **Binary Search Trees**: Produces sorted order
- **Expression trees**: Produces infix notation
- **Use case**: When order matters

**Preorder (Root-Left-Right)**:
- **Tree copying**: Root processed first
- **Expression trees**: Produces prefix notation
- **Use case**: When you need to process root before children

**Postorder (Left-Right-Root)**:
- **Tree deletion**: Children deleted before parent
- **Expression trees**: Produces postfix notation
- **Use case**: When you need to process children before root

**Level-order (BFS)**:
- **Tree printing**: Print tree level by level
- **Finding shortest path**: In unweighted trees
- **Use case**: When you need to process nodes level by level

#### Binary Tree Traversals
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    """
    Left -> Root -> Right
    Time: O(n), Space: O(h) where h is height
    """
    result = []
    
    def inorder(node):
        if node:
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
    
    inorder(root)
    return result

def preorder_traversal(root):
    """
    Root -> Left -> Right
    Time: O(n), Space: O(h)
    """
    result = []
    
    def preorder(node):
        if node:
            result.append(node.val)
            preorder(node.left)
            preorder(node.right)
    
    preorder(root)
    return result

def postorder_traversal(root):
    """
    Left -> Right -> Root
    Time: O(n), Space: O(h)
    """
    result = []
    
    def postorder(node):
        if node:
            postorder(node.left)
            postorder(node.right)
            result.append(node.val)
    
    postorder(root)
    return result

def level_order_traversal(root):
    """
    Breadth-first traversal
    Time: O(n), Space: O(w) where w is maximum width
    """
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        level_values = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            level_values.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_values)
    
    return result
```

---

## Advanced Algorithms

## Advanced Algorithms

### Dynamic Programming Theory

#### What is Dynamic Programming?
Dynamic Programming (DP) is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems and storing the results to avoid redundant calculations.

#### Fundamental Principles

**1. Optimal Substructure**:
- **Definition**: Optimal solution contains optimal solutions to subproblems
- **Example**: Shortest path from A to C through B = shortest path A→B + shortest path B→C
- **How to identify**: Check if optimal solution can be constructed from optimal solutions of subproblems

**2. Overlapping Subproblems**:
- **Definition**: Same subproblems are solved multiple times
- **Example**: Fibonacci F(n) = F(n-1) + F(n-2), F(n-1) and F(n-2) both compute F(n-3)
- **Solution**: Store results to avoid recomputation

#### DP vs Divide and Conquer
- **Divide and Conquer**: Subproblems are independent (merge sort, quick sort)
- **Dynamic Programming**: Subproblems overlap (fibonacci, knapsack)

#### Types of Dynamic Programming

**1. Memoization (Top-down)**:
- **Concept**: Start with original problem, recursively solve subproblems
- **Implementation**: Add caching to recursive solution
- **Advantages**: Only solves needed subproblems
- **Disadvantages**: Function call overhead

**2. Tabulation (Bottom-up)**:
- **Concept**: Start with smallest subproblems, build up to original problem
- **Implementation**: Fill table iteratively
- **Advantages**: No function call overhead, better space optimization
- **Disadvantages**: May solve unnecessary subproblems

#### DP Problem Identification
Look for these characteristics:
1. **Counting problems**: "How many ways..."
2. **Optimization problems**: "Find minimum/maximum..."
3. **Decision problems**: "Is it possible..."
4. **Recursive nature**: Problem can be broken into subproblems

### Dynamic Programming

#### DP Design Process
1. **Identify subproblems**: What smaller problems do we need to solve?
2. **Define state**: What parameters completely describe a subproblem?
3. **Write recurrence relation**: How do subproblems relate to each other?
4. **Determine base cases**: What are the simplest cases?
5. **Implement**: Choose memoization or tabulation

#### Mathematical Foundation
**Bellman's Principle of Optimality**: 
"An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision."

#### Basic DP Concepts
```python
def fibonacci_dp(n):
    """
    Fibonacci using dynamic programming
    Time: O(n), Space: O(n)
    """
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

def fibonacci_optimized(n):
    """
    Space-optimized fibonacci
    Time: O(n), Space: O(1)
    """
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1
```

#### Classic DP Problems Theory

**Coin Change Problem**:
- **Type**: Optimization problem (minimum coins)
- **State**: dp[i] = minimum coins needed to make amount i
- **Recurrence**: dp[i] = min(dp[i], dp[i-coin] + 1) for each coin
- **Base case**: dp[0] = 0 (zero coins needed for amount 0)
- **Time**: O(amount × number of coins)

**Longest Common Subsequence (LCS)**:
- **Type**: Optimization problem (maximum length)
- **State**: dp[i][j] = LCS length of first i characters of string1 and first j characters of string2
- **Recurrence**: 
  - If characters match: dp[i][j] = dp[i-1][j-1] + 1
  - If they don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
- **Base case**: dp[0][j] = dp[i][0] = 0
- **Time**: O(m × n) where m, n are string lengths

**0/1 Knapsack Problem**:
- **Type**: Optimization problem (maximum value)
- **State**: dp[i][w] = maximum value using first i items with weight limit w
- **Recurrence**: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
- **Base case**: dp[0][w] = 0 for all w
- **Time**: O(n × capacity)
```python
def coin_change(coins, amount):
    """
    Minimum coins needed to make amount
    Time: O(amount * len(coins)), Space: O(amount)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

def longest_common_subsequence(text1, text2):
    """
    Length of longest common subsequence
    Time: O(m * n), Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]

def knapsack_01(weights, values, capacity):
    """
    0/1 Knapsack problem
    Time: O(n * capacity), Space: O(n * capacity)
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]
    
    return dp[n][capacity]
```

### Graph Algorithm Theory

#### Graph Fundamentals
A graph G = (V, E) consists of:
- **V**: Set of vertices (nodes)
- **E**: Set of edges (connections between vertices)

#### Graph Types
**By Direction**:
- **Undirected**: Edges have no direction (friendship network)
- **Directed**: Edges have direction (web page links)

**By Weights**:
- **Unweighted**: All edges have equal weight
- **Weighted**: Edges have associated weights/costs

**By Connectivity**:
- **Connected**: Path exists between any two vertices
- **Disconnected**: Some vertices are unreachable from others

#### Graph Representation Trade-offs
**Adjacency List**:
- **Space**: O(V + E) - efficient for sparse graphs
- **Edge lookup**: O(degree of vertex)
- **Adding edge**: O(1)
- **Best for**: Sparse graphs, traversal algorithms

**Adjacency Matrix**:
- **Space**: O(V²) - less efficient for sparse graphs
- **Edge lookup**: O(1)
- **Adding edge**: O(1)
- **Best for**: Dense graphs, frequent edge queries

#### Graph Algorithms Applications
- **Social networks**: Finding connections, influence
- **Transportation**: Shortest paths, route optimization
- **Computer networks**: Routing, topology
- **Dependency resolution**: Build systems, task scheduling

### Graph Algorithms

#### Graph Traversal Theory
**Depth-First Search (DFS)**:
- **Concept**: Explore as far as possible before backtracking
- **Properties**:
  - Discovers vertices in depth-first order
  - Produces DFS tree/forest
  - Can detect cycles
  - Finds connected components

**Applications**:
- **Topological sorting**: Ordering tasks with dependencies
- **Cycle detection**: Finding circular dependencies
- **Connected components**: Finding isolated groups
- **Path finding**: Finding if path exists

**Time Complexity**: O(V + E) - visit each vertex and edge once
**Space Complexity**: O(V) - for visited set and recursion stack

**Breadth-First Search (BFS)**:
- **Concept**: Explore all neighbors before moving to next level
- **Properties**:
  - Discovers vertices in breadth-first order
  - Finds shortest path in unweighted graphs
  - Produces BFS tree

**Applications**:
- **Shortest path**: In unweighted graphs
- **Level-order traversal**: Processing nodes level by level
- **Bipartite checking**: Determining if graph is bipartite

**Time Complexity**: O(V + E)
**Space Complexity**: O(V) - for queue and visited set

#### Graph Traversal Comparison
| Algorithm | Data Structure | Space | Best for |
|-----------|---------------|-------|----------|
| DFS | Stack (recursion) | O(V) | Cycle detection, topological sort |
| BFS | Queue | O(V) | Shortest path, level processing |

#### Graph Representation
```python
class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        if v not in self.graph:
            self.graph[v] = []
        self.graph[u].append(v)
        self.graph[v].append(u)  # For undirected graph

# Adjacency Matrix
def create_adjacency_matrix(n, edges):
    matrix = [[0] * n for _ in range(n)]
    for u, v in edges:
        matrix[u][v] = 1
        matrix[v][u] = 1  # For undirected graph
    return matrix
```

#### Graph Traversal
```python
def dfs_recursive(graph, start, visited=None):
    """
    Depth-First Search (recursive)
    Time: O(V + E), Space: O(V)
    """
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start, end=' ')
    
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)

def dfs_iterative(graph, start):
    """
    Depth-First Search (iterative)
    Time: O(V + E), Space: O(V)
    """
    visited = set()
    stack = [start]
    
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            print(vertex, end=' ')
            
            # Add neighbors to stack
            for neighbor in graph.get(vertex, []):
                if neighbor not in visited:
                    stack.append(neighbor)

def bfs(graph, start):
    """
    Breadth-First Search
    Time: O(V + E), Space: O(V)
    """
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        vertex = queue.pop(0)
        print(vertex, end=' ')
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

---

## Problem-Solving Strategies

### Algorithmic Problem-Solving Framework

#### The Scientific Method for Algorithms
1. **Understand**: What exactly is the problem asking?
2. **Explore**: What are the constraints and edge cases?
3. **Hypothesize**: What approach might work?
4. **Plan**: Design the algorithm step by step
5. **Implement**: Code the solution
6. **Test**: Verify correctness with examples
7. **Optimize**: Improve time/space complexity if needed

#### Problem Analysis Techniques

**Input Analysis**:
- **Size**: How large can the input be?
- **Range**: What are the possible values?
- **Structure**: Is the input sorted, unique, etc.?
- **Constraints**: What limitations exist?

**Output Analysis**:
- **Format**: What should the output look like?
- **Multiple solutions**: Are there multiple valid answers?
- **Optimization**: Are we minimizing or maximizing something?

**Complexity Analysis**:
- **Time constraints**: How fast must the solution be?
- **Space constraints**: How much memory can we use?
- **Scalability**: Will the solution work for large inputs?

### Pattern Recognition in Problem Solving

#### When to Use Each Pattern
**Two Pointers**:
- Array/string problems
- Finding pairs with specific sum
- Palindrome checking
- Merging sorted arrays

**Sliding Window**:
- Subarray/substring problems
- Finding maximum/minimum in window
- Pattern matching
- Optimization over contiguous elements

**Backtracking**:
- Finding all possible solutions
- Constraint satisfaction
- Combinatorial problems
- Tree/graph traversal with conditions

**Dynamic Programming**:
- Optimization problems
- Counting problems
- Problems with overlapping subproblems
- Decision problems

### Common Patterns

#### Pattern Identification Guide
| Problem Type | Common Patterns | Key Indicators |
|-------------|----------------|----------------|
| Array/String | Two Pointers, Sliding Window | Sorted input, pairs, subarrays |
| Tree/Graph | DFS, BFS, Backtracking | Hierarchical data, paths, cycles |
| Optimization | Dynamic Programming, Greedy | "Maximum", "minimum", "optimal" |
| Counting | Dynamic Programming, Recursion | "How many ways", combinations |
| Search | Binary Search, DFS, BFS | Sorted data, finding elements |

#### Problem-Solving Heuristics
1. **Start simple**: Solve brute force first, then optimize
2. **Draw examples**: Visualize the problem
3. **Find patterns**: Look for recurring subproblems
4. **Consider edge cases**: Empty input, single element, etc.
5. **Think backwards**: Sometimes easier to work from result to input
6. **Use invariants**: What properties are always true?

#### 1. Two Pointers Pattern Theory
**Mathematical Foundation**:
- Reduces search space from O(n²) to O(n)
- Works when we can eliminate possibilities based on comparison
- Maintains invariant that answer lies within current window

**Problem Characteristics**:
- Array/string is sorted (or can be sorted)
- Looking for pairs/triplets with specific property
- Need to process elements from both ends
- Optimization problem with monotonic property
```python
def container_with_most_water(height):
    """
    Find two lines that form container with most water
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area
```

#### 2. Sliding Window Pattern Theory
**Mathematical Foundation**:
- Avoids redundant calculations by reusing previous computations
- Maintains window invariant throughout the process
- Amortized time complexity: each element added and removed at most once

**Problem Characteristics**:
- Contiguous subarray/substring problems
- Fixed or variable window size
- Optimization over all possible windows
- Pattern matching with constraints

**Window Types**:
- **Fixed size**: Window size remains constant
- **Variable size**: Window expands/contracts based on conditions
- **Growing window**: Window only expands
- **Shrinking window**: Window only contracts

#### 2. Sliding Window
```python
def min_window_substring(s, t):
    """
    Minimum window substring containing all characters of t
    Time: O(|s| + |t|), Space: O(|s| + |t|)
    """
    if not s or not t:
        return ""
    
    dict_t = {}
    for char in t:
        dict_t[char] = dict_t.get(char, 0) + 1
    
    required = len(dict_t)
    left, right = 0, 0
    formed = 0
    window_counts = {}
    
    ans = float("inf"), None, None
    
    while right < len(s):
        character = s[right]
        window_counts[character] = window_counts.get(character, 0) + 1
        
        if character in dict_t and window_counts[character] == dict_t[character]:
            formed += 1
        
        while left <= right and formed == required:
            character = s[left]
            
            if right - left + 1 < ans[0]:
                ans = (right - left + 1, left, right)
            
            window_counts[character] -= 1
            if character in dict_t and window_counts[character] < dict_t[character]:
                formed -= 1
            
            left += 1
        
        right += 1
    
    return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]
```

#### 3. Backtracking Pattern Theory
**Mathematical Foundation**:
- Systematic exploration of solution space
- Pruning: Eliminate branches that cannot lead to solution
- Time complexity often exponential but much better than brute force

**Problem Characteristics**:
- Finding all possible solutions
- Constraint satisfaction problems
- Combinatorial optimization
- Tree/graph traversal with conditions

**Backtracking Template**:
```
def backtrack(path, choices):
    if goal_reached(path):
        result.append(path.copy())
        return
    
    for choice in choices:
        if is_valid(choice):
            path.append(choice)  # Choose
            backtrack(path, new_choices)  # Explore
            path.pop()  # Unchoose (backtrack)
```

**Key Concepts**:
- **State space tree**: Tree representing all possible states
- **Pruning**: Cutting off branches that can't lead to solution
- **Constraint propagation**: Using constraints to reduce search space

#### 3. Backtracking
```python
def generate_parentheses(n):
    """
    Generate all valid combinations of n pairs of parentheses
    Time: O(4^n / √n), Space: O(4^n / √n)
    """
    result = []
    
    def backtrack(current_string, open_count, close_count):
        if len(current_string) == 2 * n:
            result.append(current_string)
            return
        
        if open_count < n:
            backtrack(current_string + "(", open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current_string + ")", open_count, close_count + 1)
    
    backtrack("", 0, 0)
    return result

def solve_n_queens(n):
    """
    Solve N-Queens problem
    Time: O(N!), Space: O(N²)
    """
    def is_safe(board, row, col):
        # Check column
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        
        # Check diagonal
        for i, j in zip(range(row - 1, -1, -1), range(col - 1, -1, -1)):
            if board[i][j] == 'Q':
                return False
        
        # Check anti-diagonal
        for i, j in zip(range(row - 1, -1, -1), range(col + 1, n)):
            if board[i][j] == 'Q':
                return False
        
        return True
    
    def solve(board, row):
        if row == n:
            return [[''.join(row) for row in board]]
        
        solutions = []
        for col in range(n):
            if is_safe(board, row, col):
                board[row][col] = 'Q'
                solutions.extend(solve(board, row + 1))
                board[row][col] = '.'
        
        return solutions
    
    board = [['.' for _ in range(n)] for _ in range(n)]
    return solve(board, 0)
```

---

## Interview Preparation

### Technical Interview Theory

#### What Are Technical Interviews?
Technical interviews assess a candidate's:
- **Problem-solving skills**: Ability to break down complex problems
- **Algorithmic thinking**: Understanding of fundamental algorithms and data structures
- **Code quality**: Writing clean, readable, and efficient code
- **Communication**: Explaining thought process and approach
- **Debugging skills**: Identifying and fixing issues in code

#### Types of Technical Interviews
1. **Coding interviews**: Solve algorithmic problems
2. **System design**: Design large-scale systems
3. **Behavioral**: Past experience and teamwork
4. **Domain-specific**: Role-specific technical knowledge

#### Interview Evaluation Criteria
**Problem-solving approach** (30%):
- Understanding the problem
- Asking clarifying questions
- Considering edge cases
- Systematic approach to solution

**Technical knowledge** (25%):
- Algorithm and data structure understanding
- Time and space complexity analysis
- Best practices and code quality

**Communication** (25%):
- Explaining thought process
- Asking relevant questions
- Handling feedback and hints

**Implementation** (20%):
- Correct and working code
- Handling edge cases
- Code organization and style

#### Common Interview Problem Categories
1. **Array/String manipulation** (35%): Two pointers, sliding window
2. **Tree/Graph traversal** (25%): DFS, BFS, tree algorithms
3. **Dynamic programming** (15%): Optimization, counting problems
4. **Sorting/Searching** (10%): Binary search, custom sorting
5. **Math/Logic** (10%): Number theory, bit manipulation
6. **Design** (5%): Data structure design, system design

### Interview Strategy

#### The UMPIRE Method
**U**nderstand: Clarify the problem
**M**atch: Identify similar problems/patterns
**P**lan: Design the algorithm
**I**mplement: Write the code
**R**eview: Test and debug
**E**valuate: Analyze complexity and optimize

#### Time Management
- **Understanding** (2-3 minutes): Clarify requirements
- **Planning** (3-5 minutes): Design approach
- **Implementation** (15-20 minutes): Write code
- **Testing** (5-10 minutes): Verify solution
- **Optimization** (5-10 minutes): Improve if needed

### Common Interview Questions

#### Arrays and Strings
```python
def rotate_array(nums, k):
    """
    Rotate array to the right by k steps
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    k = k % n
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)

def group_anagrams(strs):
    """
    Group strings that are anagrams
    Time: O(N * K log K), Space: O(N * K)
    """
    groups = {}
    for s in strs:
        sorted_s = ''.join(sorted(s))
        if sorted_s not in groups:
            groups[sorted_s] = []
        groups[sorted_s].append(s)
    
    return list(groups.values())
```

#### Linked Lists
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    """
    Reverse a linked list
    Time: O(n), Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

def detect_cycle(head):
    """
    Detect cycle in linked list (Floyd's algorithm)
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None
    
    slow = fast = head
    
    # Detect if cycle exists
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    
    # Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Interview Tips

#### Before the Interview
1. **Practice coding by hand** - Some interviews use whiteboards
2. **Know time/space complexity** of common algorithms
3. **Practice explaining your thought process** out loud
4. **Review system design basics** for senior positions

#### During the Interview
1. **Ask clarifying questions** before coding
2. **Start with brute force** then optimize
3. **Think out loud** - explain your reasoning
4. **Test your solution** with examples
5. **Consider edge cases** (empty input, single element, etc.)

#### Common Mistakes to Avoid
1. Jumping into coding without understanding the problem
2. Not considering edge cases
3. Writing code without explaining the approach
4. Not testing the solution
5. Getting stuck on optimization without a working solution first

---

## Practice Problems

### Easy Problems
1. **Two Sum** - Find two numbers that add to target
2. **Valid Palindrome** - Check if string is palindrome
3. **Maximum Subarray** - Find contiguous subarray with largest sum
4. **Merge Two Sorted Lists** - Merge two sorted linked lists
5. **Binary Tree Inorder Traversal** - Traverse tree inorder

### Medium Problems
1. **3Sum** - Find three numbers that sum to zero
2. **Longest Substring Without Repeating Characters**
3. **Add Two Numbers** - Add numbers represented as linked lists
4. **Group Anagrams** - Group strings that are anagrams
5. **Product of Array Except Self** - Calculate product excluding current element

### Hard Problems
1. **Median of Two Sorted Arrays** - Find median efficiently
2. **Trapping Rain Water** - Calculate trapped rainwater
3. **Merge k Sorted Lists** - Merge k sorted linked lists
4. **Word Ladder** - Transform one word to another
5. **Sliding Window Maximum** - Maximum in all windows of size k

### Problem-Solving Practice Plan
```python
def create_practice_schedule():
    """
    30-day algorithm practice plan
    """
    schedule = {
        "Week 1": [
            "Array basics and two pointers",
            "String manipulation",
            "Basic sorting and searching",
            "Hash tables and sets",
            "Stack and queue fundamentals"
        ],
        "Week 2": [
            "Linked list operations",
            "Binary tree traversals",
            "Basic dynamic programming",
            "Graph traversal (DFS/BFS)",
            "Sliding window technique"
        ],
        "Week 3": [
            "Advanced tree problems",
            "Heap and priority queue",
            "Advanced dynamic programming",
            "Backtracking problems",
            "Greedy algorithms"
        ],
        "Week 4": [
            "Advanced graph algorithms",
            "Trie data structure",
            "Bit manipulation",
            "Mock interviews",
            "Review and practice weak areas"
        ]
    }
    return schedule
```

---

## Conclusion

Mastering algorithms and problem-solving is a journey that requires consistent practice and patience. Focus on understanding the underlying patterns and principles rather than memorizing solutions. Regular practice with diverse problems will build your intuition and prepare you for technical interviews and real-world programming challenges.

### Key Takeaways
1. **Understand time and space complexity** - Essential for optimization
2. **Learn common patterns** - Two pointers, sliding window, backtracking, etc.
3. **Practice regularly** - Consistency beats intensity
4. **Explain your thinking** - Communication is as important as coding
5. **Start simple, then optimize** - Get a working solution first

### Advanced Theoretical Concepts

#### Amortized Analysis
**Definition**: Average time per operation over a sequence of operations
**Techniques**:
- **Aggregate method**: Total cost divided by number of operations
- **Accounting method**: Assign different costs to operations
- **Potential method**: Use potential function to represent stored energy

**Example**: Dynamic array resizing
- Individual insert: O(n) in worst case
- Amortized insert: O(1) over sequence of operations

#### Complexity Classes
**P**: Problems solvable in polynomial time
**NP**: Problems verifiable in polynomial time
**NP-Complete**: Hardest problems in NP
**NP-Hard**: At least as hard as NP-Complete problems

**Examples**:
- **P**: Sorting, shortest path, binary search
- **NP**: Boolean satisfiability, traveling salesman
- **NP-Complete**: 3-SAT, knapsack, graph coloring

#### Approximation Algorithms
When optimal solutions are too expensive:
- **Approximation ratio**: How close to optimal
- **PTAS**: Polynomial-time approximation scheme
- **Examples**: 2-approximation for vertex cover

#### Randomized Algorithms
Use randomness to make decisions:
- **Monte Carlo**: May give wrong answer with small probability
- **Las Vegas**: Always correct, running time is random
- **Examples**: Quicksort (randomized pivot), hash tables

### Mathematical Foundations

#### Recurrence Relations
**Master Theorem**: For T(n) = aT(n/b) + f(n)
- **Case 1**: If f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^log_b(a))
- **Case 2**: If f(n) = Θ(n^log_b(a)), then T(n) = Θ(n^log_b(a) × log n)
- **Case 3**: If f(n) = Ω(n^(log_b(a) + ε)), then T(n) = Θ(f(n))

**Common Recurrences**:
- T(n) = 2T(n/2) + O(n) → T(n) = O(n log n) [Merge sort]
- T(n) = T(n-1) + O(1) → T(n) = O(n) [Linear search]
- T(n) = 2T(n-1) + O(1) → T(n) = O(2^n) [Naive fibonacci]

#### Proof Techniques
**Induction**: Prove for base case and inductive step
**Contradiction**: Assume opposite and derive contradiction
**Loop invariants**: Property that holds before, during, and after loop
**Exchange argument**: Used in greedy algorithm proofs

### Next Steps
1. Pick a consistent practice schedule
2. Join coding communities and discussions
3. Participate in coding contests
4. Review and learn from others' solutions
5. Build projects that apply these concepts

Remember: Every expert was once a beginner. Keep practicing and stay curious!
