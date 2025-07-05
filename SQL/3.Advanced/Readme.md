# 🔵 Advanced SQL Guide

## Table of Contents
1. [Window Functions](#window-functions)
2. [CTEs (Common Table Expressions)](#ctes-common-table-expressions)
3. [Indexes](#indexes)
4. [Stored Procedures & Functions](#stored-procedures--functions)
5. [Triggers](#triggers)
6. [Transactions](#transactions)
7. [Locks and Concurrency](#locks-and-concurrency)
8. [Performance Tuning](#performance-tuning)
9. [Partitioning](#partitioning)

---

## Window Functions

Window functions perform calculations across a set of table rows that are related to the current row. Unlike aggregate functions, window functions don't cause rows to be grouped into a single output row.

### Sample Data for Window Function Examples

**sales table:**
| id | salesperson | region | product | amount | sale_date |
|----|-------------|--------|---------|--------|-----------|
| 1 | John | North | Laptop | 1500 | 2023-01-15 |
| 2 | Jane | South | Phone | 800 | 2023-01-20 |
| 3 | Mike | North | Tablet | 1200 | 2023-01-25 |
| 4 | Sarah | East | Laptop | 1600 | 2023-02-01 |
| 5 | John | North | Phone | 700 | 2023-02-05 |
| 6 | Jane | South | Laptop | 1550 | 2023-02-10 |
| 7 | Mike | North | Phone | 750 | 2023-02-15 |
| 8 | Sarah | East | Tablet | 1300 | 2023-02-20 |
| 9 | John | North | Laptop | 1650 | 2023-02-25 |
| 10 | Jane | South | Tablet | 1100 | 2023-03-01 |

### ROW_NUMBER()

Assigns a unique sequential integer to each row within a partition.

**Syntax:**
```sql
ROW_NUMBER() OVER (
    [PARTITION BY column1, column2, ...]
    [ORDER BY column3, column4, ...]
)
```

**Example - Number all sales:**
```sql
SELECT 
    salesperson,
    product,
    amount,
    ROW_NUMBER() OVER (ORDER BY amount DESC) as overall_rank
FROM sales;
```

**Output:**
| salesperson | product | amount | overall_rank |
|-------------|---------|--------|--------------|
| John | Laptop | 1650 | 1 |
| Sarah | Laptop | 1600 | 2 |
| Jane | Laptop | 1550 | 3 |
| John | Laptop | 1500 | 4 |
| Sarah | Tablet | 1300 | 5 |
| Mike | Tablet | 1200 | 6 |
| Jane | Tablet | 1100 | 7 |
| Jane | Phone | 800 | 8 |
| Mike | Phone | 750 | 9 |
| John | Phone | 700 | 10 |

**Example - Number sales by salesperson:**
```sql
SELECT 
    salesperson,
    product,
    amount,
    sale_date,
    ROW_NUMBER() OVER (PARTITION BY salesperson ORDER BY sale_date) as sale_sequence
FROM sales;
```

**Output:**
| salesperson | product | amount | sale_date | sale_sequence |
|-------------|---------|--------|-----------|---------------|
| Jane | Phone | 800 | 2023-01-20 | 1 |
| Jane | Laptop | 1550 | 2023-02-10 | 2 |
| Jane | Tablet | 1100 | 2023-03-01 | 3 |
| John | Laptop | 1500 | 2023-01-15 | 1 |
| John | Phone | 700 | 2023-02-05 | 2 |
| John | Laptop | 1650 | 2023-02-25 | 3 |
| Mike | Tablet | 1200 | 2023-01-25 | 1 |
| Mike | Phone | 750 | 2023-02-15 | 2 |
| Sarah | Laptop | 1600 | 2023-02-01 | 1 |
| Sarah | Tablet | 1300 | 2023-02-20 | 2 |

### RANK()

Assigns a rank to each row within a partition, with gaps in ranking for ties.

**Example - Rank sales by amount:**
```sql
SELECT 
    salesperson,
    product,
    amount,
    RANK() OVER (ORDER BY amount DESC) as rank_position
FROM sales;
```

**Output:**
| salesperson | product | amount | rank_position |
|-------------|---------|--------|---------------|
| John | Laptop | 1650 | 1 |
| Sarah | Laptop | 1600 | 2 |
| Jane | Laptop | 1550 | 3 |
| John | Laptop | 1500 | 4 |
| Sarah | Tablet | 1300 | 5 |
| Mike | Tablet | 1200 | 6 |
| Jane | Tablet | 1100 | 7 |
| Jane | Phone | 800 | 8 |
| Mike | Phone | 750 | 9 |
| John | Phone | 700 | 10 |

### DENSE_RANK()

Assigns a rank to each row within a partition, without gaps in ranking for ties.

**Example - Dense rank by region:**
```sql
SELECT 
    salesperson,
    region,
    amount,
    DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC) as dense_rank
FROM sales;
```

**Output:**
| salesperson | region | amount | dense_rank |
|-------------|--------|--------|------------|
| Sarah | East | 1600 | 1 |
| Sarah | East | 1300 | 2 |
| John | North | 1650 | 1 |
| John | North | 1500 | 2 |
| Mike | North | 1200 | 3 |
| Mike | North | 750 | 4 |
| John | North | 700 | 5 |
| Jane | South | 1550 | 1 |
| Jane | South | 1100 | 2 |
| Jane | South | 800 | 3 |

### LEAD()

Provides access to a row at a given physical offset that follows the current row.

**Syntax:**
```sql
LEAD(column, offset, default_value) OVER (
    [PARTITION BY column1, column2, ...]
    ORDER BY column3, column4, ...
)
```

**Example - Compare current sale with next sale:**
```sql
SELECT 
    salesperson,
    sale_date,
    amount,
    LEAD(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as next_sale_amount,
    amount - LEAD(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as difference
FROM sales;
```

**Output:**
| salesperson | sale_date | amount | next_sale_amount | difference |
|-------------|-----------|--------|------------------|------------|
| Jane | 2023-01-20 | 800 | 1550 | -750 |
| Jane | 2023-02-10 | 1550 | 1100 | 450 |
| Jane | 2023-03-01 | 1100 | 0 | 1100 |
| John | 2023-01-15 | 1500 | 700 | 800 |
| John | 2023-02-05 | 700 | 1650 | -950 |
| John | 2023-02-25 | 1650 | 0 | 1650 |
| Mike | 2023-01-25 | 1200 | 750 | 450 |
| Mike | 2023-02-15 | 750 | 0 | 750 |
| Sarah | 2023-02-01 | 1600 | 1300 | 300 |
| Sarah | 2023-02-20 | 1300 | 0 | 1300 |

### LAG()

Provides access to a row at a given physical offset that precedes the current row.

**Example - Compare current sale with previous sale:**
```sql
SELECT 
    salesperson,
    sale_date,
    amount,
    LAG(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as prev_sale_amount,
    amount - LAG(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as growth
FROM sales;
```

**Output:**
| salesperson | sale_date | amount | prev_sale_amount | growth |
|-------------|-----------|--------|------------------|--------|
| Jane | 2023-01-20 | 800 | 0 | 800 |
| Jane | 2023-02-10 | 1550 | 800 | 750 |
| Jane | 2023-03-01 | 1100 | 1550 | -450 |
| John | 2023-01-15 | 1500 | 0 | 1500 |
| John | 2023-02-05 | 700 | 1500 | -800 |
| John | 2023-02-25 | 1650 | 700 | 950 |
| Mike | 2023-01-25 | 1200 | 0 | 1200 |
| Mike | 2023-02-15 | 750 | 1200 | -450 |
| Sarah | 2023-02-01 | 1600 | 0 | 1600 |
| Sarah | 2023-02-20 | 1300 | 1600 | -300 |

### NTILE()

Distributes rows into a specified number of roughly equal groups.

**Example - Divide sales into quartiles:**
```sql
SELECT 
    salesperson,
    amount,
    NTILE(4) OVER (ORDER BY amount DESC) as quartile
FROM sales;
```

**Output:**
| salesperson | amount | quartile |
|-------------|--------|----------|
| John | 1650 | 1 |
| Sarah | 1600 | 1 |
| Jane | 1550 | 1 |
| John | 1500 | 2 |
| Sarah | 1300 | 2 |
| Mike | 1200 | 2 |
| Jane | 1100 | 3 |
| Jane | 800 | 3 |
| Mike | 750 | 3 |
| John | 700 | 4 |

### OVER(PARTITION BY ...)

The OVER clause defines the window or set of rows for the window function.

**Example - Running total by salesperson:**
```sql
SELECT 
    salesperson,
    sale_date,
    amount,
    SUM(amount) OVER (PARTITION BY salesperson ORDER BY sale_date) as running_total
FROM sales;
```

**Output:**
| salesperson | sale_date | amount | running_total |
|-------------|-----------|--------|---------------|
| Jane | 2023-01-20 | 800 | 800 |
| Jane | 2023-02-10 | 1550 | 2350 |
| Jane | 2023-03-01 | 1100 | 3450 |
| John | 2023-01-15 | 1500 | 1500 |
| John | 2023-02-05 | 700 | 2200 |
| John | 2023-02-25 | 1650 | 3850 |
| Mike | 2023-01-25 | 1200 | 1200 |
| Mike | 2023-02-15 | 750 | 1950 |
| Sarah | 2023-02-01 | 1600 | 1600 |
| Sarah | 2023-02-20 | 1300 | 2900 |

---

## CTEs (Common Table Expressions)

CTEs provide a way to define temporary named result sets that can be referenced within a SELECT, INSERT, UPDATE, or DELETE statement.

### WITH Clause

**Syntax:**
```sql
WITH cte_name AS (
    SELECT columns
    FROM table
    WHERE condition
)
SELECT columns
FROM cte_name;
```

**Example - Sales summary CTE:**
```sql
WITH sales_summary AS (
    SELECT 
        salesperson,
        COUNT(*) as total_sales,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount
    FROM sales
    GROUP BY salesperson
),
top_performers AS (
    SELECT *
    FROM sales_summary
    WHERE total_amount > 2000
)
SELECT 
    salesperson,
    total_sales,
    total_amount,
    ROUND(avg_amount, 2) as avg_amount
FROM top_performers
ORDER BY total_amount DESC;
```

**Output:**
| salesperson | total_sales | total_amount | avg_amount |
|-------------|-------------|--------------|------------|
| John | 3 | 3850 | 1283.33 |
| Jane | 3 | 3450 | 1150.00 |
| Sarah | 2 | 2900 | 1450.00 |

### Multiple CTEs

**Example - Monthly sales analysis:**
```sql
WITH monthly_sales AS (
    SELECT 
        DATE_FORMAT(sale_date, '%Y-%m') as month,
        salesperson,
        SUM(amount) as monthly_total
    FROM sales
    GROUP BY DATE_FORMAT(sale_date, '%Y-%m'), salesperson
),
monthly_rankings AS (
    SELECT 
        month,
        salesperson,
        monthly_total,
        RANK() OVER (PARTITION BY month ORDER BY monthly_total DESC) as monthly_rank
    FROM monthly_sales
)
SELECT 
    month,
    salesperson,
    monthly_total,
    monthly_rank
FROM monthly_rankings
WHERE monthly_rank <= 2
ORDER BY month, monthly_rank;
```

**Output:**
| month | salesperson | monthly_total | monthly_rank |
|-------|-------------|---------------|--------------|
| 2023-01 | John | 1500 | 1 |
| 2023-01 | Mike | 1200 | 2 |
| 2023-02 | Sarah | 2900 | 1 |
| 2023-02 | Jane | 1550 | 2 |
| 2023-03 | Jane | 1100 | 1 |

### Recursive CTEs

Recursive CTEs are useful for hierarchical data structures like organizational charts or tree structures.

**Sample Data - employees hierarchy:**
| employee_id | name | manager_id | title |
|-------------|------|------------|-------|
| 1 | John CEO | NULL | CEO |
| 2 | Jane VP | 1 | VP Sales |
| 3 | Mike VP | 1 | VP Engineering |
| 4 | Sarah Manager | 2 | Sales Manager |
| 5 | David Manager | 3 | Engineering Manager |
| 6 | Lisa Rep | 4 | Sales Rep |
| 7 | Tom Dev | 5 | Developer |
| 8 | Anna Dev | 5 | Developer |

**Example - Organizational hierarchy:**
```sql
WITH RECURSIVE org_hierarchy AS (
    -- Base case: Top-level managers (no manager_id)
    SELECT 
        employee_id,
        name,
        manager_id,
        title,
        0 as level,
        CAST(name AS VARCHAR(1000)) as hierarchy_path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: Employees with managers
    SELECT 
        e.employee_id,
        e.name,
        e.manager_id,
        e.title,
        oh.level + 1,
        CONCAT(oh.hierarchy_path, ' -> ', e.name)
    FROM employees e
    INNER JOIN org_hierarchy oh ON e.manager_id = oh.employee_id
)
SELECT 
    employee_id,
    name,
    title,
    level,
    hierarchy_path
FROM org_hierarchy
ORDER BY level, name;
```

**Output:**
| employee_id | name | title | level | hierarchy_path |
|-------------|------|-------|-------|----------------|
| 1 | John CEO | CEO | 0 | John CEO |
| 2 | Jane VP | VP Sales | 1 | John CEO -> Jane VP |
| 3 | Mike VP | VP Engineering | 1 | John CEO -> Mike VP |
| 5 | David Manager | Engineering Manager | 2 | John CEO -> Mike VP -> David Manager |
| 4 | Sarah Manager | Sales Manager | 2 | John CEO -> Jane VP -> Sarah Manager |
| 8 | Anna Dev | Developer | 3 | John CEO -> Mike VP -> David Manager -> Anna Dev |
| 6 | Lisa Rep | Sales Rep | 3 | John CEO -> Jane VP -> Sarah Manager -> Lisa Rep |
| 7 | Tom Dev | Developer | 3 | John CEO -> Mike VP -> David Manager -> Tom Dev |

---

## Indexes

Indexes are database objects that improve query performance by providing faster access paths to data.

### Clustered vs Non-Clustered Indexes

#### Clustered Index
- Physically reorders table data
- One per table (typically on primary key)
- Leaf level contains actual data rows

**Example - Create clustered index:**
```sql
CREATE CLUSTERED INDEX IX_Sales_SaleDate 
ON sales(sale_date);
```

#### Non-Clustered Index
- Separate structure that points to data rows
- Multiple per table allowed
- Leaf level contains key values and row locators

**Example - Create non-clustered index:**
```sql
CREATE NONCLUSTERED INDEX IX_Sales_Salesperson 
ON sales(salesperson);
```

### Composite Indexes

**Example - Multi-column index:**
```sql
CREATE INDEX IX_Sales_Region_Product 
ON sales(region, product);
```

### Index Usage Examples

**Sample query performance comparison:**

Without index:
```sql
-- Full table scan
SELECT * FROM sales 
WHERE salesperson = 'John';
```

With index:
```sql
-- Index seek (much faster)
CREATE INDEX IX_Sales_Salesperson ON sales(salesperson);
SELECT * FROM sales 
WHERE salesperson = 'John';
```

### Index Maintenance

**Example - Rebuild fragmented index:**
```sql
ALTER INDEX IX_Sales_Salesperson 
ON sales REBUILD;
```

**Example - Update statistics:**
```sql
UPDATE STATISTICS sales IX_Sales_Salesperson;
```

### Index Performance Metrics

| Index Type | Seek Time | Storage Overhead | Update Cost |
|------------|-----------|------------------|-------------|
| Clustered | Very Fast | Low | Medium |
| Non-Clustered | Fast | Medium | High |
| Composite | Fast (if used correctly) | Medium | High |

---

## Stored Procedures & Functions

Stored procedures and functions are precompiled SQL code stored in the database.

### Create Stored Procedures

**Syntax:**
```sql
CREATE PROCEDURE procedure_name
    @parameter1 datatype,
    @parameter2 datatype
AS
BEGIN
    -- SQL statements
END
```

**Example - Simple procedure:**
```sql
CREATE PROCEDURE GetSalesByPerson
    @salesperson VARCHAR(50)
AS
BEGIN
    SELECT 
        product,
        amount,
        sale_date
    FROM sales
    WHERE salesperson = @salesperson
    ORDER BY sale_date;
END
```

### Execute Stored Procedures

**Example:**
```sql
EXEC GetSalesByPerson @salesperson = 'John';
```

**Output:**
| product | amount | sale_date |
|---------|--------|-----------|
| Laptop | 1500 | 2023-01-15 |
| Phone | 700 | 2023-02-05 |
| Laptop | 1650 | 2023-02-25 |

### Procedures with Parameters

**Example - Procedure with input and output parameters:**
```sql
CREATE PROCEDURE GetSalesStats
    @salesperson VARCHAR(50),
    @total_sales INT OUTPUT,
    @total_amount DECIMAL(10,2) OUTPUT
AS
BEGIN
    SELECT 
        @total_sales = COUNT(*),
        @total_amount = SUM(amount)
    FROM sales
    WHERE salesperson = @salesperson;
END
```

**Execute with output parameters:**
```sql
DECLARE @sales_count INT, @sales_total DECIMAL(10,2);
EXEC GetSalesStats 
    @salesperson = 'John',
    @total_sales = @sales_count OUTPUT,
    @total_amount = @sales_total OUTPUT;
    
SELECT @sales_count as TotalSales, @sales_total as TotalAmount;
```

**Output:**
| TotalSales | TotalAmount |
|------------|-------------|
| 3 | 3850.00 |

### Create Functions

**Scalar Function:**
```sql
CREATE FUNCTION CalculateCommission(@amount DECIMAL(10,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @commission DECIMAL(10,2);
    
    IF @amount > 1500
        SET @commission = @amount * 0.10;
    ELSE IF @amount > 1000
        SET @commission = @amount * 0.08;
    ELSE
        SET @commission = @amount * 0.05;
    
    RETURN @commission;
END
```

**Table-Valued Function:**
```sql
CREATE FUNCTION GetTopSalesByRegion(@region VARCHAR(50), @top_n INT)
RETURNS TABLE
AS
RETURN (
    SELECT TOP (@top_n)
        salesperson,
        product,
        amount,
        sale_date
    FROM sales
    WHERE region = @region
    ORDER BY amount DESC
);
```

**Using functions:**
```sql
-- Scalar function
SELECT 
    salesperson,
    amount,
    dbo.CalculateCommission(amount) as commission
FROM sales;

-- Table-valued function
SELECT * FROM dbo.GetTopSalesByRegion('North', 3);
```

---

## Triggers

Triggers are special stored procedures that automatically execute in response to specific database events.

### AFTER Triggers

Execute after the triggering event completes.

**Example - Audit trigger:**
```sql
CREATE TABLE sales_audit (
    audit_id INT IDENTITY(1,1) PRIMARY KEY,
    sale_id INT,
    action VARCHAR(10),
    old_amount DECIMAL(10,2),
    new_amount DECIMAL(10,2),
    changed_by VARCHAR(50),
    changed_date DATETIME
);

CREATE TRIGGER tr_sales_audit
ON sales
AFTER UPDATE
AS
BEGIN
    INSERT INTO sales_audit (
        sale_id,
        action,
        old_amount,
        new_amount,
        changed_by,
        changed_date
    )
    SELECT 
        d.id,
        'UPDATE',
        d.amount,
        i.amount,
        SYSTEM_USER,
        GETDATE()
    FROM deleted d
    INNER JOIN inserted i ON d.id = i.id;
END
```

### BEFORE Triggers (MySQL)

Execute before the triggering event.

**Example - Validation trigger:**
```sql
DELIMITER //
CREATE TRIGGER tr_validate_sale
BEFORE INSERT ON sales
FOR EACH ROW
BEGIN
    IF NEW.amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sale amount must be positive';
    END IF;
    
    IF NEW.sale_date > CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sale date cannot be in the future';
    END IF;
END //
DELIMITER ;
```

### INSTEAD OF Triggers

Replace the triggering event (commonly used with views).

**Example - View with INSTEAD OF trigger:**
```sql
CREATE VIEW sales_summary AS
SELECT 
    salesperson,
    COUNT(*) as total_sales,
    SUM(amount) as total_amount
FROM sales
GROUP BY salesperson;

CREATE TRIGGER tr_sales_summary_insert
ON sales_summary
INSTEAD OF INSERT
AS
BEGIN
    -- Custom logic for handling inserts to the view
    PRINT 'Cannot insert directly into summary view';
END
```

### Trigger Management

**Example - Disable/Enable triggers:**
```sql
-- Disable trigger
ALTER TABLE sales DISABLE TRIGGER tr_sales_audit;

-- Enable trigger
ALTER TABLE sales ENABLE TRIGGER tr_sales_audit;

-- Drop trigger
DROP TRIGGER tr_sales_audit;
```

---

## Transactions

Transactions ensure data consistency by grouping multiple operations into a single unit of work.

### BEGIN, COMMIT, ROLLBACK

**Basic Transaction Syntax:**
```sql
BEGIN TRANSACTION;
-- SQL statements
COMMIT; -- or ROLLBACK;
```

**Example - Transfer money between accounts:**
```sql
BEGIN TRANSACTION;

DECLARE @source_balance DECIMAL(10,2);
DECLARE @transfer_amount DECIMAL(10,2) = 500.00;

-- Check source account balance
SELECT @source_balance = balance 
FROM accounts 
WHERE account_id = 1;

IF @source_balance >= @transfer_amount
BEGIN
    -- Deduct from source account
    UPDATE accounts 
    SET balance = balance - @transfer_amount 
    WHERE account_id = 1;
    
    -- Add to destination account
    UPDATE accounts 
    SET balance = balance + @transfer_amount 
    WHERE account_id = 2;
    
    COMMIT;
    PRINT 'Transfer completed successfully';
END
ELSE
BEGIN
    ROLLBACK;
    PRINT 'Insufficient funds';
END
```

### Savepoints

Allow partial rollbacks within a transaction.

**Example - Using savepoints:**
```sql
BEGIN TRANSACTION;

INSERT INTO sales (salesperson, region, product, amount, sale_date)
VALUES ('New Person', 'West', 'Laptop', 1400, '2023-03-15');

SAVE TRANSACTION SavePoint1;

UPDATE sales 
SET amount = amount * 1.1 
WHERE salesperson = 'New Person';

-- Something goes wrong, rollback to savepoint
ROLLBACK TRANSACTION SavePoint1;

-- Continue with other operations
INSERT INTO sales (salesperson, region, product, amount, sale_date)
VALUES ('New Person', 'West', 'Phone', 600, '2023-03-16');

COMMIT;
```

### ACID Properties

| Property | Description | Example |
|----------|-------------|---------|
| **Atomicity** | All operations succeed or all fail | Bank transfer: both debit and credit must succeed |
| **Consistency** | Database remains in valid state | Foreign key constraints maintained |
| **Isolation** | Concurrent transactions don't interfere | Read committed isolation level |
| **Durability** | Committed changes persist | Data survives system crashes |

**Example - Demonstrating ACID:**
```sql
-- Atomicity: All or nothing
BEGIN TRANSACTION;
INSERT INTO orders (customer_id, total) VALUES (1, 100.00);
INSERT INTO order_items (order_id, product_id, quantity) VALUES (SCOPE_IDENTITY(), 1, 2);
COMMIT; -- Both inserts succeed or both fail

-- Consistency: Referential integrity
INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (999, 1, 2); -- Fails if order 999 doesn't exist

-- Isolation: Transaction levels
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE account_id = 1;
-- Other transactions can't modify this row until commit

-- Durability: Persisted changes
COMMIT; -- Changes are permanently saved
```

---

## Locks and Concurrency

Database locks control concurrent access to data to maintain consistency.

### Locking Mechanisms

#### Shared Locks (S)
- Multiple transactions can hold shared locks on the same resource
- Prevent modifications but allow reads

#### Exclusive Locks (X)
- Only one transaction can hold an exclusive lock
- Prevent both reads and modifications by other transactions

#### Intent Locks
- Indicate intention to acquire locks at lower levels
- Help avoid lock conflicts

**Example - Lock types in action:**
```sql
-- Shared lock (reading)
BEGIN TRANSACTION;
SELECT * FROM sales WHERE id = 1; -- Acquires shared lock
-- Other transactions can read but not modify
COMMIT;

-- Exclusive lock (writing)
BEGIN TRANSACTION;
UPDATE sales SET amount = 1600 WHERE id = 1; -- Acquires exclusive lock
-- Other transactions cannot read or modify
COMMIT;
```

### Lock Granularity

| Lock Level | Description | Use Case |
|------------|-------------|----------|
| **Row Level** | Locks individual rows | High concurrency, OLTP systems |
| **Page Level** | Locks data pages | Balanced approach |
| **Table Level** | Locks entire table | Bulk operations, low concurrency |

**Example - Controlling lock granularity:**
```sql
-- Row-level locking (default in most cases)
UPDATE sales SET amount = 1600 WHERE id = 1;

-- Table-level locking
BEGIN TRANSACTION;
SELECT * FROM sales WITH (TABLOCKX); -- Exclusive table lock
-- Perform bulk operations
COMMIT;
```

### Deadlocks

Occur when two or more transactions wait for each other to release locks.

**Example - Deadlock scenario:**
```sql
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
-- Waits for lock on account 2
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;

-- Transaction 2 (running simultaneously)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE account_id = 2;
-- Waits for lock on account 1 - DEADLOCK!
UPDATE accounts SET balance = balance + 50 WHERE account_id = 1;
COMMIT;
```

**Deadlock Prevention:**
```sql
-- Always access resources in the same order
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;

-- Transaction 2
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 50 WHERE account_id = 1;
UPDATE accounts SET balance = balance - 50 WHERE account_id = 2;
COMMIT;
```

### Isolation Levels

| Level | Description | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-------------|------------|---------------------|--------------|
| **READ UNCOMMITTED** | No isolation | Yes | Yes | Yes |
| **READ COMMITTED** | Prevent dirty reads | No | Yes | Yes |
| **REPEATABLE READ** | Consistent reads | No | No | Yes |
| **SERIALIZABLE** | Full isolation | No | No | No |

**Example - Setting isolation levels:**
```sql
-- Set isolation level for session
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Set for specific transaction
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM sales WHERE salesperson = 'John';
COMMIT;
```

---

## Performance Tuning

Performance tuning involves optimizing queries and database design for better performance.

### EXPLAIN and ANALYZE

**Example - Query execution plan:**
```sql
-- SQL Server
SET SHOWPLAN_ALL ON;
SELECT s.salesperson, s.amount, r.region_name
FROM sales s
JOIN regions r ON s.region = r.region_code;

-- PostgreSQL
EXPLAIN ANALYZE
SELECT s.salesperson, s.amount, r.region_name
FROM sales s
JOIN regions r ON s.region = r.region_code;

-- MySQL
EXPLAIN FORMAT=JSON
SELECT s.salesperson, s.amount, r.region_name
FROM sales s
JOIN regions r ON s.region = r.region_code;
```

**Sample Execution Plan Output:**
```
|--Hash Match(Inner Join, HASH:([r].[region_code])=([s].[region]))
   |--Table Scan(OBJECT:([regions] AS [r]))
   |--Table Scan(OBJECT:([sales] AS [s]))
```

### Query Optimization Techniques

#### 1. Index Usage
```sql
-- Bad: Full table scan
SELECT * FROM sales WHERE YEAR(sale_date) = 2023;

-- Good: Index seek
SELECT * FROM sales WHERE sale_date >= '2023-01-01' AND sale_date < '2024-01-01';
```

#### 2. JOIN Optimization
```sql
-- Bad: Inefficient join order
SELECT s.*, c.customer_name
FROM sales s
JOIN customers c ON s.customer_id = c.customer_id
WHERE s.sale_date > '2023-01-01';

-- Good: Filter first, then join
SELECT s.*, c.customer_name
FROM (
    SELECT * FROM sales WHERE sale_date > '2023-01-01'
) s
JOIN customers c ON s.customer_id = c.customer_id;
```

#### 3. Subquery vs EXISTS
```sql
-- Bad: Correlated subquery
SELECT * FROM customers c
WHERE customer_id IN (
    SELECT customer_id FROM sales WHERE amount > 1000
);

-- Good: EXISTS (often more efficient)
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM sales s 
    WHERE s.customer_id = c.customer_id AND s.amount > 1000
);
```

### Performance Monitoring

**Example - Query performance metrics:**
```sql
-- Enable query statistics
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT salesperson, SUM(amount) as total_sales
FROM sales
GROUP BY salesperson;

-- Results show:
-- Table 'sales'. Scan count 1, logical reads 3, physical reads 0
-- SQL Server Execution Times: CPU time = 0 ms, elapsed time = 1 ms
```

### Common Performance Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Missing Index** | Table scans | Create appropriate indexes |
| **Outdated Statistics** | Poor execution plans | Update statistics |
| **Parameter Sniffing** | Inconsistent performance | Use query hints or plan guides |
| **Blocking/Deadlocks** | Slow queries | Optimize transaction scope |

---

## Partitioning

Partitioning divides large tables into smaller, more manageable pieces.

### Horizontal Partitioning

Splits rows based on values in one or more columns.

**Example - Range partitioning by date:**
```sql
-- Create partition function
CREATE PARTITION FUNCTION sales_date_pf (DATE)
AS RANGE RIGHT FOR VALUES 
('2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01');

-- Create partition scheme
CREATE PARTITION SCHEME sales_date_ps
AS PARTITION sales_date_pf
TO (FileGroup1, FileGroup2, FileGroup3, FileGroup4, FileGroup5);

-- Create partitioned table
CREATE TABLE sales_partitioned (
    id INT IDENTITY(1,1),
    salesperson VARCHAR(50),
    region VARCHAR(50),
    product VARCHAR(50),
    amount DECIMAL(10,2),
    sale_date DATE
) ON sales_date_ps (sale_date);
```

**Partition Pruning Example:**
```sql
-- Query hits only relevant partitions
SELECT * FROM sales_partitioned 
WHERE sale_date >= '2023-02-01' AND sale_date < '2023-03-01';
-- Only February partition is accessed
```

### Vertical Partitioning

Splits columns into separate tables.

**Example - Separate frequently vs rarely accessed columns:**
```sql
-- Frequently accessed columns
CREATE TABLE customer_core (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Rarely accessed columns
CREATE TABLE customer_details (
    customer_id INT PRIMARY KEY,
    address VARCHAR(200),
    date_of_birth DATE,
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES customer_core(customer_id)
);
```

### PARTITION BY Clause

**Example - Window function with partitioning:**
```sql
SELECT 
    salesperson,
    region,
    amount,
    sale_date,
    -- Partition by region for regional rankings
    RANK() OVER (PARTITION BY region ORDER BY amount DESC) as regional_rank,
    -- Partition by salesperson for individual performance
    SUM(amount) OVER (PARTITION BY salesperson ORDER BY sale_date) as running_total
FROM sales;
```

**Output:**
| salesperson | region | amount | sale_date | regional_rank | running_total |
|-------------|--------|--------|-----------|---------------|---------------|
| Sarah | East | 1600 | 2023-02-01 | 1 | 1600 |
| Sarah | East | 1300 | 2023-02-20 | 2 | 2900 |
| John | North | 1650 | 2023-02-25 | 1 | 3850 |
| John | North | 1500 | 2023-01-15 | 2 | 1500 |
| Mike | North | 1200 | 2023-01-25 | 3 | 1200 |
| John | North | 700 | 2023-02-05 | 5 | 2200 |
| Mike | North | 750 | 2023-02-15 | 4 | 1950 |
| Jane | South | 1550 | 2023-02-10 | 1 | 2350 |
| Jane | South | 1100 | 2023-03-01 | 2 | 3450 |
| Jane | South | 800 | 2023-01-20 | 3 | 800 |

### Partitioning Benefits

| Benefit | Description | Example |
|---------|-------------|---------|
| **Performance** | Faster queries on large tables | Query only current year's data |
| **Maintenance** | Easier backup/restore | Backup only recent partitions |
| **Scalability** | Distribute across multiple disks | Each partition on different drive |
| **Archiving** | Easy data lifecycle management | Drop old partitions |

---

## Summary

This advanced SQL guide covered sophisticated database concepts and techniques:

- **Window Functions** - Powerful analytical functions for complex calculations across row sets
- **CTEs** - Improved query readability and recursive data processing
- **Indexes** - Performance optimization through efficient data access paths
- **Stored Procedures & Functions** - Reusable, compiled database code
- **Triggers** - Automatic responses to database events
- **Transactions** - Data consistency through ACID properties
- **Locks and Concurrency** - Managing concurrent access to data
- **Performance Tuning** - Optimization techniques and monitoring
- **Partitioning** - Scaling large tables through data distribution

### Best Practices

1. **Design First** - Plan your database schema and indexes before implementation
2. **Monitor Performance** - Regularly analyze query execution plans
3. **Test Thoroughly** - Validate all stored procedures and triggers
4. **Backup Strategy** - Implement comprehensive backup and recovery procedures
5. **Security** - Use appropriate access controls and audit mechanisms

### Advanced Topics to Explore Next

- **Data Warehousing** - Star schema, ETL processes, OLAP cubes
- **Replication** - Master-slave, master-master configurations
- **Sharding** - Horizontal scaling across multiple servers
- **NoSQL Integration** - Hybrid relational/document database solutions
- **Cloud Database Services** - AWS RDS, Azure SQL, Google Cloud SQL

Mastering these advanced SQL concepts will enable you to design, implement, and optimize complex database solutions for enterprise applications. 🚀