import { useNavigate } from "react-router-dom";

function Home({ user }) {
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Hello {user.name}</h1>
            <p style={styles.subtitle}>Welcome to the application!</p>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
        boxSizing: "border-box",
    },
    title: {
        color: "#fff",
        fontSize: "48px",
        marginBottom: "20px",
    },
    subtitle: {
        color: "#888",
        fontSize: "18px",
    },
};

export default Home;
