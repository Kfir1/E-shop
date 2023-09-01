import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice"; // need it cause user will be logged in after registration process
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error message

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailInputRef = useRef(null); // Ref for email input field

  // destructure login and isLoading from usersApiSlice
  const [register, { isLoading }] = useRegisterMutation();

  // get the auth part of the state and put it in userInfo
  const { userInfo } = useSelector((state) => state.auth);

  // if logged in, redirect to specific direction
  const { search } = useLocation();
  // pass { search } to URLSearchParams constructor
  const sp = new URLSearchParams(search);
  // see if there is 'redirect' if not exist will be '/'
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // if userInfo exist (true) then redirect
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);
  // will run every time [userInfo, redirect] changes

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValidEmail = emailPattern.test(email);
    setEmailError(isValidEmail ? "" : "Invalid email address");
  };

  // Handle mouse leave from the email input field
  const handleMouseLeave = () => {
    validateEmail();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Email validation
    validateEmail();

    if (emailError) {
      return; // Stop execution if email is invalid
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        // name, email and password will be user input object on login page form
        // becuase it will return a PROMISE - unwrap() will extract the resolved value from the PROMISE
        const res = await register({ name, email, password }).unwrap();
        // add the call dispatch then call setCredentials and pass the respone res
        // the res will go to setCredentials in authSlice and set the local storage
        // to whatever the user is
        dispatch(setCredentials({ ...res }));
        // then navigate
        navigate(redirect);
      } catch (err) {
        // ? for not collapsing when undefined
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      <Form.Group controlId="name" className="my-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(""); // Clear email error when typing
            }}
            onBlur={handleMouseLeave} // Validate email when the mouse leaves the input field
            ref={emailInputRef} // Attach ref to the email input field
          ></Form.Control>
          {!emailError || email.length === 0 ? null : (
            <div
              className="error-message"
              style={{ color: "red", marginTop: "2px", fontWeight: "bold" }}
            >
              {emailError}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
