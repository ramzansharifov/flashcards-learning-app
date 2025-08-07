// src/App.tsx
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Главная страница — только для авторизованных */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Аутентификация */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Можно добавить 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
