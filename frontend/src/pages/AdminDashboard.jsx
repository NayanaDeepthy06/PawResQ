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
  
 

 useEffect(() => {
  fetchPendingNGOs();
  fetchApprovedNGOs();
}, []);

  async function fetchPendingNGOs() {

    try {

      const response =
        await fetch(
          "http://localhost:5001/api/admin/pending-ngos"
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
        "http://localhost:5001/api/admin/approved-ngos"
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
          `http://localhost:5001/api/admin/ngo/${ngoId}/approve`,
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

</div>

))
}

    </div>

  );
}

export default AdminDashboard;