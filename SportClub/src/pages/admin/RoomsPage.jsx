import { useEffect, useState } from "react"
import { Button, Spinner, Table, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import { getRooms, deleteRoom } from "../../services/roomService"
import RoomFormModal from "../../components/rooms/RoomFormModal"

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  async function loadRooms() {
    setLoading(true)
    try {
      const data = await getRooms()
      setRooms(data)
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  function handleCreate() {
    setSelectedRoom(null)
    setShowModal(true)
  }

  function handleEdit(room) {
    setSelectedRoom(room)
    setShowModal(true)
  }

  async function handleDelete(room) {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Se eliminará "${room.name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    try {
      await deleteRoom(room.id)
      await loadRooms()
      Swal.fire({ title: "Eliminada", text: "La sala fue eliminada.", icon: "success", confirmButtonText: "Aceptar" })
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    }
  }

  function handleModalClose(shouldReload) {
    setShowModal(false)
    setSelectedRoom(null)
    if (shouldReload) loadRooms()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de salas</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}>
          Nueva sala
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.name}</td>
                <td>{room.location}</td>
                <td>{room.capacity}</td>
                <td>
                  <Badge bg={room.status ? "success" : "secondary"}>
                    {room.status ? "Activa" : "Inactiva"}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(room)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(room)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <RoomFormModal show={showModal} room={selectedRoom} onClose={handleModalClose} />
    </div>
  )
}

export default RoomsPage