<div align="center">

# TeamApp v2

**Portal de servicios y gestión para equipos de trabajo**

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

---

## ¿Qué es TeamApp?

TeamApp es una Progressive Web App (PWA) pensada para colaboradores de empresas que necesitan gestionar sus servicios internos desde el celular o el computador. Desde un solo lugar puedes pedir tu comida, comprar en la tienda de la empresa y controlar el acceso a puertas, todo con la identidad visual de tu empresa.

---

## Características

### Autenticación
- Login con usuario y contraseña (JWT)
- Integración con Discord OAuth
- Refresh automático de tokens (30 días)
- Cierre de sesión automático ante errores de autorización

### Servicio de Comidas
- Pedido de desayuno, almuerzo y cena en tiempo real vía WebSocket
- Opciones vegetarianas con UI diferenciada (verde para regular, teal para vegano)
- Vista semanal del cronograma de comidas disponibles
- Confirmación de pedidos y seguimiento por turno horario

### Tienda Interna
- Catálogo de productos con paginación
- Carrito de compras por tienda
- Sistema de compra a crédito (trust purchase)
- Control de stock disponible

### Control de Puertas
- Visualización de puertas accesibles por colaborador
- Apertura remota de puertas en tiempo real
- Estado actualizado desde el backend

### Perfil y Carnet
- Carnet digital del empleado con datos de empresa y ciudad
- Reloj en vivo con animación de borde
- Estado de comida activa visible en el carnet
- Proceso de configuración inicial de perfil

### Identidad de Empresa
- Colores primario/secundario cargados dinámicamente desde la API
- Detección automática de contraste para texto (fondo claro/oscuro)
- Logo de empresa en modales y cabeceras
- PWA instalable con icono y splash screen

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) |
| UI | [Vue 3](https://vuejs.org) + [Tailwind CSS](https://tailwindcss.com) + [Vuetify 3](https://vuetifyjs.com) |
| Iconos | [Lucide Vue Next](https://lucide.dev) + [MDI](https://materialdesignicons.com) |
| Autenticación | [@sidebase/nuxt-auth](https://sidebase.io/nuxt-auth) (NextAuth) |
| PWA | [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) |
| Fuentes | Poppins via [@nuxt/fonts](https://fonts.nuxt.com) |
| Backend | Django REST + Django Channels (WebSockets) |

---

## Estructura del proyecto

```
teamappv2/
├── pages/
│   ├── index.vue            # Redirección raíz
│   ├── login.vue            # Página de login
│   ├── setup.vue            # Configuración inicial del perfil
│   └── dashboard/
│       └── index.vue        # Dashboard principal (Home / Comidas / Tienda)
│
├── layouts/
│   └── dashboard.vue        # Layout con BottomNav y modales globales
│
├── components/
│   ├── accounts/
│   │   ├── Login.vue        # Formulario de login + Discord
│   │   ├── LoginDiscord.vue # Botón y callback OAuth Discord
│   │   └── Enterprise.vue   # Logo de empresa en pantalla de login
│   ├── dashboard/
│   │   ├── Navbar.vue       # Cabecera con avatar y opciones
│   │   ├── BottomNav.vue    # Navegación inferior con FABs
│   │   ├── Balance.vue      # Tarjeta de saldo disponible
│   │   ├── Food.vue         # Selector de comidas (desayuno/almuerzo/cena)
│   │   ├── Store.vue        # Lista de tiendas
│   │   ├── StoreDetail.vue  # Detalle de tienda + carrito
│   │   ├── CarnetModal.vue  # Carnet digital del colaborador
│   │   ├── DoorsModal.vue   # Control de acceso a puertas
│   │   ├── ProfileHeader.vue
│   │   └── WeekSchedule.vue # Vista semanal de comidas
│   └── UIKit/               # Componentes de diseño reutilizables
│       ├── Avatar.vue
│       ├── Badge.vue
│       ├── Toast.vue
│       ├── Loader.vue
│       ├── Button/
│       ├── Input/
│       └── Modal/
│
├── composables/
│   ├── useApi.ts                # Cliente HTTP base con autenticación
│   ├── useBalanceApi.ts         # API de saldo
│   ├── useCart.ts               # Estado del carrito de compras
│   ├── useCollaboratorApi.ts    # API de perfil del colaborador
│   ├── useCollaboratorState.ts  # Estado global del colaborador
│   ├── useCompanyTheme.ts       # Tema dinámico por empresa
│   ├── useDashboardTab.ts       # Tab activo del dashboard
│   ├── useDoorApi.ts            # API de puertas
│   ├── useFoodApi.ts            # API de cronograma de comidas
│   ├── useFoodWebSocket.ts      # WebSocket para pedidos en tiempo real
│   ├── useStoreApi.ts           # API de tienda e inventario
│   └── useToast.ts              # Notificaciones toast
│
├── types/
│   ├── collaborator.ts          # Tipos del colaborador y empresa
│   ├── door.ts                  # Tipos de puertas
│   ├── food.ts                  # Tipos del servicio de comidas
│   └── store.ts                 # Tipos de tienda e inventario
│
├── server/
│   └── api/
│       └── balance/
│           └── me.get.ts        # Endpoint de saldo (Nuxt server route)
│
├── assets/css/
│   └── main.css                 # Estilos globales + Tailwind
│
└── public/
    ├── icon.png
    ├── peepo_ramen.gif
    └── peepo_pizza.gif
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz con los siguientes valores:

```env
# URL del backend Django
BASE_URL=https://teamapp.uner.gy

# URL pública del frontend (usada por NextAuth para callbacks)
FRONTEND_URL=https://teamappspa.uner.gy

# Puerto de escucha en desarrollo/producción
EXPOSE_PORT=3000
```

---

## Instalación y desarrollo

### Requisitos
- Node.js 18+
- npm / pnpm / yarn / bun

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-org/teamappv2.git
cd teamappv2

# Instala dependencias
npm install
```

### Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.

### Build de producción

```bash
npm run build
npm run preview
```

### Generación estática

```bash
npm run generate
```

---

## Flujo de autenticación

```
Usuario ingresa credenciales
        │
        ▼
POST /api/token/  ──────────────────► Django devuelve { access, refresh }
        │
        ▼
Token guardado en cookie `token.access`
        │
        ▼
GET /api/accounts/user/  ────────────► Datos del usuario inyectados en sesión
        │
        ▼
Redirección a /dashboard
        │
        ▼
Todas las requests incluyen:  Authorization: Bearer <token>
        │
        ├── 401 ──► POST /api/token/refresh/  ──► Nuevo token
        │                    │
        │                    └── Fallo ──► signOut() automático
        └── OK ──► Respuesta normal
```

---

## API del backend

La app se comunica con un backend Django en `BASE_URL`:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/token/` | Login (obtener access + refresh token) |
| `POST` | `/api/token/refresh/` | Renovar token |
| `GET` | `/api/accounts/user/` | Info del usuario autenticado |
| `GET` | `/api/colaborator/?from=me` | Perfil del colaborador |
| `POST` | `/api/colaborator/create_basic_profile/` | Crear perfil inicial |
| `GET` | `/api/cities/` | Ciudades disponibles |
| `WS` | `/ws/restaurant/` | WebSocket de pedidos de comida |
| `GET` | `/api/store/?page=N` | Catálogo de tiendas |
| `GET` | `/api/store/stock/?store=ID` | Stock de una tienda |
| `POST` | `/api/store/stock/trust_purchase/` | Compra a crédito |
| `GET` | `/api/colaborator/doors/?colaborator_id=ID` | Puertas accesibles |
| `GET` | `/api/colaborator/open_door/?door_id=ID` | Abrir una puerta |
| `GET` | `/api/colaborator/ID/balance/` | Saldo del colaborador |
| `POST` | `/api/accounts/discord/` | Callback de Discord OAuth |

---

## Sistema de temas por empresa

Los colores de cada empresa se cargan automáticamente desde la API del colaborador:

```ts
// Ejemplo de datos del colaborador
{
  company: {
    primary_color: "#753BBD",   // Color primario (botones, loader, accents)
    secondary_color: "#1E1E1E", // Color de fondo
    logo: "https://..."
  }
}
```

El composable `useCompanyTheme` detecta la luminosidad del color y ajusta automáticamente el color del texto para garantizar contraste legible en cualquier tema.

---

## Convenciones de código

- **Composables** para toda la lógica de negocio y estado global
- **TypeScript** en todos los archivos `.ts` y bloques `<script setup lang="ts">`
- **Tailwind CSS** para estilos; CSS custom solo para animaciones complejas
- **`$fetch`** de Nuxt para todas las llamadas HTTP (sin axios)
- **`definePageMeta`** para proteger rutas con autenticación global
- **`useState`** de Nuxt para estado reactivo compartido entre componentes

---

## Licencia

OpenSource
