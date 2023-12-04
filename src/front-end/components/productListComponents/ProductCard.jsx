import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/productCss/productList.module.css";
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { deleteImageFromS3 } from "../../../back-end/services/aws";

const ProductCard = (props) => {
  const { products, user, getProductsData } = props;
  const itemsPerPage = 8;
  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const loginUser = localStorage.getItem("Email");

  const handleDelete = (item) => {
    /* eslint-disable */
    console.log(item.id);
    if (!confirm("상품을 삭제하시겠습니까?")) {
      return;
    }

    // 지금 얘가 PRODUCT에 접근해서 삭제하는데 COMMENT랑 ORDER도 사라짐
    fetch(`http://localhost:3300/products/${item.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to delete product. Status: ${response.status}`);
          return;
        }
        console.log(response);
        deleteImageFromS3(item.image);
        getProductsData(item.category);
      })
      .catch((error) => {
        console.error("Error during DELETE request:", error);
      });
  };

  return (
    <div>
      {currentItems.length === 0 ? (
        <h1 className="d-flex justify-content-center align-items-center p-5">
          현재 판매중인 상품이 존재하지 않습니다.
        </h1>
      ) : (
        <>
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
                {(user === "Admin" || loginUser === item.seller_id) && (
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
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                )}
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
                    <p className="card-text text-decoration-none">
                      {item.name}
                    </p>
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
        </>
      )}
    </div>
  );
};

export default ProductCard;
