import React, { useState, useEffect } from 'react';

const ManageBuyer = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3300/users')
      .then(response => response.json())
      .then(data => setUsers(data));

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

    // 사용자가 작성한 댓글 삭제
    fetch(`http://localhost:3300/comments?user_id=${user.user_id}`)
    .then(response => response.json())
    .then(userComments => {
      userComments.forEach(comment => {
        fetch(`http://localhost:3300/comments/${comment.id}`, {
          method: 'DELETE',
        })
        .catch(error => console.error('Error:', error));
      });
    });

    // 사용자 삭제
    fetch(`http://localhost:3300/users/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setUsers(users.filter(user => user.id !== id));
      alert("사용자가 성공적으로 삭제되었습니다.");
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
          <option value={user.id} key={index}>{user.user_id}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};

export default ManageBuyer;
