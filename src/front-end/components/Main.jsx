import React, { useState } from "react";
import { Container, Stack } from "react-bootstrap";
import styles from "../css/main.module.css";
import MultyCarousel from "./MultyCarousel";
const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.forRecommend}>
        <MultyCarousel category="Food" />
      </div>
      <div className={styles.forSale}>할인 중인 상품</div>
    </div>
  );
};

export default Main;
