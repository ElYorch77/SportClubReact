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

      // Actualiza el localStorage para que el navbar y el resto de la app
      // reflejen el cambio sin necesidad de volver a loguearse
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

  return (
    <div>
      <h2 className="mb-3">Mi perfil</h2>
      <Card style={{ maxWidth: 500 }}>
        <Card.Body>
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

            <Form.Group className="mb-3">
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