import React from 'react';
import { useRecoilValue } from 'recoil';
import { users } from '../recoil_state';
import '../styles/Article.css';

function Article(props) {
  const usersList = useRecoilValue(users);
  const author = usersList.find((el) => el.id === props.userId);
  return (
    <div className='article'>
      <h3 className='article_title'>{props.title}</h3>
      <p className='article_author'>
        <em>{author?.name}</em>
      </p>
      <p className='article_content'>{props.content}</p>
    </div>
  );
}

export default Article;
