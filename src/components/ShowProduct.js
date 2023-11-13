import React, { useState, useEffect } from "react";
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
    name: "상품명",
    sellerId: "1234",
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
    if (user === "user") getCartList();

    if (user === "admin" || user === "seller") getProductList();
  }, []);

  // 상품 정보 가져오기
  const getProductData = () => {
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
    fetch(`http://localhost:3100/users/`)
      .then((response) => response.json())
      .then((jsonData) => {
        // localStorage.getItem(key) // localStorage.getItem(userId)
        setCartList(jsonData.find((item) => item.userId === "1234").cartList);
      });

    console.log(cartList);
  };

  const getProductList = () => {
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
      const guestCartList =
        JSON.parse(sessionStorage.getItem("guestCartList")) || [];
      if (guestCartList.includes(product.productId)) {
        return alert("이미 장바구니에 있는 상품입니다");
      }
      sessionStorage.setItem(
        "guestCartList",
        JSON.stringify([...guestCartList, product.productId])
      );
      return;
    }
    if (cartList.includes(product.productId)) {
      return alert("이미 장바구니에 있는 상품입니다");
    }
    setCartList([...cartList, product.productId]);
    alert("장바구니에 추가되었습니다.");
  };
  const buy = () => {
    if (user === "guest") {
      return alert("로그인 후 이용가능합니다.");
    }
    if (cartList.includes(product.productId)) {
      return;
    }
    setCartList([...cartList, product.productId]);
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
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <img className="img-fluid" src={product.image} alt="" />
          </Col>
        </Row>
        <Row className=" justify-content-between">
          <Col xs="7" sm="8" md="9" lg="9">
            <strong style={{ fontSize: "35px" }}>{product.name}</strong>
          </Col>
          <Col className="d-flex align-items-center  justify-content-end">
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
                장바구니 담기
              </Button>
              <Button variant="outline-success" onClick={buy}>
                구매하기
                <Link to="/Login" className="text-decoration-none text-reset">
                  구매하기
                </Link>
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
          <Col style={{ fontSize: "20px", wordWrap: "break-word" }}>
            {product.content}
          </Col>
        </Row>
      </Container>
    </>
  );
}
