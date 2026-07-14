import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/class-schedules`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getClassSchedules() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener los horarios")
  return data.data
}

export async function createClassSchedule(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear el horario")
  return data.data
}

export async function updateClassSchedule(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar el horario")
  return data.data
}

export async function deleteClassSchedule(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar el horario")
  return data
}