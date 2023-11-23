import React, { useState, useEffect } from "react";
import styles from "../css/main.module.css";
import MultyCarousel from "../MultyCarousel";
const Main = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [travelItems, setTravelItems] = useState([]);
  useEffect(() => {
    getItems("Food");
    getItems("Travel");
    console.log(1);
  }, []);

  const getItems = async (category) => {
    try {
      const response = await fetch("http://localhost:3300/products", {
        method: "GET",
      });
      const data = await response.json();
      const filteredItems = data.filter((item) => item.category === category);

      if (category === "Food") {
        setFoodItems(filteredItems);
      } else {
        setTravelItems(filteredItems);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className={styles.main}>
      <div
        className={styles.forRecommend}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <MultyCarousel data={foodItems} category="Food" />
      </div>
      <div className={styles.forSale}>
        <MultyCarousel data={travelItems} category="Travel" />
      </div>
    </div>
  );
};

export default Main;
