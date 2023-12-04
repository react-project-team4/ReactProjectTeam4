import React, { useState, useEffect } from 'react';

const ManageBuyer = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // 서버에서 사용자 정보 가져오기
    fetch('http://localhost:3300/users')
      .then(response => response.json())
      .then(data => setUsers(data));

    // 서버에서 상품 정보 가져오기
    fetch('http://localhost:3300/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const removeUserFromProducts = (user_id) => {
    const user = users.find(user => user.user_id === user_id);
    if (!user) return;

    user.cartList.forEach(productId => {
      const product = products.find(product => product.id === productId);
      if (!product) return;

      fetch(`http://localhost:3300/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...product, seller_id: null }),
      })
      .then(response => response.json())
      .then(updatedProduct => {
        setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
      })
      .catch(error => console.error('Error:', error));
    });
  };

  const deleteUser = (id) => {
    const user = users.find(user => user.id === id);
    if (!user) return;

    removeUserFromProducts(user.user_id);

    fetch(`http://localhost:3300/users/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setUsers(users.filter(user => user.id !== id));
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDelete = () => {
    if (selectedUser) {
      deleteUser(parseInt(selectedUser));
      setSelectedUser(null);
    } else {
      alert("삭제할 사용자를 선택해주세요.");
    }
  };

  return (
    <div>
      <h1>Delete User</h1>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">--사용자 선택--</option>
        {users.map((user, index) => (
          <option value={user.id} key={index}>{user.nickName}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};

export default ManageBuyer;
