import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import styles from "../../css/productCss/productList.module.css";

const ProductList = (props) => {
  const [category, setCategory] = useState(""); // 무슨 카테고리인지 판단
  const [products, setProducts] = useState([]); // 식품 카테고리의 데이터를 들고와야함
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryValue = searchParams.get("category");
  useEffect(() => {
    setCategory(categoryValue);
    // products 리스트를 db.json으로 부터 가져옴
    getProductsData(categoryValue);
    console.log(category);
  }, [location.search]);

  const getProductsData = (productCategory) => {
    fetch("http://localhost:3300/products")
      .then((response) => response.json())
      .then((jsonData) => {
        const products = jsonData.filter(
          (item) => item.category === productCategory /* 여기에 잘라온거 */
        );
        setProducts(products);
      });
  };

  return (
    <Container className={styles.background}>
      <>
        <div className="d-flex justify-content-between align-items-center shadow-lg p-3 mb-5 rounded">
          <h4>{category}</h4>
          <form>
            <Link to="/CreateProduct">
              <button
                type="button"
                className="btn btn-primary btn-lg rounded border-0 text-white"
              >
                상품등록
              </button>
            </Link>
          </form>
        </div>
        <ProductCard products={products} />
      </>
    </Container>
  );
};

export default ProductList;
