import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Unauthorized from "../pages/Unauthorized"
import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UsersPage from "../pages/admin/UsersPage"
import UserLayout from "../layouts/UserLayout"
import SportsPage from "../pages/admin/SportsPage"
import RoomsPage from "../pages/admin/RoomsPage"
import SportRoomsPage from "../pages/admin/SportRoomsPage"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"
import ClassSchedulesPage from "../pages/admin/ClassSchedulesPage"
import MyClassesPage from "../pages/coach/MyClassesPage"
import MySchedulePage from "../pages/coach/MySchedulePage"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="my-classes" element={<MyClassesPage />} />
          <Route path="my-schedule" element={<MySchedulePage />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sports" element={<SportsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="sport-rooms" element={<SportRoomsPage />} />
          <Route path="class-schedules" element={<ClassSchedulesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes