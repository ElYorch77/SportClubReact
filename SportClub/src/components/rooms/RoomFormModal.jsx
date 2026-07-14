import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { createRoom, updateRoom } from "../../services/roomService"

const emptyForm = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  image_url: "",
  observation: "",
  status: true,
}

function RoomFormModal({ show, room, onClose }) {
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEditMode = Boolean(room)

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        description: room.description || "",
        capacity: room.capacity || "",
        location: room.location || "",
        image_url: room.image_url || "",
        observation: room.observation || "",
        status: room.status ?? true,
      })
    } else {
      setFormData(emptyForm)
    }
  }, [room, show])

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
      capacity: Number(formData.capacity),
    }
    if (!payload.image_url) delete payload.image_url
    if (!payload.observation) delete payload.observation

    try {
      if (isEditMode) {
        await updateRoom(room.id, payload)
      } else {
        await createRoom(payload)
      }

      await Swal.fire({
        title: isEditMode ? "Sala actualizada" : "Sala creada",
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
          {isEditMode ? "Editar sala" : "Nueva sala"}
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
              placeholder="Ej: Sala Multiuso 1"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Ej: Sala amplia con piso de madera"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min={1}
              placeholder="Ej: 20"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Ej: Primer piso, ala norte"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de imagen (opcional)</Form.Label>
            <Form.Control
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observación (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observation"
              value={formData.observation}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="status"
              label="Activa"
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

export default RoomFormModal