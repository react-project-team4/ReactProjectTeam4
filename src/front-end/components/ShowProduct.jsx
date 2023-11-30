import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../css/productCss/showProduct.module.css";
import Comment from "./Comment";

export default function ShowProduct(props) {
  // const [user, setUser] = useState("Seller"); // testCode
  const user = props.user;
  const [cartList, setCartList] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  const productData = location.state.item;
  const loginUser = localStorage.getItem("Email");

  useEffect(() => {
    console.log(location);
    console.log(productData);
    if (user === "Buyer") getCartList();

    if (user === "Admin" || user === "Seller") getProductList();
  }, []);

  // 장바구니 리스트
  const getCartList = () => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((jsonData) => {
        // localStorage.getItem(key) // localStorage.getItem("user_id")
        const cartList = jsonData.find(
          (item) => item.user_id === localStorage.getItem("Email")
        ).cartList;
        console.log(cartList);
        cartList === undefined ? setCartList([]) : setCartList(cartList);
      });
  };

  // 판매 물품 리스트
  const getProductList = () => {
    fetch(`http://localhost:3300/sellers`)
      .then((response) => response.json())
      .then((jsonData) => {
        const cartList = jsonData.find(
          (item) => item.user_id === productData.seller_id
        ).productList;
        cartList === undefined ? setCartList([]) : setCartList(cartList);
        console.log(cartList);
      });
  };

  // 장바구니 담기
  const addCart = () => {
    if (user === "Guest") {
      const guestCartList =
        JSON.parse(sessionStorage.getItem("guestCartList")) || [];
      if (guestCartList.includes(productData.id)) {
        return alert("이미 장바구니에 있는 상품입니다");
      }
      sessionStorage.setItem(
        "guestCartList",
        JSON.stringify([...guestCartList, productData.id])
      );
      alert("장바구니에 추가되었습니다.");
      return;
    }
    // user === "User"
    if (cartList.includes(productData.id)) {
      return alert("이미 장바구니에 있는 상품입니다");
    }

    setCartList((prevCartList) => {
      const updatedCartList = [...prevCartList, productData.id];

      // ${localStorage.getItem("userId")}
      fetch(`http://localhost:3300/users/${localStorage.getItem("user_id")}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartList: updatedCartList }),
      }).then((response) => {
        console.log(response);
      });
      console.log(updatedCartList);
      return updatedCartList;
    });

    alert("장바구니에 추가되었습니다.");
  };
  // 구매하기
  const buy = () => {
    if (user === "Guest") {
      return alert("로그인 후 이용가능합니다.");
    }
    if (cartList.includes(productData.id)) {
      return;
    }
    setCartList((prevCartList) => {
      const updatedCartList = [...prevCartList, productData.id];

      // ${localStorage.getItem("userId")}
      fetch(`http://localhost:3300/users/${localStorage.getItem("user_id")}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartList: updatedCartList }),
      }).then((response) => {
        console.log(response);
      });
      return updatedCartList;
    });
  };
  // 상품 삭제하기
  const deleteProduct = () => {
    /* eslint-disable */
    if (!confirm("상품을 삭제하시겠습니까?")) {
      return;
    }
    setCartList((prevProductList) => {
      const updatedProductList = prevProductList.filter(
        (item) => item !== productData.id
      );

      fetch(`http://localhost:3300/sellers/${localStorage.getItem("Email")}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ productListList: updatedProductList }),
      }).then((response) => {
        console.log(response);
      });
      return updatedProductList;
    });

    fetch(`http://localhost:3300/products/${productData.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      console.log(response);
    });

    navigate(`/ProductList?category=${productData.category}`);
  };
  // 버튼 기본 className="btn btn-primary btn-lg rounded border-0 text-white"
  return (
    <Container className={styles.background}>
      <Row className="mt-2 mb-2">
        <Col className="d-flex justify-content-end">
          <Button variant="outline-dark" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col xs="auto" sm="auto" md="auto" lg="auto">
          <img className="img-fluid" src={productData.image} alt="" />
        </Col>
      </Row>
      <Row className="justify-content-between">
        <Col xs="7" sm="8" md="9" lg="9">
          <strong style={{ fontSize: "35px", fontWeight: 10 }}>
            {productData.name}
          </strong>
        </Col>
        <Col className="d-flex  align-items-end justify-content-end">
          <strong style={{ fontSize: "35px", fontWeight: 10 }}>
            {productData.price}
          </strong>
          <span
            className="pb-1"
            style={{ fontSize: "25px", marginLeft: "3px" }}
          >
            원
          </span>
        </Col>
      </Row>
      <Row className="justify-content-end mt-2">
        {user === "Guest" || user === "Buyer" ? (
          // Guest, User
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <Button
              variant="outline-dark"
              onClick={addCart}
              style={{ marginRight: "5px" }}
            >
              장바구니 담기
            </Button>

            <Button variant="outline-dark" onClick={buy}>
              {user === "Guest" ? (
                <Link to="/Login" className="text-decoration-none text-reset">
                  구매하기
                </Link>
              ) : (
                <Link to="/MyCart" className="text-decoration-none text-reset">
                  구매하기
                </Link>
              )}
            </Button>
          </Col>
        ) : (
          (loginUser === productData.seller_id || user === "Admin") && (
            // Seller, Admin
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <Button variant="outline-dark" style={{ marginRight: "5px" }}>
                수정
              </Button>
              <Button variant="outline-dark" onClick={deleteProduct}>
                삭제
              </Button>
            </Col>
          )
        )}
      </Row>
      <Row className=" ml-5 mt-5 mb-3">
        <Col
          style={{
            whiteSpace: "pre",
            fontSize: "20px",
            wordWrap: "break-word",
          }}
        >
          {productData.content}
        </Col>
      </Row>
      <Row>
        <Comment productData={productData} />
      </Row>
    </Container>
  );
}
