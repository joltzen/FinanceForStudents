/* Copyright (c) 2026, Jason Oltzen */

import { createTheme } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";

export const tokens = (mode) => {
  return {
    ...(mode === "dark"
      ? {
          darkBlueishGray: "#1b2030",
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
          brightYellow: "#FFD700",
          neonGreen: "#65C023",
          skyBlue: "#4dd0e1",
          offWhite: "#fcfcfc",
          dustyPink: "#afb1b2",
          silver: "#d1d1d1",
          darkCharcoal: "#2c2f36",
          bronzeGold: "#c6aa60",
          lightCoolGray: "#d2d5dc",
          veryDark: "#333540",
          teal: "#00bfa5",
          orange: "#ffab00",
          purple: "#536dfe",
          nav: "#1e2338",
        }
      : {
          darkBlueishGray: "#d1d1d1",
          gold: "#D4AF37",
          goldIndicator: "#be9e44",
          darkGold: "#8C6D1F",
          lightGray: "#2c2f36",
          darkGray: "#9E9E9E",
          slateBlue: "#4e577b",
          brass: "#B87333",
          lightGold: "#CD7F32",
          steelGray: "#A0A0A0",
          charcoal: "#d1d1d1",
          indigoBlue: "#6A8EAE",
          darkSlateGrey: "#F0F0F0",
          brightYellow: "#FFD700",
          neonGreen: "#65C023",
          skyBlue: "#00BFFF",
          offWhite: "#F2F2F2",
          dustyPink: "#afb1b2",
          silver: "#C0C0C0",
          darkCharcoal: "#9A9D9F",
          bronzeGold: "#D7C3A2",
          lightCoolGray: "#ECEDEF",
          teal: "#00bfa5",
          orange: "#ffab00",
          purple: "#536dfe",
          darkCharcoal2: "#2c2f36",
          nav: "#4e577b",
        }),
  };
};

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.18)" },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { borderRadius: 0 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 0.15s",
            "&:hover": {
              backgroundColor:
                mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { opacity: 0.6 },
        },
      },
    },
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: { main: colors.slateBlue },
            secondary: { main: colors.gold, light: colors.lightGold },
            profile: { main: colors.gold },
            budget: { main: colors.neonGreen },
            saving: { main: colors.skyBlue },
            text: { main: colors.lightGray },
            card: { main: colors.darkBlueishGray },
            right: { main: colors.darkBlueishGray },
            list: { main: colors.darkSlateGrey },
            icon: { main: colors.brass },
            indicator: { main: colors.lightGold },
            border: { main: colors.steelGray },
            select: { main: colors.charcoal },
            tablecell: { main: colors.indigoBlue },
            favlist: { main: colors.slateBlue },
            background: { default: "#0f1322" },
            pagination: { main: colors.dustyPink },
            savetext: { main: colors.silver },
            selected: { main: colors.bronzeGold },
            pr: { main: colors.darkCharcoal },
            left: { main: colors.darkCharcoal },
            even: { main: colors.dustyPink },
            uneven: { main: colors.lightCoolGray },
            iconlist: { default: "#ffffff" },
            nav: { main: colors.nav },
            navbar: { main: colors.nav },
            table: { main: "black" },
            tablehead: { main: "black" },
            tabletext: { main: "black" },
            selectBackground: { main: colors.veryDark },
            monthly: { main: colors.teal },
            task: { main: colors.orange },
            total: { main: colors.purple },
            favorites: { main: colors.brightYellow },
            head: { main: "#cccccc" },
            content: { main: "#444444" },
            add: { main: "#252D4C" },
          }
        : {
            primary: { main: colors.slateBlue },
            secondary: { main: colors.gold, light: colors.lightGold },
            profile: { main: colors.darkGold },
            budget: { main: colors.neonGreen },
            saving: { main: colors.skyBlue },
            text: { main: colors.lightGray },
            card: { main: colors.darkBlueishGray },
            right: { main: colors.darkCharcoal2 },
            list: { main: colors.darkGray },
            icon: { main: colors.brass },
            indicator: { main: colors.darkGold },
            border: { main: colors.steelGray },
            select: { main: colors.charcoal },
            tablecell: { main: colors.indigoBlue },
            favlist: { main: colors.steelGray },
            background: { default: colors.darkSlateGrey },
            pagination: { main: colors.dustyPink },
            savetext: { main: colors.silver },
            selected: { main: colors.bronzeGold },
            pr: { main: colors.darkCharcoal },
            left: { main: colors.offWhite },
            even: { main: colors.steelGray },
            uneven: { main: colors.lightCoolGray },
            iconlist: { default: "#ffffff" },
            nav: { main: colors.nav },
            navbar: { main: colors.nav },
            table: { main: "black" },
            tablehead: { main: "black" },
            tabletext: { main: "white" },
            selectBackground: { main: colors.veryDark },
            monthly: { main: colors.teal },
            task: { main: colors.orange },
            total: { main: colors.purple },
            favorites: { main: colors.brightYellow },
            head: { main: "#444444" },
            content: { main: "#dddddd" },
            add: { main: "#252D4C" },
          }),
    },
  };
};

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useMode = () => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
