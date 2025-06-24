// Configuración centralizada de la API
// Esta configuración debe ser consistente en todo el proyecto

// URL base de la API de Firebase Functions
// Para desarrollo local: http://localhost:5001/[PROJECT_ID]/us-central1/api
// Para producción: https://[REGION]-[PROJECT_ID].cloudfunctions.net/api

const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/pethelp-a4e95/us-central1/api',
  
  // Endpoints específicos
  ENDPOINTS: {
    // Usuarios
    USERS: '/users',
    USER_ROLE: (userId: string) => `/users/${userId}/role`,
    
    // Citas
    APPOINTMENTS: '/appointments',
    APPOINTMENT_BY_ID: (id: string) => `/appointments/${id}`,
    APPOINTMENTS_BY_CLIENT: (clientId: string) => `/appointments/client/${clientId}`,
    APPOINTMENTS_RANGE: '/appointments/range',
    
    // Adopciones
    ADOPTION_REQUESTS: '/adoption-requests',
    ADOPTION_REQUEST_BY_ID: (id: string) => `/adoption-requests/${id}`,
    
    // Notificaciones
    NOTIFICATIONS: '/api/notifications',
    REGISTER_TOKEN: '/api/notifications/register-token',
    MARK_READ: (notificationId: string) => `/api/notifications/${notificationId}/mark-read`,
    
    // Admin
    ADMIN_TOP_PRODUCTS: '/admin/top-products',
    ADMIN_TOP_SERVICES: '/admin/top-services',
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para construir URLs con parámetros
export const buildApiUrlWithParams = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// Exportar la configuración
export default API_CONFIG; 