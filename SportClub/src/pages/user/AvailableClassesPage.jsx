import { useEffect, useState } from "react"
import { Spinner, Table, Button } from "react-bootstrap"
import Swal from "sweetalert2"
import { getAvailableClasses } from "../../services/memberService"
import { createReservation } from "../../services/reservationService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getSportRooms } from "../../services/sportRoomService"

const DAYS = {
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves",
  5: "Viernes", 6: "Sábado", 7: "Domingo",
}

function AvailableClassesPage() {
  const [classes, setClasses] = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [reservingId, setReservingId] = useState(null)

  async function loadClasses() {
    setLoading(true)
    try {
      const [classesData, sportRoomsData, sportsData, roomsData] = await Promise.all([
        getAvailableClasses(),
        getSportRooms(),
        getSports(),
        getRooms(),
      ])
      setClasses(classesData)
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
    loadClasses()
  }, [])

  function getSportRoomLabel(classItem) {
    const srId = classItem.sport_room_id
    const sr = sportRooms.find((s) => s.id === srId)
    if (!sr) return "—"
    const sportName = sports.find((s) => s.id === sr.sport_id)?.name || "—"
    const roomName = rooms.find((r) => r.id === sr.room_id)?.name || "—"
    return `${sportName} - ${roomName}`
  }

  async function handleReserve(classItem) {
    const result = await Swal.fire({
      title: "¿Reservar esta clase?",
      text: `${getSportRoomLabel(classItem)} - ${DAYS[classItem.day_of_week]} ${classItem.start_time}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    setReservingId(classItem.id)
    try {
      await createReservation(classItem.id)
      await Swal.fire({
        title: "¡Reserva creada!",
        text: "Puedes verla en 'Mis Reservas'.",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    } catch (error) {
      Swal.fire({ title: "No se pudo reservar", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setReservingId(null)
    }
  }

  return (
    <div>
      <h2 className="mb-3">Clases disponibles</h2>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : classes.length === 0 ? (
        <p className="text-muted">No hay clases disponibles en este momento.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Deporte - Sala</th>
              <th>Día</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.id}</td>
                <td>{getSportRoomLabel(cls)}</td>
                <td>{DAYS[cls.day_of_week] || cls.day_of_week}</td>
                <td>{cls.start_time}</td>
                <td>{cls.end_time}</td>
                <td>
                  <Button
                    size="sm"
                    disabled={reservingId === cls.id}
                    onClick={() => handleReserve(cls)}
                    style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}
                  >
                    {reservingId === cls.id ? "Reservando..." : "Reservar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default AvailableClassesPage