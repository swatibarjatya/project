import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Product.css';
function Product(props) {
  const addToCart = () => {
    console.log('Klik');
  };

  return (
    <div className='product'>
      <div className='img_wrapper'>
        <img className='product_img' src={props.image} alt={props.name} />
      </div>
      <Link to={`/productsList/${props.id}`} className='product_title'>
        {props.title}
      </Link>
      <p className='product_price'>{props.price}</p>

      <button onClick={addToCart} className='add_To_Cart'>
        Add to cart
      </button>
    </div>
  );
}

export default Product;
