import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

// want to show it on homeScreen
const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  
  return (
    isLoading ? 
    <Loader /> :
    error ? < Message variant='danger'>{error}</Message> 
    : (
        <Carousel pause='hover' className='bg-primary mb-4'>
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fluid
                />
                <Carousel.Caption className='carousel-caption'> 
                  <h2> {/* on index.css on assets -> styles folder there is some css style for carousel-caption */}
                    {product.name} (${product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
    )
  )
}

export default ProductCarousel;

