import React, { useEffect, useState } from "react";
import axios from "axios";

function AboutPage() {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/getData")
      .then((response) => {
        setResponse(response.data);
        console.log("Datenbankverbindung erfolgreich getestet:", response.data);
      })
      .catch((error) => {
        console.error("Fehler bei der Testanfrage:", error);
      });
  }, []);

  return (
    <div>
      <h1>About Page</h1>
      {response.length > 0 ? (
        <div>
          <h2>Usernames from the server:</h2>
          <ul>
            {response.map((user, index) => (
              <li key={index}>{user.username}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default AboutPage;
