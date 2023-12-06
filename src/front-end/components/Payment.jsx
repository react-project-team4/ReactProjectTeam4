import { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const [user, setUser] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const productDetailsParam = searchParams.get("products");
  
        if (productDetailsParam) {
            const selectedProducts = JSON.parse(decodeURIComponent(productDetailsParam));
      
            console.log("선택한 상품 정보:", selectedProducts);
            setSelectedProducts(selectedProducts)
          }
        }, [location, user]);   

        useEffect(() => {
            fetch("http://localhost:3300/users")
                .then((response) => response.json())
                .then((data) => {
                    // localStorage에 있는 userId랑 같은 사람 찾아서 그 사람의 배송지 목록을
                    // users에 집어넣기
                    const $user = data.filter(
                        (e) => e.user_id === localStorage.getItem("Email")
                    );
                    
                    if ($user.length > 0) {
                        setUser($user[0]);
                        console.log("사용자 정보:", $user[0]);
                    } else {
                        console.error("사용자를 찾을 수 없습니다.");
                    }
                })
                .catch((error) => {
                    console.error("사용자 정보를 가져오는 중 에러 발생:", error);
                });
        }, []);

        if (user === null) {
            return <div>Loading...</div>;
          }

      // 기본배송지
      let defaultAddress = "";
      user.addressList.forEach(e => {
        if (e.addressType === true){
            defaultAddress = e.address
        }
      });

    // 상품가격 합
    const priceSum = selectedProducts ? selectedProducts.reduce((sum, e) => sum + Number(e.price), 0) : 0;


    // 배송비 합
    const shippingFeeSum = selectedProducts ? selectedProducts.reduce((sum, e) => sum + (e.shippingFee !== "무료" ? Number(e.shippingFee) : 0), 0) : 0;


    const handlePayment = async () => {
        try {
          const currentTime = new Date().toISOString(); // 현재 시간을 ISO 형식으로 가져오기
    
          for (const product of selectedProducts) {
            const response = await fetch("http://localhost:3300/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.user_id,
                product_id: product.id,
                address: defaultAddress,
                productQuantity: product.productQuantity,
                created_at: currentTime,
              }),
            });
    
            if (!response.ok) {
              console.error("주문 생성에 실패했습니다.");
              return;
            }
          }
    
          alert(`${selectedProducts.length}개의 상품의 주문이 완료되었습니다`);
          // 주문 생성이 성공하면, 장바구니에서 상품 삭제
            const updatedCartList = user.cartList.filter((productId) => {
                // selectedProducts 배열에 있는 상품은 삭제
                return !selectedProducts.some((product) => product.id === productId);
            });
            
            // 업데이트된 cartList를 서버에 보내어 업데이트
            await fetch(`http://localhost:3300/users/${user.id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartList: updatedCartList }),
            });
  
          navigate("/MyCart");
        } catch (error) {
          console.error("주문 생성 중 오류 발생:", error);
        }
      };

    return (
        <Container fluid>
            <h1 className="mt-3 mb-4">주문/결제</h1>
            <hr />

            <div className="mb-4">
                <h3>구매자 정보</h3>
                <Table bordered hover>
                    <tbody>
                        <tr>
                            <th className="bg-light" style={{ width: "13%" }}>이름</th>
                            <td>{user.nickName}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">이메일</th>
                            <td>{user.user_id}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">휴대폰 번호</th>
                            <td>{user.phone}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div className="mb-4">
                <h3>받는 사람 정보</h3>
                <Table bordered hover>
                    <tbody>
                        <tr>
                            <th className="bg-light" style={{ width: "13%" }}>이름</th>
                            <td>{user.nickName}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">배송주소</th>
                            <td>{defaultAddress}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">연락처</th>
                            <td>{user.phone}</td>
                        </tr>
                        <tr>
                            <th className="bg-light">배송요청사항</th>
                            <td>
                                <Form.Group controlId="deliveryRequest">
                                    <Form.Control as="select">
                                        <option>택배보관함에 놔주세요.</option>
                                        <option>문 앞에 놔주세요.</option>
                                        <option>경비실에 맡겨주세요</option>
                                    </Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>


            <div className="mb-4">
                <h3>상품 정보</h3>
                <Table bordered hover>
                    <tbody>
                        {selectedProducts !== null && selectedProducts.map((productDetail) => (
                            <tr key={productDetail.id}>
                                <td>
                                    <img
                                        src={productDetail.image}
                                        alt={productDetail.id}
                                        style={{ width: "100px", height: "70px" }}
                                    />
                                    &nbsp;{productDetail.name},
                                    &nbsp;{productDetail.productQuantity}개
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    배송비 {productDetail.shippingFee}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>



            <div className="mb-4">
                <h3>결제 정보</h3>
                <Table bordered hover>
                    <tbody>
                        <tr>
                            <th className="bg-light" style={{width:"13%"}}>총 상품가격</th>
                            <td>{priceSum}원</td>
                        </tr>
                        <tr>
                            <th className="bg-light">할인가격</th>
                            <td>0원</td>
                        </tr>
                        <tr>
                            <th className="bg-light">배송비</th>
                            <td>{shippingFeeSum}원</td>
                        </tr>
                        <tr>
                            <th className="bg-light">총 결제금액</th>
                            <td>{priceSum+shippingFeeSum}원</td>
                        </tr>
                        <tr>
                            <th className="bg-light">결제방법</th>
                            <td>
                                <Form>
                                    <Form.Check
                                        type="radio"
                                        label="계좌이체"
                                        name="pay"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="신용/체크카드"
                                        name="pay"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="법인카드"
                                        name="pay"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="휴대폰"
                                        name="pay"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="무통장입금(가상계좌)"
                                        name="pay"
                                    />
                                </Form>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <Container className="d-flex justify-content-center">
                    <Button
                        variant="outline-primary"
                        style={{ width: "200px", height: "70px" }}
                        className="mr-2"
                        onClick={() => navigate("/MyCart")}
                    >
                        돌아가기
                    </Button>

                    <Button
                        variant="primary"
                        style={{ width: "200px", height: "70px" }}
                        onClick={handlePayment}
                    >
                        결제하기
                    </Button>

            </Container>
        </Container>
    );
};

export default Payment;
