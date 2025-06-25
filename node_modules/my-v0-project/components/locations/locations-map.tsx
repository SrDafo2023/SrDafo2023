"use client"

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

interface Location {
  id: number | string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationsMapProps {
  locations: Location[];
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => {
    if (locations.length > 0) {
      return { lat: locations[0].lat, lng: locations[0].lng };
    }
    // Coordenadas de respaldo si no hay ubicaciones
    return { lat: 40.7128, lng: -74.0060 };
  }, [locations]);

  if (loadError) {
    return <div>Error al cargar el mapa. Asegúrate de que la clave de API sea correcta.</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '0.5rem' }}
      center={center}
      zoom={12}
    >
      {locations.map((location) => (
        <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} title={location.name} />
      ))}
    </GoogleMap>
  );
} 