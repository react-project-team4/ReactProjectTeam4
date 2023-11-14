import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = (props) => {
  const [products, setProducts] = useState([]); // 식품 카테고리의 데이터를 들고와야함
  const { category } = props;
  useEffect(() => {
    getProductsData(category);
  }, [category]);
  const getProductsData = (productCategory) => {
    fetch("http://localhost:3300/products")
      .then((response) => response.json())
      .then((jsonData) => {
        const products = jsonData.filter(
          (item) => item.category === productCategory /* 여기에 잘라온거 */
        );
        setProducts(products);
        console.log(products);
      });
  };
  return (
    <div className="d-flex">
      {products.map((item) => (
        <Link to={{ pathname: "/showProduct", state: { item } }}>
          <div key={item.id} className="card" style={{ width: "18rem" }}>
            <img
              className="card-img-top"
              style={{ height: "200px" }}
              src={item.image}
              alt="Card image cap"
            />
            <div className="card-body">
              <p className="card-text">{item.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
