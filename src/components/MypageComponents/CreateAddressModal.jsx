import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';




function CreateAddressModal() {
  const [show, setShow] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressId:"",
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
    console.log(newAddress)
    setShow(false);
  }
  const handleShow = () => setShow(true);

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
            <Form.Check // prettier-ignore
            type="checkbox"
            id=""
            label="기본 배송지로 설정"
          />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateAddressModal;