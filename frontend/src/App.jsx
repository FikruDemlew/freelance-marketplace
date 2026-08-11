import { Routes, Route, Navigate } from "react-router-dom";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

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

        </Routes>
    );
}

export default App;