import Add from "@mui/icons-material/Add";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

function FavCard({ theme, favorites, categories, handleAddFavoriteToMonth }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        boxShadow: theme.shadows[6],
        "&:hover": {
          boxShadow: theme.shadows[10],
        },
        height: "100%",
        marginTop: 2,
        marginRight: 4,
      }}
    >
      <CardContent>
        {favorites.length === 0 ? (
          <>
            <Typography variant="h6">Favoriten </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Du hast derzeit noch keine Favoriten. Klicke auf den Button um
              neue Favoriten hinzuzufügen.
            </Typography>
            <Typography variant="body1">
              Mithilfe der Favoriten kannst du deine regelmäßigen Einnahmen und
              Ausgaben schneller hinzufügen.
            </Typography>
            <Button variant="contained" href="/favorites" sx={{ mt: 4 }}>
              Favoriten hinzufügen
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Favoriten
            </Typography>
            {favorites?.map((favorite, index) => {
              const category = categories.find(
                (cat) => cat.id === favorite.category_id
              );
              const categoryColor = category ? category.color : "#ccc"; // Default color if not found

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 2,
                    marginBottom: 1,
                    backgroundColor: theme.palette.favlist.main,
                    borderRadius: theme.shape.borderRadius,
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
                      <strong>{favorite.description} </strong>
                      <strong>{favorite.amount} €</strong>
                    </Typography>
                  </Box>
                  {/* <IconButton
                            onClick={() =>
                              handleDeleteFavoritesById(favorite.favorites_id)
                            }
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton> */}
                  <IconButton
                    onClick={() => handleAddFavoriteToMonth(favorite)}
                    color="primary"
                    aria-label="add to month"
                  >
                    <Add sx={{ color: theme.palette.text.main }} />
                  </IconButton>
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
