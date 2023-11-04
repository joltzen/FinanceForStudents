import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import Page from "../../components/page";

function DashboardPage() {
  const [response, setResponse] = useState([]);
  const { user } = useAuth();
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
    <Page>
      <h1>Dashboard Page</h1>
      {user && response.length > 0 ? (
        <>
          <h2>
            Willkommen {user.firstname} {user.surname}!
          </h2>
        </>
      ) : (
        <></>
      )}
    </Page>
  );
}

export default DashboardPage;
