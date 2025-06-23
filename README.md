# 🐾 PetHelp - Sistema Integral de Gestión para Mascotas

PetHelp es una aplicación web completa diseñada para centralizar diversos servicios para mascotas. Ofrece una plataforma robusta que conecta a dueños de mascotas con tiendas, centros de adopción y servicios de grooming, todo a través de una interfaz intuitiva y con paneles de control específicos para cada tipo de usuario.

## 📜 Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Características Principales](#-características-principales)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [Cómo Contribuir](#-cómo-contribuir)
- [Licencia](#-licencia)

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack de tecnologías moderno y escalable:

- **Frontend**:
  - [Next.js](https://nextjs.org/) - Framework de React para producción.
  - [React](https://react.dev/) - Biblioteca para construir interfaces de usuario.
  - [TypeScript](https://www.typescriptlang.org/) - JavaScript con tipado estático.
  - [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS para diseño rápido.
  - [Shadcn/ui](https://ui.shadcn.com/) - Componentes de UI reutilizables.

- **Backend**:
  - [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript del lado del servidor.
  - [Express.js](https://expressjs.com/) - Framework para la creación de APIs.

- **Base de Datos y Autenticación**:
  - [Firebase](https://firebase.google.com/) - Plataforma de desarrollo de aplicaciones de Google.
    - **Firestore**: Base de datos NoSQL para almacenar datos de usuarios, mascotas, pedidos, etc.
    - **Firebase Authentication**: Para la gestión de usuarios y roles.
    - **Cloud Functions**: Para alojar y ejecutar la lógica del backend.
    - **Firebase Storage**: Para almacenar imágenes de mascotas y productos.

## ✨ Características Principales

- **Sistema de Roles**: Autenticación diferenciada para 5 tipos de usuarios: Administrador, Usuario, PetShop, Grooming y Centro de Adopción.
- **Paneles de Control (Dashboards)**: Interfaces dedicadas y personalizadas para cada rol, permitiendo una gestión eficiente de sus respectivas tareas.
- **Módulo de Adopción**: Los centros de adopción pueden publicar mascotas, y los usuarios pueden enviar formularios para adoptarlas. Incluye seguimiento de solicitudes.
- **Gestión de Usuarios**: El panel de administrador permite listar, editar y asignar roles a todos los usuarios del sistema de forma segura.
- **Seguridad Robusta**:
  - **Reglas de Firestore**: Reglas de seguridad detalladas que protegen el acceso a los datos a nivel de base de datos.
  - **Backend Seguro**: Endpoints de API protegidos con middleware para validar que solo los usuarios con los permisos adecuados (ej. administradores) puedan realizar acciones críticas.
- **Notificaciones**: Sistema de notificaciones en tiempo real para mantener informados a los usuarios sobre el estado de sus solicitudes de adopción.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/en/download/) (se recomienda versión 18 o superior).
- `npm` (generalmente incluido con Node.js) o `pnpm`.
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) instalado de forma global en tu sistema.

```bash
npm install -g firebase-tools
```

## 🚀 Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

1.  **Clona el repositorio:**
    ```bash
    git clone https://URL_DEL_REPOSITORIO.git
    cd pethelp
    ```

2.  **Configura tu proyecto de Firebase:**
    - Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
    - Activa los siguientes servicios: **Authentication**, **Firestore Database**, **Storage** y **Functions**.
    - En **Authentication**, habilita el proveedor de "Email/Contraseña".

3.  **Configura el Frontend:**
    - Navega a la carpeta `Frontend`: `cd Frontend`.
    - Crea un archivo `.env.local` en la raíz de la carpeta `Frontend` y añade la configuración de tu proyecto de Firebase. Puedes obtenerla desde la configuración de tu proyecto en la consola de Firebase (`Configuración del proyecto > Tus apps > Configuración de SDK`).
      ```
      # Frontend/.env.local

      NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
      NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
      NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
      ```
    - Instala las dependencias:
      ```bash
      npm install
      ```

4.  **Configura el Backend:**
    - Navega a la carpeta `Backend`: `cd ../Backend`.
    - Genera una clave de cuenta de servicio privada en tu proyecto de Firebase (`Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada`).
    - Renombra el archivo `.json` descargado a `pethelp-credentials.json` y colócalo dentro de la carpeta `Backend/config`.
    - Instala las dependencias:
      ```bash
      npm install
      ```

5.  **Conecta la CLI de Firebase con tu proyecto:**
    - En la raíz del proyecto, ejecuta:
      ```bash
      firebase login
      firebase use --add
      ```
    - Sigue las instrucciones y selecciona el ID del proyecto que creaste.

## ▶️ Uso

Para ejecutar la aplicación en tu entorno de desarrollo:

- **Para el Frontend (Next.js):**
  ```bash
  cd Frontend
  npm run dev
  ```
  La aplicación estará disponible en `http://localhost:3000`.

- **Para el Backend (Cloud Functions con Emulador):**
  - Es recomendable usar los [Emuladores de Firebase](https://firebase.google.com/docs/emulator-suite) para probar el backend localmente.
  ```bash
  # Desde la raíz del proyecto
  firebase emulators:start
  ```

- **Desplegar en producción:**
  ```bash
  # Desplegar todo (frontend, backend, reglas, etc.)
  firebase deploy

  # Desplegar solo las reglas de seguridad de Firestore
  firebase deploy --only firestore:rules

  # Desplegar solo las Cloud Functions (backend)
  firebase deploy --only functions
  ```

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor sigue estos pasos:

1.  **Haz un Fork** del repositorio.
2.  **Crea una nueva rama** para tu funcionalidad (`git checkout -b feature/AmazingFeature`).
3.  **Haz tus cambios** y haz commit de ellos (`git commit -m 'Add some AmazingFeature'`).
4.  **Haz Push** a la rama (`git push origin feature/AmazingFeature`).
5.  **Abre un Pull Request**.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

### Estructura del Proyecto
```
pethelp/
├── Backend/         # Servidor Express + Firebase Admin
├── Frontend/        # Next.js + Firebase Client
└── shared/         # Tipos y utilidades compartidas
```

# 📦 Publicar un Proyecto en GitHub (Guía Rápida)

Este documento explica los pasos básicos para subir (publicar) un proyecto a un repositorio de GitHub usando la línea de comandos.

## 1. Clona el repositorio (si aún no lo tienes)

```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

## 2. Agrega tus archivos al proyecto

Copia o crea los archivos de tu proyecto dentro de la carpeta del repositorio.

## 3. Verifica el estado de los archivos

```bash
git status
```

## 4. Agrega los archivos al área de preparación (staging)

```bash
git add .
```

## 5. Haz un commit con un mensaje descriptivo

```bash
git commit -m "Descripción de los cambios o publicación inicial"
```

## 6. Sube los cambios al repositorio remoto

```bash
git push origin main
```

> **Nota:** Si la rama principal se llama diferente (por ejemplo, `master`), reemplaza `main` por el nombre correcto.

---

## Ejemplo de flujo completo

```bash
git add .
git commit -m "Publicación inicial del proyecto"
git push origin main
```

---

## Consejos

- Asegúrate de tener permisos de escritura en el repositorio.
- Si es la primera vez que usas Git en tu PC, configura tu usuario:
  ```bash
  git config --global user.name "Tu Nombre"
  git config --global user.email "tuemail@ejemplo.com"
  ```

---

¡Listo! Así es como publicamos nuestro proyecto en GitHub. Si tienes dudas, pregunta a cualquier miembro del equipo.

