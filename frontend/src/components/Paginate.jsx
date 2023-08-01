import { Pagination } from "react-bootstrap"; // bootstrap front end pagination component - need to add back end to it
import { LinkContainer } from "react-router-bootstrap";

// pass in props destructured
const Paginate = ({ pages, page, isAdmin = false }) => {
  return (
  /* vrify that is more then one page
  if only one page, then do not want to show the pagination */
    pages > 1 && (
        <Pagination>
          { [...Array(pages).keys()].map((x) => (
            <LinkContainer 
              key={x + 1} /* array starts from 0 so + 1 to 0 page */
              to={ 
                !isAdmin
                  ? `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`  
            }
            >
              <Pagination.Item
                active={x + 1  === page}
              >
                 {x + 1}
              </Pagination.Item>
            </LinkContainer>
          )) }
        </Pagination>
    )
  )
}

export default Paginate;