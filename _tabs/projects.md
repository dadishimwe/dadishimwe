---
layout: page
icon: fas fa-code
order: 2
---

# Projects

Welcome to my project showcase! Here you'll find a collection of my work spanning data science, networking, and development. Each project represents a unique challenge and learning opportunity.

## Featured Projects

<div class="row">
{% for project in site.projects %}
  <div class="col-md-6 mb-4">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">{{ project.title }}</h5>
        <p class="card-text">{{ project.excerpt | strip_html | truncate: 150 }}</p>
        <div class="mb-2">
          {% for tag in project.tags %}
            <span class="badge badge-secondary">{{ tag }}</span>
          {% endfor %}
        </div>
        <a href="{{ project.url | relative_url }}" class="btn btn-primary">View Project</a>
      </div>
    </div>
  </div>
{% endfor %}
</div>

## Project Categories

### Data Science
Exploring data to uncover insights and build predictive models.

### Networking
Building robust network solutions and exploring network protocols.

### Development
Full-stack applications and innovative software solutions.

