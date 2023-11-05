// // Weitere Importe
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   ColorPicker,
//   Button,
//   Typography,
//   Paper,
//   TextField,
// } from "@mui/material";
// import React, { useState } from "react";
// // ...

// function DialogPage() {
//   // ... bestehender Zustand

//   // Zustand für Kategorien und deren Farben
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [categoryColor, setCategoryColor] = useState("#FFFFFF");
//   const [openDialog, setOpenDialog] = useState(false);

//   // Funktion zum Hinzufügen einer neuen Kategorie
//   const addCategory = () => {
//     setCategories([...categories, { name: newCategory, color: categoryColor }]);
//     setNewCategory("");
//     setCategoryColor("#FFFFFF");
//     setOpenDialog(false);
//   };

//   // ...

//   return (
//     <div>
//       {/* ... bestehende Elemente */}

//       {/* Button zum Öffnen des Dialogs */}
//       <Button
//         onClick={() => setOpenDialog(true)}
//         variant="contained"
//         color="primary"
//       >
//         Kategorie hinzufügen
//       </Button>

//       {/* Dialog für neue Kategorien */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Fügen Sie eine neue Kategorie hinzu und wählen Sie eine Farbe für
//             sie.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Kategoriename"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//           />
//           <ColorPicker
//             value={categoryColor}
//             onChange={(color) => setCategoryColor(color)}
//             fullWidth
//             margin="dense"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">
//             Abbrechen
//           </Button>
//           <Button onClick={addCategory} color="primary">
//             Hinzufügen
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Liste der benutzerdefinierten Kategorien */}
//       <Typography variant="h6" sx={{ mt: 2 }}>
//         Benutzerdefinierte Kategorien
//       </Typography>
//       {categories.map((category, index) => (
//         <Paper
//           key={index}
//           style={{
//             backgroundColor: category.color,
//             padding: "10px",
//             marginTop: "10px",
//           }}
//         >
//           <Typography>{category.name}</Typography>
//         </Paper>
//       ))}
//     </div>
//   );
// }

// export default DialogPage;
