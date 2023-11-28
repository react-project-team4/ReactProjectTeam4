import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/productCss/productList.module.css";
import Pagination from "react-js-pagination";

const ProductCard = (props) => {
  const { products } = props;
  const itemsPerPage = 8;
  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div
        className="d-flex flex-wrap flex-grow-0 justify-content-center"
        style={{ marginTop: "50px" }}
      >
        {currentItems.map((item) => (
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
      <div className="d-flex justify-content-center mt-4 p-3">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={products.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass={styles.paginationItem}
          linkClass={styles.paginationLink}
          activeClass={styles.aciveItem}
          activeLinkClass={styles.activeLink}
        />
      </div>
    </div>
  );
};

export default ProductCard;
