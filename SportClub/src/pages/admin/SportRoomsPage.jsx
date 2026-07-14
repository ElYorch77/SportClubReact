import { useEffect, useState } from "react"
import { Button, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSportRooms, deleteSportRoom } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"
import SportRoomFormModal from "../../components/sportRooms/SportRoomFormModal"

function SportRoomsPage() {
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSportRoom, setSelectedSportRoom] = useState(null)

  async function loadAll() {
    setLoading(true)
    try {
      const [sportRoomsData, sportsData, roomsData, usersData] = await Promise.all([
        getSportRooms(),
        getSports(),
        getRooms(),
        getUsers(),
      ])
      setSportRooms(sportRoomsData)
      setSports(sportsData)
      setRooms(roomsData)
      setCoaches(usersData.filter((u) => u.role === "coach"))
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  function getSportName(id) {
    return sports.find((s) => s.id === id)?.name || "—"
  }

  function getRoomName(id) {
    return rooms.find((r) => r.id === id)?.name || "—"
  }

  function getCoachName(id) {
    return coaches.find((c) => c.id === id)?.full_name || "—"
  }

  function handleCreate() {
    setSelectedSportRoom(null)
    setShowModal(true)
  }

  function handleEdit(sportRoom) {
    setSelectedSportRoom(sportRoom)
    setShowModal(true)
  }

  async function handleDelete(sportRoom) {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    try {
      await deleteSportRoom(sportRoom.id)
      await loadAll()
      Swal.fire({ title: "Eliminada", text: "La asignación fue eliminada.", icon: "success", confirmButtonText: "Aceptar" })
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    }
  }

  function handleModalClose(shouldReload) {
    setShowModal(false)
    setSelectedSportRoom(null)
    if (shouldReload) loadAll()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de asignaciones</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}>
          Nueva asignación
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Deporte</th>
              <th>Sala</th>
              <th>Coach</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sportRooms.map((sr) => (
              <tr key={sr.id}>
                <td>{sr.id}</td>
                <td>{getSportName(sr.sport_id)}</td>
                <td>{getRoomName(sr.room_id)}</td>
                <td>{getCoachName(sr.coach_id)}</td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(sr)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sr)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <SportRoomFormModal
        show={showModal}
        sportRoom={selectedSportRoom}
        sports={sports}
        rooms={rooms}
        coaches={coaches}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default SportRoomsPage