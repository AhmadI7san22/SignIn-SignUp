import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.state?.fromLogin) {
            // If navigated from login, go to signup page
            navigate("/register");
        } else {
            navigate("/login");
        }
    };

    return (
        <center>
            <h1>This is Home Component</h1>
            <button onClick={handleBack}>Go Back</button>
        </center>
    );
}

export default Home;
