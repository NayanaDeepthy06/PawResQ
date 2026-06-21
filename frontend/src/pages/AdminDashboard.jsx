import "./AdminDashboard.css";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";

function AdminDashboard() {

  const [ngos, setNgos] = useState([]);
   
  const [approvedNGOs, setApprovedNGOs] = useState([]);
  const [
  pendingVolunteers,
  setPendingVolunteers,
] = useState([]);

const [
  approvedVolunteers,
  setApprovedVolunteers,
] = useState([]);
  
 

 useEffect(() => {
  fetchPendingNGOs();
  fetchApprovedNGOs();
  fetchPendingVolunteers();
  fetchApprovedVolunteers();
}, []);

  async function fetchPendingNGOs() {

    try {

      const response =
        await fetch(
          "https://pawresq-api.onrender.com/api/admin/pending-ngos"
        );

      const data =
        await response.json();

      setNgos(data.ngos || []);

    } catch (error) {

      console.error(error);

    }
  }
  async function fetchApprovedNGOs() {

  try {

    const response =
      await fetch(
        "https://pawresq-api.onrender.com/api/admin/approved-ngos"
      );

    const data =
      await response.json();

    setApprovedNGOs(
      data.ngos || []
    );

  } catch (error) {

    console.error(error);

  }

}


  async function approveNGO(
    ngoId
  ) {

    try {

      const response =
        await fetch(
          `https://pawresq-api.onrender.com/api/admin/ngo/${ngoId}/approve`,
          {
            method: "PATCH",
          }
        );

      const data =
        await response.json();

      alert(data.message);

      fetchPendingNGOs();
      fetchApprovedNGOs();

    } catch (error) {

      console.error(error);

      alert(
        "Approval Failed"
      );
    }
  }

  async function fetchPendingVolunteers() {

  try {

    const response =
      await fetch(
        "https://pawresq-api.onrender.com/api/admin/pending-volunteers"
      );

    const data =
      await response.json();

    if (data.success) {

      setPendingVolunteers(
        data.volunteers
      );

    }

  } catch (error) {

    console.error(error);

  }

}

async function fetchApprovedVolunteers() {

  try {

    const response =
      await fetch(
        "https://pawresq-api.onrender.com/api/admin/approved-volunteers"
      );

    const data =
      await response.json();

    if (data.success) {

      setApprovedVolunteers(
        data.volunteers
      );

    }

  } catch (error) {

    console.error(error);

  }

}

async function approveVolunteer(
  volunteerId
) {

  try {

    const response =
      await fetch(

        `https://pawresq-api.onrender.com/api/admin/approve-volunteer/${volunteerId}`,

        {
          method: "PATCH",
        }

      );

    const data =
      await response.json();

    if (data.success) {

      fetchPendingVolunteers();

      fetchApprovedVolunteers();

    }

  } catch (error) {

    console.error(error);

  }

}

  return (

    <div className="admin-page">

      <h1>
        Pending NGO Approvals
      </h1>

      {ngos.length === 0 ? (

        <p>
          No Pending NGOs
        </p>

      ) : (

        ngos.map((ngo) => (

          <div
            key={ngo._id}
            className="ngo-card"
          >

            <h3>{ngo.ngoName}</h3>

        <p>
          <FaEnvelope />
          {" "}
          Email: {ngo.email}
        </p>

        <p>
          <FaPhone />
          {" "}
          Phone: {ngo.phoneNumber}
        </p>

        <p>
          <FaMapMarkerAlt />
          {" "}
          Address: {ngo.address}
        </p>

        <p>
          Latitude:
          {" "}
          {ngo.latitude?.toFixed(6)}
        </p>

        <p>
          Longitude:
          {" "}
          {ngo.longitude?.toFixed(6)}
        </p>

        <p>
          <FaCheckCircle />
          {" "}
          Status:
          {" "}
          {ngo.verificationStatus}
        </p>

            <button
            onClick={() =>
              approveNGO(ngo._id)
            }
          >
            Approve & Verify NGO
          </button>

          </div>

        ))

      )}

      <h1>
  Approved NGOs
</h1>

{
approvedNGOs.map((ngo) => (

<div
  key={ngo._id}
  className="ngo-card"
>

  <h3>{ngo.ngoName}</h3>

  <p>
    <FaEnvelope />
    {" "}
    Email: {ngo.email}
  </p>

  <p>
    <FaPhone />
    {" "}
    Phone: {ngo.phoneNumber}
  </p>

  <p>
    <FaMapMarkerAlt />
    {" "}
    Address: {ngo.address}
  </p>

<p>
  <FaCheckCircle />
  {" "}
  Status:
  <span className="status-approved">
    Approved
  </span>
</p>

</div>

))
}
<h1>
  Pending Volunteer Approvals
</h1>

{
pendingVolunteers.length === 0 ? (

  <p>
    No Pending Volunteers
  </p>

) : (

  pendingVolunteers.map(
    (volunteer) => (

      <div
        key={volunteer._id}
        className="ngo-card"
      >

        <h3>
          {volunteer.name}
        </h3>

        <p>
          <FaEnvelope />
          {" "}
          Email:
          {" "}
          {volunteer.email}
        </p>

        <p>
          <FaPhone />
          {" "}
          Phone:
          {" "}
          {volunteer.phoneNumber}
        </p>

        <p>
          <FaMapMarkerAlt />
          {" "}
          Address:
          {" "}
          {volunteer.address}
        </p>

        <p>
          Proof Type:
          {" "}
          {volunteer.proofType}
        </p>

        {
          volunteer.proofImageUrl && (

            <div className="volunteer-proof-section">

              <img
                src={volunteer.proofImageUrl}
                alt="Proof"
                className="proof-image"
              />

              <button
                className="approve-volunteer-btn"
                onClick={() =>
                  approveVolunteer(
                    volunteer._id
                  )
                }
              >
                Approve Volunteer
              </button>

            </div>

          )
        }

      </div>

    )
  )

)
}

<h1>
  Approved Volunteers
</h1>

{
approvedVolunteers.length === 0 ? (

  <p>
    No Approved Volunteers
  </p>

) : (

  approvedVolunteers.map(
    (volunteer) => (

      <div
        key={volunteer._id}
        className="ngo-card"
      >

        <h3>
          {volunteer.name}
        </h3>

        <p>
          <FaEnvelope />
          {" "}
          Email:
          {" "}
          {volunteer.email}
        </p>

        <p>
          <FaPhone />
          {" "}
          Phone:
          {" "}
          {volunteer.phoneNumber}
        </p>

        <p>
          <FaMapMarkerAlt />
          {" "}
          Address:
          {" "}
          {volunteer.address}
        </p>

        <p> 
          <FaCheckCircle />
          {" "}
        Status:
        <span
          style={{
            color:"#1a7a4a",
            fontWeight:"700",
            marginLeft:"8px",
          }}
        >
          Approved
        </span>
      </p>

      </div>

    )
  )

)
}

</div>

);

}

export default AdminDashboard;