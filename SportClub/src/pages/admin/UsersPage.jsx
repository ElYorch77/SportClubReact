import { useEffect, useState } from "react"
import { Button, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import { getUsers, deleteUser } from "../../services/userService"
import { getUser } from "../../services/authService"
import UserFormModal from "../../components/users/UserFormModal"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const currentUser = getUser()

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function handleCreate() {
    setSelectedUser(null)
    setShowModal(true)
  }

  function handleEdit(user) {
    setSelectedUser(user)
    setShowModal(true)
  }

  async function handleDelete(user) {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    try {
      await deleteUser(user.id)
      await loadUsers()
      Swal.fire({
        title: "Eliminado",
        text: "El usuario ha sido eliminado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      })
    }
  }

  function handleModalClose(shouldReload) {
    setShowModal(false)
    setSelectedUser(null)
    if (shouldReload) {
      loadUsers()
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de usuarios</h2>
        <Button
          onClick={handleCreate}
          style={{ backgroundColor: "#2E1A47", border: "none", fontWeight: "bold" }}
        >
          Nuevo usuario
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={user.id === currentUser?.id}
                    onClick={() => handleDelete(user)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <UserFormModal
        show={showModal}
        user={selectedUser}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default UsersPage