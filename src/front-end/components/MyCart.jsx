import React, { useEffect, useState } from "react";
import { Table, Container, Card, Alert, Button } from "react-bootstrap";

const MyCart = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3300/orders")
      .then((response) => response.json())
      .then((data) => {
        const userOrders = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        if (userOrders.length > 0) {
          setOrders(userOrders);
        }
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        const userData = data.find(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        if (userData) {
          setUser(userData);
        }
      });
  }, []);


  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await Promise.all(
        orders.map(async (order) => {
          const response = await fetch(`http://localhost:3300/products/${order.id}`);
          const productInfo = await response.json();
          return { ...order, 
            productName: productInfo.name,
            productPrice: productInfo.price,
            shippingFee: productInfo.shippingFee,
            image: productInfo.image
            };
        })
      );

      setProducts(productData);
    };

    if (orders.length > 0) {
      fetchProductData();
    }
  }, [orders]);

  if (orders.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          장바구니가 비어 있습니다.
        </Alert>
      </Container>
    );
  }

  
  return (
    <>
    <Container className="my-5">
      <Card>
        <Card.Header>
          <h2 className="mb-0">{user && `${user.nickName}님의 장바구니`}</h2>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>상품 이름</th>
                <th>상품이미지</th>
                <th>상품 가격</th>
                <th>상품 수량</th>
                <th>상품 배송비</th>
                <th>총 가격</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{product.productName}</td>
                  <td><img src={product.image} alt="description" style={{width:"150px", height:"100px"}}/></td>
                  <td>{product.productPrice}</td>
                  <td>{product.productQuantity}</td>
                  <td>{product.shippingFee}</td>
                  <td>{product.shippingFee === "무료"
                        ? product.productPrice * product.productQuantity
                        : product.productPrice * product.productQuantity + Number(product.shippingFee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
        <h5>총 가격: {calculateTotalPrice(products)} 원</h5>
        </Card.Footer>
      </Card>
    </Container>
    <Button variant="outline-primary" style={{margin:"auto"}}>
          쇼핑 계속하기
        </Button>{' '}
        <Button variant="primary">
          주문하기
        </Button>
    </>
  );
};

const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => {
      const productPrice = product.productPrice || 0;
      const productQuantity = product.productQuantity || 0;
      const shippingFee = product.shippingFee === "무료" ? 0 : Number(product.shippingFee);
      
      return total + productPrice * productQuantity + shippingFee;
    }, 0);
  };

export default MyCart;