import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateJob from "./pages/CreateJob";
import EditJobs from "./pages/EditJob";
function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/jobs" />}
            />

            <Route
                path="/jobs"
                element={<Jobs />}
            />

            <Route
                path="/jobs/:id"
                element={<JobDetails />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/jobs/create"
                element={
                    <ProtectedRoute allowedRole="client">
                        <CreateJob />
                    </ProtectedRoute>
                }
            />

            <Route
            path="/jobs/edit-jobs/:id"
            element={<EditJobs />}
            />
        </Routes>
    );
}

export default App;