import React, { useEffect, useState } from "react";
import styles from "../../css/MyPageCss/MyPageAddressChange.module.css";
import CreateAddressModal from "./CreateAddressModal";

const MyPageAddressChange = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3100/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  if (users === null) {
    return <div>Loading...</div>;
  }

  if (!users.addressList || users.addressList.length === 0) {
    return (
        <>
            <div id="box" className={styles.addressBox}>
                <div>기본 배송지가 없습니다</div>
            </div>
            <CreateAddressModal/>
        </>
    );
  }

  const addressDiv = users.addressList.map((address, index) => (
    <div key={index} className={styles.defaultAddressBox}>
      <div className={styles.addressBoxText}><h2>{address.addressName}</h2></div> 
      <br/>
      <div className={styles.addressBoxText}>{address.address}</div>
    </div>
  ));

  return (
    <div id="box">  
      {addressDiv}
      <CreateAddressModal/>
    </div>
    
  );
};

export default MyPageAddressChange;
