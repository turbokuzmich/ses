"use client";

import { Roboto } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0a0a0a",
        paper: "#161616",
      },
      primary: {
        main: "#ff6237",
        light: "#ff805b",
        dark: "#f43d0b",
      },
      secondary: {
        main: "#ffc637",
        light: "#ffde3f",
        dark: "#fdae2f",
      },
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  })
);

export default theme;
