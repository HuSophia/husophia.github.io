---
title: Posts
layout: page
icon: fas fa-feather
order: 4
---

<style>
.posts-container {
  max-height: 600px; /* Adjust height as needed */
  overflow-y: auto;
  padding-right: 10px; /* Add padding for better appearance */
}

.post-box {
  border: 1px solid #e0e0e0;
  padding: 16px;
  margin: 16px 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}
.post-box:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.post-title {
  font-size: 1.5em;
  margin-bottom: 8px;
}
.post-date {
  color: #888;
  margin-bottom: 16px;
}
.post-excerpt {
  margin-bottom: 0;
}
</style>

<div class="posts-container">
  {% for post in site.posts %}
  <div class="post-box">
    <div class="post-title">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
    <div class="post-date">
      {{ post.date | date: "%B %d, %Y" }}
    </div>
    <div class="post-excerpt">
      {{ post.excerpt | strip_html | truncatewords: 30 }}
    </div>
  </div>
  {% endfor %}
</div>


