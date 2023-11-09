import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import Page from "../../components/page";
function AboutPage() {
  const [response, setResponse] = useState([]);
  const { user, logout } = useAuth();
  useEffect(() => {
    axiosInstance
      .get("/getData")
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        console.error("Fehler bei der Testanfrage:", error);
      });
  }, []);

  return (
    <Page>
      <h1>About Page</h1>
      {user && <p>Welcome, {user.username}!</p>}
      {response.length > 0 ? (
        <div>
          <h2>Usernames from the server:</h2>
          <ul>
            {response.map((user, index) => (
              <>
                <li key={index}>{user.username}</li>
                <li key={index + 1}>{user.password}</li>
              </>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </Page>
  );
}

export default AboutPage;
