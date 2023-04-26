import { atom } from 'recoil';

const products = atom({
  key: 'products',
  default: [],
});

const users = atom({
  key: 'atoms',
  default: [],
});

const posts = atom({
  key: 'posts',
  default: [],
});

const adminPermission = atom({
  key: 'adminPermission',
  default: false,
});

const userName = atom({
  key: 'userName',
  default: '',
});
const userPassword = atom({
  key: 'userPassword',
  default: '',
});

const categories = atom({
  key: 'categories',
  default: [],
});

export {
  categories,
  products,
  users,
  posts,
  adminPermission,
  userName,
  userPassword,
};
