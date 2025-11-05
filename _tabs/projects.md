---
layout: page
icon: fas fa-code
order: 2
---

# Projects

Welcome to my project showcase! Here you'll find a collection of my work spanning data science, networking, and development. Each project represents a unique challenge and learning opportunity.

## Project Categories

### [Data Science](https://www.dadishimwe.com/categories/data-science/)
Exploring data to uncover insights and build predictive models. From machine learning algorithms to statistical analysis, these projects showcase the power of data-driven decision making.

### [Networking](https://www.dadishimwe.com/projects/networking-projects/)
Building robust network solutions and exploring network protocols. Dive into infrastructure design, network automation, and cutting-edge connectivity solutions.

### [Development](https://www.dadishimwe.com/categories/development/)
Full-stack applications and innovative software solutions. From web applications to API development, these projects demonstrate modern development practices.

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
