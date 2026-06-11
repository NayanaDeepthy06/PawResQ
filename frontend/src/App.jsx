import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import NGOAuth from "./pages/NGOAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdoptionPage from "./pages/AdoptionPage";
import ProtectedRoute from "./components/ProtectedRoute";

import NGODashboard from "./components/NGODashboard";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/ngo-auth"
          element={<NGOAuth />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

       <Route
        path="/ngo-dashboard"
        element={
          <ProtectedRoute>
            <NGODashboard />
          </ProtectedRoute>
        }
      />

        <Route
          path="/adoption"
          element={<AdoptionPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
