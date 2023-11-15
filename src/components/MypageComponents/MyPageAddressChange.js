import React, { useEffect, useState } from "react";
import styles from "../../css/MyPageCss/MyPageAddressChange.module.css";
import CreateAddressModal from "./CreateAddressModal";

localStorage.setItem("userId", "1234");

const MyPageAddressChange = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        const $user = data.find((e) => e.userId === localStorage.getItem("userId"));
        if ($user) {
          setUsers($user.addressList);
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

  const addressDiv = users.map((address) => {
    if (address.addressType === false) {
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

  return (
    <div id="box">
      <input type="button" value="기본 배송지로 변경"/>
      <br />
      <br />
      {addressMain}
      {addressDiv}
      <CreateAddressModal />
    </div>
  );
};

export default MyPageAddressChange;
