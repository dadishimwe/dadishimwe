---
layout: post
title: "Subnetting, Bandwidth Control, and Network Use Cases: A Practical Guide"
date: 2025-02-20 16:00:00 +0600
categories: [English, Networking, Infrastructure]
tags: [subnetting, bandwidth-control, networking, infrastructure, cidr, qos, network-design, ip-addressing, routing]
author: dadishimwe
---

🌐 **Subnetting, Bandwidth Control, and Network Use Cases: A Practical Guide** ⚡

Network design and management are critical skills for any IT professional. Understanding subnetting, bandwidth control, and their practical applications helps you build efficient, scalable, and secure networks. Let's explore these concepts with real-world examples and practical implementations.

## Understanding Subnetting

### What is Subnetting?

Subnetting is the practice of dividing a large network into smaller, more manageable subnetworks. This improves network performance, security, and management efficiency.

**Benefits of Subnetting:**
- **Improved Performance** - Reduced network congestion
- **Enhanced Security** - Isolated network segments
- **Better Management** - Easier troubleshooting and monitoring
- **IP Address Conservation** - More efficient use of address space

### IP Address Classes and CIDR Notation

```
Class A: 1.0.0.0 - 126.255.255.255 (Default mask: 255.0.0.0 /8)
Class B: 128.0.0.0 - 191.255.255.255 (Default mask: 255.255.0.0 /16)
Class C: 192.0.0.0 - 223.255.255.255 (Default mask: 255.255.255.0 /24)
```

**CIDR (Classless Inter-Domain Routing) Notation:**
```
192.168.1.0/24 = 192.168.1.0 - 192.168.1.255 (256 addresses)
10.0.0.0/16 = 10.0.0.0 - 10.0.255.255 (65,536 addresses)
172.16.0.0/12 = 172.16.0.0 - 172.31.255.255 (1,048,576 addresses)
```

## Subnetting Fundamentals

### Subnet Mask Calculation

```python
def calculate_subnet_info(network_address, cidr):
    """Calculate subnet information from network address and CIDR."""
    
    # Convert CIDR to subnet mask
    subnet_mask = (0xFFFFFFFF << (32 - cidr)) & 0xFFFFFFFF
    
    # Calculate network address
    network_binary = int(network_address.replace('.', ''), 16)
    network_addr = network_binary & subnet_mask
    
    # Calculate broadcast address
    broadcast_addr = network_addr | (0xFFFFFFFF >> cidr)
    
    # Calculate usable host range
    first_host = network_addr + 1
    last_host = broadcast_addr - 1
    
    # Calculate number of hosts
    num_hosts = 2**(32 - cidr) - 2
    
    return {
        'network_address': network_address,
        'subnet_mask': '.'.join([str((subnet_mask >> i) & 0xFF) for i in (24, 16, 8, 0)]),
        'broadcast_address': '.'.join([str((broadcast_addr >> i) & 0xFF) for i in (24, 16, 8, 0)]),
        'first_host': '.'.join([str((first_host >> i) & 0xFF) for i in (24, 16, 8, 0)]),
        'last_host': '.'.join([str((last_host >> i) & 0xFF) for i in (24, 16, 8, 0)]),
        'num_hosts': num_hosts
    }

# Example usage
network_info = calculate_subnet_info('192.168.1.0', 24)
print("Subnet Information:")
for key, value in network_info.items():
    print(f"{key}: {value}")
```

### Subnetting Examples

#### Example 1: Dividing a /24 Network

```
Original Network: 192.168.1.0/24 (256 addresses)

Subnet 1: 192.168.1.0/26 (64 addresses)
- Network: 192.168.1.0
- First Host: 192.168.1.1
- Last Host: 192.168.1.62
- Broadcast: 192.168.1.63

Subnet 2: 192.168.1.64/26 (64 addresses)
- Network: 192.168.1.64
- First Host: 192.168.1.65
- Last Host: 192.168.1.126
- Broadcast: 192.168.1.127

Subnet 3: 192.168.1.128/26 (64 addresses)
- Network: 192.168.1.128
- First Host: 192.168.1.129
- Last Host: 192.168.1.190
- Broadcast: 192.168.1.191

Subnet 4: 192.168.1.192/26 (64 addresses)
- Network: 192.168.1.192
- First Host: 192.168.1.193
- Last Host: 192.168.1.254
- Broadcast: 192.168.1.255
```

#### Example 2: Variable Length Subnet Masking (VLSM)

```
Network: 192.168.1.0/24

Requirements:
- Sales: 50 hosts
- Marketing: 30 hosts
- IT: 20 hosts
- Management: 10 hosts
- Future growth: 20 hosts

Solution:
Sales: 192.168.1.0/26 (64 addresses, 62 usable)
Marketing: 192.168.1.64/27 (32 addresses, 30 usable)
IT: 192.168.1.96/27 (32 addresses, 30 usable)
Management: 192.168.1.128/28 (16 addresses, 14 usable)
Future: 192.168.1.144/28 (16 addresses, 14 usable)
Reserved: 192.168.1.160/27 (32 addresses, reserved)
```

## Network Architecture Diagrams

### Small Office Network

```
                    Internet
                       |
                    [Router]
                       |
               192.168.1.1/24
                       |
                ┌──────┴──────┐
                │             │
            [Switch]      [Switch]
                │             │
        ┌───────┴───────┐     │
        │               │     │
   [Sales PCs]    [Marketing] │
   192.168.1.10-   192.168.1. │
   192.168.1.50    50-192.168.│
                              │
                         [IT Dept]
                         192.168.1.
                         100-192.168.
                         1.120
```

### Enterprise Network with Subnetting

```
                    Internet
                       |
                    [Firewall]
                       |
               10.0.0.1/16
                       |
                ┌──────┴──────┐
                │             │
            [Core Switch]  [DMZ]
                │        10.0.1.0/24
        ┌───────┴───────┐
        │               │
   [Access Layer]  [Access Layer]
        │               │
   ┌────┴────┐    ┌────┴────┐
   │         │    │         │
[Sales]   [Marketing] [IT] [HR]
10.0.10.0/24 10.0.20.0/24 10.0.30.0/24 10.0.40.0/24
```

## Bandwidth Control and QoS

### Understanding Bandwidth Control

Bandwidth control manages network traffic to ensure fair resource allocation and optimal performance for critical applications.

**QoS (Quality of Service) Categories:**
- **Voice** - Highest priority (VoIP, video calls)
- **Video** - High priority (streaming, video conferencing)
- **Data** - Medium priority (web browsing, file transfer)
- **Background** - Low priority (backups, updates)

### QoS Implementation Examples

#### Cisco IOS Configuration

```cisco
! Define QoS classes
class-map match-all VOICE
 match dscp ef
class-map match-all VIDEO
 match dscp af41
class-map match-all DATA
 match dscp af21

! Define policy maps
policy-map QOS-POLICY
 class VOICE
  priority percent 20
 class VIDEO
  bandwidth percent 30
 class DATA
  bandwidth percent 40
 class class-default
  bandwidth percent 10

! Apply to interface
interface GigabitEthernet0/1
 service-policy output QOS-POLICY
```

#### Linux Traffic Control (tc)

```bash
#!/bin/bash

# Create QoS classes for different traffic types
tc qdisc add dev eth0 root handle 1: htb default 30

# Create root class
tc class add dev eth0 parent 1: classid 1:1 htb rate 1000mbit

# Voice traffic (highest priority)
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 200mbit ceil 1000mbit prio 1
tc qdisc add dev eth0 parent 1:10 handle 10: sfq
tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 match ip dport 5060 0xffff flowid 1:10

# Video traffic
tc class add dev eth0 parent 1:1 classid 1:20 htb rate 300mbit ceil 1000mbit prio 2
tc qdisc add dev eth0 parent 1:20 handle 20: sfq
tc filter add dev eth0 protocol ip parent 1:0 prio 2 u32 match ip dport 554 0xffff flowid 1:20

# Data traffic
tc class add dev eth0 parent 1:1 classid 1:30 htb rate 400mbit ceil 1000mbit prio 3
tc qdisc add dev eth0 parent 1:30 handle 30: sfq

# Background traffic
tc class add dev eth0 parent 1:1 classid 1:40 htb rate 100mbit ceil 1000mbit prio 4
tc qdisc add dev eth0 parent 1:40 handle 40: sfq
```

#### Python Bandwidth Monitoring

```python
import psutil
import time
import matplotlib.pyplot as plt
from collections import deque

class BandwidthMonitor:
    def __init__(self, max_points=100):
        self.max_points = max_points
        self.times = deque(maxlen=max_points)
        self.bytes_sent = deque(maxlen=max_points)
        self.bytes_recv = deque(maxlen=max_points)
        
    def get_network_stats(self):
        """Get current network statistics."""
        net_io = psutil.net_io_counters()
        return net_io.bytes_sent, net_io.bytes_recv
    
    def monitor_bandwidth(self, duration=60, interval=1):
        """Monitor bandwidth usage for specified duration."""
        start_time = time.time()
        last_sent, last_recv = self.get_network_stats()
        
        while time.time() - start_time < duration:
            time.sleep(interval)
            current_time = time.time()
            current_sent, current_recv = self.get_network_stats()
            
            # Calculate bandwidth
            sent_bps = (current_sent - last_sent) / interval
            recv_bps = (current_recv - last_recv) / interval
            
            # Store data
            self.times.append(current_time - start_time)
            self.bytes_sent.append(sent_bps / 1024 / 1024)  # MB/s
            self.bytes_recv.append(recv_bps / 1024 / 1024)  # MB/s
            
            last_sent, last_recv = current_sent, current_recv
            
            print(f"Time: {current_time - start_time:.1f}s | "
                  f"Upload: {sent_bps/1024/1024:.2f} MB/s | "
                  f"Download: {recv_bps/1024/1024:.2f} MB/s")
    
    def plot_bandwidth(self):
        """Plot bandwidth usage over time."""
        plt.figure(figsize=(12, 6))
        plt.plot(list(self.times), list(self.bytes_sent), label='Upload', color='red')
        plt.plot(list(self.times), list(self.bytes_recv), label='Download', color='blue')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Bandwidth (MB/s)')
        plt.title('Network Bandwidth Usage')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.show()

# Usage example
monitor = BandwidthMonitor()
monitor.monitor_bandwidth(duration=30, interval=1)
monitor.plot_bandwidth()
```

## Real-World Use Cases

### 1. Educational Institution Network

```
Network Design: University Campus

Core Network: 10.0.0.0/16
├── Administration: 10.0.1.0/24
├── Faculty: 10.0.2.0/24
├── Students: 10.0.3.0/24
├── Library: 10.0.4.0/24
├── Labs: 10.0.5.0/24
├── WiFi: 10.0.6.0/24
└── Guest: 10.0.7.0/24

QoS Configuration:
- Faculty/Admin: 50% bandwidth, highest priority
- Library: 20% bandwidth, high priority
- Labs: 15% bandwidth, medium priority
- Students: 10% bandwidth, low priority
- Guest: 5% bandwidth, lowest priority
```

**Configuration Example:**
```bash
# Faculty network QoS
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 500mbit ceil 1000mbit prio 1
tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 match ip src 10.0.2.0/24 flowid 1:10

# Student network bandwidth limit
tc class add dev eth0 parent 1:1 classid 1:30 htb rate 100mbit ceil 200mbit prio 3
tc filter add dev eth0 protocol ip parent 1:0 prio 3 u32 match ip src 10.0.3.0/24 flowid 1:30
```

### 2. Healthcare Network

```
Network Design: Hospital

Core Network: 172.16.0.0/16
├── Emergency: 172.16.1.0/24 (Highest priority)
├── ICU: 172.16.2.0/24 (High priority)
├── Radiology: 172.16.3.0/24 (High priority)
├── Administration: 172.16.4.0/24 (Medium priority)
├── Staff: 172.16.5.0/24 (Medium priority)
└── Guest: 172.16.6.0/24 (Low priority)

Security Zones:
- Critical Care: Emergency, ICU, Radiology
- Administrative: Administration, Staff
- Public: Guest WiFi
```

**Healthcare QoS Configuration:**
```cisco
! Emergency department - highest priority
class-map match-all EMERGENCY
 match access-group 101
policy-map HEALTHCARE-QOS
 class EMERGENCY
  priority percent 40
  police 100m
 class ICU
  bandwidth percent 25
  police 50m
 class RADIOLOGY
  bandwidth percent 20
  police 100m
 class ADMIN
  bandwidth percent 10
  police 20m
 class STAFF
  bandwidth percent 3
  police 10m
 class GUEST
  bandwidth percent 2
  police 5m
```

### 3. E-commerce Network

```
Network Design: Online Retail

Core Network: 192.168.0.0/16
├── Web Servers: 192.168.1.0/24
├── Database: 192.168.2.0/24
├── Payment Processing: 192.168.3.0/24
├── CDN: 192.168.4.0/24
├── Management: 192.168.5.0/24
└── Development: 192.168.6.0/24

Load Balancing:
- Web servers behind load balancer
- Database with read replicas
- CDN for static content
- Payment processing isolated
```

**E-commerce Network Configuration:**
```bash
#!/bin/bash

# Web server load balancing
ipvsadm -A -t 192.168.1.100:80 -s rr
ipvsadm -a -t 192.168.1.100:80 -r 192.168.1.10:80 -m
ipvsadm -a -t 192.168.1.100:80 -r 192.168.1.11:80 -m
ipvsadm -a -t 192.168.1.100:80 -r 192.168.1.12:80 -m

# Database network isolation
iptables -A FORWARD -s 192.168.2.0/24 -d 192.168.1.0/24 -j ACCEPT
iptables -A FORWARD -s 192.168.1.0/24 -d 192.168.2.0/24 -j ACCEPT
iptables -A FORWARD -d 192.168.2.0/24 -j DROP

# Payment processing security
iptables -A INPUT -s 192.168.3.0/24 -j ACCEPT
iptables -A INPUT -d 192.168.3.0/24 -j DROP
```

## Network Monitoring and Troubleshooting

### Subnet Discovery Script

```python
import nmap
import ipaddress
import json

class NetworkScanner:
    def __init__(self, network_range):
        self.network_range = network_range
        self.nm = nmap.PortScanner()
    
    def scan_network(self):
        """Scan network for active hosts."""
        print(f"Scanning network: {self.network_range}")
        
        # Perform network scan
        self.nm.scan(hosts=self.network_range, arguments='-sn')
        
        active_hosts = []
        for host in self.nm.all_hosts():
            if self.nm[host].state() == 'up':
                host_info = {
                    'ip': host,
                    'hostname': self.nm[host].hostname(),
                    'mac': self.nm[host]['addresses'].get('mac', 'Unknown'),
                    'vendor': self.nm[host]['vendor'].get(self.nm[host]['addresses'].get('mac', ''), 'Unknown')
                }
                active_hosts.append(host_info)
        
        return active_hosts
    
    def analyze_subnet_usage(self, active_hosts):
        """Analyze subnet usage and provide recommendations."""
        network = ipaddress.IPv4Network(self.network_range, strict=False)
        total_addresses = network.num_addresses
        used_addresses = len(active_hosts)
        utilization = (used_addresses / total_addresses) * 100
        
        print(f"\nSubnet Analysis for {self.network_range}:")
        print(f"Total addresses: {total_addresses}")
        print(f"Used addresses: {used_addresses}")
        print(f"Utilization: {utilization:.1f}%")
        
        if utilization > 80:
            print("⚠️  High utilization - consider subnetting or expanding")
        elif utilization < 20:
            print("ℹ️  Low utilization - consider smaller subnet")
        else:
            print("✅ Optimal utilization")
        
        return {
            'total_addresses': total_addresses,
            'used_addresses': used_addresses,
            'utilization': utilization
        }

# Usage example
scanner = NetworkScanner('192.168.1.0/24')
active_hosts = scanner.scan_network()
scanner.analyze_subnet_usage(active_hosts)
```

### Bandwidth Monitoring Dashboard

```python
import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go
import psutil
import threading
import time

class BandwidthDashboard:
    def __init__(self):
        self.app = dash.Dash(__name__)
        self.bandwidth_data = {'times': [], 'upload': [], 'download': []}
        self.setup_layout()
        self.setup_callbacks()
        
    def setup_layout(self):
        self.app.layout = html.Div([
            html.H1('Network Bandwidth Monitor'),
            
            dcc.Graph(id='bandwidth-graph'),
            
            dcc.Interval(
                id='interval-component',
                interval=1*1000,  # Update every second
                n_intervals=0
            ),
            
            html.Div([
                html.H3('Current Usage'),
                html.Div(id='current-usage')
            ])
        ])
    
    def setup_callbacks(self):
        @self.app.callback(
            Output('bandwidth-graph', 'figure'),
            Input('interval-component', 'n_intervals')
        )
        def update_graph(n):
            # Get current bandwidth
            net_io = psutil.net_io_counters()
            current_time = time.time()
            
            if len(self.bandwidth_data['times']) > 0:
                last_upload = self.bandwidth_data['upload'][-1]
                last_download = self.bandwidth_data['download'][-1]
                
                upload_bps = (net_io.bytes_sent - last_upload) / 1
                download_bps = (net_io.bytes_recv - last_download) / 1
            else:
                upload_bps = download_bps = 0
            
            self.bandwidth_data['times'].append(current_time)
            self.bandwidth_data['upload'].append(upload_bps / 1024 / 1024)  # MB/s
            self.bandwidth_data['download'].append(download_bps / 1024 / 1024)  # MB/s
            
            # Keep only last 60 data points
            if len(self.bandwidth_data['times']) > 60:
                self.bandwidth_data['times'] = self.bandwidth_data['times'][-60:]
                self.bandwidth_data['upload'] = self.bandwidth_data['upload'][-60:]
                self.bandwidth_data['download'] = self.bandwidth_data['download'][-60:]
            
            figure = {
                'data': [
                    go.Scatter(
                        x=self.bandwidth_data['times'],
                        y=self.bandwidth_data['upload'],
                        name='Upload',
                        line=dict(color='red')
                    ),
                    go.Scatter(
                        x=self.bandwidth_data['times'],
                        y=self.bandwidth_data['download'],
                        name='Download',
                        line=dict(color='blue')
                    )
                ],
                'layout': go.Layout(
                    title='Real-time Bandwidth Usage',
                    xaxis={'title': 'Time'},
                    yaxis={'title': 'Bandwidth (MB/s)'}
                )
            }
            
            return figure
    
    def run(self, debug=True, port=8050):
        self.app.run_server(debug=debug, port=port)

# Run dashboard
if __name__ == '__main__':
    dashboard = BandwidthDashboard()
    dashboard.run()
```

## Best Practices

### 1. Subnetting Best Practices

```python
def calculate_optimal_subnet(required_hosts, growth_factor=1.2):
    """Calculate optimal subnet size for required hosts."""
    # Account for growth
    adjusted_hosts = int(required_hosts * growth_factor)
    
    # Add 2 for network and broadcast addresses
    total_needed = adjusted_hosts + 2
    
    # Find smallest power of 2 that can accommodate
    for i in range(32):
        if 2**i >= total_needed:
            cidr = 32 - i
            return cidr
    
    return 32

# Example usage
departments = {
    'Sales': 50,
    'Marketing': 30,
    'IT': 20,
    'HR': 10
}

print("Optimal Subnet Sizes:")
for dept, hosts in departments.items():
    cidr = calculate_optimal_subnet(hosts)
    print(f"{dept}: /{cidr} ({2**(32-cidr)-2} usable hosts)")
```

### 2. Network Documentation

```python
import yaml

class NetworkDocumentation:
    def __init__(self):
        self.network_config = {
            'network_name': 'Corporate Network',
            'vlan_config': {},
            'subnet_config': {},
            'qos_config': {},
            'security_config': {}
        }
    
    def add_subnet(self, name, network, cidr, purpose, vlan=None):
        """Add subnet to documentation."""
        self.network_config['subnet_config'][name] = {
            'network': network,
            'cidr': cidr,
            'purpose': purpose,
            'vlan': vlan,
            'gateway': self.calculate_gateway(network),
            'broadcast': self.calculate_broadcast(network, cidr),
            'usable_hosts': 2**(32-cidr) - 2
        }
    
    def calculate_gateway(self, network):
        """Calculate gateway address (first usable host)."""
        # Implementation here
        pass
    
    def calculate_broadcast(self, network, cidr):
        """Calculate broadcast address."""
        # Implementation here
        pass
    
    def export_yaml(self, filename):
        """Export network configuration to YAML."""
        with open(filename, 'w') as f:
            yaml.dump(self.network_config, f, default_flow_style=False)
    
    def generate_report(self):
        """Generate network documentation report."""
        report = f"""
# Network Documentation Report

## Network Overview
- Name: {self.network_config['network_name']}
- Total Subnets: {len(self.network_config['subnet_config'])}

## Subnet Configuration
"""
        for name, config in self.network_config['subnet_config'].items():
            report += f"""
### {name}
- Network: {config['network']}/{config['cidr']}
- Purpose: {config['purpose']}
- Gateway: {config['gateway']}
- Broadcast: {config['broadcast']}
- Usable Hosts: {config['usable_hosts']}
"""
        return report

# Usage
doc = NetworkDocumentation()
doc.add_subnet('Sales', '192.168.10.0', 26, 'Sales department', vlan=10)
doc.add_subnet('IT', '192.168.20.0', 27, 'IT department', vlan=20)
doc.export_yaml('network_config.yaml')
print(doc.generate_report())
```

## Conclusion

Subnetting and bandwidth control are fundamental skills for network administrators and engineers. Proper implementation leads to:

**Key Benefits:**
- **Improved Performance** - Reduced congestion and optimized traffic flow
- **Enhanced Security** - Isolated network segments and controlled access
- **Better Scalability** - Organized growth and efficient resource utilization
- **Easier Management** - Simplified troubleshooting and monitoring

**Implementation Tips:**
1. **Plan Ahead** - Consider future growth when designing subnets
2. **Document Everything** - Maintain detailed network documentation
3. **Monitor Continuously** - Use tools to track bandwidth and performance
4. **Test Thoroughly** - Validate configurations before deployment
5. **Security First** - Implement proper access controls and segmentation

Remember, network design is both an art and a science. Start with a solid foundation, plan for growth, and always prioritize security and performance! 🚀

---

*Ready to dive deeper into networking? Check out my posts on [networking basics](/posts/networking-basics/) and [DevOps fundamentals](/posts/getting-started-with-devops/) for more infrastructure insights!* 