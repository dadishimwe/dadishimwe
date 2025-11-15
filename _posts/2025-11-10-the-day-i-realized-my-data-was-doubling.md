---
title: "The Day I Realized My Data Was Doubling: A Cautionary Tale About API Data Management"
date: 2025-11-10 10:00 +0200
categories: [English, Programming, "API Journey"]
tags: [api, database, data-management, python, postgresql, idempotency, best-practices, api-journey]
author: dadishimwe
---

# The Day I Realized My Data Was Doubling: A Cautionary Tale About API Data Management

*How a simple oversight led to duplicate data, and the technical journey to fix it*

---

## The Discovery

It was a Tuesday morning when I got the email.

> "Hey, our usage numbers look way off. The report shows we used 2,000 GB last month, but we only have a 1,000 GB plan. What's going on?"

My heart sank. I had just built an automated reporting system that pulled data from an enterprise API and generated client reports. Everything seemed to be working perfectly—until it wasn't.

I opened the database and ran a quick query:

```sql
SELECT 
    client_name,
    SUM(consumed_gb) as total_usage,
    COUNT(*) as record_count
FROM daily_usage_history
WHERE usage_date >= '2025-10-01'
GROUP BY client_name
ORDER BY total_usage DESC;
```

The results were clear: some clients had exactly double the expected usage. Worse yet, the record count was suspiciously high. Instead of 28 days of data, I was seeing 56 records for some clients.

**The data was doubling.**

---

## The Investigation

My first thought was: "Did I accidentally run the import script twice?" But the timestamps told a different story. The duplicates weren't from a single run—they were accumulating over time.

Let me show you what I found. Here's a simplified version of my data archiving function:

```python
def archive_usage_data(db_conn, api_data):
    """Archive daily usage data from API to database"""
    with db_conn.cursor() as cur:
        for service_line_id, data in api_data.items():
            # Get database ID for this service line
            cur.execute(
                "SELECT service_line_id FROM service_lines WHERE api_service_line_id = %s",
                (service_line_id,)
            )
            db_id = cur.fetchone()[0]
            
            # Insert each day's usage
            for daily_data in data["daily_usage"]:
                cur.execute("""
                    INSERT INTO daily_usage_history 
                    (service_line_id, usage_date, consumed_gb)
                    VALUES (%s, %s, %s)
                """, (db_id, daily_data["date"], daily_data["usage_gb"]))
        
        db_conn.commit()
```

**The problem?** There's no check for existing data. Every time this function runs, it blindly inserts new records, even if data for that date already exists.

I was calling this function:

- During scheduled daily imports
- When manually pulling historical data
- When regenerating reports
- During testing and debugging

Each time, it added another set of records. The result? Duplicate data that compounded over time.

---

## The Root Cause

The issue wasn't just in my code—it was in my **mental model** of how API data should be handled. I had assumed:

1. ✅ API data is always fresh and accurate
2. ✅ I should insert whatever the API gives me
3. ✅ The database is just a cache

But I was wrong. Here's what I learned:

**APIs can return overlapping data.** When you request "the last 6 billing cycles," you might get data that overlaps with what you already have. Billing cycles don't align perfectly with calendar months, so the same day might appear in multiple cycle responses.

**Idempotency matters.** Every operation that writes data should be idempotent—running it multiple times should produce the same result as running it once.

**The database is the source of truth.** Once data is in your database, you need to treat it as authoritative and protect it from accidental duplication.

---

## The Solution: Building a Deduplication System

I rebuilt the archiving function with three layers of protection:

### Layer 1: Database Constraints

First, I added a unique constraint to prevent duplicates at the database level:

```sql
-- Add unique constraint to prevent duplicate entries
ALTER TABLE daily_usage_history
ADD CONSTRAINT unique_daily_usage 
UNIQUE (service_line_id, usage_date);
```

This is your **safety net**. Even if your application logic has a bug, the database will reject duplicate inserts.

### Layer 2: Check Before Insert

Next, I modified the archiving function to check for existing data:

```python
def archive_usage_data(db_conn, api_data):
    """Archive daily usage data with duplicate prevention"""
    stats = {
        "inserted": 0,
        "updated": 0,
        "unchanged": 0,
        "skipped": 0
    }
    
    with db_conn.cursor() as cur:
        for service_line_id, data in api_data.items():
            # Get database ID
            cur.execute(
                "SELECT service_line_id FROM service_lines WHERE api_service_line_id = %s",
                (service_line_id,)
            )
            result = cur.fetchone()
            if not result:
                stats["skipped"] += 1
                continue
                
            db_id = result[0]
            
            # Process each day's usage
            for daily_data in data["daily_usage"]:
                usage_date = daily_data["date"]
                consumed_gb = daily_data["usage_gb"]
                
                # Check if record already exists
                cur.execute("""
                    SELECT consumed_gb 
                    FROM daily_usage_history 
                    WHERE service_line_id = %s AND usage_date = %s
                """, (db_id, usage_date))
                
                existing = cur.fetchone()
                
                if existing:
                    existing_gb = existing[0]
                    # Compare with small tolerance for floating point differences
                    if abs(float(existing_gb) - float(consumed_gb)) > 0.01:
                        # Update if values differ (API might have corrected data)
                        cur.execute("""
                            UPDATE daily_usage_history 
                            SET consumed_gb = %s 
                            WHERE service_line_id = %s AND usage_date = %s
                        """, (consumed_gb, db_id, usage_date))
                        stats["updated"] += 1
                    else:
                        # Data matches, skip
                        stats["unchanged"] += 1
                else:
                    # New record, insert
                    cur.execute("""
                        INSERT INTO daily_usage_history 
                        (service_line_id, usage_date, consumed_gb)
                        VALUES (%s, %s, %s)
                    """, (db_id, usage_date, consumed_gb))
                    stats["inserted"] += 1
        
        db_conn.commit()
    
    return stats
```

This approach:

- ✅ Checks before inserting
- ✅ Updates if API data differs (handles corrections)
- ✅ Skips if data is identical
- ✅ Returns statistics for monitoring

### Layer 3: Upsert Pattern (Alternative Approach)

For even more robustness, you can use PostgreSQL's `ON CONFLICT` clause:

```python
def archive_usage_data_upsert(db_conn, api_data):
    """Archive using PostgreSQL UPSERT pattern"""
    with db_conn.cursor() as cur:
        for service_line_id, data in api_data.items():
            # ... get db_id ...
            
            for daily_data in data["daily_usage"]:
                cur.execute("""
                    INSERT INTO daily_usage_history 
                    (service_line_id, usage_date, consumed_gb)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (service_line_id, usage_date)
                    DO UPDATE SET 
                        consumed_gb = EXCLUDED.consumed_gb,
                        updated_at = NOW()
                """, (db_id, daily_data["date"], daily_data["usage_gb"]))
        
        db_conn.commit()
```

This is more concise and handles the conflict resolution at the database level.

---

## The Cleanup

Of course, I still had to fix the existing duplicate data. Here's how I approached it:

### Step 1: Identify Duplicates

```sql
-- Find duplicate entries
SELECT 
    service_line_id,
    usage_date,
    COUNT(*) as duplicate_count,
    SUM(consumed_gb) as total_gb,
    AVG(consumed_gb) as avg_gb
FROM daily_usage_history
GROUP BY service_line_id, usage_date
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
```

### Step 2: Deduplicate (Keep Most Recent)

```sql
-- Delete duplicates, keeping the most recent entry
DELETE FROM daily_usage_history
WHERE history_id IN (
    SELECT history_id
    FROM (
        SELECT history_id,
               ROW_NUMBER() OVER (
                   PARTITION BY service_line_id, usage_date 
                   ORDER BY created_at DESC
               ) as rn
        FROM daily_usage_history
    ) t
    WHERE t.rn > 1
);
```

### Step 3: Verify

```sql
-- Verify no duplicates remain
SELECT 
    service_line_id,
    usage_date,
    COUNT(*) as count
FROM daily_usage_history
GROUP BY service_line_id, usage_date
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

---

## The Lessons

This experience taught me several important principles:

### 1. **Design for Idempotency**

Every function that writes data should be safe to run multiple times. Ask yourself: "What happens if this runs twice?"

```python
# ❌ BAD: Not idempotent
def import_data(data):
    for record in data:
        db.insert(record)  # Always inserts, even if exists

# ✅ GOOD: Idempotent
def import_data(data):
    for record in data:
        db.upsert(record)  # Inserts or updates, safe to run multiple times
```

### 2. **Use Database Constraints**

Constraints are your last line of defense. They catch bugs that your application logic might miss.

```sql
-- Always add unique constraints for natural keys
ALTER TABLE daily_usage_history
ADD CONSTRAINT unique_daily_usage 
UNIQUE (service_line_id, usage_date);
```

### 3. **Log Everything**

When something goes wrong, you need to know:

- When did it happen?
- What data was processed?
- How many records were affected?

```python
def archive_usage_data(db_conn, api_data):
    stats = {"inserted": 0, "updated": 0, "unchanged": 0}
    
    # ... processing logic ...
    
    # Log the operation
    logger.info(f"Archive complete: {stats}")
    return stats
```

### 4. **Test with Real Data**

I had tested my code with sample data, but real-world data revealed the issue. Always test with:

- Overlapping date ranges
- Multiple runs of the same data
- Edge cases (missing data, API errors, etc.)

### 5. **Monitor for Anomalies**

Build alerts for suspicious patterns:

```python
def check_data_quality(db_conn):
    """Check for data quality issues"""
    # Check for duplicates
    duplicates = db_conn.execute("""
        SELECT COUNT(*) 
        FROM (
            SELECT service_line_id, usage_date, COUNT(*)
            FROM daily_usage_history
            GROUP BY service_line_id, usage_date
            HAVING COUNT(*) > 1
        ) dupes
    """).fetchone()[0]
    
    if duplicates > 0:
        alert(f"⚠️ Found {duplicates} duplicate entries!")
    
    # Check for unexpected spikes
    # Check for missing dates
    # etc.
```

---

## The Aftermath

After implementing these fixes:

- ✅ **Zero duplicates** in new data
- ✅ **Confidence** to run imports multiple times
- ✅ **Transparency** through logging and statistics
- ✅ **Safety** through database constraints

The client got a corrected report, and I got a valuable lesson in API data management.

---

## Key Takeaways

1. **APIs are not databases** - They're interfaces that may return overlapping or changing data
2. **Idempotency is essential** - Design your data operations to be safe when run multiple times
3. **Database constraints are your friend** - Use them as a safety net
4. **Check before you insert** - Or use upsert patterns
5. **Log and monitor** - You'll need visibility when things go wrong
6. **Test with real data** - Sample data hides real-world issues

---

## The Pattern

Here's the pattern I now use for all API data archiving:

```python
def archive_api_data(db_conn, api_data, table_name, unique_keys):
    """
    Generic archiving function with duplicate prevention.
    
    Args:
        db_conn: Database connection
        api_data: Data from API
        table_name: Target table
        unique_keys: List of columns that form unique constraint
    """
    stats = {"inserted": 0, "updated": 0, "unchanged": 0}
    
    with db_conn.cursor() as cur:
        for record in api_data:
            # Build WHERE clause from unique keys
            where_clause = " AND ".join([f"{key} = %s" for key in unique_keys])
            params = [record[key] for key in unique_keys]
            
            # Check if exists
            cur.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", params)
            existing = cur.fetchone()
            
            if existing:
                # Compare and update if different
                if _data_changed(existing, record):
                    _update_record(cur, table_name, record, unique_keys)
                    stats["updated"] += 1
                else:
                    stats["unchanged"] += 1
            else:
                # Insert new record
                _insert_record(cur, table_name, record)
                stats["inserted"] += 1
    
    db_conn.commit()
    return stats
```

This pattern works for any API data archiving scenario.

---

## Conclusion

That Tuesday morning email was embarrassing, but it led to a much better system. The duplicate data issue forced me to think deeply about data integrity, idempotency, and defensive programming.

Now, whenever I build a system that processes API data, I ask myself:

- ✅ Is this operation idempotent?
- ✅ Do I have database constraints protecting me?
- ✅ Am I checking for existing data?
- ✅ Am I logging what I'm doing?
- ✅ Can I safely run this multiple times?

If the answer to any of these is "no," I know I have more work to do.

**The best bugs are the ones that teach you something.** This one taught me to always design for the case where things go wrong—because they will.

---

*Have you encountered similar issues with API data management? What patterns do you use to prevent duplicates? I'd love to hear your stories in the comments.*

