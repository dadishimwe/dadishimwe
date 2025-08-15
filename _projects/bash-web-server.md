---
layout: project
title: "Bash Web Server"
date: 2024-12-01 12:00:00 +0600
categories: [Software Development]
tags: [bash, web-server, shell-scripting, networking, automation]
---

## Bash Web Server

A pure bash implementation of a web server inspired by the yousuckatprogramming series. This project demonstrates advanced bash scripting techniques and networking concepts.

### Features

- **Static File Serving**: Serves HTML, CSS, JavaScript, images, and other static assets
- **Custom Error Pages**: Configurable 404 and 500 error pages
- **Access Logging**: Comprehensive request logging
- **Basic Authentication**: HTTP Basic Authentication support
- **Caching Headers**: Optimized caching for better performance
- **Gzip Compression**: Automatic compression for supported files
- **Directory Listing**: Automatic directory index generation

### Technical Highlights

- Pure bash implementation without external dependencies
- Modular architecture with separate configuration files
- Robust error handling and logging
- Security features including input validation
- Performance optimizations for static content

### Project Structure

```
enhanced-bash-web-server/
├── config/
│   ├── server.conf         # Main server configuration
│   └── users.conf          # User credentials for authentication
├── error-pages/
│   ├── 404.html            # Custom 404 Not Found page
│   └── 500.html            # Custom 500 Internal Server Error page
├── logs/
│   ├── access.log          # Access log file
│   └── error.log           # Error log file
├── scripts/
│   ├── auth.sh             # Authentication helper script
│   ├── process_request_handler.sh # HTTP request handler
│   ├── server.sh           # Main server startup script
│   └── server_functions.sh # Common server functions
└── www/                    # Web root directory
```

### Technologies Used

- **Bash Scripting**: Core server implementation
- **Socat**: Network connection handling
- **HTTP Protocol**: Full HTTP/1.1 implementation
- **Unix Utilities**: Standard system tools for file operations

### Repository

[View on GitHub](https://github.com/dadishimwe/Bash-Web-Server.git)

### Contact

For questions or contributions, reach out at [dadishimwe0@gmail.com](mailto:dadishimwe0@gmail.com) 