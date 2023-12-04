import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../css/mainCss/multyCarousel.module.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
// import required modules
import { Pagination } from "swiper/modules";

const MultyCarousel = (props) => {
  const { data, category } = props;

  return (
    <div className="p-4">
      {data.length === 0 ? (
        <>
          <h3>{category}</h3>
          <h1 className="d-flex justify-content-center align-items-center p-5">
            현재 판매중인 상품이 존재하지 않습니다.
          </h1>
        </>
      ) : (
        <>
          <h3>{category}</h3>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className={styles.swiper}
          >
            {data.map((item, index) => (
              <SwiperSlide key={index} className={styles.swiperSlide}>
                <div>
                  <Link
                    key={item.id}
                    to={`/showProduct`}
                    state={{ item }}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="card mx-2 my-2 " style={{ width: "18rem" }}>
                      <img
                        className="card-img-top"
                        style={{ height: "200px" }}
                        src={item.image}
                        alt="Card image cap"
                      />
                      <div
                        className="card-body text-white bg-primary rounded-lg"
                        style={{ opacity: "0.7" }}
                      >
                        <p className="card-text text-decoration-none">
                          {item.name}
                        </p>
                        <h6 className="text-black">가격: {item.price}</h6>
                        {category === "Food" && (
                          <h6 className="text-black">
                            배송비: {item.shippingFee}
                          </h6>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default MultyCarousel;
