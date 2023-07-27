import { useEffect } from "react";
import { Link, useParams } from "react-router-dom"; //useParams will get the order id from the url
import {
      Row,
      Col,
      ListGroup,
      Image,
      Form,
      Button,
      Card,
      ListGroupItem, 
} from "react-bootstrap";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from "../components/Message";
import Loader from "../components/Loader";
import { 
   useGetOrderDetailsQuery,
   usePayOrderMutation,
   useGetPayPalClientIdQuery, 
} from "../slices/ordersApiSlice"; // to get data from data base

const OrderScreen = () => {
    // get order id that comes from the url (renamed it to orderId to be more specific)
    const { id: orderId } = useParams();

    // get data (re named to order) 
    // refetch to get new data (prevent not getting new data - can happen)
    const {
        data: order,
        refetch,
        isLoading,
        error 
    } = useGetOrderDetailsQuery(orderId);

    // rename isLoading because it is already exist on another query (useGetOrderDetailsQuery)
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    // rename data, isLoading, error, cause alread using same syntax on another query
    const {
       data: paypal,
       isLoading: loadingPayPal,
       error: errorPayPal,
    } = useGetPayPalClientIdQuery();

    // get user data
    const { userInfo } = useSelector((state) => state.auth);

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    // use paypal-react package to load paypal script
    useEffect(() => { // check if errorPayPal and loadingPayPal false and paypal.clientId exist 
      if (!errorPayPal && !loadingPayPal && paypal.clientId) {
        // then create function to  load paypal script
        const loadPaypalScript = async () => { // read paypal documentation 
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'client-id': paypal.clientId,
              currency: 'USD', 
            },
          });
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
        }
        if ( order && !order.isPaid ) { // if the order exist but order is not paid - want to load the script
          if ( !window.paypal ) { // check if script not already loaded 
            loadPaypalScript(); // if not then load it
          }
        }
      }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    function onApprove(data, actions) {
      // then(async function (details) PROMISE with a function with details that comes from paypal
      // async function cause it returns a PROMISE 
      return actions.order.capture().then(async function (details) {
        try {
          // call payOrder from usePayOrderMutation and pass it object { orderId, details } from paypal
          await payOrder({ orderId, details });
          // refetch data and mark order as paid instead of not paid
          refetch();
          toast.success('Payment successful');
        } catch (err) {
          toast.error(err?.data?.message || err.message)
        }
       });
    }
    async function onApproveTest() {
      // not getting details from paypal on this funcion, so set it to object with payer key with empty object
      await payOrder({ orderId, details: { payer: {} } });
      // refetch data and mark order as paid instead of not paid
      refetch();
      toast.success('Payment successful');
    }

    function onError(err) {
      toast.error(err.message);
    }

    function createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      }).then((orderId) => {
        return orderId;
      });
    }

    return isLoading ? (
        <Loader />
        ) : error ? (
        <Message variant='danger'/>
        ) : (
        <>
          <h1>Order: {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> { order.user.name }
                  </p>
                  <p>
                    <strong>Email: </strong> { order.user.email }
                  </p>
                  <p>
                    <strong>Address: </strong> 
                    { order.shippingAddress.address }, { order.shippingAddress.city } {' '}
                    { order.shippingAddress.postalCode }, { order.shippingAddress.country }
                  </p>
                  { order.isDelivered ? (
                    <Message>
                      Delivered on { order.deliveredAt }
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  ) }
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    { order.paymentMethod }
                  </p>
                  { order.isPaid ? (
                    <Message variant='success'>
                      Paid on { order.paidAt }
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  ) }
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  { order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>      
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>

                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>

                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>

                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  
                  { !order.isPaid && (
                    <ListGroup.Item>
                      { loadingPay && <Loader />}

                      {isPending ? <Loader /> : (
                        <div>
                          {/* <Button 
                            onClick={ onApproveTest }
                            style={{marginBottom: '10px'}}
                            >
                            Test Pay Order
                          </Button> */}
                          <div>
                            <PayPalButtons 
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          </div>
                        </div>
                      )}
                    </ListGroup.Item>
                  )}
                  { /* MARK DELIVERED PLACEHOLDER */}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
    );
};

export default OrderScreen;