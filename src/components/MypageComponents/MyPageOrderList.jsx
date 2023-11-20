import React, { useEffect, useState } from "react";
import { Table } from 'react-bootstrap';
import styles from "../../css/MyPageCss/MyPageOrderList.module.css";

const MyPageOrderList = () => {
    const [orders, setOrders] = useState(null); // 초기값을 빈 배열로 설정

    useEffect(() => {
        fetch("http://localhost:3300/orders")
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
            });
    }, []);

    if (orders == null) {
        return <div>Loading...</div>;
      }

    // 주문 목록을 표시하기 위해 orders 객체의 내부 데이터에 접근
    const orderList = orders.map((order, index) => (

        

        <tr key={index}>
            <td>{order.orderDate}</td>
            <td>{order.productId}</td>
            <td>{order.productQuantity}</td>
            <td>{order.shippingCost}</td>
        </tr>
    ));

    return (
        <>
            <div className={styles.clientNameSection}>{orders.userId}님의 주문목록</div>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>주문날짜</th>
                        <th>상품정보</th>
                        <th>상품금액</th>
                        <th>배송비</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList}
                </tbody>
            </Table>
        </>
    );
}

export default MyPageOrderList;
