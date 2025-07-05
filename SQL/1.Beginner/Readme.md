# 🟢 Beginner SQL Guide

## Table of Contents
1. [Introduction to SQL](#introduction-to-sql)
2. [What is SQL](#what-is-sql)
3. [Types of SQL](#types-of-sql)
4. [Basic SQL Commands](#basic-sql-commands)
5. [Data Types](#data-types)
6. [Filtering Data](#filtering-data)
7. [Sorting](#sorting)
8. [Aliases](#aliases)
9. [Functions](#functions)

---

## Introduction to SQL

SQL (Structured Query Language) is the standard language for managing and manipulating relational databases. It allows you to store, retrieve, update, and delete data from databases efficiently.

### Key Benefits:
- **Standardized**: Works across different database systems
- **Declarative**: You specify what you want, not how to get it
- **Powerful**: Can handle complex data operations
- **Efficient**: Optimized for data retrieval and manipulation

---

## What is SQL

SQL is a domain-specific language designed for managing data held in a relational database management system (RDBMS). It consists of various types of statements that allow you to:

- **Query data** from tables
- **Insert new records** into tables
- **Update existing records** in tables
- **Delete records** from tables
- **Create and modify** database structures

### SQL Standards:
- **ANSI SQL** (American National Standards Institute)
- **ISO SQL** (International Organization for Standardization)
- Popular databases like MySQL, PostgreSQL, SQL Server, Oracle follow these standards with some variations

---

## Types of SQL

SQL commands are categorized into four main types:

### 1. DDL (Data Definition Language)
Controls the structure of the database and its objects.

**Commands:**
- `CREATE` - Creates database objects (tables, indexes, etc.)
- `ALTER` - Modifies existing database objects
- `DROP` - Deletes database objects
- `TRUNCATE` - Removes all records from a table

**Example:**
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(30)
);
```

### 2. DML (Data Manipulation Language)
Deals with data manipulation within tables.

**Commands:**
- `SELECT` - Retrieves data from tables
- `INSERT` - Adds new records to tables
- `UPDATE` - Modifies existing records
- `DELETE` - Removes records from tables

**Example:**
```sql
INSERT INTO employees (id, name, department) 
VALUES (1, 'John Doe', 'IT');
```

### 3. DCL (Data Control Language)
Controls access permissions and security.

**Commands:**
- `GRANT` - Gives user access privileges
- `REVOKE` - Removes user access privileges

**Example:**
```sql
GRANT SELECT ON employees TO user1;
```

### 4. TCL (Transaction Control Language)
Manages database transactions.

**Commands:**
- `COMMIT` - Saves all changes made in the current transaction
- `ROLLBACK` - Undoes changes made in the current transaction
- `SAVEPOINT` - Sets a point within a transaction to rollback to

**Example:**
```sql
BEGIN TRANSACTION;
UPDATE employees SET department = 'HR' WHERE id = 1;
COMMIT;
```

---

## Basic SQL Commands

Let's explore the fundamental SQL commands with detailed examples using sample tables.

### Sample Data Setup

**employees table:**
| id | name | department | salary | hire_date |
|----|------|------------|---------|-----------|
| 1 | John Doe | IT | 75000 | 2023-01-15 |
| 2 | Jane Smith | HR | 65000 | 2023-02-20 |
| 3 | Mike Johnson | IT | 80000 | 2023-01-10 |
| 4 | Sarah Wilson | Finance | 70000 | 2023-03-05 |
| 5 | David Brown | IT | 72000 | 2023-02-28 |

### 1. SELECT Command

Retrieves data from one or more tables.

**Basic Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name;
```

**Examples:**

**Select all columns:**
```sql
SELECT * FROM employees;
```

**Output:**
| id | name | department | salary | hire_date |
|----|------|------------|---------|-----------|
| 1 | John Doe | IT | 75000 | 2023-01-15 |
| 2 | Jane Smith | HR | 65000 | 2023-02-20 |
| 3 | Mike Johnson | IT | 80000 | 2023-01-10 |
| 4 | Sarah Wilson | Finance | 70000 | 2023-03-05 |
| 5 | David Brown | IT | 72000 | 2023-02-28 |

**Select specific columns:**
```sql
SELECT name, department, salary FROM employees;
```

**Output:**
| name | department | salary |
|------|------------|---------|
| John Doe | IT | 75000 |
| Jane Smith | HR | 65000 |
| Mike Johnson | IT | 80000 |
| Sarah Wilson | Finance | 70000 |
| David Brown | IT | 72000 |

### 2. INSERT Command

Adds new records to a table.

**Basic Syntax:**
```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

**Examples:**

**Insert a single record:**
```sql
INSERT INTO employees (id, name, department, salary, hire_date)
VALUES (6, 'Lisa Anderson', 'Marketing', 68000, '2023-04-01');
```

**Insert multiple records:**
```sql
INSERT INTO employees (id, name, department, salary, hire_date)
VALUES 
    (7, 'Tom Wilson', 'Sales', 62000, '2023-04-15'),
    (8, 'Anna Davis', 'IT', 78000, '2023-04-20');
```

**Result after INSERT:**
| id | name | department | salary | hire_date |
|----|------|------------|---------|-----------|
| 6 | Lisa Anderson | Marketing | 68000 | 2023-04-01 |
| 7 | Tom Wilson | Sales | 62000 | 2023-04-15 |
| 8 | Anna Davis | IT | 78000 | 2023-04-20 |

### 3. UPDATE Command

Modifies existing records in a table.

**Basic Syntax:**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**Examples:**

**Update a single record:**
```sql
UPDATE employees
SET salary = 77000
WHERE id = 1;
```

**Update multiple records:**
```sql
UPDATE employees
SET salary = salary * 1.1
WHERE department = 'IT';
```

**Result after UPDATE:**
| id | name | department | salary | hire_date |
|----|------|------------|---------|-----------|
| 1 | John Doe | IT | 84700 | 2023-01-15 |
| 3 | Mike Johnson | IT | 88000 | 2023-01-10 |
| 5 | David Brown | IT | 79200 | 2023-02-28 |
| 8 | Anna Davis | IT | 85800 | 2023-04-20 |

### 4. DELETE Command

Removes records from a table.

**Basic Syntax:**
```sql
DELETE FROM table_name
WHERE condition;
```

**Examples:**

**Delete a specific record:**
```sql
DELETE FROM employees
WHERE id = 7;
```

**Delete multiple records:**
```sql
DELETE FROM employees
WHERE department = 'Sales';
```

**⚠️ Warning:** Without a WHERE clause, DELETE removes ALL records!

---

## Data Types

SQL supports various data types to store different kinds of information.

### 1. Numeric Data Types

| Type | Description | Example |
|------|-------------|---------|
| `INT` | Integer numbers | 123, -456 |
| `BIGINT` | Large integer numbers | 9223372036854775807 |
| `SMALLINT` | Small integer numbers | 32767 |
| `DECIMAL(p,s)` | Fixed-point numbers | DECIMAL(10,2) = 12345.67 |
| `FLOAT` | Floating-point numbers | 123.45 |
| `REAL` | Single-precision floating-point | 123.45 |

**Example:**
```sql
CREATE TABLE products (
    id INT,
    price DECIMAL(10,2),
    weight FLOAT,
    quantity SMALLINT
);
```

### 2. String Data Types

| Type | Description | Example |
|------|-------------|---------|
| `VARCHAR(n)` | Variable-length string | VARCHAR(50) |
| `CHAR(n)` | Fixed-length string | CHAR(10) |
| `TEXT` | Large text data | Long descriptions |
| `NVARCHAR(n)` | Unicode variable-length string | NVARCHAR(100) |

**Example:**
```sql
CREATE TABLE customers (
    id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    country_code CHAR(2),
    description TEXT
);
```

### 3. Date/Time Data Types

| Type | Description | Example |
|------|-------------|---------|
| `DATE` | Date only | 2023-12-25 |
| `TIME` | Time only | 14:30:00 |
| `DATETIME` | Date and time | 2023-12-25 14:30:00 |
| `TIMESTAMP` | Date and time with timezone | 2023-12-25 14:30:00 UTC |

**Example:**
```sql
CREATE TABLE orders (
    id INT,
    order_date DATE,
    order_time TIME,
    created_at TIMESTAMP
);
```

---

## Filtering Data

Filtering allows you to retrieve specific records based on conditions.

### Sample Data for Filtering Examples

**products table:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 1 | Laptop | Electronics | 999.99 | 50 | 1 |
| 2 | Mouse | Electronics | 25.99 | 100 | 1 |
| 3 | Desk Chair | Furniture | 199.99 | 25 | 2 |
| 4 | Notebook | Stationery | 5.99 | 200 | 3 |
| 5 | Tablet | Electronics | 399.99 | 30 | 1 |
| 6 | Pen | Stationery | 1.99 | 500 | 3 |
| 7 | Monitor | Electronics | 299.99 | 40 | 1 |

### 1. WHERE Clause

Filters records based on specified conditions.

**Basic Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

**Examples:**

**Filter by category:**
```sql
SELECT * FROM products
WHERE category = 'Electronics';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 1 | Laptop | Electronics | 999.99 | 50 | 1 |
| 2 | Mouse | Electronics | 25.99 | 100 | 1 |
| 5 | Tablet | Electronics | 399.99 | 30 | 1 |
| 7 | Monitor | Electronics | 299.99 | 40 | 1 |

**Filter by price range:**
```sql
SELECT name, price FROM products
WHERE price > 100;
```

**Output:**
| name | price |
|------|-------|
| Laptop | 999.99 |
| Desk Chair | 199.99 |
| Tablet | 399.99 |
| Monitor | 299.99 |

### 2. AND, OR, NOT Operators

Combine multiple conditions.

**AND Operator:**
```sql
SELECT * FROM products
WHERE category = 'Electronics' AND price < 300;
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 2 | Mouse | Electronics | 25.99 | 100 | 1 |
| 7 | Monitor | Electronics | 299.99 | 40 | 1 |

**OR Operator:**
```sql
SELECT * FROM products
WHERE category = 'Furniture' OR category = 'Stationery';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 3 | Desk Chair | Furniture | 199.99 | 25 | 2 |
| 4 | Notebook | Stationery | 5.99 | 200 | 3 |
| 6 | Pen | Stationery | 1.99 | 500 | 3 |

**NOT Operator:**
```sql
SELECT * FROM products
WHERE NOT category = 'Electronics';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 3 | Desk Chair | Furniture | 199.99 | 25 | 2 |
| 4 | Notebook | Stationery | 5.99 | 200 | 3 |
| 6 | Pen | Stationery | 1.99 | 500 | 3 |

### 3. BETWEEN Operator

Selects values within a range.

**Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE column_name BETWEEN value1 AND value2;
```

**Examples:**

**Price range:**
```sql
SELECT name, price FROM products
WHERE price BETWEEN 100 AND 400;
```

**Output:**
| name | price |
|------|-------|
| Desk Chair | 199.99 |
| Tablet | 399.99 |
| Monitor | 299.99 |

### 4. IN Operator

Matches any value in a list.

**Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE column_name IN (value1, value2, ...);
```

**Examples:**

**Multiple categories:**
```sql
SELECT * FROM products
WHERE category IN ('Electronics', 'Furniture');
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 1 | Laptop | Electronics | 999.99 | 50 | 1 |
| 2 | Mouse | Electronics | 25.99 | 100 | 1 |
| 3 | Desk Chair | Furniture | 199.99 | 25 | 2 |
| 5 | Tablet | Electronics | 399.99 | 30 | 1 |
| 7 | Monitor | Electronics | 299.99 | 40 | 1 |

**Specific IDs:**
```sql
SELECT name, price FROM products
WHERE id IN (1, 3, 5);
```

**Output:**
| name | price |
|------|-------|
| Laptop | 999.99 |
| Desk Chair | 199.99 |
| Tablet | 399.99 |

### 5. LIKE Operator

Searches for a pattern in a column.

**Wildcards:**
- `%` - Represents zero or more characters
- `_` - Represents a single character

**Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE column_name LIKE pattern;
```

**Examples:**

**Names starting with 'L':**
```sql
SELECT * FROM products
WHERE name LIKE 'L%';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 1 | Laptop | Electronics | 999.99 | 50 | 1 |

**Names containing 'ook':**
```sql
SELECT * FROM products
WHERE name LIKE '%ook%';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 4 | Notebook | Stationery | 5.99 | 200 | 3 |

**Names with exactly 3 characters:**
```sql
SELECT * FROM products
WHERE name LIKE '___';
```

**Output:**
| id | name | category | price | stock | supplier_id |
|----|------|----------|-------|-------|-------------|
| 6 | Pen | Stationery | 1.99 | 500 | 3 |

### 6. IS NULL / IS NOT NULL

Checks for NULL values.

**Examples:**

**Add a column with NULL values for demonstration:**
```sql
ALTER TABLE products ADD COLUMN description VARCHAR(100);
UPDATE products SET description = 'High-performance laptop' WHERE id = 1;
UPDATE products SET description = 'Wireless mouse' WHERE id = 2;
-- Leave others as NULL
```

**Find products without description:**
```sql
SELECT name, description FROM products
WHERE description IS NULL;
```

**Output:**
| name | description |
|------|-------------|
| Desk Chair | NULL |
| Notebook | NULL |
| Tablet | NULL |
| Pen | NULL |
| Monitor | NULL |

**Find products with description:**
```sql
SELECT name, description FROM products
WHERE description IS NOT NULL;
```

**Output:**
| name | description |
|------|-------------|
| Laptop | High-performance laptop |
| Mouse | Wireless mouse |

---

## Sorting

Sorting arranges query results in a specific order.

### ORDER BY Clause

**Basic Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...;
```

**Sort Options:**
- `ASC` - Ascending order (default)
- `DESC` - Descending order

**Examples:**

**Sort by price (ascending):**
```sql
SELECT name, price FROM products
ORDER BY price;
```

**Output:**
| name | price |
|------|-------|
| Pen | 1.99 |
| Notebook | 5.99 |
| Mouse | 25.99 |
| Desk Chair | 199.99 |
| Monitor | 299.99 |
| Tablet | 399.99 |
| Laptop | 999.99 |

**Sort by price (descending):**
```sql
SELECT name, price FROM products
ORDER BY price DESC;
```

**Output:**
| name | price |
|------|-------|
| Laptop | 999.99 |
| Tablet | 399.99 |
| Monitor | 299.99 |
| Desk Chair | 199.99 |
| Mouse | 25.99 |
| Notebook | 5.99 |
| Pen | 1.99 |

**Sort by multiple columns:**
```sql
SELECT name, category, price FROM products
ORDER BY category ASC, price DESC;
```

**Output:**
| name | category | price |
|------|----------|-------|
| Laptop | Electronics | 999.99 |
| Tablet | Electronics | 399.99 |
| Monitor | Electronics | 299.99 |
| Mouse | Electronics | 25.99 |
| Desk Chair | Furniture | 199.99 |
| Notebook | Stationery | 5.99 |
| Pen | Stationery | 1.99 |

---

## Aliases

Aliases provide temporary names for tables or columns in a query.

### Column Aliases

**Basic Syntax:**
```sql
SELECT column_name AS alias_name
FROM table_name;
```

**Examples:**

**Single column alias:**
```sql
SELECT name AS product_name, price AS cost
FROM products;
```

**Output:**
| product_name | cost |
|--------------|------|
| Laptop | 999.99 |
| Mouse | 25.99 |
| Desk Chair | 199.99 |
| Notebook | 5.99 |
| Tablet | 399.99 |
| Pen | 1.99 |
| Monitor | 299.99 |

**Alias with spaces (use quotes):**
```sql
SELECT name AS "Product Name", price AS "Unit Price"
FROM products;
```

**Output:**
| Product Name | Unit Price |
|--------------|------------|
| Laptop | 999.99 |
| Mouse | 25.99 |
| Desk Chair | 199.99 |
| Notebook | 5.99 |
| Tablet | 399.99 |
| Pen | 1.99 |
| Monitor | 299.99 |

### Table Aliases

**Basic Syntax:**
```sql
SELECT column_name
FROM table_name AS alias_name;
```

**Examples:**

**Single table alias:**
```sql
SELECT p.name, p.price
FROM products AS p
WHERE p.category = 'Electronics';
```

**Output:**
| name | price |
|------|-------|
| Laptop | 999.99 |
| Mouse | 25.99 |
| Tablet | 399.99 |
| Monitor | 299.99 |

---

## Functions

SQL provides built-in functions to perform calculations and manipulate data.

### Sample Data for Function Examples

**customers table:**
| id | first_name | last_name | email | registration_date | age |
|----|------------|-----------|-------|-------------------|-----|
| 1 | john | doe | john.doe@email.com | 2023-01-15 | 25 |
| 2 | jane | smith | jane.smith@email.com | 2023-02-20 | 30 |
| 3 | mike | johnson | mike.johnson@email.com | 2023-01-10 | 35 |
| 4 | sarah | wilson | sarah.wilson@email.com | 2023-03-05 | 28 |

### 1. String Functions

#### CONCAT Function
Combines two or more strings.

**Syntax:**
```sql
CONCAT(string1, string2, ...)
```

**Examples:**

**Combine first and last name:**
```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM customers;
```

**Output:**
| full_name |
|-----------|
| john doe |
| jane smith |
| mike johnson |
| sarah wilson |

**Create email prefix:**
```sql
SELECT CONCAT(first_name, '.', last_name) AS email_prefix
FROM customers;
```

**Output:**
| email_prefix |
|--------------|
| john.doe |
| jane.smith |
| mike.johnson |
| sarah.wilson |

#### UPPER Function
Converts string to uppercase.

**Syntax:**
```sql
UPPER(string)
```

**Examples:**

**Convert names to uppercase:**
```sql
SELECT UPPER(first_name) AS first_name_upper, 
       UPPER(last_name) AS last_name_upper
FROM customers;
```

**Output:**
| first_name_upper | last_name_upper |
|------------------|-----------------|
| JOHN | DOE |
| JANE | SMITH |
| MIKE | JOHNSON |
| SARAH | WILSON |

#### LOWER Function
Converts string to lowercase.

**Syntax:**
```sql
LOWER(string)
```

**Examples:**

**Convert email to lowercase:**
```sql
SELECT LOWER(email) AS email_lower
FROM customers;
```

**Output:**
| email_lower |
|-------------|
| john.doe@email.com |
| jane.smith@email.com |
| mike.johnson@email.com |
| sarah.wilson@email.com |

#### SUBSTRING Function
Extracts a substring from a string.

**Syntax:**
```sql
SUBSTRING(string, start_position, length)
```

**Examples:**

**Extract first 3 characters of first name:**
```sql
SELECT first_name, SUBSTRING(first_name, 1, 3) AS first_three_chars
FROM customers;
```

**Output:**
| first_name | first_three_chars |
|------------|-------------------|
| john | joh |
| jane | jan |
| mike | mik |
| sarah | sar |

**Extract domain from email:**
```sql
SELECT email, SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email)) AS domain
FROM customers;
```

**Output:**
| email | domain |
|-------|--------|
| john.doe@email.com | email.com |
| jane.smith@email.com | email.com |
| mike.johnson@email.com | email.com |
| sarah.wilson@email.com | email.com |

### 2. Numeric Functions

#### Sample Data for Numeric Functions

**sales table:**
| id | product_id | quantity | unit_price | total_amount |
|----|------------|----------|------------|--------------|
| 1 | 1 | 2 | 999.99 | 1999.98 |
| 2 | 2 | 5 | 25.99 | 129.95 |
| 3 | 3 | 1 | 199.99 | 199.99 |
| 4 | 4 | 10 | 5.99 | 59.90 |
| 5 | 5 | 3 | 399.99 | 1199.97 |

#### ROUND Function
Rounds a number to a specified number of decimal places.

**Syntax:**
```sql
ROUND(number, decimal_places)
```

**Examples:**

**Round to 2 decimal places:**
```sql
SELECT total_amount, ROUND(total_amount, 2) AS rounded_amount
FROM sales;
```

**Output:**
| total_amount | rounded_amount |
|--------------|----------------|
| 1999.98 | 1999.98 |
| 129.95 | 129.95 |
| 199.99 | 199.99 |
| 59.90 | 59.90 |
| 1199.97 | 1199.97 |

**Round to whole numbers:**
```sql
SELECT unit_price, ROUND(unit_price, 0) AS rounded_price
FROM sales;
```

**Output:**
| unit_price | rounded_price |
|------------|---------------|
| 999.99 | 1000 |
| 25.99 | 26 |
| 199.99 | 200 |
| 5.99 | 6 |
| 399.99 | 400 |

#### CEIL Function
Returns the smallest integer greater than or equal to the number.

**Syntax:**
```sql
CEIL(number)
```

**Examples:**

**Ceiling of unit prices:**
```sql
SELECT unit_price, CEIL(unit_price) AS ceiling_price
FROM sales;
```

**Output:**
| unit_price | ceiling_price |
|------------|---------------|
| 999.99 | 1000 |
| 25.99 | 26 |
| 199.99 | 200 |
| 5.99 | 6 |
| 399.99 | 400 |

#### FLOOR Function
Returns the largest integer less than or equal to the number.

**Syntax:**
```sql
FLOOR(number)
```

**Examples:**

**Floor of unit prices:**
```sql
SELECT unit_price, FLOOR(unit_price) AS floor_price
FROM sales;
```

**Output:**
| unit_price | floor_price |
|------------|-------------|
| 999.99 | 999 |
| 25.99 | 25 |
| 199.99 | 199 |
| 5.99 | 5 |
| 399.99 | 399 |

### 3. Date Functions

#### Sample Data for Date Functions

**orders table:**
| id | customer_id | order_date | ship_date | delivery_date |
|----|-------------|------------|-----------|---------------|
| 1 | 1 | 2023-01-15 | 2023-01-17 | 2023-01-20 |
| 2 | 2 | 2023-02-20 | 2023-02-22 | 2023-02-25 |
| 3 | 3 | 2023-01-10 | 2023-01-12 | 2023-01-15 |
| 4 | 4 | 2023-03-05 | 2023-03-07 | 2023-03-10 |
| 5 | 1 | 2023-04-01 | 2023-04-03 | 2023-04-06 |

#### NOW() Function
Returns the current date and time.

**Syntax:**
```sql
NOW()
```

**Examples:**

**Current date and time:**
```sql
SELECT NOW() AS current_datetime;
```

**Output:**
| current_datetime |
|------------------|
| 2023-12-25 14:30:45 |

**Days since order:**
```sql
SELECT id, order_date, NOW() AS current_date,
       DATEDIFF(NOW(), order_date) AS days_since_order
FROM orders;
```

**Output:**
| id | order_date | current_date | days_since_order |
|----|------------|--------------|------------------|
| 1 | 2023-01-15 | 2023-12-25 14:30:45 | 344 |
| 2 | 2023-02-20 | 2023-12-25 14:30:45 | 308 |
| 3 | 2023-01-10 | 2023-12-25 14:30:45 | 349 |
| 4 | 2023-03-05 | 2023-12-25 14:30:45 | 295 |
| 5 | 2023-04-01 | 2023-12-25 14:30:45 | 268 |

#### DATEPART Function
Extracts a specific part of a date.

**Syntax:**
```sql
DATEPART(part, date)
```

**Parts:**
- `YEAR` - Year
- `MONTH` - Month
- `DAY` - Day
- `HOUR` - Hour
- `MINUTE` - Minute
- `SECOND` - Second

**Examples:**

**Extract year and month:**
```sql
SELECT order_date,
       DATEPART(YEAR, order_date) AS order_year,
       DATEPART(MONTH, order_date) AS order_month,
       DATEPART(DAY, order_date) AS order_day
FROM orders;
```

**Output:**
| order_date | order_year | order_month | order_day |
|------------|------------|-------------|-----------|
| 2023-01-15 | 2023 | 1 | 15 |
| 2023-02-20 | 2023 | 2 | 20 |
| 2023-01-10 | 2023 | 1 | 10 |
| 2023-03-05 | 2023 | 3 | 5 |
| 2023-04-01 | 2023 | 4 | 1 |

#### DATEDIFF Function
Calculates the difference between two dates.

**Syntax:**
```sql
DATEDIFF(date1, date2)
```

**Examples:**

**Days between order and delivery:**
```sql
SELECT id, order_date, delivery_date,
       DATEDIFF(delivery_date, order_date) AS delivery_days
FROM orders;
```

**Output:**
| id | order_date | delivery_date | delivery_days |
|----|------------|---------------|---------------|
| 1 | 2023-01-15 | 2023-01-20 | 5 |
| 2 | 2023-02-20 | 2023-02-25 | 5 |
| 3 | 2023-01-10 | 2023-01-15 | 5 |
| 4 | 2023-03-05 | 2023-03-10 | 5 |
| 5 | 2023-04-01 | 2023-04-06 | 5 |

**Shipping time:**
```sql
SELECT id, order_date, ship_date,
       DATEDIFF(ship_date, order_date) AS shipping_days
FROM orders;
```

**Output:**
| id | order_date | ship_date | shipping_days |
|----|------------|-----------|---------------|
| 1 | 2023-01-15 | 2023-01-17 | 2 |
| 2 | 2023-02-20 | 2023-02-22 | 2 |
| 3 | 2023-01-10 | 2023-01-12 | 2 |
| 4 | 2023-03-05 | 2023-03-07 | 2 |
| 5 | 2023-04-01 | 2023-04-03 | 2 |

---

## Summary

This guide covered the fundamental SQL concepts for beginners:

1. **Introduction to SQL** - Understanding what SQL is and its benefits
2. **Types of SQL** - DDL, DML, DCL, and TCL commands
3. **Basic Commands** - SELECT, INSERT, UPDATE, DELETE with examples
4. **Data Types** - Numeric, String, and Date/Time types
5. **Filtering** - WHERE, AND, OR, NOT, BETWEEN, IN, LIKE, IS NULL
6. **Sorting** - ORDER BY for organizing results
7. **Aliases** - AS keyword for temporary names
8. **Functions** - String, Numeric, and Date functions with practical examples

Each concept includes detailed explanations, syntax, practical examples, and sample output tables to help you understand how SQL works in real-world scenarios.

### Next Steps

After mastering these beginner concepts, you can move on to:
- **Intermediate SQL** - JOINs, Subqueries, GROUP BY, HAVING
- **Advanced SQL** - Window Functions, CTEs, Stored Procedures
- **Database Design** - Normalization, Relationships, Indexes

### Practice Tips

1. **Start with simple queries** and gradually increase complexity
2. **Practice with real data** to understand practical applications
3. **Use different database systems** (MySQL, PostgreSQL, SQL Server)
4. **Build small projects** to reinforce learning
5. **Read and write lots of SQL** to improve fluency

Happy querying! 🚀