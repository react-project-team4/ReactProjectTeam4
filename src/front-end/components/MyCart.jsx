import React, { useEffect, useState } from "react";
import { Table, Container, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyCart = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartList, setCartList] = useState(null);
  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState([]);

  const handleOrderClick = () => {
    if (checkedProducts.length > 0) {
      const selectedProducts = checkedProducts.map(productId => {
        const selectedProduct = products.find(product => product.id === productId);
        console.log(selectedProduct)
        return {
          id: selectedProduct.id,
          image: selectedProduct.image,
          name: selectedProduct.productName,
          productQuantity: selectedProduct.productQuantity,
          shippingFee: selectedProduct.shippingFee,
          price: selectedProduct.productPrice, // 추가된 부분
        };
      });
  
      const productDetailsParam = encodeURIComponent(JSON.stringify(selectedProducts));
      navigate(`/Payment?products=${productDetailsParam}`);
    } else {
      window.alert("주문할 상품을 선택해주세요.");
    }
  };

  const handleDeleteClick = async () => {
    if (checkedProducts.length > 0) {
      const confirmDelete = window.confirm(`${checkedProducts.length}개의 상품을 삭제하시겠습니까?`);
      if (confirmDelete) {
        try {
          // 각 체크된 상품에 대해 user의 cartList에서 제거
          const updatedCartList = user.cartList.filter(productId => !checkedProducts.includes(productId));
          
          const response = await fetch(`http://localhost:3300/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartList: updatedCartList,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Failed to update cartList for user ${user.id}`);
          }
  
          // 삭제 후 화면 갱신
          window.location.href = "/MyCart";
          
          // 삭제 후 체크 상태 초기화
          setCheckedProducts([]);
        } catch (error) {
          console.error("Error deleting products from cart:", error);
        }
      }
    } else {
      // 체크한 상품이 없을 경우
      window.alert("삭제할 상품을 선택해주세요.");
    }
  };
  

  // 주어진 상품 목록(products)과 선택된 상품 ID 목록(checkedProducts)을 이용하여
  // 선택된 상품들의 총 가격을 계산하는 함수
  const calculateTotalPrice = (products, checkedProducts) => {
    return products.reduce((total, product) => {
      if (checkedProducts.includes(product.id)) {
        const productPrice = product.productPrice || 0;
        const productQuantity = product.productQuantity || 0;
        const shippingFee = product.shippingFee === "무료" ? 0 : Number(product.shippingFee);
        const totalPrice = (productPrice * productQuantity) + shippingFee;

        return total + totalPrice;
      }

      return total;
    }, 0);
  };



  const handleCheckboxChange = (productId) => {
    setCheckedProducts((prevCheckedProducts) => {
      if (prevCheckedProducts.includes(productId)) {
        // 이미 체크된 경우, 제거
        return prevCheckedProducts.filter(id => id !== productId);
      } else {
        // 체크되지 않은 경우, 추가
        return [...prevCheckedProducts, productId];
      }
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
  
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, productQuantity: newQuantity } : product
      )
    );
  };

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find(
          (e) => e.user_id === localStorage.getItem("Email")
        );
        if (user) {
          setCartList(user.cartList || []);
          setUser(user)
        }
      });
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!cartList) {
        return; // cartList가 null인 경우 fetchProductData 함수 종료
      }
  
      const productData = await Promise.all(
        cartList.map(async (productId) => {
          const response = await fetch(`http://localhost:3300/products/${productId}`);
          const productInfo = await response.json();
          return {
            id: productId,
            productName: productInfo.name,
            productPrice: productInfo.price,
            shippingFee: productInfo.shippingFee,
            image: productInfo.image,
            productQuantity: 1,
          };
        })
      );
  
      setProducts(productData);
    };
  
    if (cartList && cartList.length > 0) {
      fetchProductData();
    }
  }, [cartList]);

  return (
    <>
      <Container className="my-5">
        <Card>
          <Card.Header>
            <h2 className="mb-0">{localStorage.getItem("Nickname")}님의 장바구니</h2>
          </Card.Header>
          <Card.Body>
            <Table bordered hover>
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
                    <td>
                      <img src={product.image} alt="description" style={{ width: "150px", height: "100px" }} />
                    </td>
                    <td>{product.productPrice}</td>
                    <td>
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(product.id, product.productQuantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity"> {product.productQuantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(product.id, product.productQuantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{product.shippingFee}</td>
                    <td>
                      {product.shippingFee === "무료"
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
            <Button variant="primary" onClick={handleDeleteClick}>
              삭제
            </Button>
          </Card.Footer>
          <Card.Footer className="d-flex justify-content-center">
            <a href="/">
              <Button variant="outline-primary" style={{ width: "200px", height: "70px" }}>
                쇼핑 계속하기
              </Button>{" "}
            </a>
            {checkedProducts.length > 0 && (
              <Button variant="primary" style={{ width: "200px", height: "70px" }} onClick={handleOrderClick}>
                주문하기
              </Button>
            )}
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default MyCart;