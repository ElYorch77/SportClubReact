import { Link } from "react-router-dom"
import { Button, Container } from "react-bootstrap"

function Home() {
  return (
    <div
      style={{
        backgroundColor: "#2E1A47",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(242, 183, 5, 0.08),
          rgba(242, 183, 5, 0.08) 2px,
          transparent 2px,
          transparent 20px
        )`,
        minHeight: "100vh",
      }}
    >
      <Container className="text-center text-white py-5">
        <img src="/logo.png" alt="SportClub" height="80" className="mb-4" />
        <h1 className="display-4 fw-bold mb-3">Bienvenido a SportClub</h1>
        <p className="lead mb-4">
          Gestiona tus clases, reservas y horarios deportivos en un solo lugar.
        </p>
        <Link to="/login">
          <Button
            size="lg"
            style={{ backgroundColor: "#F2B705", border: "none", color: "#2E1A47", fontWeight: "bold" }}
          >
            Iniciar sesión
          </Button>
        </Link>
      </Container>
    </div>
  )
}

export default Home