import React from "react";
import styles from "../css/footer.module.css";
import projectMark from "../imgs/fukuokaMark.png";
const Footer = () => {
  return (
    <div className={styles.co}>
      <div className={styles.fo}>
        <img src={projectMark} width="50" height="30" />
        <h2 className="text-center fs-6 mb-0 pt-1">producted by Japang</h2>
      </div>
    </div>
  );
};

export default Footer;
