import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from "../../css/myPageCss/MyPageOrderList.module.css";

const MyPageOrderList = () => {
  const [orders, setOrders] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3300/orders")
      .then((response) => response.json())
      .then((data) => {
        const $order = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );
        if ($order) {
          setOrders($order);
        }
      });
  }, []);

  console.log("디테일", orderDetails) // 주문목록이 담긴 배열
  console.log("오더", orders)

  useEffect(() => {
    // 주문 항목에 대한 제품 정보 가져오기
    if (orders) {
      const fetchProductDetails = async () => {
        // 각 주문 항목에 대해 비동기적으로 제품 정보 가져오기
        const details = await Promise.all(
          orders.map(async (order) => {
            const response = await fetch(
              `http://localhost:3300/products/${order.product_id}`
            );
            const productDetails = await response.json();
            return {
              ...order,
              productDetails,
            };
          })
        );
        setOrderDetails(details);
      };

      fetchProductDetails();
    }
  }, [orders]);

    
  // useEffect(() => {
  //   fetch("http://localhost:3300/users")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const $user = data.filter(
  //         (e) => e.user_id === localStorage.getItem("Email")
  //       );

  //       if ($user.length > 0) {
  //         setUsers($user[0]);
  //         console.log(users)
  //       }
  //     });

  //   fetch("http://localhost:3300/products")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProducts(data);
  //     });
  // }, []);
  

  // console.log("오더",orders)

  // if (users === null || products === null || !  users.cartList) {
  //   return <div>Loading...</div>;
  // }

  // const orderList = users.cartList.map((cartItem, index) => {
  //   const product = products.find((product) => product.id === cartItem);

  //   let sumPrice =
  //   product.shippingFee === "무료"
  //     ? Number(product.price)
  //     : Number(product.price) + Number(product.shippingFee);

  //   return (
  //     <tr key={index}>
  //       <td><img src={product.image} alt="description" style={{width:"150px", height:"100px"}}/></td>
  //       <td>{product.name}</td>
  //       <td>{product.price}</td>
  //       <td>{product.shippingFee}</td>
  //       <td>{sumPrice}</td>
  //     </tr>
  //   );
  // });

  return (
    <>
      <div className={styles.clientNameSection}>
        {localStorage.getItem("Nickname")}님의 주문목록
      </div>
      <br />
      <Table bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>상품 이름</th>
            <th>상품 수량</th>
            <th>상품 금액</th>
            <th>배송비</th>
            <th>총 금액</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((order, index) => (
            <>
            {/* 주문 날짜 형식 변경 */}
            {new Date(order.created_at).toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
            <tr key={index}>
              <td>
                <img
                  src={order.productDetails.image}
                  alt="description"
                  style={{ width: "150px", height: "100px" }}
                />
              </td>
              <td>{order.productDetails.name}</td>
              <td>{order.productQuantity}</td>
              <td>{order.productDetails.price}</td>
              <td>{order.productDetails.shippingFee}</td>
              <td>
                {
                  order.productDetails.shippingFee === "무료"
                    ? order.productDetails.price * order.productQuantity
                    : order.productDetails.price * order.productQuantity + Number(order.productDetails.shippingFee)
                }
              </td>

              {/* 다른 주문 정보 필요한 경우 추가 */}
            </tr>
            </>
          ))}
        </tbody>
      </Table>
    </>
  );
};
  // return (
  //   <>
  //     <div className={styles.clientNameSection}>
  //       {users.nickName}님의 주문목록
  //     </div>
  //     <br />
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>상품 이미지</th>
  //           <th>상품 이름</th>
  //           <th>상품 금액</th>
  //           <th>배송비</th>
  //           <th>총 금액</th>
  //         </tr>
  //       </thead>
  //       <tbody>{orderList}</tbody>
  //     </Table>
  //   </>
  // );

export default MyPageOrderList;
