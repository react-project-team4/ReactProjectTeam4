import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ProductRegister from "./ProductRegister";

const ProductList = () => {
  const [products, setProducts] = ([]); // 식품 카테고리의 데이터를 들고와야함
  const [showProductRegister, setShowProductRegister] = useState(false); // 상품 등록/보여주기 상태관리

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowProductRegister(true);
  }

  return (
    <Container className="border border-left-2 border-right-2 border-dark p-4 w-full ">
      {showProductRegister ? (
        <ProductRegister setShowProductRegister />
      ) : (
        <>
          <h4>식품</h4>
          <div class="card" style={{ width: "18rem" }}>
            <img class="card-img-top" src="..." alt="Card image cap" />
            <div class="card-body">
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <input type="submit" value="상품등록" />
          </form>
        </>
      )}
    </Container>

  )
}

export default ProductList;