import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { categories, products } from '../recoil_state';
import Product from '../components/Product';
function Category() {
  const params = useParams();
  const id = Number(params.id);

  const categoriesList = useRecoilValue(categories);
  const productsList = useRecoilValue(products);

  const category = categoriesList.find((category) => category.id === id);
  const filteredProducts = productsList.filter(
    (product) => product.category === category.category
  );
  const displayProducts = filteredProducts.map((product) => (
    <Product
      key={product.id}
      id={product.id}
      title={product.title}
      price={product.price}
      image={product.images[0]}
      description={product.description}
      category={product.category}
    />
  ));
  return (
    <div>
      <Link className='back_to_list' to='/productsList'>
        Back to list
      </Link>
      <div className='products'>{displayProducts}</div>;
    </div>
  );
}

export default Category;
