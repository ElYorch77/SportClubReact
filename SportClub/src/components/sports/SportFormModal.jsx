import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { createSport, updateSport } from "../../services/sportService"

const emptyForm = {
  name: "",
  objective: "",
  duration: "",
  status: true,
}

function SportFormModal({ show, sport, onClose }) {
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEditMode = Boolean(sport)

  useEffect(() => {
    if (sport) {
      setFormData({
        name: sport.name || "",
        objective: sport.objective || "",
        duration: sport.duration || "",
        status: sport.status ?? true,
      })
    } else {
      setFormData(emptyForm)
    }
  }, [sport, show])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    const payload = {
      ...formData,
      duration: Number(formData.duration),
    }

    try {
      if (isEditMode) {
        await updateSport(sport.id, payload)
      } else {
        await createSport(payload)
      }

      await Swal.fire({
        title: isEditMode ? "Deporte actualizado" : "Deporte creado",
        text: isEditMode ? "Los cambios se guardaron correctamente." : "El registro fue creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      })

      onClose(true)
    } catch (error) {
      Swal.fire({ title: "No se pudo guardar", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
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
          {isEditMode ? "Editar deporte" : "Nuevo deporte"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Fútbol"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              required
              placeholder="Ej: Mejorar resistencia cardiovascular"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min={1}
              placeholder="Ej: 60"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="status"
              label="Activo"
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SportFormModal