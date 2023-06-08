import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  //JS date object
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col>
            <p>E-shop &copy; { currentYear } </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer