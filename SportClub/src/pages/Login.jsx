import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      if (data.data.user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (data.data.user.role === "coach") {
        navigate("/coach/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#2E1A47",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(242, 183, 5, 0.08),
          rgba(242, 183, 5, 0.08) 2px,
          transparent 2px,
          transparent 20px
        )`,
      }}
    >
      <Card
        style={{
          width: "24rem",
          borderTop: "4px solid #F2B705",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "none",
        }}
        className="shadow-lg"
      >
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="SportClub" style={{ height: "60px" }} />
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login