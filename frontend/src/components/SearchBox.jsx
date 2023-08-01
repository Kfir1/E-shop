import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

// search box component will show on Header component
const SearchBox = () => {
  const navigate = useNavigate();

  // get keyword and rename it to urlKeyword
  const { keyword: urlKeyword } = useParams();

  // set urlKeyword to default state or if not exist empty string ''
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {  // if keyword trimmmed exist
        setKeyword('');
        navigate(`/search/${keyword}`);
    } else {
        navigate('/');  // if keyword does not exist, stay on home page
    }
  } 

  return (
    <Form onSubmit={ submitHandler } className="d-flex">
      <Form.Control
        type="text"
        name="q" /* q for query */
        onChange={((e) => setKeyword(e.target.value))}
        value={keyword}
        placeholder="Search Products"
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button> 
    </Form>
  )
}

export default SearchBox;