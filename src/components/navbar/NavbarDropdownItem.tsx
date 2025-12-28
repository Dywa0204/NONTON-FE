
import { Row, Col, ListGroup } from "react-bootstrap";

interface NavbarDropdownItemProps {
  icon: any, 
  title: string, 
  description: string, 
  time: string, 
  spacing: string
}

const NavbarDropdownItem = ({ icon, title, description, time, spacing }: NavbarDropdownItemProps) => (
  <ListGroup.Item>
    <Row className="align-items-center g-0">
      <Col xs={2}>{icon}</Col>
      <Col xs={10} className={spacing ? "pl-2" : undefined}>
        <div className="text-dark">{title}</div>
        <div className="text-muted small mt-1">{description}</div>
        <div className="text-muted small mt-1">{time}</div>
      </Col>
    </Row>
  </ListGroup.Item>
);

export default NavbarDropdownItem;
