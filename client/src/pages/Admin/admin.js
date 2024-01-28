/* Copyright (c) 2023, Jason Oltzen */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import EditUserForm from "./edituser";

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }
  const fetchTransactions = async () => {
    try {
      const transactionsResponse = await axiosInstance.get(
        "/getAllTransactions",
        {
          params: { user_id: searchUserId },
        }
      );

      const categoriesResponse = await axiosInstance.get("/getCategories", {
        params: { user_id: searchUserId },
      });
      const fetchedTransactions = transactionsResponse.data;
      const fetchedCategories = categoriesResponse.data.reduce(
        (acc, category) => {
          acc[category.id] = category.name;
          return acc;
        },
        {}
      );
      const transactionsWithCategoryNames = fetchedTransactions.map(
        (transaction) => ({
          ...transaction,
          category_name:
            fetchedCategories[transaction.category_id] || "Unbekannt",
        })
      );

      setTransactions(transactionsWithCategoryNames);
    } catch (error) {
      console.error(
        "Fehler beim Laden der Transaktionen oder Kategorien:",
        error
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/getUserData", {});
      console.log("res", response.data);
      setAllUsers(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Transaktionen:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditingUser(null);
  };
  const handleEditClick = (editUser) => {
    setEditingUser(editUser);
  };

  // Funktion zum Senden der Bearbeitungsanfrage
  const handleEditSubmit = async (user) => {
    try {
      await axiosInstance.patch("/updateUser", {
        userId: user.id,
        firstname: user.firstname,
        surname: user.surname,
        username: user.username,
        email: user.email,
        admin: user.admin,
      });
      fetchUsers();
    } catch (error) {
      console.error("Fehler bei der Aktualisierung des Benutzers:", error);
    }
  };

  const handleDeleteAccount = async (user_id) => {
    try {
      await axiosInstance.delete("/delete-account", {
        params: { userId: user_id },
      });
    } catch (error) {
      console.error("Failed to delete account", error);
    }
    setAllUsers(allUsers.filter((user) => user.id !== user_id));
  };

  useEffect(() => {
    console.log(user);
    if (user.admin === false) {
      navigate("/dashboard");
    }
    fetchUsers();
    console.log(allUsers);
  }, [user]);

  return (
    <div>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom gutterTop>
          Willkommen auf der Adminseite!
        </Typography>
        {allUsers && (
          <Box>
            <TableContainer component={Paper} elevation={10}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead
                  sx={{
                    backgroundColor: theme.palette.head.main,
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "20px",
                        color: theme.palette.tabletext.main,
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20px",
                        color: theme.palette.tabletext.main,
                      }}
                    >
                      Benutzername
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}>
                      E-Mail
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.tabletext.main,
                      }}
                    >
                      Vorname
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.tabletext.main,
                      }}
                    >
                      Nachname
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.tabletext.main,
                      }}
                    >
                      Admin
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.tabletext.main,
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.tabletext.main,
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: theme.palette.content.main }}>
                  {allUsers.map((users) => {
                    return (
                      <TableRow key={users.id}>
                        <TableCell>{users.id}</TableCell>
                        <TableCell>{users.username}</TableCell>
                        <TableCell>{users.email}</TableCell>
                        <TableCell>{users.firstname}</TableCell>
                        <TableCell>{users.surname}</TableCell>
                        <TableCell>{users.admin ? "Ja" : "Nein"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteAccount(users.id)}
                            style={{ color: "red" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditClick(users)} // Änderung hier
                            style={{ color: "white" }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
      <Container maxWidth="md">
        <Typography
          sx={{ mt: 4, mb: 2, mr: 4 }}
          variant="h5"
          component="h2"
          gutterBottom
        >
          Transaktionen eines Benutzers
        </Typography>
        <TextField
          label="User ID"
          variant="outlined"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          sx={{ mt: 2, mb: 4, mr: 4 }}
        />
        <Button
          sx={{ mt: 2, mb: 4, mr: 4 }}
          variant="contained"
          onClick={fetchTransactions}
        >
          Transaktionen suchen
        </Button>
        <TableContainer component={Paper} elevation={10}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: theme.palette.head.main,
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    width: "20px",
                    color: theme.palette.tabletext.main,
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    width: "20px",
                    color: theme.palette.tabletext.main,
                  }}
                >
                  Benutzer ID
                </TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>
                  Transaktionstyp
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.tabletext.main,
                  }}
                >
                  Betrag
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.tabletext.main,
                  }}
                >
                  Beschreibung
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.tabletext.main,
                  }}
                >
                  Datum
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.tabletext.main,
                  }}
                >
                  Kategorie
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.tabletext.main,
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.transaction_id}</TableCell>
                  <TableCell>{transaction.user_id}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {formatDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell>{transaction.category_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default AdminPage;
