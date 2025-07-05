# 🟡 Intermediate SQL Guide

## Table of Contents
1. [Joins](#joins)
2. [Set Operations](#set-operations)
3. [Grouping and Aggregation](#grouping-and-aggregation)
4. [Subqueries](#subqueries)
5. [Views](#views)
6. [CASE Statements](#case-statements)
7. [NULL Handling](#null-handling)
8. [Constraints](#constraints)

---

## Joins

Joins combine rows from two or more tables based on a related column. They are essential for working with normalized relational databases.

### Sample Data for Join Examples

**employees table:**
| employee_id | name | department_id | salary | hire_date |
|-------------|------|---------------|--------|-----------|
| 1 | John Doe | 1 | 75000 | 2023-01-15 |
| 2 | Jane Smith | 2 | 65000 | 2023-02-20 |
| 3 | Mike Johnson | 1 | 80000 | 2023-01-10 |
| 4 | Sarah Wilson | 3 | 70000 | 2023-03-05 |
| 5 | David Brown | NULL | 72000 | 2023-02-28 |

**departments table:**
| department_id | department_name | location | manager_id |
|---------------|-----------------|----------|------------|
| 1 | IT | New York | 3 |
| 2 | HR | Chicago | 2 |
| 3 | Finance | Boston | 4 |
| 4 | Marketing | Los Angeles | NULL |

### INNER JOIN

Returns only the rows that have matching values in both tables.

**Syntax:**
```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
```

**Example:**
```sql
SELECT e.name, e.salary, d.department_name, d.location
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

**Output:**
| name | salary | department_name | location |
|------|--------|-----------------|----------|
| John Doe | 75000 | IT | New York |
| Jane Smith | 65000 | HR | Chicago |
| Mike Johnson | 80000 | IT | New York |
| Sarah Wilson | 70000 | Finance | Boston |

> **Note:** David Brown is excluded because he has no department (NULL), and Marketing department is excluded because it has no employees.

### LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table and matching rows from the right table. If no match, NULL values are returned for right table columns.

**Syntax:**
```sql
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;
```

**Example:**
```sql
SELECT e.name, e.salary, d.department_name, d.location
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

**Output:**
| name | salary | department_name | location |
|------|--------|-----------------|----------|
| John Doe | 75000 | IT | New York |
| Jane Smith | 65000 | HR | Chicago |
| Mike Johnson | 80000 | IT | New York |
| Sarah Wilson | 70000 | Finance | Boston |
| David Brown | 72000 | NULL | NULL |

### RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table and matching rows from the left table. If no match, NULL values are returned for left table columns.

**Syntax:**
```sql
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;
```

**Example:**
```sql
SELECT e.name, e.salary, d.department_name, d.location
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;
```

**Output:**
| name | salary | department_name | location |
|------|--------|-----------------|----------|
| John Doe | 75000 | IT | New York |
| Mike Johnson | 80000 | IT | New York |
| Jane Smith | 65000 | HR | Chicago |
| Sarah Wilson | 70000 | Finance | Boston |
| NULL | NULL | Marketing | Los Angeles |

### FULL OUTER JOIN

Returns all rows from both tables. If there's no match, NULL values are returned for the missing side.

**Syntax:**
```sql
SELECT columns
FROM table1
FULL OUTER JOIN table2 ON table1.column = table2.column;
```

**Example:**
```sql
SELECT e.name, e.salary, d.department_name, d.location
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

**Output:**
| name | salary | department_name | location |
|------|--------|-----------------|----------|
| John Doe | 75000 | IT | New York |
| Jane Smith | 65000 | HR | Chicago |
| Mike Johnson | 80000 | IT | New York |
| Sarah Wilson | 70000 | Finance | Boston |
| David Brown | 72000 | NULL | NULL |
| NULL | NULL | Marketing | Los Angeles |

### SELF JOIN

A self join is when a table is joined with itself. Useful for hierarchical data or comparing rows within the same table.

**Example - Find employees and their managers:**
```sql
SELECT e.name AS employee_name, m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

**Example - Find employees in the same department:**
```sql
SELECT e1.name AS employee1, e2.name AS employee2, e1.department_id
FROM employees e1
JOIN employees e2 ON e1.department_id = e2.department_id
WHERE e1.employee_id < e2.employee_id;
```

**Output (same department):**
| employee1 | employee2 | department_id |
|-----------|-----------|---------------|
| John Doe | Mike Johnson | 1 |

### CROSS JOIN

Returns the Cartesian product of both tables - every row from the first table combined with every row from the second table.

**Syntax:**
```sql
SELECT columns
FROM table1
CROSS JOIN table2;
```

> ⚠️ **Warning:** CROSS JOIN can produce very large result sets. Use with caution!

**Example:**
```sql
SELECT e.name, d.department_name
FROM employees e
CROSS JOIN departments d;
```

This would return 5 × 4 = 20 rows, with each employee paired with each department.

---

## Set Operations

Set operations combine results from multiple SELECT statements.

### Sample Data for Set Operations

**current_employees table:**
| employee_id | name | department |
|-------------|------|------------|
| 1 | John Doe | IT |
| 2 | Jane Smith | HR |
| 3 | Mike Johnson | IT |
| 4 | Sarah Wilson | Finance |

**former_employees table:**
| employee_id | name | department |
|-------------|------|------------|
| 3 | Mike Johnson | IT |
| 5 | David Brown | Sales |
| 6 | Lisa Anderson | Marketing |
| 7 | Tom Wilson | IT |

### UNION

Combines results from multiple SELECT statements, removing duplicate rows.

**Syntax:**
```sql
SELECT columns FROM table1
UNION
SELECT columns FROM table2;
```

**Example:**
```sql
SELECT name, department FROM current_employees
UNION
SELECT name, department FROM former_employees;
```

**Output:**
| name | department |
|------|------------|
| John Doe | IT |
| Jane Smith | HR |
| Mike Johnson | IT |
| Sarah Wilson | Finance |
| David Brown | Sales |
| Lisa Anderson | Marketing |
| Tom Wilson | IT |

### UNION ALL

Combines results from multiple SELECT statements, keeping all rows including duplicates.

**Example:**
```sql
SELECT name, department FROM current_employees
UNION ALL
SELECT name, department FROM former_employees;
```

**Output:**
| name | department |
|------|------------|
| John Doe | IT |
| Jane Smith | HR |
| Mike Johnson | IT |
| Sarah Wilson | Finance |
| Mike Johnson | IT |
| David Brown | Sales |
| Lisa Anderson | Marketing |
| Tom Wilson | IT |

### INTERSECT

Returns only the rows that appear in both result sets.

**Syntax:**
```sql
SELECT columns FROM table1
INTERSECT
SELECT columns FROM table2;
```

**Example:**
```sql
SELECT name, department FROM current_employees
INTERSECT
SELECT name, department FROM former_employees;
```

**Output:**
| name | department |
|------|------------|
| Mike Johnson | IT |

### EXCEPT (MINUS)

Returns rows from the first result set that are not in the second result set.

**Syntax:**
```sql
SELECT columns FROM table1
EXCEPT
SELECT columns FROM table2;
```

**Example:**
```sql
SELECT name, department FROM current_employees
EXCEPT
SELECT name, department FROM former_employees;
```

**Output:**
| name | department |
|------|------------|
| John Doe | IT |
| Jane Smith | HR |
| Sarah Wilson | Finance |

---

## Grouping and Aggregation

Grouping allows you to perform calculations on groups of rows that share common values.

### Sample Data for Grouping Examples

**sales table:**
| id | salesperson | region | product_category | amount | sale_date |
|----|-------------|--------|------------------|--------|-----------|
| 1 | John | North | Electronics | 1500 | 2023-01-15 |
| 2 | Jane | South | Electronics | 2000 | 2023-01-20 |
| 3 | Mike | North | Clothing | 800 | 2023-01-25 |
| 4 | Sarah | East | Electronics | 1200 | 2023-02-01 |
| 5 | John | North | Electronics | 1800 | 2023-02-05 |
| 6 | Jane | South | Clothing | 600 | 2023-02-10 |
| 7 | Mike | North | Electronics | 2200 | 2023-02-15 |
| 8 | Sarah | East | Clothing | 900 | 2023-02-20 |

### GROUP BY

Groups rows that have the same values in specified columns.

**Syntax:**
```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1;
```

**Example - Sales by region:**
```sql
SELECT region, SUM(amount) as total_sales, COUNT(*) as num_sales
FROM sales
GROUP BY region;
```

**Output:**
| region | total_sales | num_sales |
|--------|-------------|-----------|
| North | 5300 | 3 |
| South | 2600 | 2 |
| East | 2100 | 2 |

### HAVING

Filters groups based on aggregate conditions. Use HAVING instead of WHERE with aggregate functions.

**Syntax:**
```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1
HAVING aggregate_condition;
```

**Example - Regions with total sales > 2500:**
```sql
SELECT region, SUM(amount) as total_sales, COUNT(*) as num_sales
FROM sales
GROUP BY region
HAVING SUM(amount) > 2500;
```

**Output:**
| region | total_sales | num_sales |
|--------|-------------|-----------|
| North | 5300 | 3 |
| South | 2600 | 2 |

### Aggregate Functions

#### SUM
Calculates the sum of numeric values.

**Example:**
```sql
SELECT product_category, SUM(amount) as total_sales
FROM sales
GROUP BY product_category;
```

**Output:**
| product_category | total_sales |
|------------------|-------------|
| Electronics | 8700 |
| Clothing | 2300 |

#### AVG
Calculates the average of numeric values.

**Example:**
```sql
SELECT product_category, AVG(amount) as avg_sale_amount
FROM sales
GROUP BY product_category;
```

**Output:**
| product_category | avg_sale_amount |
|------------------|-----------------|
| Electronics | 1740 |
| Clothing | 766.67 |

#### COUNT
Counts the number of rows or non-NULL values.

**Example:**
```sql
SELECT salesperson, COUNT(*) as total_sales, COUNT(DISTINCT product_category) as categories_sold
FROM sales
GROUP BY salesperson;
```

**Output:**
| salesperson | total_sales | categories_sold |
|-------------|-------------|-----------------|
| John | 2 | 1 |
| Jane | 2 | 2 |
| Mike | 2 | 2 |
| Sarah | 2 | 2 |

#### MIN and MAX
Find the minimum and maximum values.

**Example:**
```sql
SELECT region, MIN(amount) as min_sale, MAX(amount) as max_sale
FROM sales
GROUP BY region;
```

**Output:**
| region | min_sale | max_sale |
|--------|----------|----------|
| North | 800 | 2200 |
| South | 600 | 2000 |
| East | 900 | 1200 |

---

## Subqueries

A subquery is a query nested inside another query. They can be used in SELECT, FROM, WHERE, and HAVING clauses.

### Sample Data for Subquery Examples

**employees table:**
| employee_id | name | department_id | salary | manager_id |
|-------------|------|---------------|--------|------------|
| 1 | John Doe | 1 | 75000 | 3 |
| 2 | Jane Smith | 2 | 65000 | 4 |
| 3 | Mike Johnson | 1 | 85000 | NULL |
| 4 | Sarah Wilson | 2 | 78000 | NULL |
| 5 | David Brown | 1 | 72000 | 3 |
| 6 | Lisa Anderson | 3 | 68000 | 7 |
| 7 | Tom Wilson | 3 | 82000 | NULL |

### Scalar Subqueries

Returns a single value (one row, one column).

**Example - Find employees earning more than average:**
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**Output:**
| name | salary |
|------|--------|
| Mike Johnson | 85000 |
| Sarah Wilson | 78000 |
| Tom Wilson | 82000 |

### Correlated Subqueries

References columns from the outer query. Executed once for each row in the outer query.

**Example - Find employees earning more than their department average:**
```sql
SELECT e1.name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

**Output:**
| name | salary | department_id |
|------|--------|---------------|
| Mike Johnson | 85000 | 1 |
| Sarah Wilson | 78000 | 2 |
| Tom Wilson | 82000 | 3 |

### Nested Subqueries

Subqueries that return multiple rows, used with IN, ANY, ALL operators.

**Example - Find employees in departments with more than 2 employees:**
```sql
SELECT name, department_id
FROM employees
WHERE department_id IN (
    SELECT department_id
    FROM employees
    GROUP BY department_id
    HAVING COUNT(*) > 2
);
```

**Output:**
| name | department_id |
|------|---------------|
| John Doe | 1 |
| Mike Johnson | 1 |
| David Brown | 1 |

**Example - Using ANY operator:**
```sql
SELECT name, salary
FROM employees
WHERE salary > ANY (
    SELECT salary
    FROM employees
    WHERE department_id = 2
);
```

**Output (salary > any HR salary):**
| name | salary |
|------|--------|
| John Doe | 75000 |
| Mike Johnson | 85000 |
| Sarah Wilson | 78000 |
| David Brown | 72000 |
| Lisa Anderson | 68000 |
| Tom Wilson | 82000 |

---

## Views

A view is a virtual table based on the result of a SELECT statement. It provides a way to simplify complex queries and enhance security.

### Create Views

**Syntax:**
```sql
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

**Example - Create a view for IT department employees:**
```sql
CREATE VIEW it_employees AS
SELECT employee_id, name, salary, hire_date
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'IT';
```

**Example - Create a view for employee summary:**
```sql
CREATE VIEW employee_summary AS
SELECT 
    e.name,
    e.salary,
    d.department_name,
    CASE 
        WHEN e.salary >= 80000 THEN 'High'
        WHEN e.salary >= 70000 THEN 'Medium'
        ELSE 'Low'
    END as salary_grade
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

### Using Views

Once created, views can be used like regular tables:

**Example:**
```sql
SELECT * FROM employee_summary
WHERE salary_grade = 'High';
```

**Output:**
| name | salary | department_name | salary_grade |
|------|--------|-----------------|--------------|
| Mike Johnson | 85000 | IT | High |
| Tom Wilson | 82000 | Finance | High |

### Update Views

**Syntax:**
```sql
CREATE OR REPLACE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

**Example:**
```sql
CREATE OR REPLACE VIEW it_employees AS
SELECT employee_id, name, salary, hire_date, manager_id
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'IT';
```

### Drop Views

**Syntax:**
```sql
DROP VIEW view_name;
```

**Example:**
```sql
DROP VIEW it_employees;
```

> 💡 **Benefits of Views:**
> - Simplify complex queries
> - Enhance security by restricting access to specific columns
> - Provide data abstraction
> - Maintain backward compatibility

---

## CASE Statements

CASE statements provide conditional logic in SQL queries, similar to if-else statements in programming languages.

### Simple CASE

**Syntax:**
```sql
CASE column_name
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ...
    ELSE default_result
END
```

**Example - Department names:**
```sql
SELECT name, salary,
    CASE department_id
        WHEN 1 THEN 'Information Technology'
        WHEN 2 THEN 'Human Resources'
        WHEN 3 THEN 'Finance'
        ELSE 'Other'
    END as department_full_name
FROM employees;
```

**Output:**
| name | salary | department_full_name |
|------|--------|--------------------|
| John Doe | 75000 | Information Technology |
| Jane Smith | 65000 | Human Resources |
| Mike Johnson | 85000 | Information Technology |
| Sarah Wilson | 78000 | Human Resources |
| David Brown | 72000 | Information Technology |
| Lisa Anderson | 68000 | Finance |
| Tom Wilson | 82000 | Finance |

### Searched CASE

**Syntax:**
```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    ELSE default_result
END
```

**Example - Salary categories:**
```sql
SELECT name, salary,
    CASE
        WHEN salary >= 80000 THEN 'High Salary'
        WHEN salary >= 70000 THEN 'Medium Salary'
        WHEN salary >= 60000 THEN 'Low Salary'
        ELSE 'Very Low Salary'
    END as salary_category
FROM employees
ORDER BY salary DESC;
```

**Output:**
| name | salary | salary_category |
|------|--------|-----------------|
| Mike Johnson | 85000 | High Salary |
| Tom Wilson | 82000 | High Salary |
| Sarah Wilson | 78000 | Medium Salary |
| John Doe | 75000 | Medium Salary |
| David Brown | 72000 | Medium Salary |
| Lisa Anderson | 68000 | Low Salary |
| Jane Smith | 65000 | Low Salary |

### CASE in Aggregations

**Example - Count employees by salary range:**
```sql
SELECT 
    COUNT(CASE WHEN salary >= 80000 THEN 1 END) as high_salary_count,
    COUNT(CASE WHEN salary >= 70000 AND salary < 80000 THEN 1 END) as medium_salary_count,
    COUNT(CASE WHEN salary < 70000 THEN 1 END) as low_salary_count
FROM employees;
```

**Output:**
| high_salary_count | medium_salary_count | low_salary_count |
|-------------------|---------------------|------------------|
| 2 | 3 | 2 |

---

## NULL Handling

NULL represents missing or unknown data. Special functions are needed to handle NULL values properly.

### Sample Data with NULLs

**customers table:**
| customer_id | name | email | phone | address |
|-------------|------|-------|-------|---------|
| 1 | John Doe | john@email.com | 555-1234 | 123 Main St |
| 2 | Jane Smith | jane@email.com | NULL | 456 Oak Ave |
| 3 | Mike Johnson | NULL | 555-5678 | NULL |
| 4 | Sarah Wilson | sarah@email.com | NULL | NULL |

### IS NULL / IS NOT NULL

**Example - Find customers without phone numbers:**
```sql
SELECT name, email, phone
FROM customers
WHERE phone IS NULL;
```

**Output:**
| name | email | phone |
|------|-------|-------|
| Jane Smith | jane@email.com | NULL |
| Sarah Wilson | sarah@email.com | NULL |

**Example - Find customers with complete contact info:**
```sql
SELECT name, email, phone, address
FROM customers
WHERE phone IS NOT NULL AND email IS NOT NULL AND address IS NOT NULL;
```

**Output:**
| name | email | phone | address |
|------|-------|-------|---------|
| John Doe | john@email.com | 555-1234 | 123 Main St |

### COALESCE

Returns the first non-NULL value from a list of expressions.

**Syntax:**
```sql
COALESCE(value1, value2, value3, ...)
```

**Example - Provide default values:**
```sql
SELECT name,
    COALESCE(email, 'No email provided') as email,
    COALESCE(phone, 'No phone provided') as phone,
    COALESCE(address, 'No address provided') as address
FROM customers;
```

**Output:**
| name | email | phone | address |
|------|-------|-------|---------|
| John Doe | john@email.com | 555-1234 | 123 Main St |
| Jane Smith | jane@email.com | No phone provided | 456 Oak Ave |
| Mike Johnson | No email provided | 555-5678 | No address provided |
| Sarah Wilson | sarah@email.com | No phone provided | No address provided |

### IFNULL (MySQL) / ISNULL (SQL Server)

Returns an alternative value if the expression is NULL.

**Syntax:**
```sql
IFNULL(expression, alternative_value)  -- MySQL
ISNULL(expression, alternative_value)  -- SQL Server
```

**Example:**
```sql
SELECT name,
    IFNULL(phone, 'Not provided') as phone_number
FROM customers;
```

**Output:**
| name | phone_number |
|------|-------------|
| John Doe | 555-1234 |
| Jane Smith | Not provided |
| Mike Johnson | 555-5678 |
| Sarah Wilson | Not provided |

### NULLIF

Returns NULL if two expressions are equal; otherwise returns the first expression.

**Syntax:**
```sql
NULLIF(expression1, expression2)
```

**Example - Convert empty strings to NULL:**
```sql
SELECT name,
    NULLIF(email, '') as email,
    NULLIF(phone, '') as phone
FROM customers;
```

---

## Constraints

Constraints are rules enforced on data columns to ensure data integrity and accuracy.

### PRIMARY KEY

Uniquely identifies each row in a table. Cannot contain NULL values.

**Syntax:**
```sql
CREATE TABLE table_name (
    column1 datatype PRIMARY KEY,
    column2 datatype,
    ...
);
```

**Example:**
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2)
);
```

### FOREIGN KEY

Links two tables together and enforces referential integrity.

**Syntax:**
```sql
CREATE TABLE child_table (
    column1 datatype,
    column2 datatype,
    FOREIGN KEY (column1) REFERENCES parent_table(column1)
);
```

**Example:**
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### UNIQUE

Ensures all values in a column are different.

**Example:**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

### CHECK

Ensures that all values in a column satisfy a specific condition.

**Example:**
```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 65),
    salary DECIMAL(10,2) CHECK (salary > 0)
);
```

### DEFAULT

Sets a default value for a column when no value is specified.

**Example:**
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Pending',
    customer_id INT NOT NULL
);
```

### NOT NULL

Ensures that a column cannot have a NULL value.

**Example:**
```sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);
```

### Adding Constraints to Existing Tables

**Example - Add PRIMARY KEY:**
```sql
ALTER TABLE table_name
ADD CONSTRAINT pk_constraint_name PRIMARY KEY (column_name);
```

**Example - Add FOREIGN KEY:**
```sql
ALTER TABLE orders
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
```

**Example - Add CHECK constraint:**
```sql
ALTER TABLE employees
ADD CONSTRAINT chk_salary CHECK (salary > 0);
```

### Dropping Constraints

**Example:**
```sql
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

> 💡 **Best Practices for Constraints:**
> - Always define PRIMARY KEY for each table
> - Use FOREIGN KEY to maintain referential integrity
> - Add CHECK constraints to validate business rules
> - Use NOT NULL for required fields
> - Consider performance impact of constraints

---

## Summary

This intermediate SQL guide covered essential concepts for working with relational databases:

- **Joins** - Combine data from multiple tables using INNER, LEFT, RIGHT, FULL OUTER, SELF, and CROSS joins
- **Set Operations** - Combine query results using UNION, INTERSECT, and EXCEPT
- **Grouping & Aggregation** - Group data and perform calculations with GROUP BY, HAVING, and aggregate functions
- **Subqueries** - Nest queries for complex data retrieval scenarios
- **Views** - Create virtual tables for simplified querying and security
- **CASE Statements** - Add conditional logic to your queries
- **NULL Handling** - Work with missing data using specialized functions
- **Constraints** - Enforce data integrity rules at the database level

### Next Steps

After mastering these intermediate concepts, you can advance to:
- Window Functions and Analytics
- Common Table Expressions (CTEs)
- Stored Procedures and Functions
- Indexes and Query Optimization
- Advanced Database Design

### Practice Tips

1. **Start with joins** - They're fundamental to relational databases
2. **Practice with real data** - Use sample databases like Northwind or Sakila
3. **Combine concepts** - Use joins with subqueries, add CASE statements to views
4. **Focus on performance** - Understand how different approaches affect query speed
5. **Read execution plans** - Learn how the database processes your queries

Happy querying! 🚀