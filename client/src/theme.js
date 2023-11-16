import { createContext, useState, useMemo } from "react";
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
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
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
            button: {
              main: "#4E577B",
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
            navicons: {
              main: "#c6aa60",
            },
            black: {
              default: "#000000",
            },
            iconlist: {
              default: "#ffffff",
            },
          }
        : {
            primary: {
              main: "#3A415C",
            },
            button: {
              main: "#4E577B",
            },
            text: {
              main: "#e0e3e9",
            },
            input: {
              main: "#2e2e38",
            },
            navicons: {
              main: "#c6aa60",
            },
            background: {
              default: "#000000",
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
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
