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
import TrackCase from "./pages/TrackCase";
import NGODashboard from "./components/NGODashboard";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerAuth from "./pages/VolunteerAuth";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/track-case"
          element={<TrackCase />}
        />

        <Route
          path="/ngo-auth"
          element={<NGOAuth />}
        />

        <Route
        path="/volunteer-auth"
        element={<VolunteerAuth />}
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
          path="/volunteer-register"
          element={<VolunteerRegister />}
        />

        <Route
          path="/volunteer-login"
          element={<VolunteerLogin />}
        />

        <Route
          path="/volunteer-dashboard"
          element={<VolunteerDashboard />}
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
