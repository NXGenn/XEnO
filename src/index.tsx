import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { HomePage } from "./screens/HomePage/HomePage";
import { MintPage } from "./screens/MintPage/MintPage";
import "./styles.css";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mint" element={<MintPage />} />
        </Routes>
      </Router>
    </WalletProvider>
  </StrictMode>,
);