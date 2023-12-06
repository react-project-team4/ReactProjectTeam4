import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "../css/Register.module.css";
import bcrypt from "bcryptjs";
import mark from "../imgs/fukuokaMark.png";

const Login = (props) => {
  const setUser = props.setUser;
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
    const usersResponse = await fetch(`http://localhost:3300/users`);
    const sellersResponse = await fetch(`http://localhost:3300/sellers`);
    const adminResponse = await fetch(`http://localhost:3300/admin`);

    const usersData = await usersResponse.json();
    const sellersData = await sellersResponse.json();
    const adminData = await adminResponse.json();

    const combinedData = {
      users: [...usersData, ...sellersData, ...adminData],
    };
    return combinedData;
  };
  // 받아온 유저정보로 로그인//
  const handleLogin = async () => {
    try {
      const combinedData = await getUserData();

      if (combinedData && combinedData.users.length > 0) {
        const loggedInUser = combinedData.users.find(
          (user) => user.user_id === Email
        );

        if (loggedInUser) {
          const passwordMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(Password, loggedInUser.password, (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result);
            });
          });

          if (passwordMatch) {
            // 로그인 성공
            // 로컬 스토리지에 유저 정보 저장
            localStorage.setItem("Email", loggedInUser.user_id);
            localStorage.setItem("Nickname", loggedInUser.nickName);
            localStorage.setItem("UserType", loggedInUser.userType);
            setUser(loggedInUser.userType);
            navigate("/");
          } else {
            // 비밀번호 불일치
            alert("이메일 혹은 비밀번호를 다시 확인해주세요.");
          }
        } else {
          // 입력된 이메일에 해당하는 사용자가 없음
          alert("이메일 혹은 비밀번호를 다시 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("로그인 중 에러", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100">
      <div className={styles.RegisterForm}>
        <Form className="w-100">
          <div className="d-flex justify-content-center mb-2 ">
            <img
              src={mark}
              alt="logo"
              style={{ width: "100px", height: "auto" }}
              className="img-fluid "
            />
            <h2 className="mt-3">Japang</h2>
          </div>

          <h2 className={styles.RegisterFormH2}>로그인</h2>

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
