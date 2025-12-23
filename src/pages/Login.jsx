import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                // User is not authenticated, stay on login page
            }
        };

        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8002/login", {
                method: "POST",
                credentials: "include", // Important: allows setting cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // JWT is automatically stored in httpOnly cookie by backend
                setUser(data.user);
                navigate("/");
            } else {
                setError(data.detail || "Login failed");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h1 style={styles.title}>Login</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter password"
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        style={styles.linkText}
                    >
                        Sign Up
                    </span>
                </p>
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
        boxSizing: "border-box",
        position: "relative",
    },
    formWrapper: {
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        border: "1px solid #333",
        borderRadius: "8px",
        backgroundColor: "#111",
    },
    title: {
        color: "#fff",
        fontSize: "32px",
        marginBottom: "30px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        color: "#fff",
        fontSize: "14px",
    },
    input: {
        padding: "12px",
        backgroundColor: "#222",
        border: "1px solid #333",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "14px",
        outline: "none",
    },
    button: {
        padding: "12px",
        backgroundColor: "#555",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
    },
    error: {
        color: "#ff4444",
        fontSize: "14px",
        margin: "0",
    },
    link: {
        color: "#888",
        textAlign: "center",
        marginTop: "20px",
        fontSize: "14px",
    },
    linkText: {
        color: "#fff",
        cursor: "pointer",
        textDecoration: "underline",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: "15px",
        textAlign: "center",
        borderTop: "1px solid #333",
    },
    footerText: {
        color: "#666",
        fontSize: "13px",
        margin: 0,
    },
};

export default Login;
