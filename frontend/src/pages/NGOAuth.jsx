import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaPaw,
} from "react-icons/fa";

function LocationMarker({
  setLatitude,
  setLongitude,
}) {

  const [position,
    setPosition] =
    useState(null);

  useMapEvents({

    click(event) {

      setPosition(
        event.latlng
      );

      setLatitude(
        event.latlng.lat
      );

      setLongitude(
        event.latlng.lng
      );

    },

  });

  return position ? (
    <Marker
      position={position}
    />
  ) : null;
}

function NGOAuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] =  useState(true);
  const [loginEmail, setLoginEmail] =  useState("");
  const [loginPassword,setLoginPassword] =  useState("");
  const [ngoName, setNgoName] = useState("");
  const [email, setEmail] =  useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword,
  setConfirmPassword] =
  useState("");

const [showPassword,
  setShowPassword] =
  useState(false);

const [showConfirmPassword,
  setShowConfirmPassword] =
  useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] =  useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] =  useState(null);
  const [locationConfirmed,setLocationConfirmed] =  useState(false);
 
  
 
   
  async function handleRegister(
  event
) {
  event.preventDefault();

if (
  !ngoName ||
  !email ||
  !password ||
  !phoneNumber ||
  !address ||
  !latitude ||
  !longitude
)
{
  alert(
    "Please fill all required fields"
  );
  return;
}

if (!locationConfirmed) {

  alert(
    "Please confirm NGO location"
  );

  return;
}

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
  alert(
    "Please enter a valid email address"
  );
  return;
}

const phonePattern =
  /^[0-9]{10}$/;

if (!phonePattern.test(phoneNumber)) {
  alert(
    "Phone number must be exactly 10 digits"
  );
  return;
}

if (
  password !==
  confirmPassword
) {
  alert(
    "Passwords do not match"
  );
  return;
}

  try {
    const response =
      await fetch(
        "http://localhost:5001/api/ngo/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ngoName,
            email,
            password,
            phoneNumber,
            address,
            latitude,
            longitude,
          }),
        }
      );

   const data =
  await response.json();

      if (!response.ok) {

        alert(data.message);

        if (
          data.message.includes("login")
        ) {
          setIsLogin(true);
        }

        return;
      }

      alert(
    "Registration Successful. Please wait for admin approval."
  );

  setIsLogin(true);

  } catch (error) {
    console.error(error);

    alert(
      "Registration Failed"
    );
  }
}
async function handleLogin(
  event
) {
  event.preventDefault();

  try {

    const response =
      await fetch(
        "http://localhost:5001/api/ngo/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: loginEmail,
            password:
              loginPassword,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem(
      "ngoToken",
      data.token
    );

    localStorage.setItem(
      "ngoData",
      JSON.stringify(data.ngo)
    );

    alert(
      "Login Successful"
    );
      navigate(
      "/ngo-dashboard"
    );

  } catch (error) {

    console.error(error);

    alert("Login Failed");
  }
}

  return (
    <div className="ngo-auth-page">

      <div className="ngo-auth-card">

        <h1 className="ngo-title">
            <FaPaw />
            PawResQ NGO Portal
          </h1>

        <div className="auth-toggle">

          <button
            onClick={() =>
              setIsLogin(true)
            }
          >
            Login
          </button>
         
          <button
            onClick={() =>
              setIsLogin(false)
            }
          >
            Register
          </button>

        </div>

        {isLogin ? (

              <form
                onSubmit={handleLogin}
              >
        

           <input
            type="email"
            placeholder="Email"
            required
            value={loginEmail}
            onChange={(e) =>
              setLoginEmail(
                e.target.value
              )
            }
          />

          <input
          type="password"
          placeholder="Password"
          required
          value={loginPassword}
          onChange={(e) =>
            setLoginPassword(
              e.target.value
            )
          }
        />

            <button
              type="submit"
              className="ngo-submit-button"
            >
              Login
            </button>

          </form>

        ) : (

          <form
          onSubmit={
            handleRegister
          }
        >

            <input
            type="text"
            placeholder="NGO Name"
            required
            value={ngoName}
            onChange={(e) =>
              setNgoName(e.target.value)
            }
          />

         <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
           <div className="password-field">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            required
            minLength="6"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

        </div>

        <div className="password-field">

        <input
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
        />

       <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
        >
          {showConfirmPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

           <input
          type="tel"
          placeholder="Contact Number"
          required
          pattern="[0-9]{10}"
          maxLength="10"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(e.target.value)
          }
        />

         <input
          type="text"
          placeholder="NGO Address"
          required
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
        />

                  <h3>
            Select NGO Location
          </h3>

          <MapContainer
            center={[17.385, 78.486]}
            zoom={12}
            style={{
              height: "300px",
              width: "100%",
            }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />

          </MapContainer>

          <p>
            Latitude:
            {latitude
            ? latitude.toFixed(6)
            : " Not Selected"}
          </p>

          <p>
            Longitude:
           {longitude
            ? longitude.toFixed(6)
            : " Not Selected"}
          </p>
          
           <div
            className="location-confirmation"
          >

            <input
              type="checkbox"
              checked={locationConfirmed}
              onChange={(e) =>
                setLocationConfirmed(
                  e.target.checked
                )
              }
            />

            <label>
              I confirm that the selected
              location is the actual
              location of my NGO.
            </label>

          </div>
           <button
              type="submit"
              className="ngo-submit-button"
            >
              Register NGO
            </button>

          </form>

        )}

      </div>

    </div>
  );
}

export default NGOAuthPage;