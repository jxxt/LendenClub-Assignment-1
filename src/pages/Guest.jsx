import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Guest() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8002/verify", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    // User is authenticated, redirect to home
                    navigate("/");
                }
            } catch (err) {
                // User is not authenticated, stay on guest page
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.iconSection}>
                    <span style={styles.lockIcon}>🔒</span>
                </div>

                <h1 style={styles.title}>Welcome to LendenClub Assignment 1</h1>
                <p style={styles.subtitle}>
                    Please log in or sign up to access the secure dashboard
                </p>

                <div style={styles.buttonContainer}>
                    <button
                        onClick={() => navigate("/login")}
                        style={styles.loginButton}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        style={styles.signupButton}
                    >
                        Sign Up
                    </button>
                </div>
            </div>

            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    Developed by <strong>Jeet Debnath</strong> •{" "}
                    {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        paddingBottom: "80px",
        boxSizing: "border-box",
        position: "relative",
    },
    content: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "60px",
    },
    iconSection: {
        marginBottom: "clamp(20px, 4vw, 30px)",
    },
    lockIcon: {
        fontSize: "clamp(50px, 12vw, 80px)",
    },
    title: {
        color: "#fff",
        fontSize: "clamp(22px, 5vw, 36px)",
        marginBottom: "15px",
        textAlign: "center",
        fontWeight: "600",
        lineHeight: "1.3",
        padding: "0 10px",
    },
    subtitle: {
        color: "#888",
        fontSize: "clamp(14px, 3vw, 18px)",
        marginBottom: "clamp(30px, 6vw, 40px)",
        textAlign: "center",
        lineHeight: "1.6",
        padding: "0 10px",
    },
    buttonContainer: {
        display: "flex",
        gap: "15px",
        width: "100%",
        maxWidth: "400px",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    loginButton: {
        flex: "1 1 140px",
        minWidth: "120px",
        padding: "clamp(12px, 2.5vw, 15px) clamp(20px, 4vw, 30px)",
        backgroundColor: "#fff",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        fontSize: "clamp(15px, 3vw, 18px)",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    signupButton: {
        flex: "1 1 140px",
        minWidth: "120px",
        padding: "clamp(12px, 2.5vw, 15px) clamp(20px, 4vw, 30px)",
        backgroundColor: "#333",
        color: "#fff",
        border: "2px solid #555",
        borderRadius: "8px",
        fontSize: "clamp(15px, 3vw, 18px)",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    footer: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "clamp(12px, 2.5vw, 20px)",
        textAlign: "center",
        borderTop: "1px solid #333",
        backgroundColor: "#000",
    },
    footerText: {
        color: "#666",
        fontSize: "clamp(11px, 2vw, 14px)",
        margin: 0,
    },
};

export default Guest;
