# Configuración Centralizada de la API

Este directorio contiene la configuración centralizada para todas las llamadas a la API del proyecto.

## Archivos de Configuración

### `api.ts`
Contiene la configuración centralizada de la API con:
- URL base de la API
- Endpoints específicos
- Funciones helper para construir URLs

## Uso

### Importar la configuración
```typescript
import { buildApiUrl, buildApiUrlWithParams } from '@/config/api';
```

### Construir URLs simples
```typescript
const url = buildApiUrl('/appointments');
// Resultado: http://localhost:5001/pethelp-a4e95/us-central1/api/appointments
```

### Construir URLs con parámetros
```typescript
const url = buildApiUrlWithParams('/appointments/range', {
  startDate: '2024-01-01T00:00:00.000Z',
  endDate: '2024-01-31T23:59:59.999Z'
});
// Resultado: http://localhost:5001/pethelp-a4e95/us-central1/api/appointments/range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z
```

## Variables de Entorno

### `NEXT_PUBLIC_API_URL`
- **Desarrollo local**: `http://localhost:5001/pethelp-a4e95/us-central1/api`
- **Producción**: `https://us-central1-pethelp-a4e95.cloudfunctions.net/api`

## Endpoints Disponibles

### Usuarios
- `USERS`: `/users`
- `USER_ROLE(userId)`: `/users/{userId}/role`

### Citas
- `APPOINTMENTS`: `/appointments`
- `APPOINTMENT_BY_ID(id)`: `/appointments/{id}`
- `APPOINTMENTS_BY_CLIENT(clientId)`: `/appointments/client/{clientId}`
- `APPOINTMENTS_RANGE`: `/appointments/range`

### Adopciones
- `ADOPTION_REQUESTS`: `/adoption-requests`
- `ADOPTION_REQUEST_BY_ID(id)`: `/adoption-requests/{id}`

### Notificaciones
- `NOTIFICATIONS`: `/api/notifications`
- `REGISTER_TOKEN`: `/api/notifications/register-token`
- `MARK_READ(notificationId)`: `/api/notifications/{notificationId}/mark-read`

### Admin
- `ADMIN_TOP_PRODUCTS`: `/admin/top-products`
- `ADMIN_TOP_SERVICES`: `/admin/top-services`

## Beneficios de la Centralización

1. **Consistencia**: Todas las URLs usan la misma configuración base
2. **Mantenibilidad**: Cambios en la URL base se hacen en un solo lugar
3. **Flexibilidad**: Fácil cambio entre desarrollo y producción
4. **Tipado**: TypeScript proporciona autocompletado y validación
5. **Reutilización**: Funciones helper para casos comunes

## Migración

Si encuentras URLs hardcodeadas en el código, reemplázalas usando:

```typescript
// Antes
const response = await fetch('http://localhost:5001/pethelp-a4e95/us-central1/api/appointments');

// Después
const response = await fetch(buildApiUrl('/appointments'));
``` 