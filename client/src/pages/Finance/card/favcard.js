import Add from "@mui/icons-material/Add";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";

function FavCard({ theme, favorites, categories, handleAddFavoriteToMonth }) {
  const [selectedDates, setSelectedDates] = useState(
    favorites.reduce(
      (acc, _, index) => ({
        ...acc,
        [index]: new Date().toISOString().slice(0, 10),
      }),
      {}
    )
  );
  const [openStates, setOpenStates] = useState(
    favorites.reduce((states, _, index) => ({ ...states, [index]: false }), {})
  );
  const [showText, setShowText] = useState(false); // State to toggle text visibility

  const handleCollapse = (index) => {
    setOpenStates({ ...openStates, [index]: !openStates[index] });
  };

  const handleDateChange = (index, newDate) => {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [index]: newDate,
    }));
  };

  useEffect(() => {
    setSelectedDates(
      favorites.reduce(
        (acc, _, index) => ({
          ...acc,
          [index]: new Date().toISOString().slice(0, 10),
        }),
        {}
      )
    );
  }, [favorites.length]);

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
        height: "100%",
        marginTop: 1,
        marginRight: 2,
        borderRadius: 5,
      }}
    >
      <CardContent>
        {favorites.length === 0 ? (
          <>
            <Typography variant="h6">Favoriten</Typography>
            <Button
              variant="contained"
              onClick={() => setShowText(!showText)} // Toggle text visibility
              sx={{ mt: 2, borderRadius: 5 }}
            >
              {showText ? "Weniger anzeigen" : "Mehr erfahren"}
            </Button>
            <Collapse in={showText}>
              {/* Collapse component to show/hide text */}
              <Typography variant="body1" sx={{ mt: 2 }}>
                Du hast derzeit noch keine Favoriten. Klicke auf den Button um
                neue Favoriten hinzuzufügen.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Mithilfe der Favoriten kannst du deine regelmäßigen Einnahmen
                und Ausgaben schneller hinzufügen.
              </Typography>
            </Collapse>
            <Button
              variant="contained"
              href="/favorites"
              sx={{ mt: 4, borderRadius: 5 }}
            >
              Favoriten hinzufügen
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Favoriten
            </Typography>
            {favorites.map((favorite, index) => {
              const category = categories.find(
                (cat) => cat.id === favorite.category_id
              );
              const categoryColor = category ? category.color : "#ccc";

              return (
                <Box
                  key={index}
                  sx={{
                    marginBottom: theme.spacing(2),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 2,
                      backgroundColor: theme.palette.favlist.main,
                      borderRadius: `${
                        openStates[index] ? "16px 16px 0 0" : "16px"
                      }`,
                      boxShadow: theme.shadows[1],
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          backgroundColor: categoryColor,
                          marginRight: 2,
                        }}
                      />
                      <Typography variant="body1">
                        <strong>{favorite.description}</strong>
                        <Box component="span" sx={{ mx: 1 }}>
                          {" "}
                        </Box>
                        <strong>{favorite.amount} €</strong>
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleCollapse(index)}
                      color="primary"
                      aria-label="add to month"
                    >
                      {openStates[index] ? (
                        <KeyboardArrowDownOutlinedIcon
                          sx={{ color: theme.palette.text.main }}
                        />
                      ) : (
                        <KeyboardArrowRightOutlinedIcon
                          sx={{ color: theme.palette.text.main }}
                        />
                      )}
                    </IconButton>
                  </Box>
                  <Collapse in={openStates[index]} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        backgroundColor: theme.palette.favlist.main, // Match the background color of the favorite item
                        borderRadius: "0 0 16px 16px", // Adjust the border radius to match the card style
                        boxShadow: theme.shadows[1],
                        borderTop: openStates[index]
                          ? "none"
                          : "1px solid rgba(0, 0, 0, 0.12)", // Remove top border if collapsed
                      }}
                    >
                      <TextField
                        type="date"
                        value={selectedDates[index]}
                        onChange={(e) =>
                          handleDateChange(index, e.target.value)
                        }
                        sx={{ marginRight: theme.spacing(1), flexGrow: 1 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          handleAddFavoriteToMonth(
                            favorite,
                            selectedDates[index]
                          )
                        }
                        color="primary"
                        aria-label="confirm add"
                      >
                        <Add sx={{ color: theme.palette.text.main }} />
                      </IconButton>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default FavCard;
