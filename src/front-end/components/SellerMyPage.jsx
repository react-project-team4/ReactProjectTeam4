import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col } from 'react-bootstrap';
import SellerMyPageEditPrivacy from './SellerMyPageEditPrivacy';




const SellerMyPage = () => {

    const initialActiveKey = "editPrivacy";

    return(
      <div className='container mt-5'>
        <Container>
          <Row>
            <Col xs={3}>
              <div style={{width:'30%', height:'100%'}}>
                <Nav
                    variant="pills"
                    className="d-flex flex-column"
                    style={{ height: "120px", width: "150px" }}
                    activeKey={initialActiveKey}
                >
                <Nav.Link eventKey="editPrivacy">개인정보수정</Nav.Link>
                </Nav>
              </div>
            </Col>
            <Col xs={9}>
              <SellerMyPageEditPrivacy/>
            </Col>
            </Row>
        </Container>
      </div>
    )
}

export default SellerMyPage;