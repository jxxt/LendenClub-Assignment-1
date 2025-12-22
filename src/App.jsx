import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Home user={user} setUser={setUser} />}
                />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;
