import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from  "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
     useGetProductsQuery,
     useCreateProductMutation,
     useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  // get createProduct from useCreateProductMutation in productApiSlice
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  // pass id for deleting a product
  const deleteHandler = async (id) =>{
    // verify if user really want to delete product with window message
    // press ok will enter if statement 
    if (window.confirm('Are you sure?')) { 
      try {
        await deleteProduct(id); 
        refetch(); // prevent need to reload page
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      } 
    }
  }

  const createProductHandler = async () => {
    // confirm that want to add new product
    if (window.confirm('Are you sure you want to create a new product? ')) {
        try {
            await createProduct();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  };

  return <>
    <Row className="align-items-center">
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className="text-end">
        <Button className="btn-sm m-3" onClick={ createProductHandler }>
          <FaEdit /> Create Product
        </Button>
      </Col>
    </Row>
    
    { loadingCreate && <Loader />}
    { loadingDelete && <Loader />}

    { isLoading ? <Loader /> : error ? <Message variant='danger'>
    {error}</Message> : (
      <>
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
              { products.map((product) => (
                <tr key={ product._id }>
                  <td>{ product._id }</td>
                  <td>{ product.name }</td>
                  <td>{ product.price }</td>
                  <td>{ product.category }</td>
                  <td>{ product.brand }</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button 
                      variant="light"
                      className="btn-sm mx-2"
                      >
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button 
                      variant="danger"
                      className="btn-sm"
                      /* onClick with arrow function cause need to pass an _id*/
                      onClick={ () => deleteHandler(product._id) } 
                      >
                        <FaTrash style={{ color: 'white' }}/>
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
        </Table>
      </>
    ) }
  </>
}

export default ProductListScreen;