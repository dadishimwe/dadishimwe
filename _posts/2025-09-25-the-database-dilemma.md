---
title: The Database Dilemma - Why We Started with SQLite and When We Knew We Had to Change
date: 2025-09-25 10:00 +0200
categories: [English, Programming, Murugo Journey]
tags: [murugo, database, sqlite, postgresql, scalability]
author: dadishimwe
---

## The Database Dilemma: Why We Started with SQLite and When We Knew We Had to Change

In the early days of building Murugo, every decision was about speed and simplicity. I needed to get the MVP up and running as quickly as possible to validate the idea and get user feedback. That’s why I made a choice that many developers would question: I started with SQLite.

### The Allure of Simplicity: Why SQLite?

SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine. For a solo developer working on an MVP, it was the perfect choice:

- **Zero Configuration:** There’s no server to set up, no users to configure, and no complex installation process. It’s just a single file in your project.
- **Rapid Prototyping:** With SQLite, I could focus on building features without getting bogged down in database administration.
- **Perfect for Development:** Laravel’s database abstraction layer makes it easy to switch between database engines, so I knew I wasn’t locked into SQLite forever.

### The Cracks Begin to Show: Performance Bottlenecks

The MVP launched, and the initial response was positive. But as more users and properties were added to the platform, I started to notice performance issues:

- **Slow Queries:** Complex queries with multiple joins were taking longer and longer to execute.
- **Concurrency Issues:** SQLite is not designed for high-concurrency environments. As more users accessed the site simultaneously, the database became a bottleneck.
- **Data Integrity Concerns:** While SQLite is reliable, it doesn’t have the same level of data integrity features as a full-fledged relational database like PostgreSQL.

### The Tipping Point: The Need for Change

The final straw came when I started implementing more advanced features like real-time notifications and property comparisons. I knew that SQLite was holding the platform back and that it was time to migrate to a more robust solution.

### The Next Step: PostgreSQL

After careful consideration, I chose PostgreSQL as the new database for Murugo. In the next post, I’ll take you through the entire migration process, from planning and data export to the final switch-over. It was a challenging but necessary step in the evolution of the platform.

Stay tuned for the story of “The Great Migration”!

