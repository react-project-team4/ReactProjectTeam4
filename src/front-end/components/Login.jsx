import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "../css/Register.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const emailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  //db에서 유저정보 받아오기//
  const getUserData = async () => {
    const response = await fetch(`http://localhost:3300/userData`);
    const userData = await response.json();
    return userData;
  };

  // 받아온 유저정보로 로그인//
  const handleLogin = async () => {
    try {
      const userData = await getUserData(Email, Password);

      if (userData && userData.length > 0) {
        const isLoginSuccessful = userData.some(
          (userData) =>
            userData.email === Email && userData.password === Password
        );

        if (isLoginSuccessful) {
          const loggedInUser = userData.find(
            (user) => user.email === Email && user.password === Password
          );

          // 로컬 스토리지에 유저 정보 저장
          localStorage.setItem("loggedInUserEmail", loggedInUser.email);
          localStorage.setItem("loggedInUserNickname", loggedInUser.nickname);
          localStorage.setItem("loggedInUserType", loggedInUser.userType);
          navigate("/");
        } else {
          alert("이메일 혹은 비밀번호를 다시 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("로그인 중 에러", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 bg-white">
      <div className={styles.RegisterForm}>
        <Form className="w-100">
          <h2 className={styles.RegisterFormH2}>로그인</h2>
          <h2 className={styles.RegisterFormH2}>로고?</h2>
          <Form.Group className="inputForm mb-3" controlId="formGroupEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={Email}
              onChange={emailHandler}
              placeholder="이메일"
            />
          </Form.Group>
          <Form.Group className="inputForm mb-3" controlId="formGroupPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={Password}
              onChange={passwordHandler}
              placeholder="비밀번호"
            />
          </Form.Group>
          <div className="d-grid gap-2 font-weight-bold">
            <Button variant="primary" size="lg" onClick={handleLogin}>
              로그인
            </Button>
          </div>
          <div className="mt-3">
            <a href="/Register">계정이 없으신가요?</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
