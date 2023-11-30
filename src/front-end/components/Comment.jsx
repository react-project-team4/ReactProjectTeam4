import { useEffect, useState } from "react";
import { Button, Col, Row, Container } from "react-bootstrap";

export default function Comment(props) {
  const productData = props.productData;
  const [comments, setComments] = useState([]);
  useEffect(() => {
    commentList();
  }, []);

  const commentList = () => {
    fetch(`http://localhost:3300/comments`)
      .then((response) => response.json())
      .then((jsonData) => {
        const comments = jsonData.filter(
          (item) => item.productId === productData.id
        );
        comments === null ? setComments([]) : setComments(comments);
        console.log(comments);
      });
  };

  const deleteComment = () => {
    fetch(`http://localhost:3300/comments/${productData.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <>
      <hr />
      <h2>Review</h2>
      {comments.length === 0 ? (
        <Row>
          <Col className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
            <Col className="text-muted">댓글이 없습니다.</Col>
            <Col className="ms-auto"></Col>
          </Col>
        </Row>
      ) : (
        comments.map((item) => (
          <Row>
            <Col
              key={item.id}
              className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom"
            >
              <Col className="text-muted">{item.content}</Col>
              <Col className="ms-auto"></Col>
              {item.userId === localStorage.getItem("Email") && (
                <>
                  <Button style={{ marginRight: "5px" }}>수정</Button>
                  <Button onClick={deleteComment}>삭제</Button>
                </>
              )}
            </Col>
          </Row>
        ))
      )}
    </>
  );
}
