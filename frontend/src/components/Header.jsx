import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

const Header = () => {
  // get cart state
  const { cartItems } = useSelector((state) => state.cart);
  // get user state
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => { 
    console.log('logged out');
  }

  return (
   <header>
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
     <Container>
      <LinkContainer to='/'>
      <Navbar.Brand> 
      <img src={logo} alt="E-Shop" />
      E-Shop
      </Navbar.Brand> 
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <LinkContainer to='/cart'>
            <Nav.Link>
              <FaShoppingCart /> Cart
              {
                cartItems.length > 0 && (
                <Badge pill bg='success' style={{marginLeft: '5px'}}>
                  { cartItems.reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0) }
                </Badge>
                )
              }
            </Nav.Link>
          </LinkContainer>
          { userInfo ? (   
            <NavDropdown title={userInfo.name} id='username'>
              <LinkContainer to='/profile'>
                <NavDropdown.Item>Profile</NavDropdown.Item> 
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          ): (
            <LinkContainer to='/login'>
            <Nav.Link href="/login">
              <FaUser /> Sign In
            </Nav.Link>
          </LinkContainer>
          ) }
        </Nav>
      </Navbar.Collapse>
     </Container>
    </Navbar>
   </header>
  )
}

export default Header