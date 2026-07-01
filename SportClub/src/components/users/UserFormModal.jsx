import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { createUser, updateUser } from "../../services/userService"

const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  role: "user",
  birth_date: "",
}

function UserFormModal({ show, user, onClose }) {
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const isEditMode = Boolean(user)

  // Cada vez que cambia el usuario seleccionado (o se abre el modal), resetea el form
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        birth_date: user.birth_date || "",
      })
    } else {
      setFormData(emptyForm)
    }
    setErrors({})
  }, [user, show])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setSaving(true)

    // En edición, si dejaron la contraseña vacía, no la mandamos (el backend la deja igual)
    const payload = { ...formData }
    if (isEditMode && !payload.password) {
      delete payload.password
    }
    if (!payload.birth_date) {
      delete payload.birth_date
    }

    try {
      if (isEditMode) {
        await updateUser(user.id, payload)
      } else {
        await createUser(payload)
      }

      await Swal.fire({
        title: isEditMode ? "Usuario actualizado" : "Usuario creado",
        text: isEditMode
          ? "Los cambios se guardaron correctamente."
          : "El registro fue creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      })

      onClose(true)
    } catch (error) {
      Swal.fire({
        title: "No se pudo guardar",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    onClose(false)
  }

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#2E1A47" }}>
        <Modal.Title className="text-white">
          {isEditMode ? "Editar usuario" : "Nuevo usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Ej: Juan Pérez"
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
              placeholder="Ej: juan.perez@mail.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Contraseña {isEditMode && <small className="text-muted">(dejar vacío para no cambiarla)</small>}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Entrenador</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de nacimiento (opcional)</Form.Label>
            <Form.Control
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserFormModal