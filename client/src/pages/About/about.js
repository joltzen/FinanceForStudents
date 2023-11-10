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
    </Page>
  );
}

export default AboutPage;
