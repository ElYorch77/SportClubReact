import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/sports`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getSports() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener los deportes")
  return data.data
}

export async function createSport(sportData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(sportData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear el deporte")
  return data.data
}

export async function updateSport(id, sportData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(sportData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar el deporte")
  return data.data
}

export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar el deporte")
  return data
}