import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { createSportRoom, updateSportRoom } from "../../services/sportRoomService"

const emptyForm = {
  sport_id: "",
  room_id: "",
  coach_id: "",
  observation: "",
}

function SportRoomFormModal({ show, sportRoom, sports, rooms, coaches, onClose }) {
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEditMode = Boolean(sportRoom)

  useEffect(() => {
    if (sportRoom) {
      setFormData({
        sport_id: sportRoom.sport_id || "",
        room_id: sportRoom.room_id || "",
        coach_id: sportRoom.coach_id || "",
        observation: sportRoom.observation || "",
      })
    } else {
      setFormData(emptyForm)
    }
  }, [sportRoom, show])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    const payload = {
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
    }
    if (formData.observation) payload.observation = formData.observation

    try {
      if (isEditMode) {
        await updateSportRoom(sportRoom.id, payload)
      } else {
        await createSportRoom(payload)
      }

      await Swal.fire({
        title: isEditMode ? "Asignación actualizada" : "Asignación creada",
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
          {isEditMode ? "Editar asignación" : "Nueva asignación"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange} required>
              <option value="">Selecciona un deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select name="room_id" value={formData.room_id} onChange={handleChange} required>
              <option value="">Selecciona una sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange} required>
              <option value="">Selecciona un coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>{coach.full_name}</option>
              ))}
            </Form.Select>
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

export default SportRoomFormModal