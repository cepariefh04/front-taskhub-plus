import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Komponen penjaga — cek token sebelum masuk dashboard
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Tidak ada token → paksa balik ke login
    return <Navigate to="/login" />;
  }

  // Ada token → lanjut tampilkan halaman yang diminta
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect dari / ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — dibungkus ProtectedRoute */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
