import React, { useEffect, useState } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { products } from '../recoil_state';
import Product from '../components/Product';
import ReactPaginate from 'react-paginate';
import '../styles/ProductsList.css';

import img from '../images/pathan.jpeg';

function ProductsList() {
  //recoil
  const productsListRecoil = useRecoilValue(products);
  const setProducts = useSetRecoilState(products);

  // getting data from API

  const productAPI = 'http://localhost:8080/api/movies';
  useEffect(() => {
    fetch(productAPI)
      .then((res) => res.json())
      .then((data) => setProducts(() => data));
  }, [setProducts]);

  // pagination

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const currentProducts = productsListRecoil.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(productsListRecoil.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % productsListRecoil.length;
    setItemOffset(newOffset);
  };

  const productsList = currentProducts.map((product) => (
    <Product
      key={product.id}
      id={product.id}
      title={product.title}
      price={product.durationInMin}
      image={product.images[0]}
      description={product.description}
      category={product.category}
    />
  ));
  return (
    <>
      <div className='products'>{productsList}</div>
      <ReactPaginate
        breakLabel='...'
        nextLabel='next ⇨'
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
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

export default ProductsList;
