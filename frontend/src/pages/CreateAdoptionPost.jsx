import "./CreateAdoptionPost.css";
import { useState } from "react";

function CreateAdoptionPost({ onClose, onSuccess }) {

  const [formData, setFormData] =
    useState({

      animalName: "",
      animalType: "",
      breed: "",
      age: "",
      gender: "",
      vaccinationStatus: "",
      foodHabits: "",
      petNature: "",
      description: "",
      location: "",
      contactNumber: "",

    });

 const [images, setImages] =
  useState([]);

  const [loading, setLoading] =
    useState(false);

  function handleChange(e) {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  }

  async function handleSubmit(e) {
    e.preventDefault();

        if (
        images.length === 0
        ) {

        alert(
            "Please upload at least one image"
        );

        return;

        }

                  if (
                !/^[0-9]{10}$/.test(
                    formData.contactNumber
                )
                ) {

  alert(
    "Contact number must contain exactly 10 digits"
  );

  return;
}

       const requiredFields = [

  "animalName",
  "animalType",
  "breed",
  "age",
  "gender",
  "vaccinationStatus",
  "foodHabits",
  "petNature",
  "description",
  "location",
  "contactNumber",

];
for (
  const field
  of requiredFields
) {

  if (
    !formData[field]
      ?.trim()
  ) {

    alert(
      "Please fill all fields"
    );

    return;
  }

}

    try {

      setLoading(true);

      const data =
        new FormData();

      Object.entries(
        formData
      ).forEach(
        ([key, value]) => {

          data.append(
            key,
            value
          );

        }
      );

    images.forEach(
        (image) => {

            data.append(
            "images",
            image
            );

        }
        );


      const response =
        await fetch(

          "https://pawresq-api.onrender.com/api/adoptions",

          {

            method: "POST",

            body: data,

          }

        );

      const result =
        await response.json();

      if (result.success) {

        alert(
          "Adoption post created successfully"
        );

        onSuccess();

        onClose();

      }

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create adoption post"
      );

    }

    setLoading(false);

  }

  return (

    <div className="adoption-modal">

      <div className="adoption-form-card">

        <h2>
          Create Adoption Post
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="text"
            name="animalName"
            placeholder="Animal Name"
            required
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="animalType"
            placeholder="Animal Type"
            required
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="breed"
            placeholder="Breed"
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="age"
            placeholder="Age"
            required
            onChange={
              handleChange
            }
          />

          <select
            name="gender"
            required
            onChange={
              handleChange
            }
          >

            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

          </select>

          <select
            name="vaccinationStatus"
            required
            onChange={
              handleChange
            }
          >

            <option value="">
              Vaccination Status
            </option>

            <option value="Vaccinated">
              Vaccinated
            </option>

            <option value="Not Vaccinated">
              Not Vaccinated
            </option>

          </select>

          <input
            type="text"
            name="foodHabits"
            placeholder="Food Habits"
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="petNature"
            placeholder="Pet Nature"
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            onChange={
              handleChange
            }
          />

        <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            maxLength="10"
            pattern="[0-9]{10}"
            required
            value={formData.contactNumber}
            onChange={(e) => {

                const value =
                e.target.value
                .replace(/\D/g, "");

                setFormData({

                ...formData,

                contactNumber:
                    value,

                });

            }}
            />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            onChange={
              handleChange
            }
          />

       <input
            type="file"
            multiple
            accept="image/*"
            required
            onChange={(e) =>
                setImages(
                [...e.target.files]
                )
            }
            />

           {
    images.length > 0 && (

        <div className="image-preview-grid">

        {
            images.map(
            (image, index) => (

                <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="preview"
                className="preview-image"
                />

            )
            )
        }

        </div>

    )
    } 

          <div className="form-buttons">

            <button
              type="submit"
              className="submit-btn"
            >

              {
                loading
                  ? "Posting..."
                  : "Create Adoption Post"
              }

            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={
                onClose
              }
            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default CreateAdoptionPost;