import React, { useState } from 'react';
import styles from '../css/productList.module.css';

const ProductRegister = (props) => {
  const [products, setProducts] = useState({
    name: '',
    product: '',
    content: '',
    image: '',
    category: '',
  });

  // textarea 자동 늘리기
  const autoResize = (textarea) => {
    textarea.style.height = '1px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  const readURL = (input) => {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('preview').src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      document.getElementById('preview').src = "";
    }
  }

  return (
    <div>
      <h4>상품 등록</h4>
      <form onSubmit={(e) => {
        // db.json에 등록
      }}>
        <table>
          <tr className='mb-3'>
            <td>카테고리</td>
            {/* 카테고리 선택 */}
            <td>
              <select className="selectpicker" aria-label="Default select example">
                <option selected>카테고리 선택</option>
                <option value="1">식품</option>
                <option value="2">지역</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>상품명</td>
            <td>
              <input type="text" name='name' placeholder='상품 이름' required />
            </td>
          </tr>
          <tr>
            <td>상품가격</td>
            <td>
              <input type="text" name='price' placeholder='가격' required />
            </td>

          </tr>
          <tr>
            <td>상품설명</td>
            <td>
              <textarea className='resize-none overflow-hidden' name="content" onKeyUp={(e) => autoResize(e.target)} onKeyDown={(e) => autoResize(e.target)} placeholder='상품 설명' required></textarea>
            </td>
          </tr>
          <tr>
            <td>이미지선택</td>
            <td>
              <div className="input-group mb-3 w-10">
                <label className="input-group-text" for="inputGroupFile01">Upload</label>
                <input type="file" className="form-control" id="inputGroupFile01" onChange={(e) => readURL(e.target)} accept='image/*' />
              </div>
              <div>
                <img id="preview" />
              </div>
            </td>
          </tr>
        </table>
        <input type="submit" value="완료" />
      </form>

    </div>
  )
}

export default ProductRegister;