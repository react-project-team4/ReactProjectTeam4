import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../css/productCss/updateProduct.module.css";
import InputImage from "./InputImage";
import default_Img from "../../imgs/xImage.png";
import {
  uploadImageFile,
  deleteImageFromS3,
} from "../../../back-end/services/aws";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state;
  const [image, setImage] = useState(null);
  // 등록할 상품의 정보
  const [products, setProducts] = useState({
    name: productData.name,
    price: productData.price,
    image: productData.image,
    content: productData.content,
    category: productData.category,
    // 배송비 + 판매자 Id 추가
    shippingFee: productData.shippingFee,
    seller_id: productData.seller_id,
  });
  // select tag 유효성 검사
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [
    showShippingFeeValidationMessage,
    setShowShippingFeeValidationMessage,
  ] = useState(false);

  useEffect(() => {
    autoResize(document.querySelector("textarea"));
  }, []);

  const handleSelectChange = (e) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      category: e.target.value,
    }));
  };

  const handleShippingFeeChange = (e) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      shippingFee: e.target.value,
    }));
  };

  // textarea 자동 늘리기
  const autoResize = (textarea) => {
    textarea.style.height = "1px";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // default Image
  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  // image input 값을 초기화
  const inputImageRef = useRef(productData.image);
  const onClearInput = () => {
    inputImageRef.current.value = "";
  };

  // 완료 버튼
  const handleCompleteButtonClick = async (e) => {
    e.preventDefault();
    if (products.category === "0") {
      setShowValidationMessage(true);
      return;
    } else {
      setShowValidationMessage(false);
    }

    if (products.shippingFee === "0") {
      setShowShippingFeeValidationMessage(true);
      return;
    } else {
      setShowShippingFeeValidationMessage(false);
    }
    console.log(products);
    // image 업로드
    try {
      let imageUrl = null;

      if (image === null) {
        imageUrl = productData.image;
      } else {
        imageUrl = await uploadImageFile(image, setImage);
        await deleteImageFromS3(productData.image);
      }

      console.log(imageUrl);
      // 이미지 업로드에 성공하면 products 상태 업데이트
      setProducts((prevProducts) => ({
        ...prevProducts,
        image: imageUrl, // 이미지의 URL을 가져와서 설정
      }));
      console.log(imageUrl);

      // 업데이트된 products를 전송
      const response = await fetch(
        `http://localhost:3300/products/${productData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...products,
            image: imageUrl,
          }),
        }
      );

      if (response.ok) {
        alert("전송 성공");
      } else {
        alert("전송 실패");
      }
    } catch (e) {
      alert("전송 실패");
    } finally {
      onClearInput();
    }

    navigate(`/ProductList?category=${products.category}`);
  };

  // input tag set data
  const changeData = (e) => {
    const { name, value } = e.target;
    setProducts((prevProducts) => ({
      ...prevProducts,
      [name]: value,
    }));
  };

  return (
    <Container className={styles.background}>
      <h2 className="p-3 mb-4">상품 등록</h2>
      <form onSubmit={handleCompleteButtonClick}>
        <table>
          <tbody>
            <tr>
              <td>카테고리</td>
              {/* 카테고리 선택 */}
              <td className="d-flex pl-12 align-items-center p-2">
                <select
                  className="selectpicker rounded-pill border-0"
                  aria-label="Default select example"
                  defaultValue={productData.category}
                  onChange={handleSelectChange}
                >
                  <option value="0">카테고리 선택</option>
                  <option value="Food">식품</option>
                  <option value="Travel">지역</option>
                </select>
                {showValidationMessage && (
                  <p
                    style={{
                      color: "red",
                      marginTop: "1rem",
                      marginLeft: "20px",
                    }}
                  >
                    카테고리를 선택하세요.
                  </p>
                )}
              </td>
            </tr>
            <tr className="mt-10">
              <td>상품명</td>
              <td className="p-2">
                <input
                  className="rounded-pill border-0"
                  type="text"
                  name="name"
                  defaultValue={productData.name}
                  onBlur={changeData}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>상품가격</td>
              <td className="p-2">
                <input
                  className="rounded-pill border-0"
                  type="text"
                  name="price"
                  defaultValue={productData.price}
                  onBlur={changeData}
                  pattern="[0-9]+"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>상품설명</td>
              <td className="p-2">
                <textarea
                  className="overflow-hidden border-0 rounded"
                  style={{ resize: "none" }}
                  name="content"
                  onBlur={changeData}
                  onKeyUp={(e) => autoResize(e.target)}
                  onKeyDown={(e) => autoResize(e.target)}
                  defaultValue={productData.content}
                  rows="1"
                  required
                ></textarea>
              </td>
            </tr>
            <tr className="align-items-center">
              <td>이미지선택</td>
              <td className="p-2">
                <div className="input-group w-10">
                  <label className="input-group-text">Upload</label>
                  <InputImage setImage={setImage} inputRef={inputImageRef} />
                </div>
              </td>
            </tr>
            <tr className="align-items-center">
              <td>미리보기</td>
              <td className="p-5">
                <img
                  src="..."
                  // src={productData.image}
                  onError={onErrorImg}
                  className="rounded"
                  alt=""
                  style={{
                    width: "auto",
                    height: "200px",
                    objectFit: "cover",
                    overflow: "hidden",
                  }}
                  id="preview"
                />
              </td>
            </tr>
            <tr>
              <td>배송비</td>
              {/* 배송비 선택 */}
              <td className="d-flex align-items-center p-2">
                <select
                  className="selectpicker"
                  aria-label="Default select example"
                  defaultValue={productData.shippingFee}
                  onChange={handleShippingFeeChange}
                >
                  <option value="0">배송비 선택</option>
                  <option value="1000">1000원</option>
                  <option value="2000">2000원</option>
                  <option value="3000">3000원</option>
                  <option value="4000">4000원</option>
                  <option value="5000">5000원</option>
                  <option value="무료">무료</option>
                </select>
                {showShippingFeeValidationMessage && (
                  <p
                    style={{
                      color: "red",
                      marginTop: "1rem",
                      marginLeft: "20px",
                    }}
                  >
                    배송요금을 선택하세요.
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-end">
          <Link to="/ProductList?category=Food" className="px-2">
            <button
              type="button"
              className="btn btn-primary btn-lg rounded border-0 text-white"
            >
              취소
            </button>
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded border-0 text-white"
          >
            완료
          </button>
        </div>
      </form>
    </Container>
  );
}
