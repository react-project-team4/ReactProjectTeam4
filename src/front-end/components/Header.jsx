import React, { useState } from "react";
import { Row, Col, Navbar, Container, Nav } from "react-bootstrap";
import styles from "../css/header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import projectMark from "../imgs/fukuokaMark.png";
import {
  faUtensils,
  faPlane,
  faAddressCard,
  faSignInAlt,
  faUserPlus,
  faUserCircle,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";

const Header = (props) => {
  const { user, setUser } = props;

  return (
    <Container>
      <Row className={styles.row}>
        <Col>
          <Navbar className="h-8" data-bs-theme="light">
            <Container>
              <Navbar.Brand className="navbar-brand" as={Link} to="/">
                <img
                  alt="main"
                  src={projectMark}
                  width="50"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
                Japang
              </Navbar.Brand>

              <Nav
                id="nav"
                className="fs-4 justify-content-between"
                style={{ width: "600px" }}
              >
                <Nav.Item>
                  <Nav.Link
                    className={styles.link}
                    as={Link}
                    to="/productList?category=Food"
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "6px" }}
                      icon={faUtensils}
                    />
                    식품
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className={styles.link}
                    as={Link}
                    to="/productList?category=Travel"
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "6px" }}
                      icon={faPlane}
                    />
                    현지학기제
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className={styles.link} as={Link} to="/">
                    <FontAwesomeIcon
                      style={{ marginRight: "6px" }}
                      icon={faAddressCard}
                    />
                    조원소개
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Nav className="d-flex ">
                {user === "Guest" ? (
                  // 게스트
                  <>
                    <Nav.Link className={styles.link} as={Link} to="/Login">
                      <FontAwesomeIcon
                        style={{ marginRight: "6px" }}
                        icon={faSignInAlt}
                      />
                      로그인
                    </Nav.Link>
                    <Nav.Link className={styles.link} as={Link} to="/Register">
                      <FontAwesomeIcon
                        style={{ marginRight: "6px" }}
                        icon={faUserPlus}
                      />
                      회원가입
                    </Nav.Link>
                  </>
                ) : user === "Buyer" ? (
                  // 구매자
                  <>
                    <Nav.Link className={styles.link} as={Link} to="/MyPage">
                      <FontAwesomeIcon
                        style={{ marginRight: "6px" }}
                        icon={faUserCircle}
                      />
                      프로필
                    </Nav.Link>
                    <Nav.Link className={styles.link} as={Link} to="/MyCart">
                      <FontAwesomeIcon
                        style={{ marginRight: "6px" }}
                        icon={faShoppingBasket}
                      />
                      장바구니
                    </Nav.Link>
                  </>
                ) : user === "Seller" ? (
                  // 판매자
                  <></>
                ) : (
                  // 어드민
                  <></>
                )}
              </Nav>
            </Container>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
