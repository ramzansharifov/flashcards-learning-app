import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TrainingHome from "./pages/training/TrainingHome";
import TrainingRun from "./pages/training/TrainingRun";
import TrainingResults from "./pages/training/TrainingResults";
import { Toaster } from "react-hot-toast";
import { Main } from "./pages/Main";
import DemoTraining from "./pages/DemoTraining";
import Tutorial from "./pages/Tutorial";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<Auth initialTab="signin" />} />
        <Route path="/signup" element={<Auth initialTab="signup" />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/demo" element={<DemoTraining />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><TrainingHome /></ProtectedRoute>} />
        <Route path="/training/:wsId/:topicId" element={<ProtectedRoute><TrainingRun /></ProtectedRoute>} />
        <Route path="/training/:wsId/:topicId/results" element={<ProtectedRoute><TrainingResults /></ProtectedRoute>} />
      </Routes >

      <Toaster position="top-right" />
    </>
  );
}
