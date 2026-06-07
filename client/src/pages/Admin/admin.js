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
import { useAuth } from "../../core/auth/auth";
import {
  deleteUserData,
  getAllTransactions,
  getAllUsers,
  getCategories,
  updateUserProfile,
} from "../../services/db";
import EditUserForm from "./edituser";

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
  }

  const fetchTransactions = async () => {
    try {
      const [fetchedTransactions, cats] = await Promise.all([
        getAllTransactions(searchUserId),
        getCategories(searchUserId),
      ]);
      const categoryMap = cats.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});
      setTransactions(
        fetchedTransactions.map((t) => ({
          ...t,
          category_name: categoryMap[t.category_id] || "Unbekannt",
        }))
      );
    } catch (error) {
      console.error("Fehler beim Laden der Transaktionen oder Kategorien:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setAllUsers(await getAllUsers());
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    }
  };

  const handleCancelEdit = () => setEditingUser(null);
  const handleEditClick = (editUser) => setEditingUser(editUser);

  const handleEditSubmit = async (editedUser) => {
    try {
      await updateUserProfile(editedUser.id, {
        firstname: editedUser.firstname,
        surname: editedUser.surname,
        username: editedUser.username,
        email: editedUser.email,
        admin: editedUser.admin,
      });
      fetchUsers();
    } catch (error) {
      console.error("Fehler bei der Aktualisierung des Benutzers:", error);
    }
  };

  const handleDeleteAccount = async (userId) => {
    try {
      await deleteUserData(userId);
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete account", error);
    }
  };

  useEffect(() => {
    if (user.admin === false) {
      navigate("/dashboard");
    }
    fetchUsers();
  }, [user]);

  return (
    <div>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Willkommen auf der Adminseite!
        </Typography>
        {allUsers && (
          <Box>
            <TableContainer component={Paper} elevation={10}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: theme.palette.head.main }}>
                  <TableRow>
                    <TableCell sx={{ width: "20px", color: theme.palette.tabletext.main }}>ID</TableCell>
                    <TableCell sx={{ width: "20px", color: theme.palette.tabletext.main }}>Benutzername</TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}>E-Mail</TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}>Vorname</TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}>Nachname</TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}>Admin</TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}></TableCell>
                    <TableCell sx={{ color: theme.palette.tabletext.main }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: theme.palette.content.main }}>
                  {allUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.firstname}</TableCell>
                      <TableCell>{u.surname}</TableCell>
                      <TableCell>{u.admin ? "Ja" : "Nein"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteAccount(u.id)} style={{ color: "red" }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(u)} style={{ color: "white" }}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
      <Container maxWidth="md">
        <Typography sx={{ mt: 4, mb: 2, mr: 4 }} variant="h5" component="h2" gutterBottom>
          Transaktionen eines Benutzers
        </Typography>
        <TextField
          label="User ID"
          variant="outlined"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          sx={{ mt: 2, mb: 4, mr: 4 }}
        />
        <Button sx={{ mt: 2, mb: 4, mr: 4 }} variant="contained" onClick={fetchTransactions}>
          Transaktionen suchen
        </Button>
        <TableContainer component={Paper} elevation={10}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.head.main }}>
              <TableRow>
                <TableCell sx={{ width: "20px", color: theme.palette.tabletext.main }}>ID</TableCell>
                <TableCell sx={{ width: "20px", color: theme.palette.tabletext.main }}>Benutzer ID</TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>Transaktionstyp</TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>Betrag</TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>Beschreibung</TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>Datum</TableCell>
                <TableCell sx={{ color: theme.palette.tabletext.main }}>Kategorie</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.transaction_id}>
                  <TableCell>{t.transaction_id}</TableCell>
                  <TableCell>{t.user_id}</TableCell>
                  <TableCell>{t.transaction_type}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{formatDate(t.transaction_date)}</TableCell>
                  <TableCell>{t.category_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {editingUser && (
        <EditUserForm user={editingUser} onSubmit={handleEditSubmit} onCancel={handleCancelEdit} />
      )}
    </div>
  );
}

export default AdminPage;
