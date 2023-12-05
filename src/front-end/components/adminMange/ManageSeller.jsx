import React, { useState, useEffect } from 'react';
import { deleteImageFromS3 } from "../../../back-end/services/aws";

const ManageSeller = () => {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3300/sellers')
      .then(response => response.json())
      .then(data => setSellers(data));

    fetch('http://localhost:3300/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProductsOfSeller = (seller_id) => {
    const sellersProducts = products.filter(product => product.seller_id === seller_id);
    sellersProducts.map((item) => { deleteImageFromS3(item.image) })
    sellersProducts.forEach(product => {
      fetch(`http://localhost:3300/products/${product.id}`, {
        method: 'DELETE',
      })
      .then(() => {
        setProducts(products.filter(p => p.id !== product.id));
      })
      .catch(error => console.error('Error:', error));
    });
  };

  const deleteSeller = (id) => {
    const seller = sellers.find(seller => seller.id === id);
    if (!seller) return;

    deleteProductsOfSeller(seller.user_id);

    fetch(`http://localhost:3300/sellers/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setSellers(sellers.filter(seller => seller.id !== id));
      alert("판매자가 성공적으로 삭제되었습니다.");
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDelete = () => {
    if (selectedSeller) {
      const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
      if (confirmDelete) {
        deleteSeller(parseInt(selectedSeller));
        setSelectedSeller(null);
      }
    } else {
      alert("삭제할 판매자를 선택해주세요.");
    }
  };

  return (
    <div>
      <h1>Delete Seller</h1>
      <select value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
        <option value="">--판매자 선택--</option>
        {sellers.map((seller, index) => (
          <option value={seller.id} key={index}>{seller.user_id}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete Seller</button>
    </div>
  );
};

export default ManageSeller;



