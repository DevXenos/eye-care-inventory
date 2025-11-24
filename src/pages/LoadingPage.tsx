import { Box, useTheme } from "@mui/material";
import * as React from "react";
import { motion } from "framer-motion";
import { MoonLoader } from "react-spinners";

const LoadingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `radial - gradient(circle at 30 % 30 %, ${ theme.palette.primary.dark }, #000)`,
        color: theme.palette.primary.contrastText,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MoonLoader size={120} color={theme.palette.primary.light} speedMultiplier={1.2} />
      </motion.div>

      {/* Optional soft glowing ring */}
      <Box
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial - gradient(circle, ${ theme.palette.primary.main }33, transparent 70 %)`,
          filter: "blur(80px)",
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default LoadingPage;