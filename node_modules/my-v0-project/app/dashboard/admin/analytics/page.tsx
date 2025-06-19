'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3Icon, TrendingUpIcon, UsersIcon, ShoppingBagIcon, DollarSignIcon, DownloadIcon, HomeIcon } from "lucide-react"

// Importaciones para DatePickerWithRange
import { CalendarIcon, FileTextIcon, TableIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { useState } from "react"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

// Importaciones para DropdownMenu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Justo después de los imports
if (typeof window !== "undefined" && autoTable) {
  (jsPDF as any).autoTable = autoTable;
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const [monthlyRevenue, setMonthlyRevenue] = useState([
    { month: "Enero", revenue: 12000 },
    { month: "Febrero", revenue: 15000 },
    { month: "Marzo", revenue: 18000 },
    { month: "Abril", revenue: 14000 },
    { month: "Mayo", revenue: 20000 },
    { month: "Junio", revenue: 17000 },
  ]);

  const [salesData, setSalesData] = useState([
    { period: "Semana 1", sales: 320 },
    { period: "Semana 2", sales: 450 },
    { period: "Semana 3", sales: 390 },
    { period: "Semana 4", sales: 520 },
  ]);

  const handleDownloadPdf = () => {
    console.log("Descargar PDF para el período:", dateRange)
    // Implementar lógica de descarga PDF aquí
    alert("Descargando reporte PDF...")
  }

  const handleDownloadExcel = () => {
    console.log("Descargar Excel para el período:", dateRange)
    // Implementar lógica de descarga Excel aquí
    alert("Descargando reporte Excel...")
  }

  const handleDownloadServicePdf = () => {
    const serviceData = [
      { service: "Grooming - Baño y Corte", bookings: 156, revenue: "$5,616" },
      { service: "Grooming - Spa Completo", bookings: 89, revenue: "$4,451" },
      { service: "Grooming - Cuidado Dental", bookings: 67, revenue: "$2,009" },
      { service: "Grooming - Corte de Uñas", bookings: 45, revenue: "$720" },
      { service: "Grooming - Desparasitación", bookings: 34, revenue: "$884" },
      { service: "Petshop - Alimento Premium", bookings: 210, revenue: "$8,900" },
      { service: "Petshop - Juguetes", bookings: 120, revenue: "$2,500" },
      { service: "Petshop - Accesorios", bookings: 98, revenue: "$1,900" },
      { service: "Petshop - Camas", bookings: 60, revenue: "$2,100" },
    ];
    const doc = new jsPDF();
    doc.text("Reporte de Servicios de Grooming y Petshop", 14, 16);
    (doc as any).autoTable({
      startY: 24,
      head: [["Servicio", "Reservas", "Ingresos"]],
      body: serviceData.map(s => [s.service, s.bookings, s.revenue]),
    });
    doc.save(`reporte_servicios_grooming_petshop_${format(dateRange?.from || new Date(), "yyyyMMdd")}_${format(dateRange?.to || new Date(), "yyyyMMdd")}.pdf`);
  }

  const handleDownloadServiceExcel = () => {
    const serviceData = [
      { service: "Baño y Corte", bookings: 156, revenue: "$5,616" },
      { service: "Spa Completo", bookings: 89, revenue: "$4,451" },
      { service: "Cuidado Dental", bookings: 67, revenue: "$2,009" },
      { service: "Corte de Uñas", bookings: 45, revenue: "$720" },
      { service: "Desparasitación", bookings: 34, revenue: "$884" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(serviceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Servicios");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `reporte_servicios_excel_${format(dateRange?.from || new Date(), "yyyyMMdd")}_${format(dateRange?.to || new Date(), "yyyyMMdd")}.xlsx`);
    alert("Generando reporte Excel de Servicios...");
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Estadísticas</h2>
            <p className="text-muted-foreground">Análisis completo del rendimiento del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Date Picker Component */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Seleccionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Dropdown Menu for Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Exportar Reporte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones de Descarga</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownloadPdf}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Descargar PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadExcel}>
                  <TableIcon className="mr-2 h-4 w-4" />
                  Descargar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Botón de Reporte de Servicios - Ahora centrado y destacado */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-500 rounded-lg p-6 flex flex-col items-center w-full max-w-xl">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  className="bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold px-8 py-4 rounded-lg shadow-lg"
                  size="lg"
                >
                  <DownloadIcon className="mr-3 h-6 w-6" />
                  Exportar Reporte de Servicios
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                <DropdownMenuLabel className="font-semibold text-blue-700">Opciones de Descarga de Servicios</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDownloadServicePdf}
                  className="cursor-pointer hover:bg-blue-50 text-blue-700"
                >
                  <FileTextIcon className="mr-2 h-4 w-4 text-blue-700" />
                  Descargar PDF de Servicios
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDownloadServiceExcel}
                  className="cursor-pointer hover:bg-blue-50 text-blue-700"
                >
                  <TableIcon className="mr-2 h-4 w-4 text-blue-700" />
                  Descargar Excel de Servicios
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20.1%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+180</span> nuevos este mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+19%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">Crecimiento mensual promedio</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="adoption-center">Centro de Adopción</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ingresos por Mes</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer config={{ revenue: { label: "Ingresos", color: "#6366f1" } }}>
                    <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#6366f1" name="Ingresos" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top PetShops</CardTitle>
                  <CardDescription>Por ingresos generados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[{
                      name: "PetShop Central", revenue: "$15,234", growth: "+23%"
                    },
                    {
                      name: "PetShop Norte", revenue: "$12,456", growth: "+18%"
                    },
                    {
                      name: "PetShop Sur", revenue: "$9,876", growth: "+15%"
                    },
                    {
                      name: "PetShop Este", revenue: "$7,654", growth: "+12%"
                    },].map((shop, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-muted-foreground">{shop.growth}</p>
                        </div>
                        <div className="text-sm font-medium">{shop.revenue}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Categorías</CardTitle>
                  <CardDescription>Ventas por categoría de productos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[{
                      category: "Comida", percentage: 40, amount: "$18,092"
                    },
                    {
                      category: "Juguetes", percentage: 25, amount: "$11,308"
                    },
                    {
                      category: "Accesorios", percentage: 20, amount: "$9,046"
                    },
                    {
                      category: "Snacks", percentage: 10, amount: "$4,523"
                    },
                    {
                      category: "Higiene", percentage: 5, amount: "$2,262"
                    },].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span>{item.amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Solicitados</CardTitle>
                  <CardDescription>Top 5 servicios por demanda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[{
                      service: "Baño y Corte", bookings: 156, revenue: "$5,616"
                    },
                    {
                      service: "Spa Completo", bookings: 89, revenue: "$4,451"
                    },
                    {
                      service: "Cuidado Dental", bookings: 67, revenue: "$2,009"
                    },
                    {
                      service: "Corte de Uñas", bookings: 45, revenue: "$720"
                    },
                    {
                      service: "Desparasitación", bookings: 34, revenue: "$884"
                    },].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.service}</p>
                          <p className="text-sm text-muted-foreground">{item.bookings} reservas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Ventas</CardTitle>
                <CardDescription>Rendimiento detallado de ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ sales: { label: "Ventas", color: "#10b981" } }}>
                  <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#10b981" name="Ventas" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Usuarios</CardTitle>
                <CardDescription>Comportamiento y crecimiento de usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de crecimiento de usuarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Servicios</CardTitle>
                <CardDescription>Rendimiento de servicios de grooming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3Icon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de servicios más demandados</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleDownloadServicePdf}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Descargar PDF de Servicios
                  </Button>
                  <Button variant="outline" onClick={handleDownloadServiceExcel}>
                    <TableIcon className="mr-2 h-4 w-4" />
                    Descargar Excel de Servicios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adoption-center" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Centro de Adopción</CardTitle>
                <CardDescription>Estadísticas de adopciones y mascotas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <HomeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de adopciones y comportamiento de mascotas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
