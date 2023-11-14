import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import default_Img from "../imgs/xImage.png";
import { useNavigate } from "react-router-dom";
import InputImage from "./InputImage";
import { uploadImageFile } from "../../back-end/services/aws";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  // 등록할 상품의 정보
  const [products, setProducts] = useState({
    name: "",
    price: "",
    image: "",
    content: "",
    category: "0",
    // 배송비 + 판매자 Id 추가
    // shippingFee: '',
    // sellerId : '',
  });
  // select tag 유효성 검사
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const handleSelectChange = (e) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      category: e.target.value,
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
  const inputImageRef = useRef(null);
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
    console.log(products);
    // image 업로드
    try {
      setLoading(true);
      const imageUrl = await uploadImageFile(image, setImage);

      console.log(imageUrl);
      // 이미지 업로드에 성공하면 products 상태 업데이트
      setProducts((prevProducts) => ({
        ...prevProducts,
        image: imageUrl, // 이미지의 URL을 가져와서 설정
      }));
      console.log(imageUrl);

      // 업데이트된 products를 전송
      const response = await fetch("http://localhost:3300/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...products,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        alert("전송 성공");
      } else {
        alert("전송 실패");
      }
    } catch (e) {
      alert("전송 실패");
    } finally {
      setLoading(false);
      onClearInput();
    }

    navigate("/ProductList?category=Food");
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
    <Container className="border-dark border-start border-end p-4">
      <h2 className="pb-2">상품 등록</h2>
      <form onSubmit={handleCompleteButtonClick}>
        <table>
          <tbody>
            <tr className="mb-3">
              <td>카테고리</td>
              {/* 카테고리 선택 */}
              <td className="d-flex align-items-center">
                <select
                  className="selectpicker"
                  aria-label="Default select example"
                  defaultValue="0"
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
              <td>
                <input
                  type="text"
                  name="name"
                  placeholder="상품 이름"
                  onBlur={changeData}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>상품가격</td>
              <td>
                <input
                  type="text"
                  name="price"
                  placeholder="가격"
                  onBlur={changeData}
                  pattern="[0-9]+"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>상품설명</td>
              <td>
                <textarea
                  className="resize-none overflow-hidden"
                  name="content"
                  onBlur={changeData}
                  onKeyUp={(e) => autoResize(e.target)}
                  onKeyDown={(e) => autoResize(e.target)}
                  placeholder="상품 설명"
                  rows="1"
                  required
                ></textarea>
              </td>
            </tr>
            <tr className="align-items-center">
              <td>이미지선택</td>
              <td>
                <div className="input-group mb-3 w-10">
                  <label className="input-group-text">Upload</label>
                  <InputImage setImage={setImage} inputRef={inputImageRef} />
                </div>
              </td>
            </tr>
            <tr className="align-items-center">
              <td>미리보기</td>
              <td>
                <img
                  src="..."
                  onError={onErrorImg}
                  className="border border-dark rounded"
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
          </tbody>
        </table>
        <Link to="/ProductList?category=Food">
          <input type="submit" value="취소" />
        </Link>
        <input type="submit" value="완료" />
      </form>
    </Container>
  );
};

export default CreateProduct;
