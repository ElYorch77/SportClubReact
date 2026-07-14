import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/rooms`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getRooms() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener las salas")
  return data.data
}

export async function createRoom(roomData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear la sala")
  return data.data
}

export async function updateRoom(id, roomData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar la sala")
  return data.data
}

export async function deleteRoom(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar la sala")
  return data
}