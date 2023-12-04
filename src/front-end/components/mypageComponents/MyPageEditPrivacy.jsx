import React, { useState } from 'react';
import styles from "../../css/myPageCss/MyPageEditPrivacy.module.css";

const bcrypt = require('bcryptjs');

const ViewPrivacy = ({ userInfo, updateName, updateUserId, updatePassword, updatePhone }) => {
  const [nameInput, setNameInput] = useState(userInfo.nickName);
  const [idInput, setIdInput] = useState(userInfo.nickName);
  const [phoneInput, setPhoneInput] = useState(userInfo.phone);
  
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [repeatPasswordInput, setRepeatPasswordInput] = useState("");
  

  return (
    <div className={styles.container}>
      <p>이름:</p>
      <div>
        <input type="text" defaultValue={userInfo.nickName} onChange={(e) => setNameInput(e.target.value)}/>
        <button onClick={()=>updateName(nameInput)}>변경</button>
      </div>

      <p>아이디:</p>
      <div>
        <input type="email" defaultValue={userInfo.user_id} onChange={(e) => setIdInput(e.target.value)}/>
        <button onClick={()=>updateUserId(idInput)}>변경</button>
      </div>
      
      <p>현재 비밀번호:</p>
      <div>
        <input type="password" onChange={(e) => setCurrentPasswordInput(e.target.value)}/>
      </div>
      
      <p>새 비밀번호:</p>
      <div>
        <input type="password" onChange={(e) => setNewPasswordInput(e.target.value)}/>
      </div>
      
      <p>비밀번호 재입력:</p>
      <div>
        <input type="password" onChange={(e) => setRepeatPasswordInput(e.target.value)}/>
        <button onClick={
          () => 
          updatePassword(
            currentPasswordInput,
            newPasswordInput,
            repeatPasswordInput
          )
          }
        >변경</button>
      </div>
      
      <p>휴대폰:</p>
      <div>
      <input type="text" defaultValue={userInfo.phone} onChange={(e) => setPhoneInput(e.target.value)}/>
        <button onClick={()=>updatePhone(phoneInput)}>변경</button>
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
    // 업데이트 데이터  
    const updatedData = {
      nickName: e,
    };
    fetch(`http://localhost:3300/users/${userInfo.id}`, {
      method: "PATCH",
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
  const updateUserId = (e) => {
    // 업데이트 데이터  
    const updatedData = {
      user_id: e,
    };
    fetch(`http://localhost:3300/users/${userInfo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      alert('아이디가 변경되었습니다.')
      setUserInfo(data); 
    })
  }


  // 비밀번호 업데이트
  const updatePassword = (currentPassword, newPassword, repeatPassword) => {
    // 현재 비밀번호와 새 비밀번호, 새 비밀번호 확인 비교
    if (!currentPassword || !newPassword || !repeatPassword) {
      console.log(currentPassword, newPassword, repeatPassword)
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }

    if (newPassword !== repeatPassword) {
      alert("새 비밀번호와 확인용 비밀번호가 일치하지 않습니다.");
      return;
    }
  
    fetch(`http://localhost:3300/users`)
      .then(response => response.json())
      .then(data => {
        const userData = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        // 입력한 현재 비밀번호가 실제로 사용자의 현재 비밀번호와 일치하는지 확인
        if (userData.length === 0 || !bcrypt.compareSync(currentPassword, userData[0].password)) {
          alert("현재 비밀번호가 일치하지 않습니다.");
          return;
        }

        // 새 비밀번호를 해싱
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        // 업데이트 데이터
        const updatedData = {
          password: hashedNewPassword
        };

        fetch(`http://localhost:3300/users/${userInfo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })
          .then(response => response.json())
          .then(data => {
            alert('비밀번호가 변경되었습니다.');
            setUserInfo(data);
          })
          .catch(error => console.error("비밀번호 업데이트 오류:", error));
      });
  };


  // 휴대폰 업데이트
  const updatePhone = (e) => {
    // 업데이트 데이터  
    const updatedData = {
      phone: e,
    };
    fetch(`http://localhost:3300/users/${userInfo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      alert('휴대폰 번호가 변경되었습니다.')
      setUserInfo(data); 
    })
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
        if (userData.length === 0) {
          alert("사용자 정보를 찾을 수 없습니다.");
          return;
        }
  
        const hashedPasswordFromDB = userData[0].password;
  
        // 입력한 비밀번호를 bcrypt로 해싱
        bcrypt.compare(passwordInput, hashedPasswordFromDB, (err, result) => {
          if (err || !result) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
          }
  
          // 비밀번호가 일치하면 setUserInfo를 사용하여 state를 업데이트합니다.
          setUserInfo(userData[0]);
          setPasswordEntered(true);
        });
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
