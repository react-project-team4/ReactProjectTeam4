import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function CreateAddressModal() {
  const [show, setShow] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressName: "",
    address: ""
  });
  const [userId, setUserId] = useState(null);
  const [isNewAddressDefault, setIsNewAddressDefault] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3300/users`)
      .then(response => response.json())
      .then(data => {
        const $user = data.find(
          (e) => e.user_id === localStorage.getItem("Email")
        );
        setUserId($user);
      });
  }, []);

  if (userId === null) {
    return <div>Loading...</div>;
  }

  const $userId = userId.id;

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

  const handleShow = () => {
    setIsNewAddressDefault(false); // 모달이 열릴 때마다 기본값으로 초기화
    setShow(true);
  }

  const addressAddButton = async () => {
    if (!userId) {
      console.error("사용자 ID를 찾을 수 없습니다");
      return;
    }
  
    const response = await fetch(`http://localhost:3300/users/${$userId}`);
    const user = await response.json();
  
    const maxAddressId = user.addressList.reduce((maxId, currentAddress) => {
      return Math.max(maxId, Number(currentAddress.addressId));
    }, 0);
  
    let updatedAddressList = [
      ...user.addressList,
      {
        addressId: (maxAddressId + 1).toString(),
        addressType: isNewAddressDefault,
        address: newAddress.address,
        addressName: newAddress.addressName
      }
    ];
  
    if (isNewAddressDefault) {
      updatedAddressList = updatedAddressList.map(e => {
        if(e.addressId !== (maxAddressId + 1).toString()){
          e.addressType = false;
        }
        return e;
      });
    }
  
    const updatedUser = { ...user, addressList: updatedAddressList };
  
    const updateResponse = await fetch(`http://localhost:3300/users/${$userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    });
  
    const data = await updateResponse.json();
  
    console.log(data);
    handleClose();
    setIsNewAddressDefault(false); // 모달이 닫힐 때마다 기본값으로 초기화
  }

  return (
    <>
      <Button variant="primary" style={{ width: '600px' }} onClick={handleShow}>
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
            checked={isNewAddressDefault}
            onChange={() => setIsNewAddressDefault(!isNewAddressDefault)}
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