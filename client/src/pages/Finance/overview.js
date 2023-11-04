import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../core/auth/auth";
import Page from "../../components/page";
import { FormControl, InputLabel, Select, Box } from "@mui/material";

function FinanceOverview() {
  const [response, setResponse] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // JavaScript months are 0-indexed
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);

  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getUserTransactions",
        {
          params: {
            month: filterMonth,
            year: filterYear,
            user_id: user.id,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Handle error here
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterMonth, filterYear]);

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel style={{ color: "white" }}>Monat</InputLabel>
        <Select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          label="Monat"
          style={{ color: "white" }}
        >
          {/* Map through months */}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel style={{ color: "white" }}>Jahr</InputLabel>
        <Select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          label="Monat"
          style={{ color: "white" }}
        >
          {/* Map through months */}
        </Select>
      </FormControl>
      <Box sx={{ maxHeight: 300, overflow: "auto" }}>
        {transactions.map((transaction) => (
          <div key={transaction.id}>{/* Display transaction details */}</div>
        ))}
      </Box>
    </div>
  );
}

export default FinanceOverview;
