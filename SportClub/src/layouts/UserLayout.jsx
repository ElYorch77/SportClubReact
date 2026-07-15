import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { logout, getUser } from "../services/authService"

function CoachLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

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
      <Navbar expand="lg" style={{ backgroundColor: "#2E1A47" }}>
        <Container>
          <Navbar.Brand>
            <img src="/logo.png" alt="SportClub" height="40" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Link className="nav-link text-white" to="/coach/dashboard">Dashboard</Link>
            <Link className="nav-link text-white" to="/coach/my-classes">Mis Clases</Link>
            <Link className="nav-link text-white" to="/coach/my-schedule">Mi Horario</Link>
            <Link className="nav-link text-white" to="/coach/profile">Mi Perfil</Link>
          </Nav>
          <span className="me-3 text-white">{user?.full_name}</span>
          <Button
            onClick={handleLogout}
            style={{ backgroundColor: "#F2B705", border: "none", color: "#2E1A47", fontWeight: "bold" }}
          >
            Cerrar sesión
          </Button>
        </Container>
      </Navbar>
      <Container className="py-4">
        <div className="bg-white rounded shadow-sm p-4">
          <Outlet />
        </div>
      </Container>
    </div>
  )
}

export default CoachLayout