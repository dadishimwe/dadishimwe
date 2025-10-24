---
title: "The Docker Deployment Saga: From Local Development to Production"
date: 2025-10-22 10:00 +0200
categories: [English, DevOps, "Murugo Journey"]
tags: [murugo, docker, deployment, devops, nginx]
author: dadishimwe
---

## The Docker Deployment Saga: From Local Development to Production

The journey from a working application on your local machine to a live, production-ready system is often fraught with unexpected challenges. For Murugo, Docker was the tool that promised to make this transition seamless, but the reality was far more complex. This is the story of our Docker deployment saga.

### The Promise: "It Works on My Machine"

Every developer has heard (or said) the phrase "it works on my machine." Docker was supposed to solve this problem by creating a consistent, reproducible environment that would work the same way on my laptop, on a staging server, and in production. The promise was simple: if it works in Docker locally, it will work in Docker anywhere.

### The Reality: A Cascade of Configuration Issues

While Docker did help to standardize our environment, the deployment process was still a complex dance of configuration files, build processes, and cache management. Here are some of the key challenges I faced:

**1. Asset Building:**

Our application used Vite to build frontend assets (CSS and JavaScript). These assets needed to be compiled and placed in the `public/build` directory before the Docker container was built. Initially, I tried to build the assets inside the Docker container, but this led to slow build times and inconsistent results. The solution was to build the assets on my local machine and then copy them into the container during the build process.

**2. Storage Symlinks:**

Laravel requires a symbolic link from `public/storage` to `storage/app/public` to serve uploaded files. This symlink needs to be created during the deployment process, and it was easy to forget, leading to broken image uploads in production.

**3. Cache Management:**

Laravel's caching system can be a double-edged sword. While it improves performance, it can also cause issues if the cache is not properly cleared after a deployment. I had to create a deployment script that would automatically clear the cache and rebuild the configuration after each deployment.

### The Solution: A Streamlined Deployment Script

After much trial and error, I created a deployment script that automated the entire process:

```bash
#!/bin/bash

# Pull latest code
cd /root/murugo-app
git pull origin main

# Stop containers
docker compose down

# Rebuild containers (with no cache to ensure fresh build)
docker compose build --no-cache

# Start containers
docker compose up -d

# Create storage symlink
docker compose exec murugo php artisan storage:link

# Clear caches
docker compose exec murugo php artisan cache:clear
docker compose exec murugo php artisan view:clear
docker compose exec murugo php artisan config:clear

# Run migrations (if needed)
docker compose exec murugo php artisan migrate --force

echo "✅ Deployment complete!"
```

This script ensured that every deployment was consistent and that all of the necessary steps were performed in the correct order.

### Lessons Learned

Deploying a Dockerized application to production is not as simple as running `docker compose up`. It requires a deep understanding of your application's build process, its dependencies, and the intricacies of Docker itself. By creating a streamlined, automated deployment process, I was able to reduce the risk of errors and make deployments a routine, stress-free task.

---

## Reflections on the Journey

Building Murugo has been an incredible learning experience. From the initial MVP to the complex, production-ready platform it is today, every challenge has taught me something new about software development, problem-solving, and the importance of perseverance.

This series of blog posts has covered the major milestones and challenges, but the journey is far from over. There are still many features to build, optimizations to make, and lessons to learn. I'm excited to see where Murugo goes next, and I hope that sharing these experiences has been helpful to other developers on their own journeys.

Thank you for following along, and stay tuned for more updates from the Murugo project!

