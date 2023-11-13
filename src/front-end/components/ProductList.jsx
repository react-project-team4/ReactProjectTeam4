import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import CreateProduct from "./CreateProduct";

const ProductList = (props) => {
  const [products, setProducts] = useState([]); // 식품 카테고리의 데이터를 들고와야함
  const location = useLocation();

  useEffect(() => {
    console.log(location.search);
    setProducts(location.search);
  });
  return (
    <Container className="border border-left-2 border-right-2 border-dark p-4 w-full ">
      <>
        <div className="d-flex justify-content-between">
          <h4>식품</h4>
          <form className="flex">
            <Link to="/CreateProduct">
              {" "}
              <input type="submit" value="상품등록" />
            </Link>
          </form>
        </div>
        <div className="card" style={{ width: "18rem" }}>
          <img className="card-img-top" src="..." alt="Card image cap" />
          <div className="card-body">
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>
      </>
    </Container>
  );
};

export default ProductList;
