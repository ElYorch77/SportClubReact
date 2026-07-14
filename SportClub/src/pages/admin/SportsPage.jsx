import { useEffect, useState } from "react"
import { Button, Spinner, Table, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSports, deleteSport } from "../../services/sportService"
import SportFormModal from "../../components/sports/SportFormModal"

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)

  async function loadSports() {
    setLoading(true)
    try {
      const data = await getSports()
      setSports(data)
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSports()
  }, [])

  function handleCreate() {
    setSelectedSport(null)
    setShowModal(true)
  }

  function handleEdit(sport) {
    setSelectedSport(sport)
    setShowModal(true)
  }

  async function handleDelete(sport) {
    const result = await Swal.fire({
      title: "¿Eliminar deporte?",
      text: `Se eliminará "${sport.name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    try {
      await deleteSport(sport.id)
      await loadSports()
      Swal.fire({ title: "Eliminado", text: "El deporte fue eliminado.", icon: "success", confirmButtonText: "Aceptar" })
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error", confirmButtonText: "Aceptar" })
    }
  }

  function handleModalClose(shouldReload) {
    setShowModal(false)
    setSelectedSport(null)
    if (shouldReload) loadSports()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de deportes</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}>
          Nuevo deporte
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
              <th>Objetivo</th>
              <th>Duración (min)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sports.map((sport) => (
              <tr key={sport.id}>
                <td>{sport.id}</td>
                <td>{sport.name}</td>
                <td>{sport.objective}</td>
                <td>{sport.duration}</td>
                <td>
                  <Badge bg={sport.status ? "success" : "secondary"}>
                    {sport.status ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(sport)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sport)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <SportFormModal show={showModal} sport={selectedSport} onClose={handleModalClose} />
    </div>
  )
}

export default SportsPage