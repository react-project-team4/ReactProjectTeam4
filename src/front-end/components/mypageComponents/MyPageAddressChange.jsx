import React, { useEffect, useState } from "react";
import styles from "../../css/myPageCss/MyPageAddressChange.module.css";
import CreateAddressModal from "./CreateAddressModal";

const MyPageAddressChange = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        // localStorage에 있는 userId랑 같은 사람 찾아서 그 사람의 배송지 목록을
        // users에 집어넣기
        const $user = data.filter(
          (e) => e.id === localStorage.getItem("userId")
        );
        // console.log($user[0].addressList) 이게 주소들가 담긴 배열임
        if ($user) {
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

  // 기본 배송지로 지정한 주소
  const addressMain = users.map((address) => {
    if (address.addressType === true) {
      return (
        <div key={address.addressId} className={styles.mainAddressBox}>
          <div className={styles.addressBoxText}>
            <br />
            <h2>{address.addressName}</h2>
          </div>
          <br />
          <div className={styles.addressBoxText}>{address.address}</div>
        </div>
      );
    }
  });

  // 기본 배송지가 아닌 나머지 주소들
  const addressDiv = users.map((address) => {
    if (address.addressType === false) {
      return (
        <div key={address.addressId} className={styles.defaultAddressBox}>
          <div className={styles.addressBoxText}>
            <br />
            <h2>{address.addressName}</h2>
          </div>
          <br />
          <div className={styles.addressBoxText}>{address.address}</div>
        </div>
      );
    }
  });

  return (
    <div id="box">
      <input type="button" value="기본 배송지로 변경" />
      <br />
      <br />
      {addressMain}
      {addressDiv}
      <CreateAddressModal />
    </div>
  );
};

export default MyPageAddressChange;
