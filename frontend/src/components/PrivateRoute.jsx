import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const PrivateRoute = () => {
  const { userInfo } = useSelector(state => state.auth);

  // if logged in Outlet will route if not Navigate will route
  // if  exist go to 
  return (
    userInfo ? <Outlet /> : <Navigate to='/login' replace/> // replace for replacing any past history
  )
}

export default PrivateRoute;