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
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice"; // to get data from data base

const OrderScreen = () => {
    // get order id that comes from the url
    const { id: orderId } = useParams();

    // get data (re named to order). refetch to get new data (prevent not getting new data - can happen)
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  
    console.log(order);
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
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>Column</Col>
          </Row>
        </>
    );
};

export default OrderScreen;