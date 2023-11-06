import React, { useState, useEffect } from "react";
import {} from "../css/ShowProduct.module.css";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ShowProduct(props) {
  // const { user } = props;
  const [user, setUser] = useState("guest");
  const [cartList, setCartList] = useState([]);
  // 임시 하드코딩 props로 productsId를 받아와서 찾은 후 셋
  const [product, setProduct] = useState({
    // productId: "",
    // name: "",
    // price: "",
    // content: "",
    // image: "",
    // category: "",
    productId: "1",
    name: "상품명상품명상품명상품명상품명상품명상품명상품명상품명상품명",
    price: "10,000",
    content:
      "제품설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명",
    image:
      "https://cdn.pixabay.com/photo/2020/08/09/11/31/business-5475283_1280.jpg",
    category: "Food",
  });

  useEffect(() => {
    setUser("guest");

    getProductData();
    if (user === "user" || user === "seller") getCartList();

    if (user === "admin") getProductList();
  }, []);

  // 상품 정보 가져오기
  const getProductData = async () => {
    fetch("http://localhost:3100/products")
      .then((response) => response.json())
      .then((jsonData) =>
        // item.productId === props.productsId
        // setProduct(jsonData.find((item) => item.productId === "1"))
        setProduct(product)
      );

    console.log(product);
  };

  // 장바구니 리스트 가져오기
  const getCartList = () => {
    //   const response = await fetch(`http://localhost:3100/${user}s/`);
    //   const jsonData = await response.json();

    //   // localStorage.getItem(key) // localStorage.getItem(userId)
    //   const findList = jsonData.find((item) => item.userId === "1234");
    //   setCartList(findList.cartList);

    fetch(`http://localhost:3100/users/`)
      .then((response) => response.json())
      .then((jsonData) => {
        // localStorage.getItem(key) // localStorage.getItem(userId)
        setCartList(jsonData.find((item) => item.userId === "1234").cartList);
      });

    console.log(cartList);
  };

  const getProductList = async () => {
    // const response = await fetch(`http://localhost:3100/sellers/`);
    // const jsonData = await response.json();

    // // localStorage.getItem(key) // localStorage.getItem(userId)
    // const findList = jsonData.find((item) => item.userId === product.sellerId);
    // setCartList(findList.productList);

    fetch(`http://localhost:3100/sellers/`)
      .then((response) => response.json())
      .then((jsonData) => {
        // localStorage.getItem(key) // localStorage.getItem(userId)
        setCartList(jsonData.find((item) => item.userId === product.sellerId));
      });

    console.log(cartList);
  };

  // 장바구니 담기
  const addCart = () => {
    if (user === "guest") {
      return alert(" 장바구니는 로그인 후 사용하실 수 있습니다.");
    }
    if (cartList.includes(product.productId)) {
      return alert("이미 장바구니에 있는 상품입니다");
    }
    setCartList([...cartList, product.productId]);
    alert("장바구니에 추가되었습니다.");
  };

  return (
    <>
      <Container>
        <Row
          xs="auto"
          sm="auto"
          md="auto"
          lg="auto"
          className="justify-content-center mt-5 mb-3"
        >
          <Col>
            <img className="img-fluid" src={product.image} alt="" />
          </Col>
        </Row>
        <Row className="justify-content-between">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <strong style={{ fontSize: "35px" }}>{product.name}</strong>
          </Col>
          <Col
            xs="auto"
            sm="auto"
            md="auto"
            lg="auto"
            className="d-flex align-items-center"
          >
            <strong style={{ fontSize: "35px" }}>{product.price}</strong>
            <span style={{ fontSize: "25px", marginLeft: "3px" }}>원</span>
          </Col>
        </Row>
        <Row className="justify-content-end mt-2">
          {user === "guest" || user === "user" ? (
            // guest, user
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <Button
                variant="outline-success"
                onClick={addCart}
                style={{ marginRight: "5px" }}
              >
                {/* 링크의 주소들은 임시 세팅 */}
                {user === "guest" ? (
                  // guest
                  <Link to="/login" className="text-decoration-none text-reset">
                    장바구니 담기
                  </Link>
                ) : (
                  // user
                  "장바구니"
                )}
              </Button>
              <Button variant="outline-success" onClick={addCart}>
                구매하기
              </Button>
            </Col>
          ) : (
            // seller, admin
            <Col xs="auto" sm="auto" md="auto" lg="auto">
              <Button variant="outline-success" style={{ marginRight: "5px" }}>
                수정
              </Button>
              <Button variant="outline-success">삭제</Button>
            </Col>
          )}
        </Row>
        <Row className="justify-content-start ml-5 mt-5 mb-3">
          <Col
            xs="auto"
            sm="auto"
            md="auto"
            lg="auto"
            style={{ fontSize: "20px", wordWrap: "break-word" }}
          >
            {product.content}
          </Col>
        </Row>
      </Container>
    </>
  );
}
