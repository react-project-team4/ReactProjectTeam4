import Nav from 'react-bootstrap/Nav';
import styles from '../../css/MyPageCss/MyPage.module.css'
import MyPageOrderList from './MyPageOrderList';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MyPageEditPrivacy from './MyPageEditPrivacy';
import MyPageAddressChange from './MyPageAddressChange';




const MyPage = () => {

    const [selectedTab, setSelectedTab] = useState();

    const handleNavItemClick = (selectedTab) => {
        setSelectedTab(selectedTab);
      };
    
      const renderSelectedTabContent = () => {
        if (selectedTab === 'orderList') {
          return <MyPageOrderList/>
        } else if (selectedTab === 'editPrivacy') {
          return <MyPageEditPrivacy/>
        } else if (selectedTab === 'addressChange') {
          return <MyPageAddressChange/>
        }
      };


    return(
      <div className='container mt-5'>
        <Container>
          <Row>
            <Col xs={3}>
              <div style={{width:'30%', height:'100%'}}>
                <Nav variant="pills" className="d-flex flex-column" style={{height:"120px", width:"150px"}} activeKey={selectedTab} onSelect={handleNavItemClick}>
                    <Nav.Item className={styles.customNavItem}>
                        <Nav.Link eventKey="orderList">주문 목록</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className={styles.customNavItem}>
                        <Nav.Link eventKey="editPrivacy">개인정보수정</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className={styles.customNavItem}>
                        <Nav.Link eventKey="addressChange">배송지 관리</Nav.Link>
                    </Nav.Item>
                </Nav>
              </div>
            </Col>
            <Col xs={9}>
              <div>{renderSelectedTabContent()}</div>
            </Col>
            </Row>
        </Container>
      </div>
    )
}

export default MyPage