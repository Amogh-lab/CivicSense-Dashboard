import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Feed from "./pages/citizen/Feed";
import Explore from "./pages/citizen/Explore";
import CreateIssue from "./pages/citizen/CreateIssue";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Navbar from "./components/Navbar";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const authPages = ["/login", "/signup"];
  const showNavbar = user && !authPages.includes(location.pathname);

  if (loading) return null;

  return (
    <div className="app-shell">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/feed" /> : <Signup />} />

        <Route
          path="/feed"
          element={<ProtectedRoute><Feed /></ProtectedRoute>}
        />
        <Route
          path="/explore"
          element={<ProtectedRoute><Explore /></ProtectedRoute>}
        />
        <Route
          path="/create-issue"
          element={<ProtectedRoute><CreateIssue /></ProtectedRoute>}
        />

        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/feed" />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
