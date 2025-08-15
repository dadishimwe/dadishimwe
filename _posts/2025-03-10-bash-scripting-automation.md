---
layout: post
title: "Bash Scripting and Automation: From Basics to Advanced Techniques"
date: 2025-03-10 12:00:00 +0600
categories: [English, Development, DevOps]
tags: [bash, scripting, automation, shell, linux, devops, system-administration, command-line]
author: dadishimwe
---

🐚 **Bash Scripting and Automation: From Basics to Advanced Techniques** ⚙️

Bash scripting is a powerful skill that can transform repetitive tasks into automated workflows. Whether you're a system administrator, developer, or DevOps engineer, mastering bash scripting will significantly improve your productivity.

## Why Bash Scripting?

**Key Benefits:**
- **Automation** - Eliminate repetitive manual tasks
- **Consistency** - Ensure tasks are performed the same way every time
- **Efficiency** - Save hours of manual work
- **Error Reduction** - Minimize human errors in repetitive tasks
- **Scalability** - Handle multiple systems simultaneously

## Bash Scripting Fundamentals

### 1. Basic Script Structure

```bash
#!/bin/bash
# Script: system_info.sh
# Description: Display system information

set -euo pipefail  # Strict error handling

# Variables
SCRIPT_NAME=$(basename "$0")
CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Functions
print_header() {
    echo "=========================================="
    echo "$1"
    echo "=========================================="
}

# Main script logic
main() {
    print_header "System Information Report"
    echo "Generated on: $CURRENT_DATE"
    echo "Hostname: $(hostname)"
    echo "OS: $(uname -s)"
    echo "Kernel: $(uname -r)"
    echo "Uptime: $(uptime -p)"
}

main "$@"
```

### 2. Variables and Control Structures

```bash
#!/bin/bash

# Variable declaration
NAME="Dadi"
AGE=30
FRUITS=("apple" "banana" "orange")

# String operations
FULL_NAME="$NAME Ishimwe"
UPPER_NAME=${FULL_NAME^^}
echo "Name: $UPPER_NAME"

# Conditional statements
if [ $AGE -ge 18 ]; then
    echo "You are an adult"
else
    echo "You are a minor"
fi

# Loops
for fruit in "${FRUITS[@]}"; do
    echo "Fruit: $fruit"
done

# While loop
COUNTER=5
while [ $COUNTER -gt 0 ]; do
    echo "$COUNTER..."
    COUNTER=$((COUNTER - 1))
done
```

### 3. Functions and Error Handling

```bash
#!/bin/bash

# Function with parameters
greet() {
    echo "Hello, $1!"
}

# Function with return value
is_even() {
    local num=$1
    if [ $((num % 2)) -eq 0 ]; then
        return 0  # Success
    else
        return 1  # Failure
    fi
}

# Error handling
error_handler() {
    local exit_code=$?
    local line_number=$1
    echo "Error at line $line_number, exit code: $exit_code"
    exit $exit_code
}

trap 'error_handler $LINENO' ERR

# Usage
greet "Dadi"
if is_even 10; then
    echo "10 is even"
fi
```

## Advanced Scripting Techniques

### 1. Input Validation

```bash
#!/bin/bash

# Validate numeric input
validate_number() {
    local input=$1
    local min=${2:-0}
    local max=${3:-999999}
    
    if [[ ! "$input" =~ ^[0-9]+$ ]]; then
        echo "Error: Input must be a number"
        return 1
    fi
    
    if [ "$input" -lt "$min" ] || [ "$input" -gt "$max" ]; then
        echo "Error: Input must be between $min and $max"
        return 1
    fi
    
    return 0
}

# Validate email format
validate_email() {
    local email=$1
    local email_regex="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    
    if [[ "$email" =~ $email_regex ]]; then
        return 0
    else
        echo "Error: Invalid email format"
        return 1
    fi
}

# Usage
read -p "Enter age: " age
if validate_number "$age" 0 120; then
    echo "Valid age: $age"
fi
```

### 2. Logging and Debugging

```bash
#!/bin/bash

# Logging configuration
LOG_FILE="/tmp/script.log"
LOG_LEVEL="INFO"  # DEBUG, INFO, WARN, ERROR

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $LOG_LEVEL in
        DEBUG) ;;
        INFO)  [ "$level" = "DEBUG" ] && return ;;
        WARN)  [ "$level" = "DEBUG" ] || [ "$level" = "INFO" ] && return ;;
        ERROR) [ "$level" != "ERROR" ] && return ;;
    esac
    
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Debug function
debug() {
    if [ "${DEBUG:-false}" = true ]; then
        echo "DEBUG: $*" >&2
    fi
}

# Usage
log "INFO" "Script started"
log "DEBUG" "Processing file: $1"
log "ERROR" "Failed to connect to database"
```

## Automation Scripts

### 1. System Backup Script

```bash
#!/bin/bash
# backup_system.sh - Automated system backup

set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
SOURCE_DIRS=("/etc" "/home" "/var/www")
BACKUP_RETENTION_DAYS=7
DATE_FORMAT=$(date '+%Y%m%d_%H%M%S')
BACKUP_NAME="system_backup_$DATE_FORMAT.tar.gz"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Create backup
create_backup() {
    log "Creating system backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Create backup archive
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" "${SOURCE_DIRS[@]}" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)
        log "Backup completed: $BACKUP_NAME ($BACKUP_SIZE)"
    else
        log "Backup failed"
        exit 1
    fi
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    find "$BACKUP_DIR" -name "system_backup_*.tar.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
}

# Main function
main() {
    log "=== System Backup Started ==="
    create_backup
    cleanup_old_backups
    log "=== System Backup Completed ==="
}

main "$@"
```

### 2. Server Monitoring Script

```bash
#!/bin/bash
# server_monitor.sh - Server monitoring and alerting

set -euo pipefail

# Configuration
ALERT_EMAIL="admin@example.com"
DISK_THRESHOLD=80
MEMORY_THRESHOLD=90
CPU_THRESHOLD=80

# Send email alert
send_alert() {
    local subject="$1"
    local message="$2"
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
}

# Check disk usage
check_disk_usage() {
    while IFS= read -r line; do
        local filesystem=$(echo "$line" | awk '{print $1}')
        local usage=$(echo "$line" | awk '{print $5}' | sed 's/%//')
        local mount_point=$(echo "$line" | awk '{print $6}')
        
        if [ "$usage" -gt "$DISK_THRESHOLD" ]; then
            local alert_msg="High disk usage on $filesystem ($mount_point): ${usage}%"
            send_alert "Disk Usage Alert" "$alert_msg"
        fi
    done < <(df -h | tail -n +2)
}

# Check memory usage
check_memory_usage() {
    local total_mem=$(free | grep Mem | awk '{print $2}')
    local used_mem=$(free | grep Mem | awk '{print $3}')
    local mem_usage=$((used_mem * 100 / total_mem))
    
    if [ "$mem_usage" -gt "$MEMORY_THRESHOLD" ]; then
        send_alert "Memory Usage Alert" "High memory usage: ${mem_usage}%"
    fi
}

# Check services
check_services() {
    local services=("nginx" "mysql" "sshd")
    
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet "$service"; then
            send_alert "Service Alert" "Service $service is not running"
        fi
    done
}

# Main function
main() {
    check_disk_usage
    check_memory_usage
    check_services
}

main "$@"
```

### 3. Deployment Automation Script

```bash
#!/bin/bash
# deploy.sh - Automated application deployment

set -euo pipefail

# Configuration
APP_NAME="myapp"
DEPLOY_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/backups/$APP_NAME"
GIT_REPO="https://github.com/username/$APP_NAME.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    
    case $level in
        INFO)  echo -e "${GREEN}INFO: $message${NC}" ;;
        ERROR) echo -e "${RED}ERROR: $message${NC}" ;;
    esac
}

# Create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        local backup_name="${APP_NAME}_backup_$(date '+%Y%m%d_%H%M%S').tar.gz"
        mkdir -p "$BACKUP_DIR"
        tar -czf "$BACKUP_DIR/$backup_name" -C "$(dirname "$DEPLOY_DIR")" "$(basename "$DEPLOY_DIR")"
        log "INFO" "Backup created: $backup_name"
    fi
}

# Update repository
update_repository() {
    if [ -d "$DEPLOY_DIR/.git" ]; then
        cd "$DEPLOY_DIR"
        git fetch origin
        git reset --hard "origin/$BRANCH"
    else
        rm -rf "$DEPLOY_DIR"
        git clone -b "$BRANCH" "$GIT_REPO" "$DEPLOY_DIR"
    fi
    log "INFO" "Repository updated"
}

# Install dependencies
install_dependencies() {
    cd "$DEPLOY_DIR"
    
    if [ -f "package.json" ]; then
        npm install --production
    fi
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
    
    log "INFO" "Dependencies installed"
}

# Set permissions
set_permissions() {
    chown -R www-data:www-data "$DEPLOY_DIR"
    find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
    find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
    log "INFO" "Permissions set"
}

# Restart services
restart_services() {
    if systemctl is-active --quiet "$APP_NAME"; then
        systemctl restart "$APP_NAME"
    fi
    
    if systemctl is-active --quiet nginx; then
        systemctl reload nginx
    fi
    
    log "INFO" "Services restarted"
}

# Health check
health_check() {
    sleep 5
    
    if systemctl is-active --quiet "$APP_NAME"; then
        log "INFO" "Deployment successful"
    else
        log "ERROR" "Deployment failed"
        exit 1
    fi
}

# Main deployment function
main() {
    log "INFO" "=== Starting deployment of $APP_NAME ==="
    
    create_backup
    update_repository
    install_dependencies
    set_permissions
    restart_services
    health_check
    
    log "INFO" "=== Deployment completed successfully ==="
}

main "$@"
```

## Best Practices

### 1. Script Organization

```bash
#!/bin/bash
# well_organized_script.sh

# =============================================================================
# Script Configuration
# =============================================================================
SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
LOG_FILE="$SCRIPT_DIR/logs/${SCRIPT_NAME%.*}.log"

# =============================================================================
# Utility Functions
# =============================================================================
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# =============================================================================
# Main Functions
# =============================================================================
setup_environment() {
    log "INFO" "Setting up environment..."
    # Implementation here
}

process_data() {
    log "INFO" "Processing data..."
    # Implementation here
}

# =============================================================================
# Main Script Logic
# =============================================================================
main() {
    log "INFO" "=== Script execution started ==="
    setup_environment
    process_data
    log "INFO" "=== Script execution completed ==="
}

# =============================================================================
# Script Entry Point
# =============================================================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

### 2. Error Handling

```bash
#!/bin/bash
# robust_script.sh

set -euo pipefail

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    local script_name=$(basename "$0")
    
    echo "Error in $script_name at line $line_number"
    echo "Exit code: $exit_code"
    
    # Cleanup on error
    cleanup_on_error
    
    exit $exit_code
}

# Cleanup function
cleanup_on_error() {
    echo "Performing cleanup..."
    rm -f /tmp/temp_*
    pkill -f "script_name" 2>/dev/null || true
}

# Set trap for error handling
trap 'handle_error $LINENO' ERR
trap cleanup_on_error INT TERM

# Main script logic here...
```

## Conclusion

Bash scripting is an essential skill for automation and system administration. By mastering these techniques, you can:

**Key Benefits:**
- **Automate Repetitive Tasks** - Save time and reduce errors
- **Improve System Management** - Consistent and reliable operations
- **Enhance Monitoring** - Proactive system health checks
- **Streamline Deployments** - Automated application deployment
- **Increase Productivity** - Focus on high-value tasks

**Best Practices:**
1. **Always use proper error handling** - Set `set -euo pipefail`
2. **Validate inputs** - Check parameters and file existence
3. **Use meaningful variable names** - Make scripts self-documenting
4. **Add comprehensive logging** - Track script execution
5. **Test thoroughly** - Validate scripts in safe environments
6. **Document your code** - Add comments and usage examples
7. **Follow the principle of least privilege** - Use appropriate permissions

Start with simple scripts and gradually build complexity. Remember, the best automation is the one that saves you time and reduces errors! 🚀

---

*Ready to apply these concepts? Check out my posts on [DevOps fundamentals](/posts/getting-started-with-devops/) and [networking basics](/posts/networking-basics/) for more infrastructure automation insights!* 