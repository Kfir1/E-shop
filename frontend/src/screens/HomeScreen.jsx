import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useGetProductsQuery } from "../slices/productsApiSlice";

const HomeScreen = () => {
  // get pageNumber + keyword dynamically from URL to pass it later to useGetProductsQuery()
  const { pageNumber, keyword } = useParams();
  // data includes products, page, pageSize object from the productController.js
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {" "}
      {/* want the carousel to show if keyword does not exist */}
      {/* if keyword exists, then show the go back button */}
      {!keyword ? (
        <>
          <h1 style={{ color: "white" }}>Top Products</h1>
          <ProductCarousel />
        </>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 style={{ color: "white" }}>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={
              keyword ? keyword : ""
            } /* if keyword as prop is keyword then do keyword else empty string. this get next match keyword after clicking next page if there is matches to keyword search on next page*/
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
