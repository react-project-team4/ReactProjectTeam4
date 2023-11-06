import React, { useState } from 'react';
import { Container, Stack } from 'react-bootstrap';
import '../css/main.css';
const Main = () => {
  return (
    <div id="main">
      <div id='forRecommend'>추천 상품</div>
      <div id='forSale'>할인 중인 상품</div>
    </div>
  )
}

export default Main;

