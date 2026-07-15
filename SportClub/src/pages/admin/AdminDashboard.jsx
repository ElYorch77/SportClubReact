import { Link } from "react-router-dom"
import { Card, Col, Row } from "react-bootstrap"

const sections = [
  { to: "/admin/users", title: "Usuarios", description: "Crear, editar y eliminar cuentas del sistema." },
  { to: "/admin/sports", title: "Deportes", description: "Administra la oferta deportiva del club." },
  { to: "/admin/rooms", title: "Salas", description: "Gestiona los espacios disponibles." },
  { to: "/admin/sport-rooms", title: "Asignaciones", description: "Vincula deporte, sala y coach." },
  { to: "/admin/class-schedules", title: "Horarios", description: "Define días y horas de cada clase." },
  { to: "/admin/profile", title: "Mi Perfil", description: "Actualiza tus datos personales." },
]

function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-1">Dashboard Administrador</h1>
      <p className="text-muted mb-4">Gestión de usuarios, deportes, entrenadores y clases.</p>

      <Row xs={1} md={2} lg={3} className="g-3">
        {sections.map((section) => (
          <Col key={section.to}>
            <Link to={section.to} className="text-decoration-none">
              <Card
                className="h-100 shadow-sm"
                style={{ borderTop: "4px solid #F2B705", borderLeft: "none", borderRight: "none", borderBottom: "none" }}
              >
                <Card.Body>
                  <Card.Title style={{ color: "#2E1A47" }}>{section.title}</Card.Title>
                  <Card.Text className="text-muted">{section.description}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AdminDashboard