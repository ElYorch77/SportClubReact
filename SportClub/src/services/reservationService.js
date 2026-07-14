import { getToken } from "./authService"

const API_URL = `${import.meta.env.VITE_API_URL}/reservations`

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function getMyReservations() {
  const response = await fetch(`${API_URL}/my-reservations`, { headers: getAuthHeaders() })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener mis reservas")
  return data.data
}

export async function createReservation(classScheduleId) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ class_schedule_id: classScheduleId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear la reserva")
  return data.data
}

export async function cancelReservation(id) {
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al cancelar la reserva")
  return data.data
}