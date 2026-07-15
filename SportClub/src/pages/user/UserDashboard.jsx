import { Link } from "react-router-dom"
import { Card, Col, Row } from "react-bootstrap"

const sections = [
  { to: "/user/classes", title: "Clases Disponibles", description: "Explora y reserva las clases del club." },
  { to: "/user/reservations", title: "Mis Reservas", description: "Revisa y cancela tus reservas activas." },
  { to: "/user/profile", title: "Mi Perfil", description: "Actualiza tus datos personales." },
]

function UserDashboard() {
  return (
    <div>
      <h1 className="mb-1">Dashboard Usuario</h1>
      <p className="text-muted mb-4">Mis reservas, clases disponibles y perfil.</p>

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

export default UserDashboard