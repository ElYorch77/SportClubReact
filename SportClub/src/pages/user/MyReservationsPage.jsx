import { useEffect, useState } from "react"
import { Spinner, Table, Button, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyReservations, cancelReservation } from "../../services/reservationService"
import { getSportRooms } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"

const DAYS = {
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves",
  5: "Viernes", 6: "Sábado", 7: "Domingo",
}

function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState(null)

  async function loadReservations() {
    setLoading(true)
    try {
      const [reservationsData, sportRoomsData, sportsData, roomsData] = await Promise.all([
        getMyReservations(),
        getSportRooms(),
        getSports(),
        getRooms(),
      ])
      setReservations(reservationsData)
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
    loadReservations()
  }, [])

  function getClassLabel(reservation) {
    // La reserva puede traer el horario anidado (classSchedule) o solo el ID plano
    const schedule = reservation.classSchedule || reservation.ClassSchedule
    const scheduleId = reservation.class_schedule_id

    if (schedule) {
      const sr = sportRooms.find((s) => s.id === schedule.sport_room_id)
      const sportName = sports.find((s) => s.id === sr?.sport_id)?.name || "—"
      const roomName = rooms.find((r) => r.id === sr?.room_id)?.name || "—"
      return `${sportName} - ${roomName} | ${DAYS[schedule.day_of_week]} ${schedule.start_time}`
    }
    return `Horario #${scheduleId || "—"}`
  }

  async function handleCancel(reservation) {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    })
    if (!result.isConfirmed) return

    setCancelingId(reservation.id)
    try {
      await cancelReservation(reservation.id)
      await loadReservations()
      Swal.fire({ title: "Reserva cancelada", icon: "success", confirmButtonText: "Aceptar" })
    } catch (error) {
      Swal.fire({ title: "No se pudo cancelar", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div>
      <h2 className="mb-3">Mis reservas</h2>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : reservations.length === 0 ? (
        <p className="text-muted">No tienes reservas todavía.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Clase</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{getClassLabel(res)}</td>
                <td>
                  <Badge bg={res.status === "active" ? "success" : "secondary"}>
                    {res.status === "active" ? "Activa" : res.status}
                  </Badge>
                </td>
                <td>
                  {res.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={cancelingId === res.id}
                      onClick={() => handleCancel(res)}
                    >
                      {cancelingId === res.id ? "Cancelando..." : "Cancelar"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default MyReservationsPage