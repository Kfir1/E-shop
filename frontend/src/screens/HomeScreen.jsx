import { useEffect, useState } from 'react'; // for fetching from server
import { Row, Col} from 'react-bootstrap';
// import products from '../products'; 
// (for fetching from json file locally - for check)  (bring from axios instead)
import Product from '../components/Product';
import axios from 'axios';
 
const HomeScreen = () => {
  // empty array by default
  const [products, setProducts] = useState([]);

 useEffect(() => {
    const fetchProducts = async () => {
      // destructuring the data 
      // `data` is the response that was provided by the server
      // proxy added as dependency on json on frontend....
      // so can use '/api/prodcuts' instead of whole path with localhost
      const { data } = await axios.get('/api/products');
      
      setProducts(data);
    };

    fetchProducts();
  }, []);
// [] empty to run useEffect once.

  return (
    <>
       <h1>Latest products</h1>
      <Row>
        {products.map( (product) => 
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product}/>
          </Col>
        )}
      </Row>
    </>
  )
}

export default HomeScreen

