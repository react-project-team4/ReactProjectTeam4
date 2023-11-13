import React, { useState } from "react";
import { Container, Stack } from "react-bootstrap";
import styles from "../css/main.module.css";
const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.forRecommend}>추천 상품</div>
      <div className={styles.forSale}>할인 중인 상품</div>
    </div>
  );
};

export default Main;
