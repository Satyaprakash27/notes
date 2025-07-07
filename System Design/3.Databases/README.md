# Databases in System Design

## Overview
Databases are the backbone of most modern applications, providing persistent storage, data integrity, and efficient data access patterns. Understanding database concepts is crucial for designing scalable, reliable, and performant systems. This section covers the fundamental database concepts, different database paradigms, and the trade-offs involved in database design decisions.

## Core Topics

### 🗄️ SQL vs NoSQL Databases

The choice between SQL and NoSQL databases represents one of the most fundamental decisions in system design, each offering distinct advantages based on specific use cases, data structures, and scalability requirements.

#### SQL Databases (Relational Databases)

**Characteristics:**
- **Structured Data:** Data stored in tables with predefined schemas
- **ACID Properties:** Atomicity, Consistency, Isolation, Durability
- **Standardized Query Language:** SQL for data manipulation and querying
- **Relationships:** Foreign keys and joins to maintain data relationships
- **Schema Enforcement:** Strict data validation and type checking

**Popular SQL Databases:**
- **MySQL:** Most popular open-source relational database, excellent for web applications
- **PostgreSQL:** Advanced open-source database with complex data types and extensibility
- **Oracle:** Enterprise-grade database with advanced features and high performance
- **SQL Server:** Microsoft's enterprise database solution with strong Windows integration
- **SQLite:** Lightweight, file-based database ideal for embedded applications

**Advantages:**
- **Data Integrity:** Strong consistency and validation through constraints
- **Complex Queries:** Advanced JOIN operations and analytical queries
- **Mature Ecosystem:** Extensive tooling, documentation, and community support
- **Standardization:** SQL is a widely adopted standard across platforms
- **Transaction Support:** Full ACID compliance for critical business operations

**Disadvantages:**
- **Scalability Limitations:** Vertical scaling challenges with massive datasets
- **Schema Rigidity:** Difficult to modify structure in production systems
- **Performance:** Can be slower for simple read/write operations at scale
- **Complexity:** Requires careful schema design and optimization

#### NoSQL Databases (Non-Relational Databases)

**Characteristics:**
- **Flexible Schema:** Dynamic or schema-less data structures
- **Horizontal Scalability:** Designed for distributed, scale-out architectures
- **Varied Data Models:** Document, key-value, column-family, graph databases
- **Eventual Consistency:** Often prioritizes availability over immediate consistency
- **High Performance:** Optimized for specific access patterns and large volumes

**Types of NoSQL Databases:**

##### Document Databases
- **MongoDB:** JSON-like documents with dynamic schemas, excellent for content management
- **CouchDB:** Document database with REST API and multi-master replication
- **Amazon DocumentDB:** AWS managed MongoDB-compatible service

##### Key-Value Stores
- **Redis:** In-memory data structure store with persistence options
- **DynamoDB:** AWS managed NoSQL database with predictable performance
- **Riak:** Distributed key-value store with high availability

##### Column-Family Databases
- **Cassandra:** Wide-column store designed for massive scale and high availability
- **HBase:** Hadoop-based column database for real-time access to big data
- **Amazon SimpleDB:** AWS managed column database service

##### Graph Databases
- **Neo4j:** Leading graph database for complex relationship analysis
- **Amazon Neptune:** Managed graph database supporting multiple graph models
- **ArangoDB:** Multi-model database supporting document, key-value, and graph data

**Advantages:**
- **Horizontal Scalability:** Easy to scale across multiple servers
- **Flexible Schema:** Adapt to changing data requirements quickly
- **High Performance:** Optimized for specific data access patterns
- **Availability:** Designed for high availability and fault tolerance
- **Big Data Handling:** Efficient processing of large, unstructured datasets

**Disadvantages:**
- **Consistency Trade-offs:** May sacrifice immediate consistency for availability
- **Limited Query Capabilities:** Less sophisticated querying compared to SQL
- **Learning Curve:** Different paradigms require new skills and approaches
- **Tooling Maturity:** Fewer mature tools compared to SQL ecosystem

#### SQL vs NoSQL Comparison

| Aspect | SQL | NoSQL |
|--------|-----|--------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scalability** | Vertical (scale up) | Horizontal (scale out) |
| **Consistency** | ACID compliance | Eventual consistency |
| **Queries** | Complex SQL queries | Simple queries, aggregations |
| **Relationships** | Strong relationships via JOINs | Denormalized, embedded data |
| **Use Cases** | Complex transactions, analytics | Web applications, big data |
| **Examples** | MySQL, PostgreSQL | MongoDB, Cassandra |

#### When to Choose SQL vs NoSQL

**Choose SQL When:**
- Data structure is well-defined and unlikely to change frequently
- Complex relationships between data entities are important
- ACID compliance is critical for business operations
- Complex analytical queries and reporting are required
- Team has strong SQL expertise and existing SQL infrastructure

**Choose NoSQL When:**
- Rapid development with evolving data requirements
- Horizontal scaling is essential for handling large volumes
- Data is primarily unstructured or semi-structured
- High availability is more important than immediate consistency
- Specific performance requirements for read/write operations

### 📊 Database Indexing

Database indexing is a critical optimization technique that dramatically improves query performance by creating efficient data access paths, similar to an index in a book that helps locate information quickly.

#### Index Fundamentals

**What is an Index:**
An index is a separate data structure that maintains a sorted reference to data in the main table, allowing the database engine to locate records without scanning the entire table.

**Index Structure:**
- **B-Tree Index:** Most common index type, balanced tree structure for range queries
- **Hash Index:** Fast equality lookups but no range queries
- **Bitmap Index:** Efficient for low-cardinality data with few distinct values
- **Composite Index:** Multiple columns combined into a single index

#### Types of Indexes

##### Primary Index
- **Definition:** Automatically created for primary key columns
- **Characteristics:** Unique, non-null, clustered (data physically ordered)
- **Use Case:** Direct record access via primary key

##### Secondary Index
- **Definition:** Additional indexes on non-primary key columns
- **Characteristics:** May be unique or non-unique, typically non-clustered
- **Use Case:** Optimize queries on frequently searched columns

##### Clustered Index
- **Definition:** Index where data pages are physically ordered by index key
- **Characteristics:** One per table, determines physical storage order
- **Performance:** Excellent for range queries, slower for inserts/updates

##### Non-Clustered Index
- **Definition:** Index with logical ordering separate from physical storage
- **Characteristics:** Multiple per table, points to data locations
- **Performance:** Good for equality searches, requires key lookup for full data

#### Index Design Strategies

**Single-Column Indexes:**
```sql
-- Create index on frequently queried column
CREATE INDEX idx_user_email ON users(email);

-- Query optimization
SELECT * FROM users WHERE email = 'user@example.com';
-- Uses idx_user_email for fast lookup
```

**Composite Indexes:**
```sql
-- Create composite index for multi-column queries
CREATE INDEX idx_user_name_age ON users(last_name, first_name, age);

-- Optimized queries (left-most prefix rule)
SELECT * FROM users WHERE last_name = 'Smith';
SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'John';
SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'John' AND age = 30;
```

**Partial Indexes:**
```sql
-- Index only specific subset of data
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Reduces index size and maintenance overhead
```

#### Index Performance Considerations

**Benefits:**
- **Query Speed:** Dramatically faster SELECT operations
- **Sorting:** Efficient ORDER BY operations
- **Grouping:** Faster GROUP BY operations
- **Uniqueness:** Enforce unique constraints efficiently

**Costs:**
- **Storage Overhead:** Additional disk space for index structures
- **Maintenance Cost:** Indexes must be updated on INSERT/UPDATE/DELETE
- **Memory Usage:** Indexes consume memory for caching
- **Insert Performance:** Slower writes due to index maintenance

#### Index Optimization Best Practices

**Column Selection:**
- Index columns used in WHERE clauses frequently
- Consider columns used in JOIN conditions
- Index columns used in ORDER BY clauses
- Avoid indexing columns with high update frequency

**Index Maintenance:**
- Monitor index usage statistics
- Remove unused indexes to reduce overhead
- Rebuild fragmented indexes periodically
- Consider index consolidation for similar queries

### 🔄 Data Modeling

Data modeling is the process of creating a conceptual representation of data structures, relationships, and constraints that will be implemented in a database system.

#### Entity-Relationship (ER) Diagrams

**Components of ER Diagrams:**

##### Entities
- **Definition:** Objects or concepts about which data is stored
- **Examples:** Customer, Product, Order, Employee
- **Representation:** Rectangles in ER diagrams
- **Types:** Strong entities (independent) vs weak entities (dependent)

##### Attributes
- **Definition:** Properties or characteristics of entities
- **Types:**
  - **Simple:** Cannot be divided further (e.g., age, name)
  - **Composite:** Can be divided into sub-attributes (e.g., address)
  - **Derived:** Calculated from other attributes (e.g., age from birth_date)
  - **Multi-valued:** Can have multiple values (e.g., phone_numbers)

##### Relationships
- **Definition:** Associations between entities
- **Cardinality:** Number of instances that can participate
  - **One-to-One (1:1):** Each entity instance relates to one instance of another
  - **One-to-Many (1:M):** One entity instance relates to many instances of another
  - **Many-to-Many (M:N):** Multiple instances relate to multiple instances

**ER Diagram Example:**
```
Customer (CustomerID, Name, Email, Phone)
    |
    | (1:M)
    |
Order (OrderID, OrderDate, TotalAmount, CustomerID)
    |
    | (M:N)
    |
Product (ProductID, ProductName, Price, StockQuantity)
```

#### Database Normalization

Normalization is the process of organizing data to reduce redundancy and dependency, ensuring data integrity and efficient storage.

##### First Normal Form (1NF)
**Requirements:**
- Each column contains atomic (indivisible) values
- Each row is unique
- No repeating groups or arrays

**Example:**
```sql
-- Violates 1NF (multi-valued attribute)
Customer (ID, Name, Phone)
1, John Smith, "555-1234, 555-5678"

-- Normalized to 1NF
Customer (ID, Name)
1, John Smith

CustomerPhone (CustomerID, Phone)
1, 555-1234
1, 555-5678
```

##### Second Normal Form (2NF)
**Requirements:**
- Must be in 1NF
- All non-key attributes are fully functionally dependent on the primary key
- Eliminates partial dependencies

**Example:**
```sql
-- Violates 2NF (partial dependency)
OrderItem (OrderID, ProductID, ProductName, Quantity, Price)
-- ProductName depends only on ProductID, not full key

-- Normalized to 2NF
OrderItem (OrderID, ProductID, Quantity, Price)
Product (ProductID, ProductName)
```

##### Third Normal Form (3NF)
**Requirements:**
- Must be in 2NF
- No transitive dependencies (non-key attributes depend only on primary key)
- Eliminates indirect dependencies

**Example:**
```sql
-- Violates 3NF (transitive dependency)
Employee (EmployeeID, Name, DepartmentID, DepartmentName)
-- DepartmentName depends on DepartmentID, not EmployeeID

-- Normalized to 3NF
Employee (EmployeeID, Name, DepartmentID)
Department (DepartmentID, DepartmentName)
```

##### Boyce-Codd Normal Form (BCNF)
**Requirements:**
- Must be in 3NF
- Every determinant must be a candidate key
- Stricter version of 3NF

##### Fourth Normal Form (4NF)
**Requirements:**
- Must be in BCNF
- No multi-valued dependencies
- Eliminates independent multi-valued facts

#### Denormalization Strategies

**When to Denormalize:**
- Performance requirements outweigh storage concerns
- Read-heavy applications with complex joins
- Data warehouse and analytical systems
- Distributed systems where joins are expensive

**Denormalization Techniques:**
- **Redundant Data:** Store frequently accessed data in multiple tables
- **Computed Columns:** Pre-calculate expensive aggregations
- **Materialized Views:** Store pre-computed query results
- **Flattened Structures:** Combine normalized tables for specific use cases

### 💳 Transactions and ACID Properties

Transactions are fundamental units of work in database systems that ensure data integrity and consistency, especially in concurrent environments.

#### Transaction Fundamentals

**Definition:** A transaction is a sequence of database operations that are executed as a single logical unit of work.

**Transaction States:**
- **Active:** Transaction is currently executing
- **Partially Committed:** Transaction has executed but not yet committed
- **Committed:** Transaction has completed successfully
- **Aborted:** Transaction has been rolled back
- **Failed:** Transaction cannot proceed due to errors

#### ACID Properties

##### Atomicity
**Definition:** All operations in a transaction succeed or fail together (all-or-nothing principle).

**Implementation:**
- **Logging:** Write-ahead logging to record all changes
- **Rollback:** Ability to undo all changes if transaction fails
- **Savepoints:** Partial rollback to specific points in transaction

**Example:**
```sql
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
    -- If either update fails, both are rolled back
COMMIT;
```

##### Consistency
**Definition:** Database must remain in a valid state before and after transaction execution.

**Mechanisms:**
- **Constraints:** Primary keys, foreign keys, check constraints
- **Triggers:** Business rule enforcement
- **Data Types:** Type checking and validation
- **Referential Integrity:** Maintaining relationships between tables

**Example:**
```sql
-- Consistency ensured through constraints
ALTER TABLE orders ADD CONSTRAINT fk_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id);

-- Invalid customer_id will be rejected
INSERT INTO orders (customer_id, total) VALUES (999, 100.00);
-- Error: Customer ID 999 does not exist
```

##### Isolation
**Definition:** Concurrent transactions do not interfere with each other.

**Isolation Levels:**

###### Read Uncommitted
- **Level:** Lowest isolation
- **Characteristics:** Can read uncommitted changes from other transactions
- **Problems:** Dirty reads, non-repeatable reads, phantom reads
- **Use Case:** Reporting where approximate data is acceptable

###### Read Committed
- **Level:** Default in most databases
- **Characteristics:** Only reads committed data
- **Problems:** Non-repeatable reads, phantom reads
- **Use Case:** Most general-purpose applications

###### Repeatable Read
- **Level:** Higher isolation
- **Characteristics:** Consistent reads within transaction
- **Problems:** Phantom reads (new rows appearing)
- **Use Case:** Applications requiring consistent data within transaction

###### Serializable
- **Level:** Highest isolation
- **Characteristics:** Transactions execute as if run sequentially
- **Problems:** Reduced concurrency, potential deadlocks
- **Use Case:** Critical financial transactions

**Isolation Problems:**
```sql
-- Dirty Read Example
Transaction A: UPDATE accounts SET balance = 1000 WHERE id = 1;
Transaction B: SELECT balance FROM accounts WHERE id = 1; -- Reads 1000
Transaction A: ROLLBACK; -- Balance reverts to original value
-- Transaction B read uncommitted data
```

##### Durability
**Definition:** Committed transactions persist even in case of system failures.

**Implementation:**
- **Write-Ahead Logging:** Changes logged before being written to disk
- **Checkpoints:** Periodic synchronization of memory and disk
- **Backup and Recovery:** Regular backups and point-in-time recovery
- **Replication:** Data copies across multiple systems

### 🔄 CAP Theorem and BASE in NoSQL

The CAP theorem and BASE properties represent fundamental trade-offs in distributed database systems, particularly relevant for NoSQL databases.

#### CAP Theorem in Database Context

**Consistency:**
- **Definition:** All nodes see the same data simultaneously
- **Database Implication:** All replicas have identical data at any given time
- **Implementation:** Synchronous replication, distributed locks

**Availability:**
- **Definition:** System remains operational despite failures
- **Database Implication:** Database responds to queries even during network partitions
- **Implementation:** Replication, failover mechanisms

**Partition Tolerance:**
- **Definition:** System continues operating despite network failures
- **Database Implication:** Database functions when communication between nodes fails
- **Implementation:** Distributed architecture, message queues

#### CAP Theorem Trade-offs in Databases

##### CP Systems (Consistency + Partition Tolerance)
**Characteristics:**
- Sacrifice availability for consistency
- System may become unavailable during network partitions
- Strong consistency guarantees

**Examples:**
- **MongoDB:** Provides strong consistency with automatic failover
- **Redis Cluster:** Maintains consistency but may reject writes during partitions
- **HBase:** Consistent data access with potential unavailability

**Use Cases:**
- Financial systems requiring accurate balances
- Inventory management systems
- Systems where stale data is unacceptable

##### AP Systems (Availability + Partition Tolerance)
**Characteristics:**
- Sacrifice consistency for availability
- System remains available but may serve stale data
- Eventual consistency model

**Examples:**
- **Cassandra:** Highly available with tunable consistency
- **DynamoDB:** Always available with eventual consistency
- **CouchDB:** Multi-master replication with conflict resolution

**Use Cases:**
- Social media applications
- Content management systems
- Applications where availability is more important than immediate consistency

##### CA Systems (Consistency + Availability)
**Characteristics:**
- Cannot handle network partitions
- Typically single-node or tightly coupled systems
- Traditional relational databases

**Examples:**
- **MySQL (single node):** Consistent and available but not partition tolerant
- **PostgreSQL (single node):** Strong consistency but no distributed capabilities

#### BASE Properties

BASE (Basically Available, Soft state, Eventual consistency) provides an alternative to ACID properties for distributed systems.

##### Basically Available
**Definition:** System remains available even during partial failures.

**Implementation:**
- **Graceful Degradation:** Reduced functionality rather than complete failure
- **Partial Responses:** Return available data even if some nodes are down
- **Load Balancing:** Distribute requests across available nodes

**Example:**
```javascript
// Cassandra query with degraded service
try {
    result = cassandra.query("SELECT * FROM users WHERE id = ?", [userId]);
} catch (UnavailableException e) {
    // Return cached data or default values
    result = getFromCache(userId) || getDefaultUserData();
}
```

##### Soft State
**Definition:** System state may change over time without input due to eventual consistency.

**Characteristics:**
- Data may be inconsistent across replicas temporarily
- No guarantees about state consistency at any given time
- Background processes eventually synchronize data

**Example:**
```javascript
// Data may be different across replicas
replica1.get("user:123").name // "John Smith"
replica2.get("user:123").name // "John Doe" (not yet synchronized)
// Eventually both will converge to the same value
```

##### Eventual Consistency
**Definition:** System will become consistent over time, given that no new updates are made.

**Types:**
- **Causal Consistency:** Causally related operations appear in the same order
- **Read-your-writes:** Users see their own writes immediately
- **Session Consistency:** Consistency within a single session
- **Monotonic Read:** If a process reads a value, subsequent reads return the same or more recent values

**Implementation Strategies:**
- **Vector Clocks:** Track causality in distributed systems
- **Conflict Resolution:** Last-write-wins, merge functions
- **Anti-entropy:** Background processes to synchronize replicas
- **Gossip Protocols:** Nodes share state information periodically

### 🔀 Partitioning, Sharding, and Replication

These techniques enable databases to scale beyond single-machine limitations by distributing data across multiple nodes.

#### Database Partitioning

**Definition:** Dividing a database into smaller, more manageable pieces while maintaining logical unity.

##### Vertical Partitioning
**Approach:** Split tables by columns
**Benefits:** Reduce I/O for queries accessing specific columns
**Challenges:** Complex joins across partitions

**Example:**
```sql
-- Original table
Users (ID, Name, Email, Bio, Avatar, LastLogin, CreatedAt)

-- Vertical partitioning
UserBasic (ID, Name, Email, LastLogin, CreatedAt)
UserProfile (ID, Bio, Avatar)
```

##### Horizontal Partitioning
**Approach:** Split tables by rows
**Benefits:** Distribute data volume across multiple storage units
**Challenges:** Cross-partition queries and transactions

**Example:**
```sql
-- Partition by date range
Orders_2023 (OrderID, CustomerID, OrderDate, Amount)
Orders_2024 (OrderID, CustomerID, OrderDate, Amount)

-- Partition by hash
Users_Shard1 (ID, Name, Email) -- IDs 1-1000000
Users_Shard2 (ID, Name, Email) -- IDs 1000001-2000000
```

#### Database Sharding

**Definition:** Horizontal partitioning across multiple database instances, each running on separate servers.

##### Sharding Strategies

###### Range-Based Sharding
**Approach:** Partition data based on value ranges
**Benefits:** Good for range queries, natural data distribution
**Challenges:** Hot spots if data distribution is uneven

**Example:**
```sql
-- Shard by user ID ranges
Shard1: Users with ID 1-100000
Shard2: Users with ID 100001-200000
Shard3: Users with ID 200001-300000

-- Query routing
SELECT * FROM users WHERE id = 150000; -- Route to Shard2
```

###### Hash-Based Sharding
**Approach:** Use hash function to determine shard placement
**Benefits:** Even data distribution, simple implementation
**Challenges:** Difficult range queries, resharding complexity

**Example:**
```sql
-- Hash-based sharding
shard_id = hash(user_id) % number_of_shards

-- Example with 4 shards
hash(12345) % 4 = 1 -- User goes to Shard1
hash(67890) % 4 = 2 -- User goes to Shard2
```

###### Directory-Based Sharding
**Approach:** Lookup service maintains mapping of data to shards
**Benefits:** Flexible, easy to rebalance
**Challenges:** Directory becomes bottleneck and single point of failure

**Example:**
```sql
-- Directory service
Directory Table:
UserID_Range | Shard_Server
1-100000     | shard1.example.com
100001-200000| shard2.example.com
200001-300000| shard3.example.com
```

###### Consistent Hashing
**Approach:** Hash ring with virtual nodes for better distribution
**Benefits:** Minimal data movement during scaling
**Challenges:** Complex implementation, uneven load possible

##### Sharding Challenges

**Cross-Shard Queries:**
```sql
-- Complex query across multiple shards
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
-- Requires querying multiple shards and aggregating results
```

**Distributed Transactions:**
```sql
-- Transaction spanning multiple shards
BEGIN TRANSACTION;
    -- Update inventory in Shard1
    UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123;
    -- Create order in Shard2
    INSERT INTO orders (user_id, product_id, quantity) VALUES (456, 123, 1);
COMMIT;
-- Requires two-phase commit protocol
```

#### Database Replication

**Definition:** Maintaining multiple copies of data across different database servers for availability and performance.

##### Replication Types

###### Master-Slave Replication
**Architecture:** One primary (master) server, multiple secondary (slave) servers
**Benefits:** Read scaling, automatic failover capability
**Challenges:** Write bottleneck, replication lag

**Example:**
```sql
-- Master server (handles all writes)
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- Slave servers (handle reads)
-- Slight delay due to replication lag
SELECT * FROM users WHERE email = 'john@example.com';
```

###### Master-Master Replication
**Architecture:** Multiple servers can handle both reads and writes
**Benefits:** High availability, geographic distribution
**Challenges:** Conflict resolution, data consistency

**Example:**
```sql
-- Server A and Server B both accept writes
Server A: UPDATE users SET email = 'john.new@example.com' WHERE id = 1;
Server B: UPDATE users SET email = 'john.old@example.com' WHERE id = 1;
-- Conflict resolution needed
```

###### Multi-Master Replication
**Architecture:** Multiple masters with conflict resolution
**Benefits:** High availability, load distribution
**Challenges:** Complex conflict resolution, eventual consistency

##### Replication Strategies

**Synchronous Replication:**
- **Characteristics:** Write confirmed only after all replicas updated
- **Benefits:** Strong consistency, no data loss
- **Drawbacks:** Higher latency, reduced availability

**Asynchronous Replication:**
- **Characteristics:** Write confirmed immediately, replicas updated later
- **Benefits:** Low latency, high availability
- **Drawbacks:** Potential data loss, eventual consistency

**Semi-Synchronous Replication:**
- **Characteristics:** Write confirmed after at least one replica updated
- **Benefits:** Balance between consistency and performance
- **Drawbacks:** Increased complexity

### 🚀 Query Optimization

Query optimization is the process of improving database query performance through various techniques and strategies.

#### Query Execution Process

**Steps:**
1. **Parsing:** Syntax and semantic analysis
2. **Optimization:** Generate execution plans
3. **Execution:** Execute the optimal plan
4. **Result Delivery:** Return results to client

#### Query Optimization Techniques

##### Index Optimization
**Strategy:** Use appropriate indexes for query patterns
**Implementation:**
```sql
-- Slow query without index
SELECT * FROM users WHERE email = 'user@example.com';

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Now query uses index for fast lookup
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
```

##### Query Rewriting
**Strategy:** Transform queries into more efficient forms
**Examples:**
```sql
-- Original query
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 100
);

-- Rewritten using JOIN (often faster)
SELECT DISTINCT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount > 100;
```

##### Predicate Pushdown
**Strategy:** Move filtering conditions as early as possible in execution
**Example:**
```sql
-- Inefficient: filter after join
SELECT * FROM (
    SELECT u.*, o.amount FROM users u
    JOIN orders o ON u.id = o.user_id
) combined
WHERE combined.amount > 100;

-- Efficient: filter before join
SELECT u.*, o.amount FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.amount > 100;
```

##### Join Optimization
**Strategies:**
- **Join Order:** Optimize order of join operations
- **Join Algorithms:** Choose appropriate join algorithm (nested loop, hash join, merge join)
- **Statistics:** Maintain accurate table statistics for cost estimation

**Example:**
```sql
-- Query with multiple joins
SELECT u.name, p.title, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id
WHERE u.created_at > '2023-01-01'
AND p.category = 'electronics';

-- Optimizer considers:
-- 1. Which table to scan first
-- 2. Join order based on selectivity
-- 3. Available indexes
```

#### Query Performance Analysis

##### Execution Plan Analysis
**Tools:**
- **EXPLAIN:** Shows query execution plan
- **ANALYZE:** Provides actual execution statistics
- **Visual Explain:** Graphical representation of execution plan

**Example:**
```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- Output shows:
-- - Table scan vs index scan
-- - Join algorithm used
-- - Estimated vs actual rows
-- - Execution time breakdown
```

##### Performance Metrics
**Key Metrics:**
- **Rows Examined:** Number of rows scanned
- **Rows Returned:** Number of rows in result set
- **Execution Time:** Total query duration
- **I/O Operations:** Disk reads and writes
- **Memory Usage:** Temporary table sizes

#### Query Optimization Best Practices

##### Schema Design
**Principles:**
- **Appropriate Data Types:** Use smallest suitable data types
- **Normalization Balance:** Normalize for consistency, denormalize for performance
- **Index Strategy:** Create indexes for common query patterns
- **Partitioning:** Partition large tables for better performance

##### Query Writing
**Best Practices:**
- **Selective WHERE Clauses:** Use highly selective conditions early
- **Avoid Functions in WHERE:** Functions prevent index usage
- **Use EXISTS Instead of IN:** EXISTS often more efficient for subqueries
- **Limit Result Sets:** Use LIMIT to restrict returned rows

**Examples:**
```sql
-- Avoid functions in WHERE clause
-- Inefficient
SELECT * FROM users WHERE UPPER(name) = 'JOHN';

-- Efficient
SELECT * FROM users WHERE name = 'John';

-- Use EXISTS instead of IN for better performance
-- Less efficient
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 100
);

-- More efficient
SELECT * FROM users WHERE EXISTS (
    SELECT 1 FROM orders WHERE user_id = users.id AND amount > 100
);
```

##### Monitoring and Maintenance
**Regular Tasks:**
- **Statistics Updates:** Keep table statistics current
- **Index Maintenance:** Rebuild fragmented indexes
- **Query Performance Monitoring:** Track slow queries
- **Storage Analysis:** Monitor disk usage and growth

## Learning Path

### Prerequisites
- Basic understanding of data structures and algorithms
- Familiarity with SQL syntax and basic database concepts
- Understanding of computer systems and storage

### Recommended Study Order
1. **Start with SQL fundamentals** and basic database concepts
2. **Learn data modeling** and normalization principles
3. **Understand transactions and ACID properties**
4. **Explore NoSQL databases** and their use cases
5. **Study distributed database concepts** (CAP theorem, BASE)
6. **Learn about partitioning and sharding** strategies
7. **Master query optimization** techniques

### Practical Exercises
- Design a database schema for a real-world application
- Implement different types of database indexes
- Compare SQL and NoSQL databases for specific use cases
- Practice query optimization techniques
- Set up database replication and test failover scenarios

## Related Topics
- **[System Design Fundamentals](../1.Fundamentals/):** Core concepts that apply to database design
- **[Caching](../4.Caching/):** Database caching strategies and implementation
- **[Scalability & Performance](../8.Scalability%20&%20Performance/):** Performance optimization techniques
- **[Security in System Design](../9.Security%20in%20System%20Design/):** Database security considerations

## Key Takeaways
- **Database choice depends on specific requirements:** Consider data structure, scalability needs, and consistency requirements
- **Indexing is crucial for performance:** Proper indexing can dramatically improve query performance
- **Data modeling affects everything:** Good schema design prevents many future problems
- **Transactions ensure data integrity:** ACID properties are essential for reliable systems
- **Distributed databases involve trade-offs:** CAP theorem guides decisions in distributed systems
- **Query optimization is an ongoing process:** Regular monitoring and optimization maintain performance

## Next Steps
After mastering database concepts, explore:
- **Advanced NoSQL patterns** and specific database implementations
- **Database security** and encryption techniques
- **Database monitoring and observability** tools
- **Cloud database services** and their trade-offs
- **Data warehousing and analytics** for large-scale data processing

Understanding databases is fundamental to system design. These concepts form the foundation for making informed decisions about data storage, retrieval, and consistency in distributed systems.