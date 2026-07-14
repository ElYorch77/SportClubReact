import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/sport-rooms`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getSportRooms() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener las asignaciones")
  return data.data
}

export async function createSportRoom(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear la asignación")
  return data.data
}

export async function updateSportRoom(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar la asignación")
  return data.data
}

export async function deleteSportRoom(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar la asignación")
  return data
}