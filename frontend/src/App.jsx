import { Routes, Route, Navigate } from "react-router-dom";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
        </Routes>
    );
}

export default App;