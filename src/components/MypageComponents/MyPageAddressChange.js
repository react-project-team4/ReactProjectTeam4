import React, { useEffect, useState } from "react";
import styles from "../../css/MyPageCss/MyPageAddressChange.module.css";
import CreateAddressModal from "./CreateAddressModal";

// 마이페이지 Seller, User
// localStorage에서 userId를 가져와 일치하는 user를 찾아 addressList 뽑아내기\
// userId 일단 직접 쩍어두기
localStorage.setItem("userId","1234")

const MyPageAddressChange = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    // localStorage에서 가져온 userId를 숫자로 변환
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        // data 배열을 돌면서 각 배열안 의 객체에서 userID가 같은 객체를 가져오기
        data.map((e) => console.log(e.userId));
        const $user = data.filter((e) => e.userId === localStorage.getItem("userId"));
        if ($user.length > 0) {
          setUsers($user[0].addressList);
        }
      });
  }, []);

  if (users === null) {
    return <div>Loading...</div>;
  }

  if (!users || users.length === 0) {
    return (
      <>
        <div id="box" className={styles.addressBox}>
          <div>기본 배송지가 없습니다</div>
        </div>
        <CreateAddressModal />
      </>
    );
  }

  const addressDiv = users.map((address, index) => (
    <div key={index} className={styles.defaultAddressBox}>
      <div className={styles.addressBoxText}>
        <h2>{address.addressName}</h2>
      </div>
      <br />
      <div className={styles.addressBoxText}>{address.address}</div>
    </div>
  ));

  return (
    <div id="box">
      {addressDiv}
      <CreateAddressModal />
    </div>
  );
};

export default MyPageAddressChange;
