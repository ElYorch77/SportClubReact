import { useState } from "react"
import { Button, Card, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import { getUser, getToken, saveSession } from "../../services/authService"
import { updateUser } from "../../services/userService"

function ProfilePage() {
  const currentUser = getUser()

  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || "",
    email: currentUser?.email || "",
    password: "",
    birth_date: currentUser?.birth_date || "",
  })
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    const payload = { ...formData }
    if (!payload.password) delete payload.password
    if (!payload.birth_date) delete payload.birth_date

    try {
      const updatedUser = await updateUser(currentUser.id, payload)
      saveSession(getToken(), updatedUser)

      await Swal.fire({
        title: "Perfil actualizado",
        text: "Tus datos se guardaron correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      })

      setFormData((prev) => ({ ...prev, password: "" }))
    } catch (error) {
      Swal.fire({ title: "No se pudo guardar", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setSaving(false)
    }
  }

  const roleLabels = { admin: "Administrador", coach: "Entrenador", user: "Usuario" }

  return (
    <div>
      <h2 className="mb-1">Mi perfil</h2>
      <p className="text-muted mb-4">Actualiza tus datos personales.</p>

      <Card
        style={{ maxWidth: 500, borderTop: "4px solid #F2B705", borderLeft: "none", borderRight: "none", borderBottom: "none" }}
        className="shadow-sm"
      >
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#2E1A47",
                color: "#F2B705",
                fontWeight: "bold",
                fontSize: "1.4rem",
              }}
            >
              {currentUser?.full_name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="fw-bold" style={{ color: "#2E1A47" }}>{currentUser?.full_name}</div>
              <div className="text-muted small">{roleLabels[currentUser?.role] || currentUser?.role}</div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Nueva contraseña <small className="text-muted">(dejar vacío para no cambiarla)</small>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                placeholder="Mínimo 8 caracteres"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={saving}
              className="w-100"
              style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ProfilePage