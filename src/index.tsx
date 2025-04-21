import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup/Signup";
import { HomePage } from "./screens/HomePage/HomePage";
import { useAuthStore } from "./store/authStore";
import { MintPage } from "./screens/MintPage/MintPage";
import { WalletProvider } from "./contexts/WalletContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mint" element={
            <PrivateRoute>
            <MintPage />
            </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </WalletProvider>
  </StrictMode>
);