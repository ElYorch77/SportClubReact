import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { logout, getUser } from "../services/authService"

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#2E1A47" }}>
        <Container>
          <Navbar.Brand>
            <img src="/logo.png" alt="SportClub" height="40" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Link className="nav-link text-white" to="/user/dashboard">Dashboard</Link>
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
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  )
}

export default UserLayout