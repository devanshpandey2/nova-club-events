import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider, RequireAdmin } from './components/AdminAuth'
import { ToastProvider } from './components/Toast'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import EventRegister from './pages/EventRegister'
import About from './pages/About'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminEvents from './pages/AdminEvents'
import EventForm from './pages/EventForm'
import Registrations from './pages/Registrations'

export default function App() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            {/* Public site */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register/:id" element={<EventRegister />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin login lives outside the guarded layout */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Guarded admin area */}
            <Route path="/admin" element={<RequireAdmin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/edit/:id" element={<EventForm />} />
              <Route path="registrations" element={<Registrations />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ToastProvider>
  )
}
