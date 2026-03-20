import React, { useState, useEffect } from "react";
import { Fab, Badge, Tooltip, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import useProductStore from "../store/productStore";
import useAuthStore from "../store/authStore";

const FloatingCartButton = () => {
  const { toggleCart, totalItems } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const whatsappNumber = "5491170504193";
  const whatsappMessage =
    "¡Hola! Quiero hacer una consulta sobre productos personalizados 😊";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        bottom: 260,
        left: 0,
        zIndex: 1600,
        gap: 1,
        background: "rgba(0, 0, 0, 0.25)",
        borderRadius: "16px",
        padding: "2px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
      }}
    >
      {/* Modo oscuro/claro */}
      <Tooltip
        title={darkMode ? "Modo claro" : "Modo oscuro"}
        arrow
        placement="left"
      >
        <Fab
          aria-label="toggle dark mode"
          onClick={toggleDarkMode}
          sx={{
            width: { xs: 36, sm: 42 },
            height: { xs: 36, sm: 42 },
            background: darkMode
              ? "rgba(255, 193, 7, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
            color: darkMode ? "#ffeb3b" : "#424242",
            transition: "all 0.3s ease",
            "&:hover": {
              background: darkMode
                ? "rgba(255, 193, 7, 0.4)"
                : "rgba(255, 255, 255, 0.4)",
              transform: "scale(1.1)",
            },
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </Fab>
      </Tooltip>

      {/* WhatsApp */}
      <Tooltip title="WhatsApp" arrow placement="left">
        <Fab
          aria-label="whatsapp"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: { xs: 36, sm: 42 },
            height: { xs: 36, sm: 42 },
            background: "linear-gradient(45deg, #25D366, #128C7E)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(45deg, #128C7E, #075E54)",
              transform: "scale(1.1)",
            },
          }}
        >
          <WhatsAppIcon />
        </Fab>
      </Tooltip>

      {/* Admin */}
      {isAdmin && (
        <Tooltip title="Panel Admin" arrow placement="left">
          <Fab
            aria-label="admin"
            color="warning"
            onClick={() => navigate("/admin")}
            sx={{
              width: { xs: 36, sm: 42 },
              height: { xs: 36, sm: 42 },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <AdminPanelSettingsIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Carrito */}
      <Tooltip title="Carrito" arrow placement="left">
        <Fab
          aria-label="carrito"
          color="primary"
          onClick={toggleCart}
          sx={{
            width: { xs: 36, sm: 42 },
            height: { xs: 36, sm: 42 },
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <Badge badgeContent={totalItems()} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default FloatingCartButton;
