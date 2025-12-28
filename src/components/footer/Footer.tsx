import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer className="footer">
    <Container fluid>
      <Row className="text-muted">
        <Col xs="6" className="text-start">
          <ul className="list-inline">
            <li className="list-inline-item">
              <span className="text-muted">
                Privacy Policy
              </span>
            </li>
            <li className="list-inline-item">
              <span className="text-muted">
                Terms of Service
              </span>
            </li>
          </ul>
        </Col>
        <Col xs="6" className="text-end">
          <p className="mb-0">
            {new Date().getFullYear()}{" "}&copy;{" "}
            <span className="text-muted">
              PT. Farma Global Teknologi
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
