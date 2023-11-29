import { Button, Col, Row, Container } from "react-bootstrap";

export default function Comment() {
  return (
    <Row>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
        <div className="text-muted">댓글</div>
        <div className="ms-auto"></div>
        <Button to="/Comment">댓글 작성</Button>
      </div>
    </Row>
  );
}
