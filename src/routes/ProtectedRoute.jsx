import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  const location = useLocation();

  // Checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05020b] text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />

          <p className="mt-4 text-sm text-white/50">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → Login page
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Logged in → Allow access
  return <Outlet />;
};

export default ProtectedRoute;