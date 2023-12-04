import React, { useState, useEffect } from 'react';

const ManageSeller = () => {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    // 서버에서 판매자 정보 가져오기
    fetch('http://localhost:3300/sellers')
      .then(response => response.json())
      .then(data => setSellers(data));

    // 서버에서 상품 정보 가져오기
    fetch('http://localhost:3300/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProductsOfSeller = (seller_id) => {
    const sellersProducts = products.filter(product => product.seller_id === seller_id);

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
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDelete = () => {
    if (selectedSeller) {
      deleteSeller(parseInt(selectedSeller));
      setSelectedSeller(null);
    } else {
      alert("삭제할 판매자를 선택해주세요.");
    }
  };

  return (
    <div>
      <h1>Delete Seller</h1>
      <select value={selectedSeller} onChange={(e) => setSelectedSeller(parseInt(e.target.value, 10))}>
        <option value="">--판매자 선택--</option>
        {sellers.map((seller, index) => (
          <option value={seller.id} key={index}>{seller.nickName}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete Seller</button>
    </div>
  );
};

export default ManageSeller;


