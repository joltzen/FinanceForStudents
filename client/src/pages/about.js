import React, { useEffect, useState } from "react";
import axios from "axios";

function AboutPage() {
  const [response, setResponse] = useState();

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
      {response && (
        <div>
          <h2>Response from the server:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AboutPage;
