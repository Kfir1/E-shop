import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error message

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailInputRef = useRef(null); // Ref for email input field

  // destructure login and isLoading from usersApiSlice
  const [login, { isLoading }] = useLoginMutation();

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

    try {
      // email and password will be user input object on login page form
      // becuase it will return a PROMISE - unwrap() will extract the resolved value from the PROMISE
      const res = await login({ email, password }).unwrap();
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
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

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

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
