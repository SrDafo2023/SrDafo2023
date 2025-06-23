"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Ban,
  Settings,
  Users,
  Bell,
  ShieldAlert,
  Database,
  MessageSquare,
  Search,
  Shield,
  Key,
  FileWarning
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Interfaces
interface Report {
  user: string;
  reason: string;
  date: string;
  status: string;
}

interface ReportDetails extends Report {
  id: string;
  details: string;
  evidence: string;
}

export default function AdminDashboard() {
  // Estados para el modo mantenimiento
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true)
  
  // Estados para los modales
  const [showAccessLogs, setShowAccessLogs] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)
  const [showBackup, setShowBackup] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showNotificationHistory, setShowNotificationHistory] = useState(false)
  const [showReports, setShowReports] = useState(false)

  // Estado para el formulario de notificaciones
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info"
  })

  // Nuevo estado para el modal de revisión de reporte
  const [showReviewReport, setShowReviewReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportDetails>({
    id: "",
    user: "",
    reason: "",
    date: "",
    status: "",
    details: "",
    evidence: ""
  })

  // Estado para los reportes
  const [reports, setReports] = useState<ReportDetails[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)

  const cardClasses = "bg-white dark:bg-slate-800/80 dark:border-slate-700"
  const titleClasses = "text-gray-900 dark:text-white"
  const descriptionClasses = "text-gray-600 dark:text-slate-400"
  const textClasses = "text-sm text-gray-700 dark:text-slate-300"
  const outlineButtonClasses = "dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"

  // Función para manejar el envío de notificaciones
  const handleSendNotification = () => {
    // Aquí iría la lógica para enviar la notificación
    console.log("Enviando notificación:", notificationForm)
    setShowNotification(false)
    setNotificationForm({ title: "", message: "", type: "info" })
  }

  // Función para manejar la apertura del modal de revisión
  const handleReviewClick = (report: Report) => {
    setSelectedReport({
      id: "REP-001",
      user: report.user,
      reason: report.reason,
      date: report.date,
      status: report.status,
      details: "El usuario ha estado enviando mensajes inapropiados en el chat general y ha recibido múltiples quejas de otros usuarios.",
      evidence: "https://evidencia-ejemplo.com/captura-1.jpg"
    })
    setShowReviewReport(true)
  }

  // Función para manejar el cambio de estado del reporte
  const handleStatusChange = (newStatus: string) => {
    console.log("Cambiando estado a:", newStatus)
    // Aquí iría la lógica para actualizar el estado en la base de datos
  }

  // Función para manejar la acción sobre el reporte
  const handleReportAction = (action: "ban" | "warn" | "save") => {
    console.log("Ejecutando acción:", action)
    // Aquí iría la lógica para ejecutar la acción correspondiente
    setShowReviewReport(false)
  }

  // Función para cargar los reportes
  const loadReports = async () => {
    try {
      setIsLoadingReports(true)
      // Aquí iría la llamada a tu API o base de datos
      // Por ahora usaremos datos de ejemplo
      const mockReports: ReportDetails[] = [
        {
          id: "REP-001",
          user: "usuario@example.com",
          reason: "Comportamiento inadecuado",
          date: "2024-01-20",
          status: "Pendiente",
          details: "El usuario ha estado enviando mensajes inapropiados en el chat general.",
          evidence: "https://evidencia-ejemplo.com/1.jpg"
        },
        {
          id: "REP-002",
          user: "otro@example.com",
          reason: "Spam",
          date: "2024-01-19",
          status: "Resuelto",
          details: "Usuario enviando spam comercial.",
          evidence: ""
        }
      ]
      setReports(mockReports)
    } catch (error) {
      console.error("Error al cargar reportes:", error)
    } finally {
      setIsLoadingReports(false)
    }
  }

  // Cargar reportes al montar el componente
  useEffect(() => {
    loadReports()
  }, [])

  // Calcular cantidades de reportes
  const pendingReports = reports.filter(report => report.status === "Pendiente").length
  const resolvedReports = reports.filter(report => report.status === "Resuelto").length

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Panel Administrativo</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Maintenance Mode Card */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
              <ShieldAlert className="h-6 w-6 text-yellow-500" />
              Modo Mantenimiento
            </CardTitle>
            <CardDescription className={descriptionClasses}>Activar/desactivar el modo mantenimiento del sitio</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${textClasses}`}>Estado:</span>
              <Badge variant={isMaintenanceMode ? "destructive" : "secondary"}>
                {isMaintenanceMode ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <Switch
              checked={isMaintenanceMode}
              onCheckedChange={setIsMaintenanceMode}
              aria-label="Toggle maintenance mode"
            />
          </CardContent>
        </Card>

        {/* User Management Card */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
                <Users className="h-6 w-6" />
                Gestión de Usuarios
            </CardTitle>
            <CardDescription className={descriptionClasses}>Administrar usuarios y permisos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Ver Usuarios</Button>
            <div className={textClasses}>
                <p>Usuarios Bloqueados: <span className="font-bold text-red-500">3</span></p>
                <p>Usuarios Activos: <span className="font-bold text-green-500">150</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className={cardClasses}>
          <CardHeader>
             <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
                <ShieldAlert className="h-6 w-6" />
                Seguridad
            </CardTitle>
            <CardDescription className={descriptionClasses}>Configuración de seguridad y accesos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className={outlineButtonClasses}>Registros de Acceso</Button>
            <Button variant="outline" className={outlineButtonClasses}>Configurar Permisos</Button>
          </CardContent>
        </Card>

        {/* Database Card */}
        <Card className={cardClasses}>
          <CardHeader>
             <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
                <Database className="h-6 w-6" />
                Base de Datos
            </CardTitle>
            <CardDescription className={descriptionClasses}>Gestión y respaldo de datos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className={outlineButtonClasses}>Crear Respaldo</Button>
            <Button variant="outline" className={outlineButtonClasses}>Ver Registros</Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className={cardClasses}>
          <CardHeader>
             <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
                <Bell className="h-6 w-6" />
                Notificaciones
            </CardTitle>
            <CardDescription className={descriptionClasses}>Enviar notificaciones a usuarios</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className={outlineButtonClasses}>Enviar Notificación</Button>
            <Button variant="outline" className={outlineButtonClasses}>Historial</Button>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${titleClasses}`}>
                <FileWarning className="h-6 w-6" />
                Reportes y Denuncias
            </CardTitle>
            <CardDescription className={descriptionClasses}>Gestionar reportes de usuarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className={`w-full ${outlineButtonClasses}`}>Ver Reportes</Button>
             <div className={textClasses}>
                <p>Reportes Pendientes: <span className="font-bold text-yellow-500">1</span></p>
                <p>Reportes Resueltos: <span className="font-bold text-green-500">8</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
