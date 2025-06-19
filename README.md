# PetHelp

## Configuración del Proyecto

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm o pnpm
- Cuenta de Firebase

### Configuración de Firebase

1. **Credenciales del Backend:**
   - Obtén el archivo de credenciales de servicio desde la consola de Firebase
   - Renombra el archivo a `pethelp-credencial.json`
   - Colócalo en la carpeta `Backend/`
   - Usa `pethelp-credencial.example.json` como referencia

2. **Variables de Entorno:**
   - Crea un archivo `.env` en la carpeta `Backend/`
   ```
   PORT=3005
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Instalación

1. **Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Notas de Seguridad
- No subas nunca el archivo `pethelp-credencial.json` al repositorio
- Mantén tus credenciales y claves API seguras
- Usa variables de entorno para configuraciones sensibles

### Estructura del Proyecto
```
pethelp/
├── Backend/         # Servidor Express + Firebase Admin
├── Frontend/        # Next.js + Firebase Client
└── shared/         # Tipos y utilidades compartidas
```