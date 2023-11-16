import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        darkBlueishGray: "#262b3d",
        gold: "#be9e44",
        lightGray: "#e0e3e9",
        darkGray: "#333740",
        slateBlue: "#3A415C",
        brass: "#c6aa60",
        lightGold: "#cbb26a",
        steelGray: "#373c47",
        charcoal: "#2e2e38",
        indigoBlue: "#4e577b",
        darkSlateGrey: "#3b3d49",
        brightYellow: "#ffce56",
        neonGreen: "#76ff03",
        skyBlue: "#4dd0e1",
        offWhite: "#fcfcfc",
        dustyPink: "#afb1b2",
        silver: "#d1d1d1",
        darkCharcoal: "#2c2f36",
        bronzeGold: "#c6aa60",
        lightCoolGray: "#d2d5dc",
      }
    : {
        darkBlueishGray: "#262b3d",
        gold: "#be9e44",
        lightGray: "#e0e3e9",
        darkGray: "#333740",
        slateBlue: "#3A415C",
        brass: "#c6aa60",
        lightGold: "#cbb26a",
        steelGray: "#373c47",
        charcoal: "#2e2e38",
        indigoBlue: "#4e577b",
        darkSlateGrey: "#3b3d49",
        brightYellow: "#ffce56",
        neonGreen: "#76ff03",
        skyBlue: "#4dd0e1",
        offWhite: "#fcfcfc",
        dustyPink: "#afb1b2",
        silver: "#d1d1d1",
        darkCharcoal: "#2c2f36",
        bronzeGold: "#c6aa60",
        lightCoolGray: "#d2d5dc",
      }),
});

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
            budget: {
              main: colors.brightYellow,
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
            black: {
              default: "#000000",
            },
            even: {
              main: colors.lightCoolGray,
            },
            iconlist: {
              default: "#ffffff",
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
            budget: {
              main: colors.brightYellow,
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
            black: {
              default: "#000000",
            },
            even: {
              main: colors.lightCoolGray,
            },
            iconlist: {
              default: "#ffffff",
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
    return savedMode ? savedMode : "light"; // Default to 'light' if not found
  });

  useEffect(() => {
    // Save the mode to local storage whenever it changes
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
