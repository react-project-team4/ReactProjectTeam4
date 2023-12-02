import React, { useState } from 'react';
import styles from "../../css/myPageCss/MyPageEditPrivacy.module.css";

const ViewPrivacy = ({ userInfo, updateName, updateUserId, updatePassword, updatePhone }) => {
  const [nameInput, setNameInput] = useState(userInfo.nickName);

  return (
    <div className={styles.container}>
      <p>이름:</p>
      <div>
        <input type="text" defaultValue={userInfo.nickName} onChange={(e) => setNameInput(e.target.value)}/>
        <button onClick={()=>updateName(nameInput)}>변경</button>
      </div>

      <p>아이디:</p>
      <div>
        <input type="text" defaultValue={userInfo.user_id} />
        <button onClick={updateUserId}>변경</button>
      </div>
      
      <p>현재 비밀번호:</p>
      <div>
        <input type="password" defaultValue="" id="currentPassword"/>
      </div>
      
      <p>새 비밀번호:</p>
      <div>
        <input type="password" defaultValue="" />
      </div>
      
      <p>비밀번호 재입력:</p>
      <div>
        <input type="password" defaultValue="" />
        <button onClick={updatePassword}>변경</button>
      </div>
      
      <p>휴대폰:</p>
      <div>
        <input type="text" defaultValue={userInfo.phone} />
        <button onClick={updatePhone}>변경</button>
      </div>
      
      <p>유저타입:</p>
      <div>
        <input type="text" defaultValue={userInfo.userType} />
      </div>
    </div>
  );
};


const MyPageEditPrivacy = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [passwordEntered, setPasswordEntered] = useState(false);

// 이름 업데이트
const updateName = (e) => {
  // 만약 userInfo가 null이거나 nickName이 존재하지 않으면 아무것도 하지 않습니다.
  if (!userInfo || !userInfo.nickName) {
    console.error("유저 정보가 없거나 유효하지 않습니다.");
    return;
  }

  // 서버로 보낼 데이터를 준비합니다.
  const updatedData = {
    ...userInfo,  // 기존 데이터를 모두 포함
    nickName: e,  // 업데이트할 닉네임만 새로 설정
  };

  // 서버에 PUT 요청을 보냅니다.
  fetch(`http://localhost:3300/users/${userInfo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      alert('이름이 변경되었습니다.')
      setUserInfo(data); 
    })
};





  // 아이디 업데이트
  const updateUserId = () => {
    console.log("아이디 업데이트")
  }

  // 비밀번호 업데이트
  const updatePassword = () => {
    console.log("비밀번호 업데이트")
  }

  // 휴대폰 업데이트
  const updatePhone = () => {
    console.log("휴대폰 업데이트")
  }

  const checkPassword = () => {
    const passwordInput = document.getElementById('passwordInput').value;

    // 사용자 정보 요청을 위한 fetch
    fetch(`http://localhost:3300/users`)
      .then(response => response.json())
      .then(data => {
        const userData = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        // 비밀번호 확인 절차
        if (userData.length === 0 || passwordInput !== userData[0].password) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }

        // setUserInfo 및 setPasswordEntered를 사용하여 state를 업데이트합니다.
        setUserInfo(userData[0]);
        setPasswordEntered(true);
      });
  };

  

  return (
    <>
      {!passwordEntered ? (
        <div className="input-group mb-3">
          <input type="password" id="passwordInput" placeholder="비밀번호를 입력해주세요" />
          <button onClick={checkPassword}>확인</button>
        </div>
      ) : (
        <ViewPrivacy 
          userInfo={userInfo}
          updateName={updateName}
          updateUserId={updateUserId}
          updatePassword={updatePassword}
          updatePhone={updatePhone}/>
      )}
    </>
  );
};

export default MyPageEditPrivacy;
