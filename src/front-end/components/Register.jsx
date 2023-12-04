import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "../css/Register.module.css";
import bcrypt from "bcryptjs";

const Register = () => {
  const navigate = useNavigate();

  const [Nickname, setNickname] = useState("");
  const [errorNickname, setErrorNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const [Email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [Password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [PasswordDouble, setPasswordDouble] = useState("");
  const [errorPasswordDouble, setErrorPasswordDouble] = useState("");
  const [isPasswordDoubleValid, setIsPasswordDoubleValid] = useState(false);

  const [PhoneNumber, setPhoneNumber] = useState("");
  const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  //////////////////////////회원가입 체크는 여기에////////////////////

  // 닉네임 체크
  const nicknameHandler = (e) => {
    setNickname(e.currentTarget.value);
    const nicknameRegex = /^[a-zA-Z가-힣0-9]{3,15}$/; // 닉네임 정규식

    if (nicknameRegex.test(e.currentTarget.value)) {
      setIsNicknameValid(true);
      setErrorNickname("");
    } else {
      setErrorNickname("닉네임은 3~15자로 입력해주세요.");
      setIsNicknameValid(false);
    }
  };

  // 이메일 체크
  const emailHandler = (e) => {
    setEmail(e.currentTarget.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 이메일 정규식

    if (emailRegex.test(e.currentTarget.value)) {
      setErrorEmail("");
      setIsEmailValid(true);
    } else {
      setErrorEmail("올바른 이메일을 입력해주세요.");
      setIsEmailValid(false);
    }
  };

  // 비밀번호 체크
  const passwordHandler = (e) => {
    setPassword(e.currentTarget.value);
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/; // 비밀번호 체크 정규식 (영문 숫자 포함 6자리 이상)

    if (passwordRegex.test(e.currentTarget.value)) {
      setErrorPassword("");
      setIsPasswordValid(true);
    } else {
      setErrorPassword("비밀번호는 영문 숫자 포함 6자리 이상이어야 합니다.");
      setIsPasswordValid(false);
    }
  };

  // 비밀번호 확인 체크
  const passwordDoubleHandler = (e) => {
    setPasswordDouble(e.currentTarget.value);
  };

  // 비밀번호와 비밀번호 확인이 같은지 확인
  useEffect(() => {
    if (Password === PasswordDouble) {
      setErrorPasswordDouble("");
      setIsPasswordDoubleValid(true);
    } else {
      setErrorPasswordDouble("비밀번호가 일치하지 않습니다");
      setIsPasswordDoubleValid(false);
    }
  }, [Password, PasswordDouble]);

  // 전화번호 체크
  const phoneNumberHandler = (e) => {
    const phoneRegex = /^\d{0,11}$/;

    if (phoneRegex.test(e.currentTarget.value)) {
      setPhoneNumber(e.currentTarget.value);
      setErrorPhoneNumber("");
      setIsPhoneNumberValid(true);
    } else {
      setErrorPhoneNumber("올바른 전화번호를 입력해주세요.");
      setIsPhoneNumberValid(false);
    }
  };

  // 판매자 가입 체크
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  ////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////// 전송 관련 여기에 ///////////////////////////////////////

  // 회원가입 버튼 클릭, 기입한 정보가 올바르지 않으면 전송 막고 올바르면 유저정보 전송
  const submitButton = (e) => {
    e.preventDefault();

    if (
      !isNicknameValid ||
      !isPhoneNumberValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isPasswordDoubleValid
    ) {
      alert("올바른 정보를 기입해주세요.");
      return;
    }

    // 비밀번호 암호화
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return;
      }

      const userData = {
        nickName: Nickname,
        user_id: Email,
        password: hashedPassword,
        phone: PhoneNumber,
        userType: isChecked ? "Seller" : "Buyer",
        addressList: [
          {
            addressId: "",
            addressName: "",
            address: "",
          },
        ],
        cartList: [],
      };

      const sellerData = {
        nickName: Nickname,
        user_id: Email,
        password: hashedPassword,
        phone: PhoneNumber,
        userType: isChecked ? "Seller" : "Buyer",
        productList: [],
      };

      const endpoint = isChecked
        ? "http://localhost:3300/sellers"
        : "http://localhost:3300/users";

      const postData = isChecked ? sellerData : userData;

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("회원가입 완료", data);
          navigate("/Login");
        })
        .catch((error) => {
          console.log("회원가입 실패", error);
        });
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 ">
      <div className={styles.RegisterForm}>
        <Form className="w-100">
          <h2 className={styles.RegisterFormH2}>회원가입</h2>
          <Form.Group className="inputForm mb-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type="text"
              name="Nickname"
              value={Nickname}
              onChange={nicknameHandler}
              placeholder="닉네임"
            />
            {errorNickname && <p className="text-danger">{errorNickname}</p>}
          </Form.Group>
          <Form.Group className="inputForm mb-3" controlId="formGroupEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={Email}
              onChange={emailHandler}
              placeholder="이메일"
            />
            {errorEmail && <p className="text-danger">{errorEmail}</p>}
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
            {errorPassword && <p className="text-danger">{errorPassword}</p>}
          </Form.Group>
          <Form.Group className="inputForm mb-3">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              name="PasswordDouble"
              value={PasswordDouble}
              onChange={passwordDoubleHandler}
              placeholder="비밀번호 확인"
            />
            {errorPasswordDouble && (
              <p className="text-danger">{errorPasswordDouble}</p>
            )}
          </Form.Group>
          <Form.Group className="inputForm mb-3">
            <Form.Label>휴대폰 번호</Form.Label>
            <Form.Control
              name="PhoneNumber"
              type="text"
              value={PhoneNumber}
              onChange={phoneNumberHandler}
              placeholder="휴대폰 번호 "
            />
            {errorPhoneNumber && (
              <p className="text-danger">{errorPhoneNumber}</p>
            )}
          </Form.Group>

          <div>
            <Form.Check
              type="checkbox"
              label="판매자로 활동할래요!"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="d-grid gap-2 font-weight-bold mt-3">
            <Button variant="primary" size="lg" onClick={submitButton}>
              회원가입
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
