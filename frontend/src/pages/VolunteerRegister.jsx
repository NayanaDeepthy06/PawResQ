import { useState } from "react";
import "./VolunteerRegister.css";
import VolunteerLocationPicker from "../components/VolunteerLocationPicker";
import { ENDPOINTS } from "../config";
function VolunteerRegister() {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      proofType: "",
    });

  const [proofImage, setProofImage] = useState(null);
  const [message, setMessage] =  useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] =   useState(null);
  const [
  locationConfirmed,
  setLocationConfirmed,
] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();
          if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.proofType ||
      !proofImage
    ) {

      setMessage(
        "Please fill all required fields"
      );

      return;

    }
            const emailPattern =
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          formData.email
        )
      ) {

        setMessage(
          "Please enter a valid email address"
        );

        return;

      }
      if (
    formData.phoneNumber.length !== 10
  ) {

    setMessage(
      "Phone number must contain exactly 10 digits"
    );

    return;

  }
      if (!latitude || !longitude) {

        setMessage(
          "Please select location on map"
        );

        return;

      }

      if (!locationConfirmed) {

        setMessage(
          "Please confirm location"
        );

        return;

      }
      if (
        formData.password.length < 6
      ) {

        setMessage(
          "Password must contain at least 6 characters"
        );

        return;

      }

      try {

        const data =
          new FormData();

        Object.keys(formData)
          .forEach((key) => {

            data.append(
              key,
              formData[key]
            );

          });
          data.append(
          "latitude",
          latitude
        );

        data.append(
          "longitude",
          longitude
        );

        data.append(
          "proofImage",
          proofImage
        );

        const response =
          await fetch(
            ENDPOINTS.VOLUNTEER_REGISTER,
            {
              method: "POST",
              body: data,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {

          throw new Error(
            result.message
          );

        }

        setMessage(
          result.message
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          proofType: "",
        });

        setProofImage(null);
        setLatitude(null);
        setLongitude(null);
        setLocationConfirmed(false);

      } catch (error) {

        setMessage(
          error.message
        );

      }

    };

  return (

    <div className="volunteer-register-page">

      <div className="volunteer-register-card">

        <h1>
          Volunteer Registration
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="text"
            name="name"
            required
            minLength="3"
            placeholder="Full Name"
            onChange={
              handleChange
            }
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={
              handleChange
            }
          />

         <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          maxLength="10"
          pattern="[0-9]{10}"
          value={formData.phoneNumber}
          onChange={(e) => {

            const value =
              e.target.value.replace(
                /\D/g,
                ""
              );

            setFormData({
              ...formData,
              phoneNumber: value,
            });

          }}
          required
        />

          <input
            type="text"
            name="address"
            required
            placeholder="Address"
            onChange={
              handleChange
            }
          />
                    <h3 className="location-heading">
            Select Volunteer Location
          </h3>

          <VolunteerLocationPicker
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />

          <div className="location-info">

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

          </div>

          <label className="confirm-location">

            <input
              type="checkbox"
              checked={
                locationConfirmed
              }
              onChange={(e) =>
                setLocationConfirmed(
                  e.target.checked
                )
              }
            />

            I confirm that the selected
            location is my actual
            location.

          </label>

          <select
            name="proofType"
            required
            onChange={
              handleChange
            }
          >

            <option value="">
              Select Proof
            </option>

            <option value="Aadhar">
              Aadhar Card
            </option>

            <option value="PAN">
              PAN Card
            </option>

            <option value="Driving License">
              Driving License
            </option>

            <option value="Voter ID">
              Voter ID
            </option>

          </select>

          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) =>
              setProofImage(
                e.target.files[0]
              )
            }
          />

          <button
            type="submit"
          >
            Register
          </button>

        </form>

        {message && (
          <p>
            {message}
          </p>
        )}

      </div>

    </div>

  );

}

export default VolunteerRegister;