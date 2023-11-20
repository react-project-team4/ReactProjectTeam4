import React from "react";

const MultyCarousel = (props) => {
  const { category } = props;
  return (
    <div>
      <h4>{category}</h4>
      {/* 3장 or 4장의 상품 사진 캐러셀 구현*/}
    </div>
  );
};

export default MultyCarousel;
