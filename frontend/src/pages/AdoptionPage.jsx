import "./AdoptionPage.css";
import { useEffect, useState } from "react";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import CreateAdoptionPost from "./CreateAdoptionPost";

function AdoptionPage() {

  const [showForm, setShowForm] =
    useState(false);

  const [adoptions, setAdoptions] =
    useState([]);
  
  const [search, setSearch] =
  useState("");
  const [currentImages, setCurrentImages] =
  useState({});  

 const [animalFilter, setAnimalFilter] =
  useState("");

const [genderFilter, setGenderFilter] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState(""); 

  useEffect(() => {

    fetchAdoptions();

  }, []);

  async function fetchAdoptions() {

    try {

      const response =
        await fetch(
          "https://pawresq-api.onrender.com/api/adoptions"
        );

      const data =
        await response.json();

      setAdoptions(
        data.adoptions || []
      );

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <div className="adoption-page">

      <section className="adoption-hero">

        <h1>
          Find Your Furever Friend
        </h1>

        <p>
          Give rescued animals
          a loving forever home.
        </p>

        <button
          className="create-post-btn"
          onClick={() =>
            setShowForm(true)
          }
        >

          <FaPlus />

          Create Adoption Post

        </button>

      </section>

      <div className="search-section">

      <input
        type="text"
        placeholder="Search animals..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

    </div>
       <div className="filter-section">

  <select
    value={animalFilter}
    onChange={(e) =>
      setAnimalFilter(
        e.target.value
      )
    }
  >

    <option value="">
      All Animals
    </option>

    <option value="dog">
        Dog
      </option>

      <option value="cat">
        Cat
      </option>

      <option value="bird">
        Bird
      </option>

      <option value="cow">
        Cow
      </option>

  </select>

  <select
    value={genderFilter}
    onChange={(e) =>
      setGenderFilter(
        e.target.value
      )
    }
  >

    <option value="">
      All Genders
    </option>

    <option value="Male">
      Male
    </option>

    <option value="Female">
      Female
    </option>

  </select>

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(
        e.target.value
      )
    }
  >

    <option value="">
      All Status
    </option>

    <option value="Available">
      Available
    </option>

    <option value="Reserved">
      Reserved
    </option>

    <option value="Adopted">
      Adopted
    </option>

  </select>

</div>

      <section className="adoption-feed">

        {
          adoptions.length === 0 ? (

            <div className="empty-state">

              <h2>
                No Adoption Posts Yet
              </h2>

              <p>
                Be the first to help
                an animal find a home.
              </p>

            </div>

          ) : (

            <div className="adoption-grid">

              {
  adoptions

    .filter((pet) => {

  const matchesSearch =

    pet.animalName
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    pet.animalType
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    pet.breed
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );

 const matchesAnimal =

  !animalFilter ||

  pet.animalType
    ?.toLowerCase() ===

  animalFilter
    .toLowerCase();

 const matchesGender =

  !genderFilter ||

  pet.gender
    ?.toLowerCase() ===
  genderFilter
    .toLowerCase();
  
 
  const matchesStatus =

  !statusFilter ||

  pet.adoptionStatus ===
  statusFilter;  

  return (

    matchesSearch &&

    matchesAnimal &&

    matchesGender &&

    matchesStatus

  );

})

    .map(
      (pet) => (

                    <div
                      key={pet._id}
                      className="adoption-card"
                    >

                      <div className="image-slider">

  <img
    src={
      pet.images?.[
        currentImages[
          pet._id
        ] || 0
      ]
    }
    alt={pet.animalName}
  />

  {
    pet.images?.length > 1 && (
      <>
        <button
          className="slider-btn left"
          onClick={() => {

            setCurrentImages(
              (prev) => ({

                ...prev,

                [pet._id]:
                  (
                    (prev[
                      pet._id
                    ] || 0) -
                    1 +
                    pet.images.length
                  ) %
                  pet.images.length,

              })
            );

          }}
        >

          ‹

        </button>

        <button
          className="slider-btn right"
          onClick={() => {

            setCurrentImages(
              (prev) => ({

                ...prev,

                [pet._id]:
                  (
                    (prev[
                      pet._id
                    ] || 0) +
                    1
                  ) %
                  pet.images.length,

              })
            );

          }}
        >

          ›

        </button>
      </>
    )
  }

</div>

    {
  pet.images?.length > 1 && (

    <div className="image-counter">

      {
        (currentImages[
          pet._id
        ] || 0) + 1
      }

      /

      {
        pet.images.length
      }

    </div>

  )
}

                      <div className="card-content">

                        <h3>
                          {
                            pet.animalName
                          }
                        </h3>

                        <span className="animal-type">

                            {
                              pet.animalType
                            }

                          </span>

                        <p>

                          <strong>
                            Breed:
                          </strong>
                          {" "}
                          {pet.breed}

                        </p>

                        <p>

                          <strong>
                            Age:
                          </strong>
                          {" "}
                          {pet.age}

                        </p>

                        <p>

                          <strong>
                            Gender:
                          </strong>
                          {" "}
                          {pet.gender}

                        </p>

                        <p>

                          <strong>
                            Vaccination:
                          </strong>
                          {" "}
                          {
                            pet.vaccinationStatus
                          }

                        </p>

                        <p className="location">

                          <FaMapMarkerAlt />

                          {" "}

                          {pet.location}

                        </p>

                        <a
                          href={`tel:${pet.contactNumber}`}
                          className="contact-btn"
                        >

                          Contact Owner

                        </a>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </section>

      {
        showForm && (

          <CreateAdoptionPost

            onClose={() =>
              setShowForm(false)
            }

            onSuccess={
              fetchAdoptions
            }

          />

        )
      }

    </div>

  );

}

export default AdoptionPage;