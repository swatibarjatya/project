import React, { useEffect, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import ReactPaginate from 'react-paginate';
import Article from '../components/Article';
import { posts, users } from '../recoil_state';
import '../styles/PaginateBlog.css';

function PaginateBlog() {
  const postsAPI = 'https://jsonplaceholder.typicode.com/posts';
  const usersAPI = 'https://jsonplaceholder.typicode.com/users';

  const setPosts = useSetRecoilState(posts);
  const postsList = useRecoilValue(posts);

  const setUsers = useSetRecoilState(users);

  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    fetch(postsAPI)
      .then((response) => response.json())
      .then((data) => setPosts(() => data));
  });

  useEffect(() => {
    fetch(usersAPI)
      .then((response) => response.json())
      .then((data) => setUsers(() => data));
  });

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentArticles = postsList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(postsList.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % postsList.length;
    setItemOffset(newOffset);
  };

  const currentPageData = currentArticles.map((article) => (
    <Article
      key={article.id}
      userId={article.userId}
      title={article.title}
      content={article.body}
    />
  ));

  return (
    <>
      {currentPageData}
      <ReactPaginate
        breakLabel='...'
        nextLabel='next ⇨'
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel='⇦ previous'
        renderOnZeroPageCount={null}
        className='pagination'
        activeClassName='pagination_activeClass'
        breakLinkClassName='pagination_link'
        pageLinkClassName='pagination_link'
        previousLinkClassName='pagination_button'
        nextLinkClassName='pagination_button'
      />
    </>
  );
}

export default PaginateBlog;
