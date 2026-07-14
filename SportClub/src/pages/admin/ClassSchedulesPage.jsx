import { useEffect, useState } from "react"
import { Button, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getClassSchedules, deleteClassSchedule } from "../../services/classScheduleService"
import { getSportRooms } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import ClassScheduleFormModal from "../../components/classSchedules/ClassScheduleFormModal"

const DAYS = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
}

function ClassSchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  async function loadAll() {
    setLoading(true)
    try {
      const [schedulesData, sportRoomsData, sportsData, roomsData] = await Promise.all([
        getClassSchedules(),
        getSportRooms(),
        getSports(),
        getRooms(),
      ])
      setSchedules(schedulesData)
      setSportRooms(sportRoomsData)
      setSports(sportsData)
      setRooms(roomsData)
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  function getSportRoomLabel(sportRoomId) {
    const sr = sportRooms.find((s) => s.id === sportRoomId)
    if (!sr) return "—"
    const sportName = sports.find((s) => s.id === sr.sport_id)?.name || "—"
    const roomName = rooms.find((r) => r.id === sr.room_id)?.name || "—"
    return `${sportName} - ${roomName}`
  }

  function handleCreate() {
    setSelectedSchedule(null)
    setShowModal(true)
  }

  function handleEdit(schedule) {
    setSelectedSchedule(schedule)
    setShowModal(true)
  }

  async function handleDelete(schedule) {
    const result = await Swal.fire({
      title: "¿Eliminar horario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    try {
      await deleteClassSchedule(schedule.id)
      await loadAll()
      Swal.fire({ title: "Eliminado", text: "El horario fue eliminado.", icon: "success", confirmButtonText: "Aceptar" })
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    }
  }

  function handleModalClose(shouldReload) {
    setShowModal(false)
    setSelectedSchedule(null)
    if (shouldReload) loadAll()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de horarios</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}>
          Nuevo horario
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Deporte - Sala</th>
              <th>Día</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr key={sch.id}>
                <td>{sch.id}</td>
                <td>{getSportRoomLabel(sch.sport_room_id)}</td>
                <td>{DAYS[sch.day_of_week] || sch.day_of_week}</td>
                <td>{sch.start_time}</td>
                <td>{sch.end_time}</td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(sch)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sch)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ClassScheduleFormModal
        show={showModal}
        schedule={selectedSchedule}
        sportRooms={sportRooms}
        sports={sports}
        rooms={rooms}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default ClassSchedulesPage