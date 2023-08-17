import { useNavigate } from "react-router-dom";
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FcFlashOn } from "react-icons/fc";
import { LinkContainer } from "react-router-bootstrap";
import React from "react";
import { useSelector, useDispatch } from "react-redux"; // dispatch for logout
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice"; // dispatch for logout
import SearchBox from "./SearchBox";
// https://react-icons.github.io/react-icons/  react icons

const Header = () => {
  // get cart state
  const { cartItems } = useSelector((state) => state.cart);
  // get user state
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // destructure logoutApiCall from useLoginMutation()
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      // err is error need to be consistent name to error
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              {" "}
              <span className="logo-text">Electri</span>
              <FcFlashOn
                style={{ width: "50px", height: "50px", color: "green" }}
              ></FcFlashOn>
              {/* <Image
                src={logo2}
                alt="E-Shop"
                style={{ width: "100px", height: "100px" }}
                className="company-logo"
              /> */}
              <span className="logo-text">fying</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce(
                        (accumulator, currentItem) =>
                          accumulator + currentItem.qty,
                        0
                      )}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link href="/login">
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
