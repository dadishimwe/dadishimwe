---
title: Image Upload Chaos - From Broken Forms to Seamless File Management
date: 2025-10-05 10:00 +0200
categories: [English, Programming, Murugo Journey]
tags: [murugo, laravel, file-uploads, nginx, debugging]
author: dadishimwe
---

## Image Upload Chaos: From Broken Forms to Seamless File Management

Images are the lifeblood of a real estate platform. They sell the dream, showcase the property, and are often the deciding factor for a potential renter or buyer. But in the early days of Murugo, our image upload system was a source of constant frustration, leading to broken forms, server errors, and a poor user experience.

### The Problem: `413 Request Entity Too Large`

The most common error our users faced was the dreaded `413 Request Entity Too Large`. This Nginx error meant that the files they were trying to upload were larger than the server’s configured limit. In a world of high-resolution smartphone cameras, this was happening all the time.

### The Investigation: A Three-Headed Monster

Fixing this wasn’t as simple as changing a single configuration value. The problem was a three-headed monster, with limits set in three different places:

1.  **Nginx:** The web server itself had a default `client_max_body_size` of 1MB, which was far too small.
2.  **PHP:** The PHP configuration had its own limits for `upload_max_filesize` and `post_max_size`.
3.  **Application-Specific Configuration:** We also had a `.user.ini` file that was overriding the global PHP settings.

### The Solution: A Unified Configuration

To slay this beast, I had to ensure that all three configurations were in sync and set to a reasonable limit. I settled on 20MB, which was large enough for high-quality images but not so large that it would open the server to abuse.

**1. Nginx Configuration (`nginx.conf`):**

```nginx
http {
    # ...
    client_max_body_size 20M;
}
```

**2. PHP Configuration (`php.ini`):**

```ini
upload_max_filesize = 20M
post_max_size = 21M # Must be slightly larger than upload_max_filesize
```

**3. User INI Configuration (`.user.ini`):**

```ini
upload_max_filesize = 20M
post_max_size = 21M
```

### Beyond Configuration: Building a Robust System

Fixing the server configuration was only half the battle. I also needed to improve the application’s image handling logic:

-   **Frontend Validation:** I added JavaScript to the upload form to check file sizes before the user even clicked “submit.”
-   **Backend Validation:** I implemented Laravel’s validation rules to ensure that only valid image types were being uploaded.
-   **Image Optimization:** I integrated the `spatie/laravel-image-optimizer` package to automatically compress and resize images in the background, reducing storage costs and improving page load times.

### Lessons Learned

Building a reliable file upload system is a complex task that requires a deep understanding of the entire stack, from the frontend to the web server and the application itself. This experience taught me the importance of a holistic approach to problem-solving and the value of a well-configured, multi-layered defense against common user errors.

In the next post, I’ll take you on the journey of “The Great Migration” from SQLite to PostgreSQL, a critical step in making Murugo a truly scalable platform.

