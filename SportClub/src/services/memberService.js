import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/member`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getAvailableClasses() {
  const response = await fetch(`${API_URL}/classes`, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener las clases disponibles")
  return data.data
}