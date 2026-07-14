import { useEffect, useState } from "react"
import { Spinner, Table, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyClasses } from "../../services/coachService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"

function MyClassesPage() {
  const [classes, setClasses] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [classesData, sportsData, roomsData] = await Promise.all([
          getMyClasses(),
          getSports(),
          getRooms(),
        ])
        setClasses(classesData)
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

  function getSportName(item) {
    return item.sport_id
      ? sports.find((s) => s.id === item.sport_id)?.name
      : item.sport?.name || item.Sport?.name
  }

  function getRoomName(item) {
    return item.room_id
      ? rooms.find((r) => r.id === item.room_id)?.name
      : item.room?.name || item.Room?.name
  }

  return (
    <div>
      <h2 className="mb-3">Mis clases</h2>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : classes.length === 0 ? (
        <p className="text-muted">No tienes clases asignadas.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Deporte</th>
              <th>Sala</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{getSportName(item) || "—"}</td>
                <td>{getRoomName(item) || "—"}</td>
                <td>
                  <Badge bg={item.status ? "success" : "secondary"}>
                    {item.status ? "Activa" : "Inactiva"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default MyClassesPage
