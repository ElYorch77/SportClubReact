import { Link } from "react-router-dom"
import { Card, Col, Row } from "react-bootstrap"

const sections = [
  { to: "/coach/my-classes", title: "Mis Clases", description: "Revisa las clases que tienes asignadas." },
  { to: "/coach/my-schedule", title: "Mi Horario", description: "Consulta tus días y horas de trabajo." },
  { to: "/coach/profile", title: "Mi Perfil", description: "Actualiza tus datos personales." },
]

function CoachDashboard() {
  return (
    <div>
      <h1 className="mb-1">Dashboard Coach</h1>
      <p className="text-muted mb-4">Mis clases, alumnos inscritos y horarios.</p>

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

export default CoachDashboard