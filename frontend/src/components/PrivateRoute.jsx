import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector(state => state.auth);

  // if  exist go to 
  return (
    userInfo ? <Outlet /> : <Navigate to='/login' replace/> // replace for replacing any past history
  )
}

export default PrivateRoute;