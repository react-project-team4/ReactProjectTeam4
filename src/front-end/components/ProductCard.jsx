import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../css/productList.module.css";

const ProductCard = (props) => {
  const { products } = props;

  return (
    <div className="d-flex flex-wrap flex-grow-0" style={{ marginTop: "50px" }}>
      {products.map((item) => (
        <Link
          className={styles.boxShadow}
          key={item.id}
          to={`/showProduct`}
          state={{ item }}
          style={{ textDecoration: "none" }}
        >
          <div className="card mx-2 my-2 " style={{ width: "18rem" }}>
            <img
              className="card-img-top"
              style={{ height: "200px" }}
              src={item.image}
              alt="Card image cap"
            />
            <div
              className="card-body text-white bg-primary rounded-lg"
              style={{ opacity: "0.5" }}
            >
              <p className="card-text text-decoration-none">{item.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
