import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VolunteerLogin.css";

function VolunteerLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleLogin() {

    try {

      const response =
        await fetch(
          "https://pawresq-api.onrender.com/api/volunteer/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message
        );

      }

      localStorage.setItem(
        "volunteerToken",
        data.token
      );

      localStorage.setItem(
        "volunteer",
        JSON.stringify(
          data.volunteer
        )
      );

      navigate(
        "/volunteer-dashboard"
      );

    } catch (error) {

      setError(
        error.message
      );

    }

  }

  return (
    <div className="volunteer-login-page">

      <div className="volunteer-login-card">

        <h1>
          Volunteer Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          onClick={
            handleLogin
          }
        >
          Login
        </button>

      </div>

    </div>
  );

}

export default VolunteerLogin;