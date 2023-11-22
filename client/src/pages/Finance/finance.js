/* Copyright (c) 2023, Jason Oltzen */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import SelectComp from "../../components/SelectComp";
import TextComp from "../../components/TextComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import FinanceOverview from "./overview";
import Add from "@mui/icons-material/Add";
import AddTransaction from "./addtransaction";
function FinancePage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Ausgabe");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const triggerUpdate = () => {
    setUpdateNeeded((prev) => !prev);
  };

  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setUpdate(!update);
    setOpenDialog(false);
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const getCurrentCategoryColor = () => {
    const currentCategory = categories.find((cat) => cat.id === category);
    return currentCategory ? currentCategory.color : "defaultColor";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/addTransaction", {
        date,
        description,
        amount,
        transactionType,
        user_id: user.id,
        category_id: category,
      });
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        response.data.transaction,
      ]);
      setAmount("");
      setDescription("");
      setDate(date);
      setTransactionType("Ausgabe");
      setCategory(category);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00ff) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000ff) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategory(response.data[0].id);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };
    fetchCategories();
  }, [user.id, update, categories, triggerUpdate]);

  return (
    <Grid item xs={12} md={8} lg={6}>
      <AddTransaction
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        theme={theme}
        handleSubmit={handleSubmit}
        description={description}
        handleDescriptionChange={handleDescriptionChange}
        amount={amount}
        handleAmountChange={handleAmountChange}
        transactionType={transactionType}
        handleTransactionTypeChange={handleTransactionTypeChange}
        categories={categories}
        category={category}
        setCategory={setCategory}
        date={date}
        handleDateChange={handleDateChange}
      />

      <FinanceOverview
        update={update}
        handleOpenDialog={handleOpenDialog}
        triggerUpdate={triggerUpdate}
      />
    </Grid>
  );
}

export default FinancePage;
