import "./VolunteerDashboard.css";

function VolunteerDashboard() {

  const volunteer =
    JSON.parse(
      localStorage.getItem(
        "volunteer"
      )
    );

  return (

    <div className="volunteer-dashboard">

      <h1>
        Welcome,
        {" "}
        {volunteer?.name}
      </h1>

      <div className="dashboard-card">

        <h2>
          Emergency Cases
        </h2>

        <p>
          No emergency cases available.
        </p>

      </div>

    </div>

  );

}

export default VolunteerDashboard;