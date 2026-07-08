import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/users`

// Arma los headers con el token de sesión
function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

// Listar usuarios
export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los usuarios")
  }

  return data.data
}

// Crear usuario
export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el usuario")
  }

  return data.data
}

// Editar usuario
export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el usuario")
  }

  return data.data
}

// Eliminar usuario
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar el usuario")
  }

  return data
}