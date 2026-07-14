import { useEffect, useState } from "react"
import { Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMySchedules } from "../../services/coachService"
import { getSportRooms } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"

const DAYS = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
}

function MySchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [schedulesData, sportRoomsData, sportsData, roomsData] = await Promise.all([
          getMySchedules(),
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
    load()
  }, [])

  function getSportRoomLabel(schedule) {
    const srId = schedule.sport_room_id
    const sr = sportRooms.find((s) => s.id === srId)
    if (!sr) {
      // Fallback por si el backend anida los datos en vez de dar el ID plano
      const nested = schedule.sportRoom || schedule.SportRoom
      if (nested) {
        const sportName = sports.find((s) => s.id === nested.sport_id)?.name
        const roomName = rooms.find((r) => r.id === nested.room_id)?.name
        return `${sportName || "—"} - ${roomName || "—"}`
      }
      return "—"
    }
    const sportName = sports.find((s) => s.id === sr.sport_id)?.name || "—"
    const roomName = rooms.find((r) => r.id === sr.room_id)?.name || "—"
    return `${sportName} - ${roomName}`
  }

  return (
    <div>
      <h2 className="mb-3">Mi horario</h2>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : schedules.length === 0 ? (
        <p className="text-muted">No tienes horarios asignados.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Deporte - Sala</th>
              <th>Día</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr key={sch.id}>
                <td>{sch.id}</td>
                <td>{getSportRoomLabel(sch)}</td>
                <td>{DAYS[sch.day_of_week] || sch.day_of_week}</td>
                <td>{sch.start_time}</td>
                <td>{sch.end_time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default MySchedulePage