import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/coach`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getMyClasses() {
  const response = await fetch(`${API_URL}/my-classes`, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener mis clases")
  return data.data
}

export async function getMySchedules() {
  const response = await fetch(`${API_URL}/my-schedules`, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener mi horario")
  return data.data
}