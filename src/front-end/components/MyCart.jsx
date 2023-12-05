import React, { useEffect, useState } from "react";
import { Table, Container, Card, Alert, Button } from "react-bootstrap";
import styles from "../css/MyCart.module.css";

const MyCart = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState([]);

  const handleQuantityChange = async (productId, newQuantity) => {

    if (newQuantity < 1) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3300/orders/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productQuantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product quantity for ID ${productId}`);
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, productQuantity: newQuantity } : product
        )
      );
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };


  const handleCheckboxChange = (productId) => {
    if (checkedProducts.includes(productId)) {
      // 이미 체크된 경우, 제거
      setCheckedProducts(checkedProducts.filter(id => id !== productId));
    } else {
      // 체크되지 않은 경우, 추가
      setCheckedProducts([...checkedProducts, productId]);
    }
  };

  const handleDeleteClick = async () => {
    if (checkedProducts.length > 0) {
      const confirmDelete = window.confirm(`${checkedProducts.length}개의 상품을 삭제하시겠습니까?`);
      if (confirmDelete) {
        // 각 체크된 상품에 대해 DELETE 요청 보내기
        try {
          await Promise.all(
            checkedProducts.map(async (productId) => {
              const response = await fetch(`http://localhost:3300/orders/${productId}`, {
                method: 'DELETE',
              });
  
              if (!response.ok) {
                throw new Error(`Failed to delete product with ID ${productId}`);
              }
            })
          );
          // 삭제 후 리다이렉션
          window.location.href = "/MyCart"
          
          // 삭제 후 체크 상태 초기화
          setCheckedProducts([]);
        } catch (error) {
          console.error("Error deleting products:", error);
        }
      }
    } else {
      // 체크한 상품이 없을 경우
      window.alert("삭제할 상품을 선택해주세요.");
    }
  };
  

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
                    <input
                      type="checkbox"
                      checked={checkedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td>{product.productName}</td>
                  <td><img src={product.image} alt="description" style={{width:"150px", height:"100px"}}/></td>
                  <td>{product.productPrice}</td>
                  <td>
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product.id, product.productQuantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">  {product.productQuantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product.id, product.productQuantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
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
        <Card.Footer className="d-flex justify-content-between align-items-center">
            <h5>총 가격: {calculateTotalPrice(products, checkedProducts)} 원</h5>
            <Button variant="primary" onClick={handleDeleteClick}>삭제</Button>
        </Card.Footer>
      </Card>
    </Container>
    <Container className="d-flex justify-content-center">
      <a href="http://localhost:3000/">
      <Button variant="outline-primary" style={{width:"200px", height:"70px"}}>
        쇼핑 계속하기
      </Button>{' '}
      </a>
      <Button variant="primary" style={{width:"200px", height:"70px"}}>
        주문하기
      </Button>
    </Container>
    </>
  );
};

const calculateTotalPrice = (products, checkedProducts) => {
  return products.reduce((total, product) => {
    // 체크된 상품만 계산에 포함
    if (checkedProducts.includes(product.id)) {
      const productPrice = product.productPrice || 0;
      const productQuantity = product.productQuantity || 0;
      const shippingFee = product.shippingFee === "무료" ? 0 : Number(product.shippingFee);
      
      return total + productPrice * productQuantity + shippingFee;
    }

    return total;
  }, 0);
};

export default MyCart;