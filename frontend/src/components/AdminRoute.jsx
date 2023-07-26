import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const AdminRoute = () => {
  const { userInfo } = useSelector(state => state.auth);

  // if logged in, Outlet will route if not Navigate will route
  // if  exist go to 
  return userInfo && userInfo.isAdmin ? (
      <Outlet /> 
  ) : ( 
      <Navigate to='/login' replace/> // replace for replacing any past history
  );
};

export default AdminRoute;