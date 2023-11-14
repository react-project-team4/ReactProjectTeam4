import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

const CreateProduct = () => {
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
    <Container className='border-dark border-start border-end p-4'>
      <h2 className='pb-2'>상품 등록</h2>
      <form onSubmit={(e) => {
        // db.json에 등록
      }}>
        <table>
          <tbody>
            <tr className='mb-3'>
              <td>카테고리</td>
              {/* 카테고리 선택 */}
              <td>
                <select className="selectpicker" aria-label="Default select example" defaultValue="0">
                  <option value="0">카테고리 선택</option>
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
            <tr className='align-items-center'>
              <td>이미지선택</td>
              <td>
                <div className="input-group mb-3 w-10">
                  <label className="input-group-text">Upload</label>
                  <input type="file" className="form-control" id="inputGroupFile01" onChange={(e) => readURL(e.target)} accept='image/*' />
                </div>
              </td>
            </tr>
            <tr className='align-items-center'>
              <td>Image Preview</td>
              <td>
                <img className='border border-dark rounded w-48 h-48' id="preview" />
              </td>
            </tr>
          </tbody>
        </table>
        <Link to="/ProductList"><input type="submit" value="취소" /></Link>
        <input type="submit" value="완료" />
      </form>

    </Container>
  )
}

export default CreateProduct;