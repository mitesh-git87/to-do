import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { TasksPage } from "./pages/TasksPage.jsx";

function App() {
  return (
    <div className="min-h-full">
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </div>
  )
}

export default App
