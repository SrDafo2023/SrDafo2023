"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentService } from "@/lib/appointment-service";
import { useUser } from "@/hooks/useUser";
import { es } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { buildApiUrl } from "@/config/api";

const HOURS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

async function fetchOccupiedHours(serviceId: string, date: Date): Promise<string[]> {
  const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const res = await fetch(buildApiUrl(`/appointments/occupied`) + `?serviceId=${serviceId}&date=${dateStr}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.occupied || [];
}

export default function AgendarCitaPage() {
  const router = useRouter();
  const { serviceId } = useParams();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate || !serviceId) {
      setAvailableHours([]);
      return;
    }
    setLoading(true);
    fetchOccupiedHours(String(serviceId), selectedDate)
      .then((occupied) => {
        setAvailableHours(HOURS.filter(h => !occupied.includes(h)));
      })
      .catch(() => setAvailableHours(HOURS))
      .finally(() => setLoading(false));
  }, [selectedDate, serviceId]);

  const handleAgendar = async () => {
    if (!user) {
      toast({ title: "Debes iniciar sesión para agendar una cita", variant: "destructive" });
      return;
    }
    if (!selectedDate || !selectedHour) {
      toast({ title: "Selecciona fecha y hora", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const [hours, minutes] = selectedHour.split(":");
      const date = new Date(selectedDate);
      date.setHours(Number(hours), Number(minutes), 0, 0);
      await appointmentService.create({
        clientId: user.id,
        petId: "", // Puedes pedir selección de mascota si lo necesitas
        serviceId: String(serviceId),
        date,
        notes: "",
      });
      toast({ title: "Cita agendada con éxito" });
      router.push("/dashboard/grooming/appointments");
    } catch (e: any) {
      toast({ title: "Error al agendar cita", description: e?.response?.data?.error || String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Cita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Selecciona una fecha</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={es}
              disabled={(date) => date < new Date()}
            />
          </div>
          {selectedDate && (
            <div className="mb-6">
              <label className="block mb-2 font-medium">Selecciona una hora</label>
              <div className="grid grid-cols-3 gap-2">
                {availableHours.length === 0 && <span className="col-span-3 text-muted-foreground">No hay horas disponibles</span>}
                {availableHours.map(hour => (
                  <Button
                    key={hour}
                    variant={selectedHour === hour ? "default" : "outline"}
                    onClick={() => setSelectedHour(hour)}
                    disabled={loading}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
            onClick={handleAgendar}
            disabled={loading || !selectedDate || !selectedHour}
          >
            {loading ? "Agendando..." : "Confirmar Cita"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 