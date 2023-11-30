import React, { useEffect, useState } from "react";
import styles from "../../css/myPageCss/MyPageAddressChange.module.css";
import CreateAddressModal from "./CreateAddressModal";


const MyPageAddressChange = () => {
  const [users, setUsers] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((data) => {
        // localStorage에 있는 userId랑 같은 사람 찾아서 그 사람의 배송지 목록을
        // users에 집어넣기
        const $user = data.filter(
          (e) => e.user_id === localStorage.getItem("Email")
        );
        // console.log($user[0].addressList) 이게 주소들가 담긴 배열임

        if ($user) {
          setUsers($user[0]);
        }
      });
  }, []);

  const changeDefaultAddress = async () => {
    if(!selectedAddressId) {
      alert('배송지를 클릭해주세요');
      return;
    }

    const response = await fetch(`http://localhost:3300/users/${users.id}`);
    const user = await response.json();

    const updatedAddressList = user.addressList.map(address => {
      if (address.addressId === selectedAddressId) {
        address.addressType = true;
      } else {
        address.addressType = false;
      }
      return address;
    });

    const updatedUser = { ...user, addressList: updatedAddressList };

    await fetch(`http://localhost:3300/users/${users.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    });

    setUsers(updatedUser);
    setSelectedAddressId(null);
  };

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
  const addressMain = users.addressList.map((address) => {
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
  const addressDiv = users.addressList.map((address) => {
    if (address.addressType === false) {
      return (
        <div key={address.addressId} className={styles.defaultAddressBox}>
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="radio" 
              name="flexRadioDefault" 
              id="flexRadioDefault1" 
              style={{float:"right"}}
              onChange={() => setSelectedAddressId(address.addressId)}
            />
          </div>

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
      <input type="button" value="기본 배송지로 변경" onClick={changeDefaultAddress} />
      <br />
      <br />  
      {addressMain}
      {addressDiv}
      <CreateAddressModal />
    </div>
  );
};

export default MyPageAddressChange;
