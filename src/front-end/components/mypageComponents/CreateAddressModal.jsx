import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// 로컬스토리지 유저 Id 빼오기
localStorage.setItem("userId", "1234");
const $userId = localStorage.getItem("userId")

function CreateAddressModal() {
  const [show, setShow] = useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressName:"",
    address:""
});

const handleInputChange = (e) => {
  
  const { name, value } = e.target;
  setNewAddress((prevAddress) => ({
    ...prevAddress,
    [name]: value,
  }));
};


  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);

  // 먼저 users의 
  const addressAddButton = () => {
    fetch(`http://localhost:3300/users/${$userId}`)
      .then(response => response.json())
      .then(user => {
        // 가장 큰 addressId 찾아서 1더해서 addressId 추가해주기
        const maxAddressId = user.addressList.reduce((maxId, currentAddress) => {
          return maxId > Number(currentAddress.addressId) ? maxId : Number(currentAddress.addressId);
        }, 0);
  
        const updatedAddressList = [
          ...user.addressList,
          {
            // 가장 큰 addressId에 1을 더한 후 다시 문자열로 변환
            addressId: (maxAddressId + 1).toString(),
            addressType: isDefaultAddress,
            address: newAddress.address,
            addressName: newAddress.addressName
          }
        ];

        // 기본배송지로 선택을 눌렀으면 기존에 addressType이 true이던거를 false로 바꿔줘야 함
        // updatedAddressList를 돌면서 .addressType이 true인거를 찾아서 false로 바꿔줘야 함
        updatedAddressList.map((e)=>{
          if(e.addressType === true && isDefaultAddress==true){
            e.addressType = false
          }
        })
  
        const updatedUser = { ...user, addressList: updatedAddressList };
  
        fetch(`http://localhost:3300/users/${$userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedUser)
        })
          .then(response => response.json())
          .then(data => console.log(data));
      });

      handleClose()
  }
  
  

  return (
    <>
      <Button variant="primary" style={{width:'600px'}} onClick={handleShow}>
        배송지 추가
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>배송지 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>배송지 이름</Form.Label>
              <Form.Control
                type="text"
                name='addressName'
                value={newAddress.addressName}
                onChange={handleInputChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>상세 주소</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                name='address'
                value={newAddress.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>

            {/* 체크박스 */}
            <Form.Check
              type="checkbox"
              id="defaultAddressCheckbox"
              label="기본 배송지로 설정"
              checked={isDefaultAddress}
              onChange={() => setIsDefaultAddress(!isDefaultAddress)}
            />


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={addressAddButton}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateAddressModal;