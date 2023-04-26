import React from 'react';
import '../styles/Blog.css';
import PaginateBlog from './PaginateBlog';

function Blog() {
  return (
    <div>
      <h2 className='blog_title'>Check out our news!</h2>
      <PaginateBlog />
    </div>
  );
}

export default Blog;
