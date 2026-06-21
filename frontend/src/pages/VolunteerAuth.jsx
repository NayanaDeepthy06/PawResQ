import { useNavigate } from "react-router-dom";
import "./VolunteerAuth.css";

function VolunteerAuth() {

  const navigate = useNavigate();

  return (
    <div className="volunteer-auth-page">

      <div className="volunteer-auth-card">

        <h1>
          Volunteer With PawResQ
        </h1>

        <p>
          Help rescue injured and
          abandoned animals.
        </p>

        <div className="auth-buttons">

          <button
            onClick={() =>
              navigate(
                "/volunteer-register"
              )
            }
          >
            New Volunteer
          </button>

          <button
            onClick={() =>
              navigate(
                "/volunteer-login"
              )
            }
          >
            Existing Volunteer
          </button>

        </div>

      </div>

    </div>
  );
}

export default VolunteerAuth;