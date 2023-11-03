import Table from 'react-bootstrap/Table';
import styles from "../../css/MyPageCss/MyPageOrderList.module.css";

const MyPageOrderList = () => {
    return(
        <>
            <div className={styles.clientNameSection}>김건우님의 주문목록</div>
            <br/>
            <Table striped bordered hover>
                <tr>
                    <th>주문날짜</th>
                    <th>상품정보</th>
                    <th>상품금액</th>
                    <th>배송비</th>
                </tr>
            </Table>
        </>
    )
}

export default MyPageOrderList;