import { Table } from 'react-bootstrap';
import styles from "../../css/MyPageCss/MyPageOrderList.module.css";

const MyPageOrderList = () => {
    return (
        <>
            <div className={styles.clientNameSection}>님의 주문목록</div>
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
                    
                </tbody>
            </Table>
        </>
    );
}

export default MyPageOrderList;
