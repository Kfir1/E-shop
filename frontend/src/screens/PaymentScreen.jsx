
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice"; // to save payment method to local storage

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => { 
    // check if there is shippingAddress in local storage (if exist)
    // if not navigate to shipping, so user can enter the shippingAddress
    if (!shippingAddress) {
        navigate('/shipping');
    } 
    // add shippingAddress and navigate as dependencies [shippingAddress, navigate]
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // paymentMethod by default will be PayPal
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder');
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={ submitHandler }>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label='PayPal or Credit Card'
              id='PayPal'
              name="paymentMethod"
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen;