import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/productCss/productList.module.css";
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { deleteImageFromS3 } from "../../../back-end/services/aws";

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

  const handleDelete = (id, image) => {
    console.log(id);
  };

  return (
    <div>
      <div
        className="d-flex flex-wrap flex-grow-0 justify-content-center"
        style={{ marginTop: "50px" }}
      >
        {currentItems.map((item) => (
          <div
            className="card mx-2 my-2 "
            style={{ width: "18rem" }}
            key={item.id}
          >
            <div>
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "red",
                  color: "white",
                  padding: "5px",
                  zIndex: 5,
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(item.id, item.image)}
              />
            </div>
            <Link
              className={styles.boxShadow}
              key={item.id}
              to={`/showProduct`}
              state={{ item }}
              style={{ textDecoration: "none" }}
            >
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
            </Link>
          </div>
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
