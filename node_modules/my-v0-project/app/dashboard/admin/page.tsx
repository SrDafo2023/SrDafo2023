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
  Key
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
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
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
    <div className="p-6 space-y-6">
      <div className="flex justify-center mb-8">
        <h1 className="text-2xl font-bold">Panel Administrativo</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel de Modo Mantenimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Modo Mantenimiento
            </CardTitle>
            <CardDescription>
              Activar/desactivar el modo mantenimiento del sitio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Estado: {maintenanceMode ? 
                  <Badge variant="destructive">En Mantenimiento</Badge> : 
                  <Badge variant="default">Activo</Badge>
                }
              </span>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Al activar el modo mantenimiento, solo los administradores podrán acceder al sitio.
            </p>
          </CardContent>
        </Card>

        {/* Panel de Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Administrar usuarios y permisos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/admin/users">
              <Button className="w-full">
                Ver Usuarios
              </Button>
            </Link>
            <div className="text-sm">
              <p className="font-medium">Usuarios Bloqueados: <span className="text-red-500">3</span></p>
              <p className="font-medium">Usuarios Activos: <span className="text-green-500">150</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-purple-500" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Configuración de seguridad y accesos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAccessLogs(true)}
            >
              Registros de Acceso
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPermissions(true)}
            >
              Configurar Permisos
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Base de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Base de Datos
            </CardTitle>
            <CardDescription>
              Gestión y respaldo de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowBackup(true)}
            >
              Crear Respaldo
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowLogs(true)}
            >
              Ver Registros
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Enviar notificaciones a usuarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowNotification(true)}
            >
              Enviar Notificación
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowNotificationHistory(true)}
            >
              Historial
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Reportes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-500" />
              Reportes y Denuncias
            </CardTitle>
            <CardDescription>
              Gestionar reportes de usuarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              {isLoadingReports ? (
                <p>Cargando reportes...</p>
              ) : (
                <>
                  <p className="font-medium">Reportes Pendientes: <span className="text-red-500">{pendingReports}</span></p>
                  <p className="font-medium">Reportes Resueltos: <span className="text-green-500">{resolvedReports}</span></p>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowReports(true)}
            >
              Ver Reportes
            </Button>
          </CardContent>
        </Card>

        {/* Modal de Registros de Acceso */}
        <Dialog open={showAccessLogs} onOpenChange={setShowAccessLogs}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Registros de Acceso
              </DialogTitle>
              <DialogDescription>
                Historial de accesos al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Usuario</th>
                      <th className="text-left p-2">Fecha</th>
                      <th className="text-left p-2">IP</th>
                      <th className="text-left p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">admin@example.com</td>
                      <td className="p-2">2024-01-20 15:30</td>
                      <td className="p-2">192.168.1.1</td>
                      <td className="p-2"><Badge>Exitoso</Badge></td>
                    </tr>
                    {/* Más registros aquí */}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración de Permisos */}
        <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Permisos
              </DialogTitle>
              <DialogDescription>
                Gestionar permisos de roles
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Rol: Administrador</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Acceso total al sistema</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gestión de usuarios</span>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
              {/* Más roles aquí */}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Crear Respaldo */}
        <Dialog open={showBackup} onOpenChange={setShowBackup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Crear Respaldo
              </DialogTitle>
              <DialogDescription>
                Crear una copia de seguridad de la base de datos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p>¿Estás seguro de que deseas crear un respaldo?</p>
                <p className="text-sm text-muted-foreground">
                  Esto puede tomar varios minutos
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBackup(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  // Aquí iría la lógica para crear el respaldo
                  setShowBackup(false)
                }}>
                  Crear Respaldo
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Enviar Notificación */}
        <Dialog open={showNotification} onOpenChange={setShowNotification}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Enviar Notificación
              </DialogTitle>
              <DialogDescription>
                Enviar una notificación a los usuarios
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({
                    ...notificationForm,
                    title: e.target.value
                  })}
                  placeholder="Título de la notificación"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensaje</label>
                <Textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({
                    ...notificationForm,
                    message: e.target.value
                  })}
                  placeholder="Escribe el mensaje..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNotification(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendNotification}>
                  Enviar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Historial de Notificaciones */}
        <Dialog open={showNotificationHistory} onOpenChange={setShowNotificationHistory}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Historial de Notificaciones
              </DialogTitle>
              <DialogDescription>
                Registro de notificaciones enviadas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Título</th>
                      <th className="text-left p-2">Fecha</th>
                      <th className="text-left p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Mantenimiento Programado</td>
                      <td className="p-2">2024-01-20 15:30</td>
                      <td className="p-2"><Badge>Enviado</Badge></td>
                    </tr>
                    {/* Más notificaciones aquí */}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Reportes */}
        <Dialog open={showReports} onOpenChange={setShowReports}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Reportes y Denuncias
              </DialogTitle>
              <DialogDescription>
                Gestión de reportes de usuarios
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                {isLoadingReports ? (
                  <p>Cargando reportes...</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Usuario Reportado</th>
                        <th className="text-left p-2">Motivo</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id} className="border-b">
                          <td className="p-2">{report.user}</td>
                          <td className="p-2">{report.reason}</td>
                          <td className="p-2">{report.date}</td>
                          <td className="p-2">
                            <Badge variant={report.status === "Pendiente" ? "destructive" : "default"}>
                              {report.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReviewClick(report)}
                            >
                              Revisar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Revisión de Reporte */}
        <Dialog open={showReviewReport} onOpenChange={setShowReviewReport}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Revisar Reporte #{selectedReport.id}
              </DialogTitle>
              <DialogDescription>
                Detalles del reporte y acciones disponibles
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información del reporte */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Usuario Reportado</label>
                    <p className="mt-1">{selectedReport.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha</label>
                    <p className="mt-1">{selectedReport.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Motivo</label>
                    <p className="mt-1">{selectedReport.reason}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estado Actual</label>
                    <p className="mt-1">
                      <Badge variant={selectedReport.status === "Pendiente" ? "destructive" : "default"}>
                        {selectedReport.status}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Detalles del Reporte</label>
                  <p className="mt-1 text-sm">{selectedReport.details}</p>
                </div>

                {selectedReport.evidence && (
                  <div>
                    <label className="text-sm font-medium">Evidencia</label>
                    <div className="mt-1">
                      <a 
                        href={selectedReport.evidence} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Ver evidencia adjunta
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Cambiar Estado</label>
                  <Select onValueChange={handleStatusChange} defaultValue="pending">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="reviewing">En Revisión</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                      <SelectItem value="dismissed">Desestimado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notas de Revisión</label>
                  <Textarea 
                    className="mt-1"
                    placeholder="Ingresa notas sobre la revisión del reporte..."
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={() => handleReportAction("ban")}
                  >
                    Banear Usuario
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleReportAction("warn")}
                  >
                    Enviar Advertencia
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowReviewReport(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => handleReportAction("save")}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
