import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";

const ProductList = (props) => {
  const [category, setCategory] = useState(""); // 무슨 카테고리인지 판단
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryValue = searchParams.get("category");
    setCategory(categoryValue);
    // products 리스트를 db.json으로 부터 가져옴
  }, [category]);

  return (
    <Container className="border border-left-2 border-right-2 border-dark p-4 w-full ">
      <>
        <div className="d-flex justify-content-between">
          <h4>{category}</h4>
          <form className="flex">
            <Link to="/CreateProduct">
              <input type="submit" value="상품등록" />
            </Link>
          </form>
        </div>
        <ProductCard category={category} />
      </>
    </Container>
  );
};

export default ProductList;
