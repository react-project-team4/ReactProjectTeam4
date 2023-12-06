import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

export default function Comment(props) {
  const productData = props.productData;
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState(false);
  const [updateCommentForm, setUpdateCommentForm] = useState(0);

  useEffect(() => {
    commentList();
    commentInputForm();
  }, []);

  // 댓글리스트 가져오기
  const commentList = () => {
    fetch(`http://localhost:3300/comments`)
      .then((response) => response.json())
      .then((jsonData) => {
        const comments = jsonData.filter(
          (item) => item.productId === productData.id
        );

        comments === null ? setComments([]) : setComments(comments);
      });
  };
  // 시간을 보기 좋은 형식으로 출력
  const formatDate = (date) => {
    date = new Date(date);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 24시간 형식으로 출력하려면 true 대신 false로 설정
      timeZone: "UTC", // 시간대를 원하는대로 설정하세요
    };

    const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(
      date
    );
    return formattedDate;
  };

  // 주문자 확인하고 댓글 입력창 출력 여부 결정
  const commentInputForm = () => {
    fetch(`http://localhost:3300/orders`)
      .then((response) => response.json())
      .then((jsonData) => {
        const commentForm = jsonData.some(
          (item) =>
            item.user_id === localStorage.getItem("Email") &&
            item.product_id === productData.id
        );
        setCommentForm(commentForm);
      });
  };

  // 댓글 등록
  const inputComment = () => {
    const textarea = document.querySelector(".comment");
    const content = textarea.value.trim();
    console.log(content);
    if (content.trim() === "") {
      return alert("댓글을 입력해 주세요");
    }
    fetch("http://localhost:3300/comments", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        productId: productData.id,
        user_id: localStorage.getItem("Email"),
        nickName: localStorage.getItem("Nickname"),
        content: content,
        created_at: new Date(),
        updated_at: new Date(),
      }),
    }).then((response) => {
      textarea.value = "";
      console.log(response);
      commentList();
    });
  };

  // 댓글 삭제
  const deleteComment = (comment_id) => {
    /* eslint-disable */
    if (!confirm("상품을 삭제하시겠습니까?")) {
      return;
    }
    fetch(`http://localhost:3300/comments/${comment_id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      console.log(response);
      commentList();
    });
  };

  const updateComment = (comment_id) => {
    /* eslint-disable */
    if (!confirm("댓글을 수정하시겠습니까?")) {
      return;
    }
    const textarea = document.querySelector(".updateComment");
    const content = textarea.value.trim();
    if (content.trim() === "") {
      return alert("댓글을 입력해 주세요");
    }
    fetch(`http://localhost:3300/comments/${comment_id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        content: content,
        updated_at: new Date(),
      }),
    }).then((response) => {
      textarea.value = "";
      setUpdateCommentForm(0);
      commentList();
    });
  };

  return (
    <>
      <hr />
      <h2>Review</h2>
      {commentForm && (
        <Row>
          <Col>
            <textarea
              type="text"
              className="comment rounded-3 p-2"
              placeholder=" 댓글 입력"
              cols={"45"}
              rows={"2"}
              style={{ width: "100%", resize: "none", overflow: "hidden" }}
            />
          </Col>
          <Col
            xs="auto"
            sm="auto"
            md="auto"
            lg="auto"
            className="d-flex flex-wrap flex-md-nowrap align-items-center"
          >
            <Button variant="primary" onClick={inputComment}>
              등록
            </Button>
          </Col>
        </Row>
      )}
      {comments.length === 0 ? (
        <Row>
          <Col className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
            <Col className="text-muted">댓글이 없습니다.</Col>
            <Col className="ms-auto"></Col>
          </Col>
        </Row>
      ) : (
        comments.map((item) => (
          <Row key={item.id}>
            <Row>
              <Col className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3">
                <Col className="text-muted" style={{ fontSize: "12px" }}>
                  {item.nickName}
                </Col>
                <Col className="ms-auto"></Col>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex flex-wrap flex-md-nowrap align-items-center pt-1 ">
                <Col className="text-muted">{item.content}</Col>
                <Col className="ms-auto"></Col>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex flex-wrap flex-md-nowrap align-items-center pb-2 border-bottom">
                <Col className="text-muted" style={{ fontSize: "12px" }}>
                  {formatDate(item.updated_at)}
                </Col>
                <Col className="ms-auto"></Col>
                {(localStorage.getItem("UserType") === "Admin" ||
                  item.user_id === localStorage.getItem("Email")) && (
                  <>
                    <Button
                      onClick={() => setUpdateCommentForm(item.id)}
                      style={{ marginRight: "5px" }}
                    >
                      수정
                    </Button>
                    <Button onClick={() => deleteComment(item.id)}>삭제</Button>
                  </>
                )}
              </Col>
            </Row>
            {updateCommentForm === item.id && (
              <Row>
                <Col>
                  <textarea
                    type="text"
                    className="updateComment rounded-3 p-2"
                    cols={"45"}
                    rows={"2"}
                    key={item.id}
                    defaultValue={item.content}
                    style={{
                      width: "100%",
                      resize: "none",
                      overflow: "hidden",
                    }}
                  />
                </Col>
                <Col
                  xs="auto"
                  sm="auto"
                  md="auto"
                  lg="auto"
                  className="d-flex flex-wrap flex-md-nowrap align-items-center"
                >
                  <Button
                    variant="primary"
                    onClick={() => updateComment(item.id)}
                  >
                    수정
                  </Button>
                </Col>
              </Row>
            )}
          </Row>
        ))
      )}
    </>
  );
}
