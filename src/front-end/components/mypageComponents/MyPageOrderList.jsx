import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from "../../css/myPageCss/MyPageOrderList.module.css";

const MyPageOrderList = () => {
  const [users, setUsers] = useState(null); 
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        const $user = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        if ($user.length > 0) {
          setUsers($user[0]);
          console.log(users)
        }
      });

    fetch("http://localhost:3300/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  if (users === null || products === null || !users.cartList) {
    return <div>Loading...</div>;
  }

  const orderList = users.cartList.map((cartItem, index) => {
    const product = products.find((product) => product.id === cartItem);

    let sumPrice =
    product.shippingFee === "무료"
      ? Number(product.price)
      : Number(product.price) + Number(product.shippingFee);

    return (
      <tr key={index}>
        <td><img src={product.image} alt="description" style={{width:"150px", height:"100px"}}/></td>
        <td>{product.name}</td>
        <td>{product.price}</td>
        <td>{product.shippingFee}</td>
        <td>{sumPrice}</td>
      </tr>
    );
  });

  return (
    <>
      <div className={styles.clientNameSection}>
        {users.nickName}님의 주문목록
      </div>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>상품 이미지</th>
            <th>상품 이름</th>
            <th>상품 금액</th>
            <th>배송비</th>
            <th>총 금액</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </Table>
    </>
  );
};

export default MyPageOrderList;
