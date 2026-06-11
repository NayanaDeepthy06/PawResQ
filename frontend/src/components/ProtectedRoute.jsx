import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem(
      "ngoToken"
    );

  if (!token) {

    return (
      <Navigate
        to="/ngo-auth"
      />
    );
  }

  return children;
}

export default ProtectedRoute;