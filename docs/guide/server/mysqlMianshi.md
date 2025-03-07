# MySql

## char 和 varchar 的区别？

在数据库中，CHAR（固定长度字符）和 VARCHAR（可变长度字符）是两种用于存储字符数据的数据类型，它们之间的主要区别在于数据存储方式和存储需求。

**存储方式：**

- CHAR： 存储固定长度的字符数据，不管实际数据的长度是多少，都会占用指定长度的存储空间。如果存储的数据长度小于定义的长度，剩余空间将用空格填充。

- VARCHAR： 存储可变长度的字符数据，实际存储的空间取决于数据的长度。它只占用实际数据的存储空间加上一些额外的字节来记录数据的长度。

**存储需求：**

- CHAR： 由于它存储固定长度的数据，对于每个数据项都需要分配固定的存储空间，可能会浪费一些存储空间。适用于存储长度固定的数据，如固定长度的代码或状态。

- VARCHAR： 由于它存储实际数据的长度，因此在存储可变长度的数据时更为节省空间。适用于存储长度可变的文本数据，如评论、描述等。

**性能：**

- CHAR： 由于存储固定长度，检索时可能更快，但在存储大量可变长度的数据时可能会浪费空间。

- VARCHAR： 由于存储实际数据长度，可能在某些情况下对存储效率更友好，尤其是对于可变长度的数据。

**总体来说，选择使用 CHAR 还是 VARCHAR 取决于你的数据特性和存储需求。如果你知道数据项的长度是固定的，而且不太可能变化，那么使用 CHAR 可能更合适。如果数据长度变化较大，或者你想要更节省存储空间，那么 VARCHAR 可能是更好的选择。**

## 聚合函数有哪些？

数据库中的聚合函数是用于对一组值执行计算并返回单一值的函数。常见的数据库聚合函数包括：

COUNT： 用于计算某列或表中的行数。

```sql
SELECT COUNT(column_name) FROM table_name;
```

SUM： 用于计算某列的数值总和。

```sql
SELECT SUM(column_name) FROM table_name;
```

AVG： 用于计算某列的数值平均值。

```sql
SELECT AVG(column_name) FROM table_name;
```

MIN： 用于找出某列的最小值。

```sql
SELECT MIN(column_name) FROM table_name;
```

MAX： 用于找出某列的最大值。

```sql
SELECT MAX(column_name) FROM table_name;
```

这些聚合函数可以与 GROUP BY 子句一起使用，以便按照一个或多个列对数据进行分组，然后在每个组内

应用聚合函数。例如：

```sql
SELECT column1, COUNT(column2)
FROM table_name
GROUP BY column1;
```

这将返回每个不同的 column1 值及其对应的 column2 计数。

在使用这些聚合函数时，通常需要注意使用合适的 GROUP BY 子句，以确保获得正确的聚合结果

## 除了聚合函数之外还使用过哪些函数？

- 字符串函数

1. `CONCAT`：连接两个或多个字符串。
2. `SUBSTRING` 或 `SUBSTR`：提取子字符串。
3. `UPPER`：将字符串转换为大写。
4. `LOWER`：将字符串转换为小写。
5. `CHAR_LENGTH` 或 `LEN`：返回字符串的长度。
6. `TRIM`：去除字符串首尾的空格。

- 日期和时间函数

1. `NOW()`、 `CURRENT_TIMESTAMP()`: 返回当前的日期和时间。
2. `YEAR`、`MONTH`、`DAY`：从日期中提取年、月、日。
3. `TIME`：从日期时间值中提取时间部分。

- 数学函数

1. `ABS(x)`: 返回 x 的绝对值。
2. `ROUND`：将数值四舍五入。
3. `FLOOR`：向下取整。
4. `CEIL` 或 `CEILING`：向上取整。
5. `RAND()`: 返回一个随机数。
6. `POW(x, y)`, `POWER(x, y)`: 返回 x 的 y 次方。

- 逻辑函数

1. `NULLIF`：如果两个表达式相等，则返回 NULL，否则返回第一个表达式的值。
2. `TO_DATE` 或 `TO_CHAR`：将日期和时间转换为字符串，或字符串转换为日期和时间。

## 连接查询有哪些方法？什么情况使用右外连接？

- 内连接
  返回两个表中满足连接条件的行。如果两个表中没有匹配的行，那么就不会出现在结果集中。

- 左外连接（LEFT JOIN 或 LEFT OUTER JOIN）
  返回左表中的所有行，以及右表中满足连接条件的行。如果右表中没有匹配的行，将返回 NULL 值。

- 右外连接（RIGHT JOIN 或 RIGHT OUTER JOIN）
  返回右表中的所有行，以及左表中满足连接条件的行。如果左表中没有匹配的行，将返回 NULL 值。

- 全外连接（FULL JOIN 或 FULL OUTER JOIN）
  MySQL 本身不直接支持 FULL JOIN，但可以通过组合左连接和右连接来模拟全外连接的效果
  全外连接返回左右两个表中所有匹配的行，同时也会返回左右表中没有匹配的行，这些没有匹配的行在另一个表中显示为 NULL。

- 右外连接适用于以下情况：
  右外连接是根据右表为基础的，左表的数据是辅助的，即使左表中没有匹配的行，右表中的行也会出现在结果集中，并用 NULL 填充左表的列。

> 例如，在一个订单系统中，你可能想列出所有客户，即使他们没有任何订单。在这种情况下，你会以客户表作为右表进行右外连接，以确保所有客户都被列出，无论他们是否下过订单。

## union 和 union all 有什么区别？

UNION 和 UNION ALL 都是用于合并两个或多个 SELECT 语句的结果集

重复行：

- UNION： 它会合并两个结果集并去除重复的行，即结果集中不会包含重复的行
- UNION ALL： 它会合并两个结果集，但不会去除任何重复的行，即结果集中可能包含重复的行。

性能：

- UNION： 由于要去除重复的行，UNION 操作可能会引起一些额外的性能开销。数据库系统需要进行排序
  和去重的操作。
- UNION ALL： 由于不需要去除重复的行，UNION ALL 的性能通常比 UNION 更好。如果确实需要所有的
  行，而不仅仅是不重复的行，使用 UNION ALL 可以避免额外的开销。

语法：

- UNION： 使用 UNION 时，两个 SELECT 语句的列数和数据类型必须相同，否则会导致错误。
- UNION ALL： 对于 UNION ALL，两个 SELECT 语句的列数和数据类型也应该相同，但它允许更灵活一些。结果集中的顺序相同即可。

## between and 和 in 有什么区别？

BETWEEN 和 IN 是 SQL 中用于筛选数据的两种不同的条件操作符。

- BETWEEN 用于在给定的范围内筛选数据
- IN 用于指定一个值列表，以便筛选满足条件的数据。

语法：

- BETWEEN 后面需要两个值，用 AND 连接，表示一个范围。
- IN 后面可以跟一个值列表，用括号括起来。

范围 vs 离散值：

- BETWEEN 用于指定一个范围，适用于连续的值。
- IN 用于指定一个离散的值列表，适用于不连续的值。

性能：

- 在某些情况下，BETWEEN 可能比 IN 更有效率，尤其是在有序索引的情况下。BETWEEN 的查询条件可以更容易地利用索引，因为它表示一个范围。
- IN 的性能可能在查询的值列表较长时略有下降，因为数据库需要逐一匹配值。

`BETWEEN` 更适合描述范围，而 `IN` 更适合描述离散的值列表

## delete 和 truncate table 有什么区别

操作类型：

- DELETE 是一种行级别的操作，用于删除表中的特定行。
- TRUNCATE TABLE 是一种表级别的操作，用于删除整个表的所有数据，但保留表结构。

事务：

- DELETE 可以在事务中使用，可以根据需要回滚或提交。DELETE 操作是事务安全的，这意味着你可以回滚这个操作。如果在删除过程中发生错误，你可以撤销更改，恢复数据。
- TRUNCATE TABLE 是一个 DDL（数据定义语言）操作，通常不能在事务中使用。一些数据库系统（如 MySQL）在使用 TRUNCATE TABLE 时会自动提交当前事务。
  不是事务安全的，一旦执行，无法回滚。这意味着如果你错误地使用了 TRUNCATE TABLE，你将无法恢复数据。

速度：

- DELETE 操作会生成事务日志，并逐行删除数据，因此相对较慢，尤其是在删除大量数据时。因为它需要单独记录每一行的删除
- 由于 TRUNCATE TABLE 是一种表级别的操作，通常比 DELETE 更快，尤其是在删除大量数据时。
  TRUNCATE TABLE 不记录删除的每一行，也不需要执行回滚段的管理,而是直接释放表的数据页。

回滚：

- 可以使用 ROLLBACK 语句回滚 DELETE 操作，但不能回滚 TRUNCATE TABLE。
- 在数据库系统中，TRUNCATE TABLE 通常不会写入事务日志，因此无法回滚。

条件过滤：

- DELETE 可以使用 WHERE 子句来指定删除的条件，可以删除表中满足条件的特定行。
- TRUNCATE TABLE 通常不允许使用 WHERE 子句，它删除整个表的数据。

触发器：

- 如果表上有触发器，DELETE 操作会触发这些触发器。
- TRUNCATE TABLE 通常不会触发表上的触发器。TRUNCATE TABLE 不会触发任何触发器，因为它是作为一个 DDL（数据定义语言）语句来处理的。

综上所述，DELETE 用于删除表中的特定行，具有更多的灵活性，但相对较慢。
TRUNCATE TABLE 用于删除整个表的数据，速度更快，但不如 DELETE 灵活。选择使用哪个操作取决于具体的需求和性能要求。

## 什么是事务？

在数据库管理系统（DBMS）中，事务（Transaction）是指一系列数据库操作组成的逻辑工作单元，这些操作要么全部执行，要么全部不执行，以保证数据库的一致性和完整性。

在 SQL 中，通过以下关键字来控制事务：

- BEGIN TRANSACTION： 用于开始一个事务。
- COMMIT： 用于提交事务，使其更改永久生效。
- ROLLBACK： 用于回滚事务，取消未提交的更改，将数据库回滚到事务开始前的状态。

## 事务的四个特性？怎么实现原子性的？

事务具有以下四个关键属性，通常被称为 ACID 特性：

- 原子性（Atomicity）： 事务是原子性的，即事务中的所有操作要么全部执行成功，要么全部不执行，不会
  出现部分执行的情况。如果其中任何一个操作失败，整个事务将回滚到初始状态。

- 一致性（Consistency）： 事务执行后，数据库从一个一致的状态转变为另一个一致的状态。这意味着事务
  在执行前后，不能破坏数据库数据的完整性和一致性，数据库应该保持一致性，不破坏数据完整性和业务规则。
- 隔离性（Isolation）： 多个事务可以同时在数据库中执行，但它们之间应该是相互隔离的，一个事务的执
  行不应该影响其他事务的执行。隔离性确保并发事务的执行不会导致数据混乱或不一致。

- 持久性（Durability）： 一旦事务提交，其对数据库的修改应该是永久性的，即使系统崩溃，重启后也应该
  保留事务的结果。

**实现原子性的方式：**

原子性通过使用事务的 BEGIN、COMMIT 和 ROLLBACK 操作来实现。当一组 SQL 语句被包裹在 BEGIN
和 COMMIT 之间时，它们形成一个事务。如果事务中的所有 SQL 语句执行成功，那么可以通过 COMMIT
来提交事务，使得所有的更改永久生效。如果在事务执行过程中发生错误，可以通过 ROLLBACK 操作来回
滚事务，取消未提交的更改，将数据库回滚到事务开始前的状态。

下面是一个简单的 SQL 示例，演示了如何使用事务和实现原子性：

```sql
BEGIN TRANSACTION;
-- SQL 语句执行
-- 如果一切正常，提交事务
COMMIT; -- 如果发生错误，回滚事务
ROLLBACK;
```

在程序中，也可以使用编程语言提供的事务管理机制，如在许多编程语言中使用的数据库事务 API 来实现原 子性。这确保了一组操作的原子执行。

## 事务的隔离级别有哪些？分别会产生什么问题？怎么解决这些问题？

SQL 标准定义了四种事务隔离级别，每个级别提供一定程度的隔离，以处理并发事务可能引发的问题。这四个隔离级别由低到高分别是：

- READ UNCOMMITTED（读未提交）：
  允许一个事务读取另一个事务未提交的数据。这是最低的隔离级别，不提供任何隔离保护。
  可能出现脏读、不可重复读和幻读的问题。

- READ COMMITTED（读已提交）：
  允许一个事务只能读取已经提交的其他事务的数据。这是大多数数据库系统的默认隔离级别。
  可能出现不可重复读和幻读的问题，但解决了脏读的问题。

- REPEATABLE READ（可重复读）：
  保证一个事务在其生命周期内多次读取相同的数据，将返回相同的结果，即使其他事务已经修改了数据。其他事务的插入操作将被阻止。
  可能出现幻读的问题，但解决了脏读和不可重复读的问题。

- SERIALIZABLE（串行化）：
  提供最高的隔离级别，确保事务之间完全隔离。事务按顺序执行，所有事务都像是按照顺序串行执行的，没有并发。避免了脏读、不可重复读和幻读的问题，但会降低并发性能。 虽然能保证数据的一致性，但可能会导致大量的事务等待，降低了系统的吞吐量和性能。

**解决**：`SERIALIZABLE`通常不作为常规使用的隔离级别，但在某些情况下，如非常关键的金融交易，可能需要使用串行化来确保绝对的数据一致性。
不同的隔离级别在性能和隔离性之间存在权衡。通常来说，如果应用程序对数据一致性要求较高，可以选择
较高的隔离级别，但需要注意可能的性能影响。在实际应用中，开发者需要仔细评估业务需求，并选择适当
的隔离级别。在某些情况下，也可以使用一些数据库系统提供的特定功能来解决并发问题，如行级锁、乐观锁等。

---

并发事务可能引发一些问题，主要涉及到事务的隔离性。这些问题通常被称为并发控制问题，其中包括以下几个主要问题：

- 脏读（Dirty Read）：
  脏读发生在一个事务读取了另一个事务尚未提交的数据。如果这个事务最终回滚，读取到的数据就是无效的。

  解决方法： 设置事务隔离级别，使用更高的隔离级别，如 `READ COMMITTED`， `REPEATABLE READ`，`SERIALIZABLE` 可以避免脏读。

- 不可重复读（Non-Repeatable Read）：
  不可重复读发生在一个事务内的两个相同查询返回了不同的结果，因为在两次查询之间，另一个事务修改了数据。

  解决方法： 设置隔离级别，如：`REPEATABLE READ`， `Serializable`，或者使用锁定机制。

- 幻读（Phantom Read）：
  幻读发生在一个事务内的两个相同查询返回了不同的结果，因为在两次查询之间，另一个事务插入或删除了数据，导致结果集发生变化。

  解决方法： 设置隔离级别`Serializable`，通过强制事务串行化执行来避免幻读，或者使用锁定机制。

- 丢失更新（Lost Update）：
  丢失更新发生在两个事务同时尝试更新相同数据，但只有一个更新生效，导致另一个更新的结果丢失。

  解决方法： 使用锁定机制，如悲观锁或乐观锁，确保同时只有一个事务可以更新数据。

- 死锁（Deadlock）：
  死锁是指两个或多个事务互相等待对方释放锁，从而导致它们都无法继续执行。

  解决方法： 使用事务超时机制、死锁检测和回滚机制，或者通过应用程序设计来避免死锁的发生。尽量避免同时执行诸如`INSERT`、`UPDATE`和`DELETE`等数据修改语句。
  解决这些问题的方法主要包括合理设置事务的隔离级别，使用锁定机制，以及采用一些并发控制技术，如乐观锁和悲观锁。不同的场景和要求可能需要不同的解决方案，因此在选择解决方法时需要仔细考虑应用程序的需求和性能要求。

| 隔离级别         |   脏读   | 不可重复读 |   幻读   |
| ---------------- | :------: | :--------: | :------: |
| READ UNCOMMITTED | 可能发生 |  可能发生  | 可能发生 |
| READ COMMITTED   | 不会发生 |  可能发生  | 可能发生 |
| REPEATABLE READ  | 不会发生 |  不会发生  | 可能发生 |
| SERIALIZABLE     | 不会发生 |  不会发生  | 不会发生 |

## mysql 中常见的引擎有哪些？有什么区别？

MyISAM：

- 特点： 不支持事务，只支持表级锁定，不支持行级锁。适用于读操作频繁的场景，如查询比较多的静态网站。日志分析、数据分析和报表系统

- 优点： 查询速度快，占用磁盘空间较少。适合静态查询和插入操作。

- 缺点： 不支持事务、数据一致性较差。不支持外键约束，不提供崩溃恢复机制。

InnoDB：

- 特点： 支持 ACID 事务，行级锁定，适用于读写操作频繁的场景，是 MySQL 的默认存储引擎。

- 优点： 支持事务、外键约束，行级锁定，提供崩溃恢复机制，数据一致性较好。适合高并发场景；如金融、电商等。

- 缺点： 相对 MyISAM 更复杂，写操作性能可能较低。

:::tip
InnoDB 的默认数据结构是聚簇索引，而 MyISAM 是非聚簇索引
:::
MEMORY（或 HEAP）：

- 特点： 数据存储在内存中，适用于临时表和数据量较小的场景。

- 优点： 读写速度快，适用于一些临时性数据存储。

- 缺点： 数据存储在内存中，数据是非持久化的，重启服务器或发生崩溃时数据丢失。内存有限，不适合存储大量数据。只支持表级锁定。

ARCHIVE：ao kai wu

- 特点： 数据以压缩格式存储，占用磁盘空间小。适用于大量归档数据的只读表或日志存储。

- 优点： 压缩存储，适用于大量历史数据的归档。大量的日志数据压缩

- 缺点： 不支持索引、事务，只支持 INSERT 和 SELECT 操作。

## 索引的分类？索引目的是？

MySQL 索引是一种用于提高查询性能的数据结构。索引能够快速定位和访问表中的特定行，从而加速数据
的检索和过滤。MySQL 支持多种类型的索引，主要包括以下几类：

**按功能分类**

- 单列索引(普通索引)（Single-Column Index）：
  对表中的单个列创建的索引。没有唯一性的限制，允许为 NULL 值。
  示例：

  ```sql
  CREATE INDEX index_name ON table_name(column_name);
  ```

- 复合索引（Composite Index）：
  对表中的多个列创建的索引。复合索引覆盖了多个列，可以支持多列的查询。
  示例：

  ```sql
  CREATE INDEX index_name ON table_name(column1, column2);
  ```

- 唯一索引（Unique Index）：
  与单列索引类似，但要求索引列的值在整个表中必须唯一。允许为 NULL 值，一个表允许多个列创建唯一索引
  示例：

  ```sql
  CREATE UNIQUE INDEX index_name ON table_name(column_name);
  ```

- 主键索引
  主键索引是一种特殊的唯一索引，一个表只能有一个主键，不允许有空值。一般是在建表的时候同时创建主键索引

- 全文索引（Full-Text Index）：
  用于全文搜索的索引类型，主要用于对文本数据进行模糊匹配。对文本的内容进行分词、搜索，可以提高文本数据的搜索效率。
  示例：

  ```sql
  CREATE FULLTEXT INDEX index_name ON table_name(column_name);
  ```

- 空间索引（Spatial Index）：
  用于空间数据类型（如地理坐标）的索引，支持空间数据的查询。提高空间数据相关查询的效率。
  示例：

  ```sql
  CREATE SPATIAL INDEX index_name ON table_name(column_name);
  ```

**按物理存储分类**

- 聚簇索引（Clustered Index）
- 非聚簇索引（Secondary Index / Non-Clustered Index）

**索引作用：**

索引的主要目的是提高查询性能，通过减少数据库的扫描行数，加速数据的检索。索引能够加速 WHERE 子
句中的条件过滤、JOIN 操作和排序操作。在大型数据库中，使用合适的索引是优化查询性能的关键之一。
索引的作用包括：

- 加速数据检索： 通过索引，数据库可以快速定位到满足查询条件的数据，减少了数据的扫描和读取时间。
- 加速排序操作： 当使用 ORDER BY 子句进行排序时，索引可以减少排序所需的时间。提高 GROUP BY 和 ORDER BY 子句的效率。
- 加速连接操作： 在连接多个表时，索引可以加速连接的执行效率。
- 保持唯一性： 唯一索引可以确保索引列的数值唯一，防止重复数据的插入。

尽管索引能够提高查询性能，但需要注意的是，过多或不合理使用索引可能会导致性能下降，因为每次对表
进行写操作时，都需要更新索引。因此，在设计索引时，需要综合考虑查询和更新操作的需求，选择适当的
索引类型和列。

:::tip
不适合索引场景:

1. 小表或低频查询的表不需要索引。
2. 高频率写入的表，可能因索引维护导致性能问题。
   :::

## 索引有哪些优缺点以及具体有哪些索引类型

**优：**

- 加速数据检索： 通过索引，数据库可以快速定位到满足查询条件的数据，减少了数据的扫描和读取时间。
- 加速排序操作： 当使用 ORDER BY 子句进行排序时，索引可以减少排序所需的时间。提高 GROUP BY 和 ORDER BY 子句的效率。
- 加速连接操作： 在连接多个表时，索引可以加速连接的执行效率。
- 保持唯一性： 唯一索引可以确保索引列的数值唯一，防止重复数据的插入。

**缺：**

- 创建索引和维护索引需要很多时间，这种时间随着数据量的增加而增加。
- 如果一个数据建立了索引，那么增删改这个数据，相应的索引也要进行动态修改，这将大大降低 sql 的执行效率。
- 需要占用物理存储空间：索引需要使用物理文件存储，会耗费一定空间。

**索引的类型：**

参考上面 ⬆️

## 什么是聚集索引和非聚集索引

1. 简单来说，聚集索引就是基于主键创建的索引，除了主键索引以外的其他索引，称为非聚集索引，也叫做二级索引。

2. 由于在 InnoDB 引擎里面，一张表的数据对应的物理文件本身就是按照 B+树来组织的一种索引结构，而聚集索引就是按照每张表的主键来构建一颗 B+树，然后叶子节点里面存储了这个表的每一行数据记录。
3. 所以基于 InnoDB 这样的特性，聚集索引并不仅仅是一种索引类型，还代表着一种数据的存储方式。

4. 同时也意味着每个表里面必须要有一个主键，如果没有主键，InnoDB 会默认选择或者添加一个隐藏列作为主键索引来存储这个表的数据行。一般情况是建议使用自增 id 作为主键，这样的话 id 本身具有连续性使得对应的数据也会按照顺序存储在磁盘上，写入性能和检索性能都很高。否则，如果使用 uuid 这种随机 id，那么在频繁插入数据的时候，就会导致随机磁盘 IO，从而导致性能较低。

5. 需要注意的是，InnoDB 里面只能存在一个聚集索引，原因很简单，如果存在多个聚集索引，那么意味着这个表里面的数据存在多个副本，造成磁盘空间的浪费，以及数据维护的困难。

6. 由于在 InnoDB 里面，主键索引表示的是一种数据存储结构，所以如果是基于非聚集索引来查询一条完整的记录，最终还是需要访问主键索引来检索。

## 聚集索引和非聚集索引区别

区别：

数据检索

- 聚集索引：通过索引键直接定位到数据行，检索速度较快。
- 非聚集索引：通过索引键查找到指针，再通过指针访问数据行，检索速度较慢。需要回表获取数据

存储空间

- 聚集索引：不需要额外的存储空间来存储索引叶节点，因为数据行本身就存储在叶节点中。
- 非聚集索引：需要额外的存储空间来存储索引页。

插入和更新

- 聚集索引：插入新数据或更新现有数据可能会导致数据页的重新排序，性能开销较大。
- 非聚集索引：插入新数据或更新现有数据时性能开销较低，因为不影响数据表的物理存储顺序。

支持的数量

- 聚集索引：一个表只能有一个聚集索引。
- 非聚集索引：一个表可以有多个非聚集索引。

## 为什么 MySQL 索引结构采用 B+树？

一般来说，数据库的存储引擎都是采用 B 树或者 B+树来实现索引的存储。首先来看 B 树
B 树是一种多路平衡树，用这种存储结构来存储大量数据，它的整个高度会相比二叉树来说，会矮很多。
而对于数据库而言，所有的数据都将会保存到磁盘上，而磁盘 I/O 的效率又比较低，特别是在随机磁盘 I/O 的情况下效率更低。
所以高度决定了磁盘 I/O 的次数，磁盘 I/O 次数越少，对于性能的提升就越大，这也是为什么采用 B 树作为索引存储结构的原因

而 MySQL 的 InnoDB 存储引擎，它用了一种增强的 B 树结构，也就是 B+树来作为索引和数据的存储结构。
相比较于 B 树结构来说，B+树做了两个方面的优化

- B+树的所有数据都存储在叶子节点，非叶子节点只存储索引。
- 叶子节点中的数据使用双向链表的方式进行关联。

MySQL 索引结构采用 B+树，有以下 4 个原因：

1. 从磁盘 I/O 效率方面来看：B+树的非叶子节点不存储数据，所以树的每一层就能够存储更多的索引数量，也就是说，B+树在层高相同的情况下，比 B 树的存储数据量更多，间接会减少磁盘 I/O 的次数。

2. 从范围查询效率方面来看：在 MySQL 中，范围查询是一个比较常用的操作，而 B+树的所有存储在叶子节点的数据使用了双向链表来关联，所以 B+树在查询的时候只需查两个节点进行遍历就行，而 B 树需要获取所有节点，因此，B+树在范围查询上效率更高。

3. 从全表扫描方面来看：因为，B+树的叶子节点存储所有数据，所以 B+树的全局扫描能力更强一些，因为它只需要扫描叶子节点。而 B 树需要遍历整个树。

4. 从自增 ID 方面来看：基于 B+树的这样一种数据结构，如果采用自增的整型数据作为主键，还能更好的避免增加数据的时候，带来叶子节点分裂导致的大量运算的问题。

:::tip
b 树：叶子节点和非叶子节点都会存储数据，指针和数据共同保存在同一节点中。
:::

## Mysql 删除重复数据

```sql
--t_good 三个字段，id、type、name; 删除name重复的数据

delete from t_good where id not in (
	select t.id from (select min(id) as id from t_good group by name)t
)
```

## 关于 MVCC 的理解？

MVCC（Multi-Version Concurrency Control，多版本并发控制）

对于 MVCC 的理解，可以先从数据库的三种并发场景说起：

第一种：读读

- 就是线程 A 与线程 B 同时在进行读操作，这种情况下不会出现任何并发问题。

第二种：读写

- 就是线程 A 与线程 B 在同一时刻分别进行读和写操作。这种情况下，可能会对数据库中的数据造成以下问题：
  事物隔离性问题，出现脏读，幻读，不可重复读的问题

第三种：写写

- 就是线程 A 与线程 B 同时进行写操作，这种情况下可能会存在数据更新丢失的问题。

而 MVCC 就是为了解决事务操作中并发安全性问题(确保在高并发下，多个事务读取数据时不加锁也可以多次读取相同的值。)的无锁并发控制技术，全称为`Multi-Version Concurrency Control`，也就是多版本并发控制。它是通过数据库记录中的隐式字段，undo 日志，Read View 来实现的。

MVCC 主要解决了三个问题：

- 第一个是：通过 MVCC 可以解决读写并发阻塞问题从而提升数据并发处理能力

- 第二个是：MVCC 采用了乐观锁的方式实现，降低了死锁的概率

- 第三个是：解决了一致性读的问题，也就是事务启动时根据某个条件读取到的数据直到事务结束时，再次执行相同条件，还是读到同一份数据，不会发生变化。

而我们在使用 MVCC 时一般会根据业务场景来选择组合搭配乐观锁或悲观锁。
这两个组合中，MVCC 用来解决读写冲突，乐观锁或者悲观锁解决写写冲突从而最大程度的提高数据库并发性能。

:::tip
Read View

- ReadView 其实就是一个保存事务 ID 的 list 列表。记录的是本事务执行时，MySQL 还有哪些事务在执行，且还没有提交。(当前系统中还有哪些活跃的读写事务);

Undo Log

- Undo Log 来保存数据的历史版本。

:::

## MVCC 过程中会加锁吗？

MVCC 机制，全称(Multi-Version Concurrency Control)**_多版本并发控制_**，是确保在高并发下，多个事务读取数据时不加锁也可以多次读取相同的值。

MVCC 在读已提交(READ COMMITTED)、可重复读(REPEATABLE READ 简称 RR)模式下才生效。

MVCC 在可重复读的事物隔离级别下，可以解决脏读、脏写、不可重复读等问题。MVCC 是基于乐观锁的实现，所以很自然的想到 MVCC 是不是不会加锁。

**问题答案**

在 MVCC 中，通常不需要加锁来控制并发访问。

相反，每个事务都可以读取已提交的快照，而不需要获得共享锁或排它锁。

在写操作的时候，MVCC 会使用一种叫为**写时复制**(Copy-On-Write)的技术，也就是在修改数据之前先将数据复制一份，从而创建一个新的快照。

当一个事务需要修改数据时，MVCC 会首先检查修改数据的快照版本号。

是否与该事务的快照版本一致，如果一致则表示可以修改这条数据，否则该事务需要等待其他事务完成对该数据的修改。

另外，这个事务在新快照之上修改的结果，事务对数据的修改不会直接覆盖原始数据，而是基于一个新的快照，其他事务可以继续读取原始数据的快照，原始数据的旧版本仍然保留在 Undo Log 中，供其他事务读取。从而解决了脏读、不可重复读问题。

所以，正是有了 MVCC 机制，让多个事务对同一条数据进行读写时，不需要加锁也不会出现读写冲突。

## 索引失效场景

- 在 where 后使用 or，如果 OR 条件中有一个字段没有索引，导致索引失效（尽量少用 or）
- 使用 like ，like 查询是以%开头
- 复合索引遵守**最左前缀**原则，即在查询条件中使用了复合索引的第一个字段，索引才会被使用
- 如果列类型是字符串，那一定要在条件中将数据使用引号引用起来,否则不使用索引
- 使用 `in` 导致索引失效，使用 `NOT` 或 `!=`导致失效
- DATE_FORMAT()格式化时间，格式化后的时间再去比较，可能会导致索引失效。
- 对于 order by、group by 、 union、 distinc 中的字段出现在 where 条件中时，才会利用索引

---

**复合索引失效示例：**

```sql
CREATE INDEX idx_name_age ON users(name, age);
```

在这个例子中，name 和 age 列组成了一个复合索引。假设有一个复合索引 (name, age)：

```sql
-- 索引会被使用
SELECT * FROM users WHERE name = 'Alice';

-- 索引会被使用
SELECT * FROM users WHERE name = 'Alice' AND age = 25;

-- 索引不会被使用
SELECT * FROM users WHERE age = 25;

```

- 第一条查询使用了 name，符合最左前缀原则，索引会被使用。
- 第二条查询同时使用了 name 和 age，也符合最左前缀原则，索引会被使用。
- 第三条查询只使用了 age，没有包含索引的最左列 name，索引不会被使用。

---

**如果列类型是字符串**

当列的数据类型是字符串（如 VARCHAR、CHAR 等），但在查询条件中未使用引号时，MySQL 会尝试进行隐式类型转换。这种隐式类型转换可能导致索引失效。

**原因**

MySQL 在比较两个值时，要求它们的类型一致。如果查询条件中的值与列的类型不匹配，MySQL 会进行隐式类型转换。例如：

如果列 name 是字符串类型（VARCHAR），但查询条件中写成 WHERE name = 123，MySQL 会将 name 列的所有值隐式转换为数字类型。
这种隐式转换会导致索引失效，因为索引是基于原始数据类型的。

**示例**

假设 name 列是字符串类型，并且有索引：

```sql
-- 索引会被使用
SELECT * FROM users WHERE name = 'Alice';

-- 索引不会被使用
SELECT * FROM users WHERE name = 123;
```

## sql 优化

**方式 1：**

针对慢 SQL，我们可以使用关键字 explain 来查看当前 sql 的执行计划.可以重点关注 type key rows filterd 等字段，从而定位该 SQL 执行慢的根本原因

- **type**：range 表示使用了索引范围扫描。(type 表示访问类型，用于说明 MySQL 决定如何查找行)
- **key**：表示实际使用的索引。
- **rows**：表示 MySQL 预计需要检查的行数。
- **filterd**表示 MySQL 估计经过 WHERE 子句过滤后，只有大约 xxxx% 的行会被保留下来。

:::tip
type：

- **system**：表只有一行记录，这是最好的情况。
- **const**：通过主键或唯一索引匹配单行记录。
- **eq_ref**：对于多表连接，通过主键或唯一索引匹配单行记录。
- **ref**：使用普通索引或唯一索引。
- **fulltext**：全文索引搜索。
- **index_merge**：使用了多个索引。
- **unique_subquery**：使用了唯一索引的子查询。
- **index_subquery**：使用了索引的子查询。
- **range**：使用索引范围扫描。
- **index**：全索引扫描。
- **all**：全表扫描。
  :::

**方式 2：**

`Show Profile`是 MySQL 提供的可以用来分析当前会话中，SQL 语句资源消耗情况的工具，可用于 SQL 调优的测量。在当前会话中，默认情况下处于 show profile 是关闭状态， 打开之后保存最近 15 次的运行结果。

针对运行慢的 SQL，通过 profile 工具进行详细分析，可以得到 SQL 执行过程中所有的资源开销情况，**如 IO 开销,CPU 开销,内存开销等。**

开启性能监控 `SET profiling = ON;` 打开之后保存最近 15 次的运行结果。

关闭 `SET profiling = OFF;`

**一旦开启了性能监控，你可以使用 `SHOW PROFILES` 命令来查看可用的性能数据，然后再使用 `SHOW PROFILE` 来查看具体的性能统计信息。**

**优化方式：**

1. 查询有效的列信息即可，少用\*代替列信息

2. 联合索引中的列从左往右，命中越多越好

3. where 字句中 like%号,尽量放置在右边

4. 避免索引列上使用函数或者运算，这样会导致索引失效

5. 避免使用 `SELECT DISTINCT`，除非绝对必要，否则尽量避免使用 `DISTINCT`，因为它会导致额外的排序操作

6. 使用 `LIMIT`分页，在分页查询中使用 LIMIT 和 OFFSET 来限制结果集的大小。

公式：`LIMIT (n-1)*m , m`，n 代表第几页，m 代表显示内容的数量

:::tip
啥是慢 sql

慢 SQL 是指执行时间过长的 SQL 查询。这类查询会消耗较多的数据库资源（如 CPU、内存、I/O），可能导致数据库性能下降，甚至影响整个系统的响应速度。
:::

:::info
多慢算慢？

如果一条 SQL 查询的执行时间超过 1 秒 ，就会被认为是慢查询。
:::

这个阈值可以通过配置参数 `long_query_time` 来调整。

```sql
SHOW VARIABLES LIKE 'long_query_time';
```
默认值通常是 10 秒（具体取决于 MySQL 配置）。

可以通过以下命令将慢查询的阈值设置为更小的值（例如 0.5 秒）：所有执行时间超过 0.5 秒 的 SQL 查询都会被记录到 慢查询日志 中。
```sql
SET GLOBAL long_query_time = 0.5;
```


```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';

--查看慢查询日志文件路径
SHOW VARIABLES LIKE 'slow_query_log_file';
```

**示例日志内容：**
```log
# Time: 2023-10-01T12:00:00.123456Z
# User@Host: root[root] @ localhost [127.0.0.1]
# Query_time: 0.612345  Lock_time: 0.000123 Rows_sent: 1  Rows_examined: 10000
SELECT * FROM users WHERE age > 30;
```
慢查询日志的内容通常包括以下信息：
- 查询的执行时间（Query_time）。
- 锁等待时间（Lock_time）。
- 返回的行数（Rows_sent）。
- 扫描的行数（Rows_examined）。
- 具体的 SQL 语句。