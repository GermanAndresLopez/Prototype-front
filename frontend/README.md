# Multi-Cloud Frontend

Frontend del sistema de aprovisionamiento multi-nube construido con React y Vite.

## Instalación

```bash
cd frontend
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en `frontend/dist/`

## Configuración

El frontend está configurado para conectarse al backend en:
```
http://localhost:3000
```

Si el backend está en otra URL, edita `frontend/src/services/ApiService.js`

## Características

- Selección visual de proveedores cloud
- Selección dinámica de tipos de máquinas según el proveedor
- Selección de regiones y tipos de almacenamiento
 - Selección de regiones, tipos de almacenamiento y tamaño en GB (campo "Tamaño de Almacenamiento (GB)")
- Visualización de infraestructura aprovisionada
- Gestión de templates
- Sistema de notificaciones

## Estructura MVC

- **Models**: Modelos de datos con validación
- **Controllers**: Lógica de negocio y comunicación con API
- **Views**: Componentes React (páginas y componentes reutilizables)
- **Services**: Servicios de API y configuración
