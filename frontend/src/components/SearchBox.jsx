import { useEffect, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";

// search box component will show on Header component
const SearchBox = () => {
  const navigate = useNavigate();

  // get keyword and rename it to urlKeyword
  const { keyword: urlKeyword } = useParams();

  // set urlKeyword to default state or if not exist empty string ''
  const [keyword, setKeyword] = useState(urlKeyword || "");

  // set state filteredResults to an empty array
  const [filteredResults, setFilteredResults] = useState([]);

  // Use the useGetProductsQuery hook to fetch products based on the keyword
  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProductsQuery({
    keyword,
  });

  // Handle API response and update filteredResults
  useEffect(() => {
    if (productsData?.products && !isLoading && keyword) {
      const filteredData = productsData.products.filter((product) => {
        return product.name.toLowerCase().includes(keyword.toLocaleLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults([]);
    }
  }, [error, productsData, isLoading, keyword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // if keyword trimmmed exist
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/"); // if keyword does not exist, stay on home page
    }
  };

  const handleAutocomplete = (input) => {
    if (input) {
      setKeyword(input); // Update the keyword state
    } else {
      setKeyword("");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q" /* q for query */
        onChange={(e) => {
          handleAutocomplete(e.target.value);
          /* Call handleAutocomplete when input changes */
        }}
        value={keyword}
        placeholder="Search Products"
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2 mx-2">
        Search
      </Button>
      {/* Display the autocomplete results */}
      {filteredResults && keyword && (
        <ListGroup className="position-absolute mt-2 mt-5 searchbox">
          {filteredResults.map((result) => (
            <ListGroup.Item
              key={result._id}
              action
              onClick={() => setKeyword(result.name)}
              style={{ zIndex: 44 }}
            >
              {result.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Form>
  );
};

export default SearchBox;
