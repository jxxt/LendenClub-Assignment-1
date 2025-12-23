import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        aadhaar: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for Aadhaar field
        if (name === "aadhaar") {
            // Remove all non-digits
            const digitsOnly = value.replace(/\D/g, "");

            // Limit to 12 digits
            const limitedDigits = digitsOnly.slice(0, 12);

            // Add spaces after every 4 digits
            let formattedValue = "";
            for (let i = 0; i < limitedDigits.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += " ";
                }
                formattedValue += limitedDigits[i];
            }

            setFormData({
                ...formData,
                [name]: formattedValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.aadhaar ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("All fields are required");
            return;
        }

        // Remove spaces from Aadhaar for validation
        const aadhaarDigits = formData.aadhaar.replace(/\s/g, "");

        if (aadhaarDigits.length !== 12 || !/^\d+$/.test(aadhaarDigits)) {
            setError("Aadhaar number must be 12 digits");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Enhanced password validation
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (!/[a-z]/.test(formData.password)) {
            setError("Password must contain at least one lowercase letter");
            return;
        }

        if (!/[A-Z]/.test(formData.password)) {
            setError("Password must contain at least one uppercase letter");
            return;
        }

        if (!/[0-9]/.test(formData.password)) {
            setError("Password must contain at least one number");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setError("Password must contain at least one symbol");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8002/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    aadhaar: formData.aadhaar.replace(/\s/g, ""), // Remove spaces before sending
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful! Please login.");
                navigate("/login");
            } else {
                setError(data.detail || "Signup failed");
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
                <h1 style={styles.title}>Sign Up</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your name"
                        />
                    </div>

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
                        <label style={styles.label}>Aadhaar Number</label>
                        <input
                            type="text"
                            name="aadhaar"
                            value={formData.aadhaar}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength="14"
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

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Confirm password"
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        style={styles.linkText}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
        boxSizing: "border-box",
    },
    formWrapper: {
        width: "100%",
        maxWidth: "400px",
        maxHeight: "90vh",
        padding: "30px",
        border: "1px solid #333",
        borderRadius: "8px",
        backgroundColor: "#111",
        overflowY: "auto",
    },
    title: {
        color: "#fff",
        fontSize: "28px",
        marginBottom: "20px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
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
};

export default Signup;
