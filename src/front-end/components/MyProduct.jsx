import React, { useEffect, useState } from "react";
import { Card, Table, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyProduct = () => {
  const [productId, setProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3300/sellers")
      .then((response) => response.json())
      .then((data) => {
        const $seller = data.find(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        if ($seller) {
          setProductId($seller.productList);
        }
      });
  }, []);

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        const productDetailsPromises = productId.map(async (product_id) => {
          const response = await fetch(
            `http://localhost:3300/products/${product_id}`
          );
          const productDetails = await response.json();
          return productDetails;
        });

        const productDetails = await Promise.all(productDetailsPromises);
        setProducts(productDetails);
      };

      fetchProductDetails();
    }
  }, [productId]);

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        const sellerResponse = await fetch("http://localhost:3300/sellers");
        const sellers = await sellerResponse.json();

        const seller = sellers.find(
          (e) => e.user_id === localStorage.getItem("Email")
        );

        if (seller) {
          const updatedProductList = seller.productList.filter(
            (productId) => productId !== selectedProduct
          );

          const updatedSeller = { ...seller, productList: updatedProductList };

          const patchResponse = await fetch(
            `http://localhost:3300/sellers/${seller.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedSeller),
            }
          );

          if (patchResponse.ok) {
            console.log("Product deleted successfully");

            setProductId(updatedProductList);
            setSelectedProduct(null);

            navigate("/MyProduct");
          } else {

            console.error("Failed to delete product");
          }
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (productId) => {
    setEditMode(true);
    setSelectedProduct(productId);

    const productToEdit = products.find((product) => product.id === productId);
    setEditedProduct(productToEdit);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3300/products/${selectedProduct}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedProduct),
        }
      );
  
      if (response.ok) {
        console.log("Product edited successfully");
  
        const updatedProductResponse = await fetch(
          `http://localhost:3300/products/${selectedProduct}`
        );
        const updatedProduct = await updatedProductResponse.json();
  
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === selectedProduct ? updatedProduct : product
          )
        );
  
        setEditMode(false);
        setSelectedProduct(null);
        setEditedProduct({});
  
        navigate("/MyProduct");
      } else {
        console.error("Failed to edit product");
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleRadioChange = (productId) => {
    setSelectedProduct(productId);
  };

  const handleInputChange = (e, field) => {
    setEditedProduct((prevEditedProduct) => ({
      ...prevEditedProduct,
      [field]: e.target.value,
    }));
  };

  if (productId === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container className="my-5">
        <Card>
          <Card.Header>
            <h2 className="mb-0">{localStorage.getItem("Nickname")}님의 판매상품</h2>
          </Card.Header>
          <Card.Body>
            <Table bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>상품 이름</th>
                  <th>상품 이미지</th>
                  <th>상품 가격</th>
                  <th>상품 배송비</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="radio"
                        onChange={() => handleRadioChange(product.id)}
                        checked={selectedProduct === product.id}
                      />
                    </td>
                    <td>
                      {editMode && selectedProduct === product.id ? (
                        <Form.Control
                          type="text"
                          value={editedProduct.name}
                          onChange={(e) => handleInputChange(e, "name")}
                        />
                      ) : (
                        product.name
                      )}
                    </td>
                    <td>
                      <img
                        src={product.image}
                        alt="description"
                        style={{ width: "150px", height: "100px" }}
                      />
                    </td>
                    <td>
                      {editMode && selectedProduct === product.id ? (
                        <Form.Control
                          type="text"
                          value={editedProduct.price}
                          onChange={(e) => handleInputChange(e, "price")}
                        />
                      ) : (
                        product.price
                      )}
                    </td>
                    <td>
                      {editMode && selectedProduct === product.id ? (
                        <Form.Control
                          type="text"
                          value={editedProduct.shippingFee}
                          onChange={(e) => handleInputChange(e, "shippingFee")}
                        />
                      ) : (
                        product.shippingFee
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            {editMode && (
              <Button
                variant="success"
                size="sm"
                onClick={handleSave}
                className="ml-2"
              >
                저장
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(selectedProduct)}
              disabled={editMode || selectedProduct === null}
              className="ml-2"
            >
              수정
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(selectedProduct)}
              disabled={editMode || selectedProduct === null}
              className="ml-2"
            >
              삭제
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default MyProduct;