# 🗄️ Caching in System Design

## Overview

Caching is one of the most fundamental techniques in system design for improving performance, reducing latency, and decreasing load on backend systems. A cache is a high-speed storage layer that stores frequently accessed data in memory, allowing applications to retrieve information much faster than fetching it from the original data source.

Effective caching strategies can dramatically improve system performance, user experience, and resource utilization. This comprehensive guide covers the essential caching concepts, strategies, and technologies used in modern system design.

## Table of Contents

1. [Caching Strategies](#caching-strategies)
2. [Cache Eviction Policies](#cache-eviction-policies)
3. [Redis and Memcached](#redis-and-memcached)
4. [CDN Caching](#cdn-caching)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#common-pitfalls)

---

## Caching Strategies

### Write-Through Cache

**Write-Through** is a caching strategy where data is written to both the cache and the backing store simultaneously.

#### How It Works:
1. **Write Operation**: Data is written to the cache first
2. **Immediate Write**: The same data is immediately written to the persistent storage
3. **Confirmation**: Operation completes only after both writes succeed

#### Advantages:
- **Data Consistency**: Cache and database are always in sync
- **Data Reliability**: No risk of data loss since data is immediately persisted
- **Read Performance**: Subsequent reads are served from fast cache
- **Fault Tolerance**: If cache fails, data is still available in persistent storage

#### Disadvantages:
- **Write Latency**: Higher write latency due to dual writes
- **Write Throughput**: Lower write performance compared to write-back
- **Resource Usage**: Requires both cache and database writes for every operation

#### Use Cases:
- **Financial Systems**: Where data consistency is critical
- **User Profiles**: Where data integrity is important
- **Configuration Data**: Where consistency across reads is essential

#### Implementation Example:
```python
class WriteThroughCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def write(self, key, value):
        # Write to cache first
        self.cache.set(key, value)
        
        # Immediately write to database
        self.database.save(key, value)
        
        return True
    
    def read(self, key):
        # Try cache first
        value = self.cache.get(key)
        if value is not None:
            return value
        
        # Fallback to database
        value = self.database.get(key)
        if value is not None:
            self.cache.set(key, value)
        
        return value
```

### Write-Around Cache

**Write-Around** is a caching strategy where data is written directly to the backing store, bypassing the cache.

#### How It Works:
1. **Write Operation**: Data is written directly to persistent storage
2. **Cache Bypass**: Cache is not updated during write operations
3. **Lazy Loading**: Data is loaded into cache only when read

#### Advantages:
- **Write Performance**: Faster writes since cache is bypassed
- **Cache Efficiency**: Prevents cache pollution from infrequently accessed data
- **Simple Implementation**: Straightforward to implement and understand
- **Resource Efficiency**: Saves cache space for frequently read data

#### Disadvantages:
- **Read Latency**: First read after write incurs database lookup
- **Cache Miss**: Recently written data may not be in cache
- **Inconsistent Performance**: Variable read performance depending on cache state

#### Use Cases:
- **Logging Systems**: Where data is written frequently but rarely read
- **Audit Trails**: Where historical data is accessed infrequently
- **Batch Processing**: Where data is written in bulk but accessed selectively

#### Implementation Example:
```python
class WriteAroundCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def write(self, key, value):
        # Write directly to database, bypass cache
        self.database.save(key, value)
        
        # Optionally invalidate cache entry
        self.cache.delete(key)
        
        return True
    
    def read(self, key):
        # Try cache first
        value = self.cache.get(key)
        if value is not None:
            return value
        
        # Load from database and cache
        value = self.database.get(key)
        if value is not None:
            self.cache.set(key, value)
        
        return value
```

### Write-Back Cache (Write-Behind)

**Write-Back** is a caching strategy where data is written to the cache immediately, but the write to the backing store is deferred.

#### How It Works:
1. **Write Operation**: Data is written to cache immediately
2. **Deferred Write**: Write to persistent storage is scheduled for later
3. **Batch Processing**: Multiple writes may be batched together
4. **Asynchronous Sync**: Cache and database are synchronized asynchronously

#### Advantages:
- **Write Performance**: Extremely fast writes since only cache is updated
- **Write Throughput**: High write throughput for burst workloads
- **Batch Efficiency**: Can batch multiple writes for better database performance
- **Reduced Load**: Reduces immediate load on backend database

#### Disadvantages:
- **Data Loss Risk**: Risk of data loss if cache fails before sync
- **Complexity**: More complex implementation and error handling
- **Consistency Issues**: Temporary inconsistency between cache and database
- **Recovery Complexity**: Difficult to recover from cache failures

#### Use Cases:
- **Gaming Applications**: Where high-frequency updates are common
- **Real-time Analytics**: Where immediate write performance is critical
- **Session Management**: Where temporary data can tolerate some risk

#### Implementation Example:
```python
import asyncio
from collections import defaultdict

class WriteBackCache:
    def __init__(self, cache, database, sync_interval=5):
        self.cache = cache
        self.database = database
        self.dirty_keys = set()
        self.sync_interval = sync_interval
        self.start_sync_task()
    
    def write(self, key, value):
        # Write to cache immediately
        self.cache.set(key, value)
        
        # Mark as dirty for later sync
        self.dirty_keys.add(key)
        
        return True
    
    def read(self, key):
        # Always read from cache first
        value = self.cache.get(key)
        if value is not None:
            return value
        
        # Load from database if not in cache
        value = self.database.get(key)
        if value is not None:
            self.cache.set(key, value)
        
        return value
    
    async def sync_to_database(self):
        while True:
            await asyncio.sleep(self.sync_interval)
            
            # Get dirty keys to sync
            keys_to_sync = list(self.dirty_keys)
            self.dirty_keys.clear()
            
            # Sync to database
            for key in keys_to_sync:
                value = self.cache.get(key)
                if value is not None:
                    self.database.save(key, value)
    
    def start_sync_task(self):
        asyncio.create_task(self.sync_to_database())
```

### Caching Strategy Comparison

| Strategy | Write Performance | Read Performance | Consistency | Complexity | Data Safety |
|----------|------------------|------------------|-------------|------------|-------------|
| **Write-Through** | Slow | Fast | Strong | Low | High |
| **Write-Around** | Fast | Variable | Eventual | Low | High |
| **Write-Back** | Very Fast | Fast | Eventual | High | Medium |

---

## Cache Eviction Policies

Cache eviction policies determine which data should be removed from the cache when it reaches capacity. The choice of eviction policy significantly impacts cache performance and hit rates.

### Least Recently Used (LRU)

**LRU** evicts the least recently accessed items first, based on the principle that recently accessed data is more likely to be accessed again.

#### How It Works:
1. **Access Tracking**: Maintains access timestamps or access order
2. **Eviction Decision**: Removes items that haven't been accessed for the longest time
3. **Update on Access**: Updates access information on every read/write

#### Advantages:
- **Temporal Locality**: Works well for data with temporal access patterns
- **Intuitive**: Mirrors human intuition about data usage
- **Balanced**: Good general-purpose eviction policy
- **Widely Supported**: Available in most caching systems

#### Disadvantages:
- **Overhead**: Requires tracking access times or maintaining access order
- **Sequential Access**: Poor performance for sequential scans
- **Memory Usage**: Additional memory for tracking access information

#### Implementation Example:
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key in self.cache:
            # Move to end (most recently used)
            self.cache.move_to_end(key)
            return self.cache[key]
        return None
    
    def set(self, key, value):
        if key in self.cache:
            # Update existing key
            self.cache[key] = value
            self.cache.move_to_end(key)
        else:
            # Add new key
            if len(self.cache) >= self.capacity:
                # Remove least recently used (first item)
                self.cache.popitem(last=False)
            self.cache[key] = value
```

### Least Frequently Used (LFU)

**LFU** evicts the least frequently accessed items first, based on the principle that frequently accessed data is more likely to be accessed again.

#### How It Works:
1. **Frequency Tracking**: Maintains access frequency counters
2. **Eviction Decision**: Removes items with lowest access frequency
3. **Counter Updates**: Increments frequency on every access

#### Advantages:
- **Frequency-Based**: Excellent for data with clear access frequency patterns
- **Long-term Optimization**: Optimizes for long-term access patterns
- **Stable**: Less sensitive to temporary access spikes
- **Efficient for Skewed Data**: Works well with highly skewed access patterns

#### Disadvantages:
- **Aging Problem**: Old frequent items may never be evicted
- **Cold Start**: New items are disadvantaged
- **Complex Implementation**: More complex than LRU
- **Memory Overhead**: Requires frequency counters

#### Implementation Example:
```python
from collections import defaultdict, Counter

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.frequencies = defaultdict(int)
        self.min_frequency = 0
        self.frequency_groups = defaultdict(set)
    
    def get(self, key):
        if key not in self.cache:
            return None
        
        # Update frequency
        self._update_frequency(key)
        return self.cache[key]
    
    def set(self, key, value):
        if self.capacity <= 0:
            return
        
        if key in self.cache:
            # Update existing key
            self.cache[key] = value
            self._update_frequency(key)
        else:
            # Add new key
            if len(self.cache) >= self.capacity:
                self._evict_lfu()
            
            self.cache[key] = value
            self.frequencies[key] = 1
            self.frequency_groups[1].add(key)
            self.min_frequency = 1
    
    def _update_frequency(self, key):
        old_freq = self.frequencies[key]
        new_freq = old_freq + 1
        
        # Remove from old frequency group
        self.frequency_groups[old_freq].remove(key)
        
        # Update frequency
        self.frequencies[key] = new_freq
        self.frequency_groups[new_freq].add(key)
        
        # Update min frequency if necessary
        if old_freq == self.min_frequency and not self.frequency_groups[old_freq]:
            self.min_frequency += 1
    
    def _evict_lfu(self):
        # Remove any key from the minimum frequency group
        key_to_remove = self.frequency_groups[self.min_frequency].pop()
        
        # Clean up
        del self.cache[key_to_remove]
        del self.frequencies[key_to_remove]
```

### First In, First Out (FIFO)

**FIFO** evicts the oldest items first, regardless of access patterns, following a simple queue-like behavior.

#### How It Works:
1. **Insertion Order**: Tracks the order in which items were inserted
2. **Eviction Decision**: Removes the oldest inserted item
3. **Simple Queue**: Behaves like a queue data structure

#### Advantages:
- **Simple Implementation**: Easy to implement and understand
- **Low Overhead**: Minimal memory overhead for tracking
- **Predictable**: Deterministic eviction behavior
- **Fair**: Treats all items equally regardless of access patterns

#### Disadvantages:
- **Ignores Access Patterns**: Doesn't consider how frequently items are accessed
- **Poor Performance**: Generally poor cache hit rates
- **No Locality**: Doesn't exploit temporal or spatial locality
- **Limited Use Cases**: Suitable only for specific scenarios

#### Implementation Example:
```python
from collections import deque

class FIFOCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.order = deque()
    
    def get(self, key):
        return self.cache.get(key)
    
    def set(self, key, value):
        if key in self.cache:
            # Update existing key (don't change order)
            self.cache[key] = value
        else:
            # Add new key
            if len(self.cache) >= self.capacity:
                # Remove oldest item
                oldest_key = self.order.popleft()
                del self.cache[oldest_key]
            
            self.cache[key] = value
            self.order.append(key)
```

### Other Eviction Policies

#### Random Replacement
- **Approach**: Randomly selects items for eviction
- **Advantages**: Simple implementation, low overhead
- **Disadvantages**: Unpredictable performance, no optimization

#### Time-To-Live (TTL)
- **Approach**: Evicts items after a specified time period
- **Advantages**: Prevents stale data, automatic cleanup
- **Disadvantages**: May evict frequently used items

#### Adaptive Replacement Cache (ARC)
- **Approach**: Combines LRU and LFU with adaptive behavior
- **Advantages**: Self-tuning, excellent performance
- **Disadvantages**: Complex implementation, patent restrictions

### Eviction Policy Comparison

| Policy | Implementation | Overhead | Performance | Use Case |
|--------|---------------|----------|-------------|----------|
| **LRU** | Medium | Medium | Good | General purpose |
| **LFU** | Complex | High | Excellent | Skewed access patterns |
| **FIFO** | Simple | Low | Poor | Simple scenarios |
| **Random** | Simple | Low | Unpredictable | Testing, simple systems |
| **TTL** | Medium | Medium | Good | Time-sensitive data |

---

## Redis and Memcached

Redis and Memcached are two of the most popular in-memory caching solutions, each with distinct characteristics and use cases.

### Redis

**Redis** (Remote Dictionary Server) is an in-memory data structure store that can be used as a cache, database, and message broker.

#### Key Features:
- **Rich Data Structures**: Strings, lists, sets, sorted sets, hashes, bitmaps
- **Persistence**: Optional disk persistence with RDB snapshots and AOF logging
- **Replication**: Master-slave replication for high availability
- **Clustering**: Built-in clustering support for horizontal scaling
- **Pub/Sub**: Built-in publish/subscribe messaging
- **Lua Scripting**: Support for server-side Lua scripts
- **Transactions**: Multi-command transactions with MULTI/EXEC

#### Data Structures:

##### Strings
```redis
# Basic string operations
SET user:1001 "John Doe"
GET user:1001
INCR page_views
INCRBY score 10
EXPIRE user:1001 3600  # TTL in seconds
```

##### Lists
```redis
# List operations (queues, stacks)
LPUSH tasks "task1" "task2"
RPOP tasks
LRANGE tasks 0 -1
LLEN tasks
```

##### Sets
```redis
# Set operations (unique items)
SADD users:online "user1" "user2"
SISMEMBER users:online "user1"
SCARD users:online
SUNION users:online users:premium
```

##### Sorted Sets
```redis
# Sorted set operations (leaderboards, rankings)
ZADD leaderboard 1500 "player1" 1200 "player2"
ZRANGE leaderboard 0 -1 WITHSCORES
ZRANK leaderboard "player1"
```

##### Hashes
```redis
# Hash operations (objects)
HSET user:1001 name "John" email "john@example.com"
HGET user:1001 name
HGETALL user:1001
HINCRBY user:1001 login_count 1
```

#### Redis Configuration Example:
```python
import redis
import json

class RedisCache:
    def __init__(self, host='localhost', port=6379, db=0):
        self.client = redis.Redis(
            host=host,
            port=port,
            db=db,
            decode_responses=True
        )
    
    def set(self, key, value, ttl=None):
        """Set a key-value pair with optional TTL"""
        serialized_value = json.dumps(value)
        if ttl:
            return self.client.setex(key, ttl, serialized_value)
        else:
            return self.client.set(key, serialized_value)
    
    def get(self, key):
        """Get a value by key"""
        value = self.client.get(key)
        if value:
            return json.loads(value)
        return None
    
    def delete(self, key):
        """Delete a key"""
        return self.client.delete(key)
    
    def increment(self, key, amount=1):
        """Increment a numeric value"""
        return self.client.incr(key, amount)
    
    def add_to_set(self, key, *values):
        """Add values to a set"""
        return self.client.sadd(key, *values)
    
    def get_set_members(self, key):
        """Get all members of a set"""
        return self.client.smembers(key)
    
    def add_to_sorted_set(self, key, mapping):
        """Add items to sorted set"""
        return self.client.zadd(key, mapping)
    
    def get_leaderboard(self, key, start=0, end=-1):
        """Get sorted set range with scores"""
        return self.client.zrange(key, start, end, withscores=True)
```

### Memcached

**Memcached** is a simple, high-performance, distributed memory caching system designed for speeding up dynamic web applications.

#### Key Features:
- **Simple Protocol**: Text-based protocol for easy integration
- **Distributed**: Built-in support for distributed caching
- **High Performance**: Optimized for simple key-value operations
- **Memory Efficient**: Efficient memory usage with slab allocation
- **Thread-Safe**: Multi-threaded architecture
- **LRU Eviction**: Built-in LRU eviction policy

#### Basic Operations:
```python
import memcache
import json

class MemcachedCache:
    def __init__(self, servers=['127.0.0.1:11211']):
        self.client = memcache.Client(servers)
    
    def set(self, key, value, ttl=0):
        """Set a key-value pair with optional TTL"""
        serialized_value = json.dumps(value)
        return self.client.set(key, serialized_value, time=ttl)
    
    def get(self, key):
        """Get a value by key"""
        value = self.client.get(key)
        if value:
            return json.loads(value)
        return None
    
    def delete(self, key):
        """Delete a key"""
        return self.client.delete(key)
    
    def increment(self, key, delta=1):
        """Increment a numeric value"""
        return self.client.incr(key, delta)
    
    def decrement(self, key, delta=1):
        """Decrement a numeric value"""
        return self.client.decr(key, delta)
    
    def get_multi(self, keys):
        """Get multiple values"""
        results = self.client.get_multi(keys)
        return {k: json.loads(v) if v else None for k, v in results.items()}
    
    def set_multi(self, mapping, ttl=0):
        """Set multiple key-value pairs"""
        serialized_mapping = {k: json.dumps(v) for k, v in mapping.items()}
        return self.client.set_multi(serialized_mapping, time=ttl)
```

### Redis vs Memcached Comparison

| Feature | Redis | Memcached |
|---------|--------|-----------|
| **Data Types** | Rich (strings, lists, sets, etc.) | Simple (strings only) |
| **Persistence** | Yes (RDB, AOF) | No |
| **Replication** | Yes (master-slave) | No (client-side) |
| **Clustering** | Yes (built-in) | No (client-side) |
| **Memory Usage** | Higher | Lower |
| **Performance** | Excellent | Excellent |
| **Scalability** | Vertical + Horizontal | Horizontal |
| **Use Cases** | Complex applications | Simple caching |

### When to Choose Redis vs Memcached

#### Choose Redis When:
- **Complex Data**: Need data structures beyond simple key-value
- **Persistence**: Need to persist cache data
- **Pub/Sub**: Need messaging capabilities
- **Atomic Operations**: Need transactions or atomic operations
- **Rich Features**: Need advanced features like scripting

#### Choose Memcached When:
- **Simple Caching**: Only need basic key-value caching
- **Memory Efficiency**: Need maximum memory efficiency
- **Horizontal Scaling**: Need simple horizontal scaling
- **High Throughput**: Need maximum throughput for simple operations
- **Simplicity**: Want simple, straightforward caching

---

## CDN Caching

**Content Delivery Network (CDN)** caching is a distributed caching strategy that stores content at geographically distributed edge servers to reduce latency and improve user experience.

### How CDN Caching Works

#### 1. Content Distribution
- **Origin Server**: Primary server containing original content
- **Edge Servers**: Geographically distributed servers that cache content
- **POP (Point of Presence)**: Locations where edge servers are deployed
- **Global Distribution**: Servers placed strategically worldwide

#### 2. Cache Workflow
1. **User Request**: User requests content from application
2. **Edge Server**: Request routed to nearest edge server
3. **Cache Check**: Edge server checks if content is cached
4. **Cache Hit**: If cached, content served directly from edge
5. **Cache Miss**: If not cached, content fetched from origin
6. **Cache Storage**: Content cached at edge server for future requests

### CDN Caching Strategies

#### Push CDN
- **Approach**: Content is proactively pushed to edge servers
- **Control**: Full control over what content is cached where
- **Use Case**: Static content, predictable access patterns
- **Advantages**: Guaranteed cache hits, predictable performance
- **Disadvantages**: Higher storage costs, complex management

#### Pull CDN
- **Approach**: Content is pulled to edge servers on-demand
- **Control**: Automatic based on user requests
- **Use Case**: Dynamic content, unpredictable access patterns
- **Advantages**: Efficient storage usage, automatic optimization
- **Disadvantages**: Initial cache misses, less predictable performance

### CDN Cache Configuration

#### Cache Headers
```http
# Control caching behavior
Cache-Control: public, max-age=3600, s-maxage=7200
Expires: Wed, 21 Oct 2025 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
Vary: Accept-Encoding, Accept-Language
```

#### Cache Directives
- **public**: Content can be cached by any cache
- **private**: Content can only be cached by browser
- **max-age**: Maximum time content is fresh (in seconds)
- **s-maxage**: Maximum time content is fresh for shared caches
- **no-cache**: Must revalidate with origin before serving
- **no-store**: Must not cache content at all

### CDN Implementation Example
```python
import requests
from datetime import datetime, timedelta

class CDNCache:
    def __init__(self, cdn_url, origin_url):
        self.cdn_url = cdn_url
        self.origin_url = origin_url
    
    def get_cached_content(self, path):
        """Get content from CDN or origin"""
        cdn_full_url = f"{self.cdn_url}/{path}"
        
        try:
            # Try CDN first
            response = requests.get(cdn_full_url, timeout=5)
            if response.status_code == 200:
                return {
                    'content': response.content,
                    'source': 'cdn',
                    'cache_hit': True
                }
        except requests.RequestException:
            pass
        
        # Fallback to origin
        origin_full_url = f"{self.origin_url}/{path}"
        response = requests.get(origin_full_url)
        
        if response.status_code == 200:
            return {
                'content': response.content,
                'source': 'origin',
                'cache_hit': False
            }
        
        return None
    
    def set_cache_headers(self, response, cache_duration=3600):
        """Set appropriate cache headers"""
        expires = datetime.utcnow() + timedelta(seconds=cache_duration)
        
        response.headers['Cache-Control'] = f'public, max-age={cache_duration}'
        response.headers['Expires'] = expires.strftime('%a, %d %b %Y %H:%M:%S GMT')
        response.headers['ETag'] = f'"{hash(response.content)}"'
        
        return response
```

### CDN Cache Optimization

#### Content Types and Caching
```python
# Different caching strategies for different content types
CACHE_STRATEGIES = {
    'static_assets': {
        'max_age': 31536000,  # 1 year
        'immutable': True,
        'public': True
    },
    'html_pages': {
        'max_age': 300,  # 5 minutes
        'must_revalidate': True,
        'public': True
    },
    'api_responses': {
        'max_age': 60,  # 1 minute
        'private': True,
        'vary': ['Authorization', 'Accept-Language']
    },
    'user_content': {
        'max_age': 3600,  # 1 hour
        'private': True,
        'vary': ['Authorization']
    }
}

def get_cache_headers(content_type):
    """Get appropriate cache headers for content type"""
    strategy = CACHE_STRATEGIES.get(content_type, {})
    
    headers = {}
    
    if strategy.get('public'):
        headers['Cache-Control'] = 'public'
    elif strategy.get('private'):
        headers['Cache-Control'] = 'private'
    
    if strategy.get('max_age'):
        headers['Cache-Control'] += f', max-age={strategy["max_age"]}'
    
    if strategy.get('must_revalidate'):
        headers['Cache-Control'] += ', must-revalidate'
    
    if strategy.get('immutable'):
        headers['Cache-Control'] += ', immutable'
    
    if strategy.get('vary'):
        headers['Vary'] = ', '.join(strategy['vary'])
    
    return headers
```

### CDN Cache Invalidation

#### Purge Strategies
```python
import requests

class CDNInvalidation:
    def __init__(self, cdn_api_key, cdn_zone_id):
        self.api_key = cdn_api_key
        self.zone_id = cdn_zone_id
        self.base_url = "https://api.cloudflare.com/client/v4"
    
    def purge_by_url(self, urls):
        """Purge specific URLs from CDN cache"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'files': urls if isinstance(urls, list) else [urls]
        }
        
        response = requests.post(
            f"{self.base_url}/zones/{self.zone_id}/purge_cache",
            json=data,
            headers=headers
        )
        
        return response.json()
    
    def purge_by_tag(self, tags):
        """Purge cache by tags"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'tags': tags if isinstance(tags, list) else [tags]
        }
        
        response = requests.post(
            f"{self.base_url}/zones/{self.zone_id}/purge_cache",
            json=data,
            headers=headers
        )
        
        return response.json()
    
    def purge_all(self):
        """Purge all cache"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {'purge_everything': True}
        
        response = requests.post(
            f"{self.base_url}/zones/{self.zone_id}/purge_cache",
            json=data,
            headers=headers
        )
        
        return response.json()
```

### CDN Benefits
- **Reduced Latency**: Content served from geographically closer servers
- **Improved Performance**: Faster page load times and better user experience
- **Reduced Origin Load**: Less traffic to origin servers
- **Better Availability**: Content remains available even if origin is down
- **Cost Efficiency**: Reduced bandwidth costs at origin servers
- **Global Reach**: Serve content efficiently to users worldwide

---

## Best Practices

### 1. Cache Key Design
- **Consistent Naming**: Use consistent, hierarchical naming conventions
- **Avoid Collisions**: Ensure keys are unique across different data types
- **Include Version**: Include version numbers for cache invalidation
- **Hierarchical Structure**: Use prefixes for logical grouping

```python
# Good cache key examples
cache_keys = {
    'user_profile': f"user:profile:{user_id}:v1",
    'product_details': f"product:details:{product_id}:v2",
    'search_results': f"search:results:{query_hash}:{page}:v1",
    'session_data': f"session:data:{session_id}:v1"
}
```

### 2. Cache Warming
- **Preload Critical Data**: Warm cache with frequently accessed data
- **Scheduled Warming**: Implement scheduled cache warming jobs
- **User-Triggered**: Warm cache based on user behavior patterns
- **Gradual Warming**: Gradually warm cache to avoid thundering herd

```python
class CacheWarmer:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def warm_user_data(self, user_ids):
        """Warm cache with user data"""
        users = self.database.get_users(user_ids)
        
        for user in users:
            cache_key = f"user:profile:{user.id}:v1"
            self.cache.set(cache_key, user.to_dict(), ttl=3600)
    
    def warm_popular_products(self, limit=100):
        """Warm cache with popular products"""
        products = self.database.get_popular_products(limit)
        
        for product in products:
            cache_key = f"product:details:{product.id}:v2"
            self.cache.set(cache_key, product.to_dict(), ttl=7200)
```

### 3. Cache Monitoring
- **Hit Rate Monitoring**: Track cache hit rates and performance
- **Memory Usage**: Monitor memory consumption and capacity
- **Latency Tracking**: Measure cache response times
- **Error Monitoring**: Track cache errors and failures

```python
import time
from functools import wraps

class CacheMonitor:
    def __init__(self):
        self.stats = {
            'hits': 0,
            'misses': 0,
            'errors': 0,
            'total_time': 0,
            'request_count': 0
        }
    
    def record_hit(self, duration):
        self.stats['hits'] += 1
        self.stats['total_time'] += duration
        self.stats['request_count'] += 1
    
    def record_miss(self, duration):
        self.stats['misses'] += 1
        self.stats['total_time'] += duration
        self.stats['request_count'] += 1
    
    def record_error(self):
        self.stats['errors'] += 1
    
    def get_hit_rate(self):
        total_requests = self.stats['hits'] + self.stats['misses']
        return self.stats['hits'] / total_requests if total_requests > 0 else 0
    
    def get_average_latency(self):
        return self.stats['total_time'] / self.stats['request_count'] if self.stats['request_count'] > 0 else 0

def cache_monitoring(monitor):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                
                if result is not None:
                    monitor.record_hit(duration)
                else:
                    monitor.record_miss(duration)
                
                return result
            except Exception as e:
                monitor.record_error()
                raise
        return wrapper
    return decorator
```

### 4. Cache Invalidation
- **TTL Strategy**: Use appropriate TTL values for different data types
- **Event-Driven**: Invalidate cache on data updates
- **Version-Based**: Use versioning for cache invalidation
- **Hierarchical**: Implement hierarchical cache invalidation

```python
class CacheInvalidator:
    def __init__(self, cache):
        self.cache = cache
    
    def invalidate_user_cache(self, user_id):
        """Invalidate all cache entries for a user"""
        keys_to_invalidate = [
            f"user:profile:{user_id}:v1",
            f"user:preferences:{user_id}:v1",
            f"user:orders:{user_id}:v1"
        ]
        
        for key in keys_to_invalidate:
            self.cache.delete(key)
    
    def invalidate_product_cache(self, product_id):
        """Invalidate cache entries for a product"""
        keys_to_invalidate = [
            f"product:details:{product_id}:v2",
            f"product:reviews:{product_id}:v1",
            f"product:recommendations:{product_id}:v1"
        ]
        
        for key in keys_to_invalidate:
            self.cache.delete(key)
    
    def invalidate_search_cache(self, query=None):
        """Invalidate search cache"""
        if query:
            # Invalidate specific query cache
            query_hash = hash(query)
            pattern = f"search:results:{query_hash}:*"
            self.cache.delete_pattern(pattern)
        else:
            # Invalidate all search cache
            self.cache.delete_pattern("search:*")
```

---

## Common Pitfalls

### 1. Cache Stampede
**Problem**: Multiple requests trying to regenerate the same cache entry simultaneously

**Solution**:
```python
import threading
import time

class CacheStampedeProtection:
    def __init__(self, cache):
        self.cache = cache
        self.locks = {}
        self.lock_creation_lock = threading.Lock()
    
    def get_with_protection(self, key, generate_func, ttl=3600):
        """Get value from cache with stampede protection"""
        # Try to get from cache first
        value = self.cache.get(key)
        if value is not None:
            return value
        
        # Get or create lock for this key
        with self.lock_creation_lock:
            if key not in self.locks:
                self.locks[key] = threading.Lock()
            lock = self.locks[key]
        
        # Try to acquire lock
        if lock.acquire(blocking=False):
            try:
                # Double-check cache after acquiring lock
                value = self.cache.get(key)
                if value is not None:
                    return value
                
                # Generate new value
                value = generate_func()
                self.cache.set(key, value, ttl)
                return value
            finally:
                lock.release()
        else:
            # Wait for other thread to finish, then try cache again
            time.sleep(0.1)
            return self.get_with_protection(key, generate_func, ttl)
```

### 2. Cache Inconsistency
**Problem**: Cache and database become out of sync

**Solution**:
```python
class ConsistentCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def update_with_cache(self, key, value):
        """Update database and cache atomically"""
        try:
            # Update database first
            self.database.update(key, value)
            
            # Update cache
            cache_key = f"data:{key}:v1"
            self.cache.set(cache_key, value)
            
            return True
        except Exception as e:
            # Rollback cache if database update fails
            self.cache.delete(cache_key)
            raise e
    
    def get_with_consistency(self, key):
        """Get value with consistency check"""
        cache_key = f"data:{key}:v1"
        
        # Get from cache
        cached_value = self.cache.get(cache_key)
        
        # Periodic consistency check (e.g., 5% of requests)
        if cached_value and random.random() < 0.05:
            db_value = self.database.get(key)
            if cached_value != db_value:
                # Cache is stale, update it
                self.cache.set(cache_key, db_value)
                return db_value
        
        return cached_value if cached_value else self.database.get(key)
```

### 3. Hot Key Problem
**Problem**: Single cache key receiving too many requests

**Solution**:
```python
class HotKeyMitigation:
    def __init__(self, cache):
        self.cache = cache
    
    def get_with_replication(self, key, replica_count=3):
        """Replicate hot keys across multiple cache entries"""
        import random
        
        # Try replicated keys first
        for i in range(replica_count):
            replica_key = f"{key}:replica:{i}"
            value = self.cache.get(replica_key)
            if value is not None:
                return value
        
        # Fallback to original key
        value = self.cache.get(key)
        if value is not None:
            # Replicate to random replica
            replica_index = random.randint(0, replica_count - 1)
            replica_key = f"{key}:replica:{replica_index}"
            self.cache.set(replica_key, value)
        
        return value
```

### 4. Memory Leaks
**Problem**: Cache growing indefinitely and consuming all memory

**Solution**:
```python
class MemoryAwareCache:
    def __init__(self, cache, max_memory_mb=1000):
        self.cache = cache
        self.max_memory_bytes = max_memory_mb * 1024 * 1024
        self.memory_usage = 0
    
    def set_with_memory_check(self, key, value, ttl=None):
        """Set value with memory usage check"""
        value_size = len(str(value).encode('utf-8'))
        
        # Check if adding this value would exceed memory limit
        if self.memory_usage + value_size > self.max_memory_bytes:
            # Trigger cleanup
            self.cleanup_old_entries()
        
        # Set value
        success = self.cache.set(key, value, ttl)
        if success:
            self.memory_usage += value_size
        
        return success
    
    def cleanup_old_entries(self):
        """Clean up old entries to free memory"""
        # Implementation depends on cache type
        # For Redis: use MEMORY USAGE command
        # For Memcached: rely on LRU eviction
        pass
```

---

## Summary

Caching is a fundamental technique in system design that can dramatically improve performance and user experience. Key takeaways include:

### Key Concepts:
- **Caching Strategies**: Choose between write-through, write-around, and write-back based on consistency and performance requirements
- **Eviction Policies**: Select appropriate policies (LRU, LFU, FIFO) based on access patterns
- **Technology Choice**: Choose between Redis and Memcached based on feature requirements
- **CDN Caching**: Leverage CDN for global content distribution and reduced latency

### Best Practices:
- **Design for Consistency**: Plan cache invalidation strategies early
- **Monitor Performance**: Track hit rates, latency, and memory usage
- **Handle Edge Cases**: Protect against cache stampede and hot key problems
- **Choose Appropriate TTL**: Balance data freshness with performance

### Common Patterns:
- **Cache-Aside**: Application manages cache explicitly
- **Cache-Through**: Cache sits between application and database
- **Multi-Level Caching**: Combine different cache layers for optimal performance

Understanding these caching concepts and implementing them correctly is crucial for building scalable, high-performance systems that can handle modern application demands.