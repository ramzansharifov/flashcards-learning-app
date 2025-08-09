// src/App.tsx
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TrainingHome from "./pages/training/TrainingHome";
import TrainingRun from "./pages/training/TrainingRun";
import TrainingResults from "./pages/training/TrainingResults";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth initialTab="login" />} />
          <Route path="/register" element={<Auth initialTab="register" />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute><TrainingHome /></ProtectedRoute>} />
          <Route path="/training/:wsId/:topicId" element={<ProtectedRoute><TrainingRun /></ProtectedRoute>} />
          <Route path="/training/:wsId/:topicId/results" element={<ProtectedRoute><TrainingResults /></ProtectedRoute>} />
        </Routes>
      </Router>

      <Toaster position="top-right" />
    </UserProvider>
  );
}
