import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  //JS date object
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>E-SHOP &copy; {currentYear} </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
