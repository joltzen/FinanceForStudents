import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => {
  return {
    ...(mode === "dark"
      ? {
          //card.main
          darkBlueishGray: "#262b3d",
          //secondary.main
          gold: "#be9e44",
          //text.main
          lightGray: "#e0e3e9",
          //list.main
          darkGray: "#333740",
          //primary.main
          slateBlue: "#3A415C",
          //icon.main
          brass: "#c6aa60",
          //secondary.light
          lightGold: "#cbb26a",
          //border.main
          steelGray: "#373c47",
          //select.main
          charcoal: "#2e2e38",
          //tablecell.main
          indigoBlue: "#4e577b",
          //background.default
          darkSlateGrey: "#3b3d49",
          //not used
          brightYellow: "#ffce56",
          //budget.main
          neonGreen: "#76ff03",
          //saving.main
          skyBlue: "#4dd0e1",
          //pagination.main
          offWhite: "#fcfcfc",
          //savetext.main
          dustyPink: "#afb1b2",
          //selected.main
          silver: "#d1d1d1",
          //pr.main
          darkCharcoal: "#2c2f36",
          //iconlist.default
          bronzeGold: "#c6aa60",
          //even.main
          lightCoolGray: "#d2d5dc",
          veryDark: "#333540",
        }
      : {
          //card.main
          darkBlueishGray: "#d1d1d1",
          //secondary.main
          gold: "#D4AF37",
          goldIndicator: "#be9e44",
          darkGold: "#8C6D1F",
          //text.main
          lightGray: "#2c2f36",
          //list.main
          darkGray: "#9E9E9E",
          //primary.main
          slateBlue: "#4e577b",
          //icon.main
          brass: "#B87333",
          //secondary.light
          lightGold: "#CD7F32",
          //border.main
          steelGray: "#A0A0A0",
          //select.main
          charcoal: "#d1d1d1",
          //tablecell.main
          indigoBlue: "#6A8EAE",
          //background.default
          darkSlateGrey: "#F0F0F0",
          //not used
          brightYellow: "#FFD700",
          //budget.main
          neonGreen: "#76ff03",
          //saving.main
          skyBlue: "#00BFFF",
          //pagination.main
          offWhite: "#F2F2F2",
          //savetext.main
          dustyPink: "#afb1b2",
          //selected.main
          silver: "#C0C0C0",
          //pr.main
          darkCharcoal: "#9A9D9F",
          //iconlist.default
          bronzeGold: "#D7C3A2",
          //even.main
          lightCoolGray: "#ECEDEF",
        }),
  };
};

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.slateBlue,
            },
            secondary: {
              main: colors.gold,
              light: colors.lightGold,
            },
            profile: {
              main: colors.gold,
            },
            budget: {
              main: colors.neonGreen,
            },
            saving: {
              main: colors.skyBlue,
            },
            text: {
              main: colors.lightGray,
            },
            card: {
              main: colors.darkBlueishGray,
            },
            list: {
              main: colors.darkGray,
            },
            icon: {
              main: colors.brass,
            },
            indicator: {
              main: colors.brass,
            },
            border: {
              main: colors.steelGray,
            },
            select: {
              main: colors.charcoal,
            },
            tablecell: {
              main: colors.indigoBlue,
            },
            background: {
              default: colors.darkSlateGrey,
            },
            pagination: {
              main: colors.dustyPink,
            },
            savetext: {
              main: colors.silver,
            },
            selected: {
              main: colors.bronzeGold,
            },
            pr: {
              main: colors.darkCharcoal,
            },
            even: {
              main: colors.dustyPink,
            },
            uneven: {
              main: colors.lightCoolGray,
            },
            iconlist: {
              default: "#ffffff",
            },
            navbar: {
              main: colors.blue,
            },
            table: {
              main: "black",
            },
            tablehead: {
              main: "black",
            },
            tabletext: {
              main: "white",
            },
            selectBackground: {
              main: colors.veryDark,
            },
            components: {
              MuiTableCell: {
                styleOverrides: {
                  root: {
                    color: "black", // Set your desired color here
                  },
                },
              },
            },
          }
        : {
            primary: {
              main: colors.slateBlue,
            },
            secondary: {
              main: colors.gold,
              light: colors.lightGold,
            },
            profile: {
              main: colors.darkGold,
            },
            budget: {
              main: colors.neonGreen,
            },
            saving: {
              main: colors.skyBlue,
            },
            text: {
              main: colors.lightGray,
            },
            card: {
              main: colors.darkBlueishGray,
            },
            list: {
              main: colors.darkGray,
            },
            icon: {
              main: colors.brass,
            },
            indicator: {
              main: colors.darkGold,
            },
            border: {
              main: colors.steelGray,
            },
            select: {
              main: colors.charcoal,
            },
            tablecell: {
              main: colors.indigoBlue,
            },
            background: {
              default: colors.darkSlateGrey,
            },
            pagination: {
              main: colors.dustyPink,
            },
            savetext: {
              main: colors.silver,
            },
            selected: {
              main: colors.bronzeGold,
            },
            pr: {
              main: colors.darkCharcoal,
            },
            even: {
              main: colors.steelGray,
            },
            uneven: {
              main: colors.lightCoolGray,
            },
            iconlist: {
              default: "#ffffff",
            },
            navbar: {
              main: colors.blue,
            },
            table: {
              main: "black",
            },
            tablehead: {
              main: "black",
            },
            tabletext: {
              main: "white",
            },
            selectBackground: {
              main: colors.veryDark,
            },
            components: {
              MuiTableCell: {
                styleOverrides: {
                  root: {
                    color: "black", // Set your desired color here
                  },
                },
              },
            },
          }),
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState(() => {
    // Check if theme mode is saved in local storage
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "dark"; // Default to 'light' if not found
  });

  useEffect(() => {
    // Save the mode to local storage whenever it changes
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
