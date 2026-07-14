import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { createClassSchedule, updateClassSchedule } from "../../services/classScheduleService"

const emptyForm = {
  sport_room_id: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
}

const DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
]

function ClassScheduleFormModal({ show, schedule, sportRooms, sports, rooms, onClose }) {
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEditMode = Boolean(schedule)

  useEffect(() => {
    if (schedule) {
      setFormData({
        sport_room_id: schedule.sport_room_id || "",
        day_of_week: schedule.day_of_week || "",
        start_time: schedule.start_time || "",
        end_time: schedule.end_time || "",
      })
    } else {
      setFormData(emptyForm)
    }
  }, [schedule, show])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function getSportRoomLabel(sr) {
    const sportName = sports.find((s) => s.id === sr.sport_id)?.name || "—"
    const roomName = rooms.find((r) => r.id === sr.room_id)?.name || "—"
    return `${sportName} - ${roomName}`
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Validación básica: hora fin debe ser mayor que hora inicio
    if (formData.start_time >= formData.end_time) {
      Swal.fire({
        title: "Horario inválido",
        text: "La hora de fin debe ser posterior a la hora de inicio.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      })
      return
    }

    setSaving(true)

    const payload = {
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
    }

    try {
      if (isEditMode) {
        await updateClassSchedule(schedule.id, payload)
      } else {
        await createClassSchedule(payload)
      }

      await Swal.fire({
        title: isEditMode ? "Horario actualizado" : "Horario creado",
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
          {isEditMode ? "Editar horario" : "Nuevo horario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Asignación (Deporte - Sala)</Form.Label>
            <Form.Select name="sport_room_id" value={formData.sport_room_id} onChange={handleChange} required>
              <option value="">Selecciona una asignación</option>
              {sportRooms.map((sr) => (
                <option key={sr.id} value={sr.id}>{getSportRoomLabel(sr)}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange} required>
              <option value="">Selecciona un día</option>
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de inicio</Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de fin</Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
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

export default ClassScheduleFormModal