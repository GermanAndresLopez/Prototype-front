Multi-Cloud API (Abstract Factory + Builder + Prototype + Director)
---------------------------------------------------------------

## Descripción
Sistema de aprovisionamiento multi-nube con backend en Node.js/Express y frontend en React.
Implementa los patrones de diseño Abstract Factory, Builder, Prototype y Director.

**Frontend y Backend están completamente separados y pueden ejecutarse en servidores diferentes.**

## Arquitectura del Frontend (MVC + SOLID)

### Estructura de Carpetas
```
frontend/
├── src/
│   ├── models/               # Modelos de datos (M)
│   │   ├── ProvisionModel.js
│   │   ├── TemplateModel.js
│   │   └── InfrastructureModel.js
│   ├── controllers/          # Controladores (C)
│   │   ├── ProvisionController.js
│   │   └── TemplateController.js
│   ├── services/             # Servicios de API
│   │   └── ApiService.js
│   ├── views/                # Vistas (V)
│   │   ├── components/
│   │   │   ├── ProviderSelector.jsx
│   │   │   ├── ProvisionForm.jsx
│   │   │   ├── InfrastructureResult.jsx
│   │   │   ├── TemplateManager.jsx
│   │   │   └── Notification.jsx
│   │   └── pages/
│   │       └── HomePage.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
└── index.html
```

### Principios SOLID Aplicados

1. **Single Responsibility Principle (SRP)**
   - Cada modelo tiene una única responsabilidad (ProvisionModel, TemplateModel, InfrastructureModel)
   - Los controladores están separados por dominio (ProvisionController, TemplateController)
   - Los componentes tienen propósitos específicos y bien definidos

2. **Open/Closed Principle (OCP)**
   - Los modelos pueden extenderse sin modificar su código base
   - El ApiService es extensible para nuevos métodos HTTP

3. **Liskov Substitution Principle (LSP)**
   - Los modelos implementan métodos comunes (validate(), toJSON())
   - Los componentes React siguen la misma interfaz de props

4. **Interface Segregation Principle (ISP)**
   - Los componentes reciben solo las props que necesitan
   - Los controladores exponen solo los métodos necesarios

5. **Dependency Inversion Principle (DIP)**
   - Los controladores dependen de abstracciones (ApiService)
   - Los componentes reciben funciones como props (inversión de control)

## Instalación y Uso

### Opción 1: Ejecutar Backend y Frontend por Separado (Recomendado)

#### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```
El servidor backend estará disponible en `http://localhost:3000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

### Opción 2: Build de Frontend para Producción
```bash
cd frontend
npm install
npm run build
```
Los archivos compilados estarán en `frontend/dist/`

### Configuración
- El backend corre en puerto **3000**
- El frontend corre en puerto **5173**
- El frontend se conecta automáticamente al backend en `http://localhost:3000`
- CORS está habilitado en el backend para permitir conexiones desde el frontend

## Endpoints API

### Aprovisionar Infraestructura
**POST** `/api/v1/provision`
```json
{
  "provider": "aws|azure|gcp|onpremise",
  "builderType": "standard",
  "choice": "web",
  "specs": {
    "region": "us-east-1",
    "size": "t2.micro",
    "name": "mi-servidor"
  }
}
```

### Guardar Template
**POST** `/api/v1/template`
```json
{
  "name": "mi-template",
  "infra": { ... }
}
```

### Clonar Template
**POST** `/api/v1/template/clone`
```json
{
  "name": "mi-template",
  "overrides": {
    "vm": { "size": "large" }
  }
}
```

## Características del Frontend

- ✅ Interfaz visual para seleccionar proveedores cloud (AWS, Azure, GCP, On-Premise)
- ✅ **Selects dinámicos** - El usuario selecciona opciones, no escribe
- ✅ Selección de categorías y tipos de máquinas según el proveedor elegido
- ✅ Selección de regiones específicas por proveedor
- ✅ Selección de tipos de almacenamiento
- ✅ Carga automática de configuraciones desde el backend
- ✅ Visualización de resultados en tarjetas organizadas
- ✅ Sistema de notificaciones para feedback de operaciones
- ✅ Gestión de templates (guardar y clonar)
- ✅ Diseño responsive y moderno con gradientes
- ✅ Animaciones y transiciones suaves
- ✅ Arquitectura MVC con separación clara de responsabilidades
- ✅ Implementación de principios SOLID

## Proveedores Soportados

- **AWS** (Amazon Web Services)
- **Azure** (Microsoft Azure)
- **GCP** (Google Cloud Platform)
- **On-Premise** (Infraestructura local)

## Tecnologías

### Backend
- Node.js
- Express.js
- Body-parser
- CORS

### Frontend
- React 18
- Vite 5
- CSS3 (Variables CSS, Grid, Flexbox)

## Estructura del Proyecto

```
project/
├── backend/               # Backend independiente
│   ├── src/
│   │   ├── app.js        # Servidor Express con CORS
│   │   ├── controllers/
│   │   ├── core/
│   │   ├── builders/
│   │   ├── factories/
│   │   └── models/
│   ├── tests/
│   └── package.json
│
├── frontend/             # Frontend independiente
│   ├── src/
│   │   ├── models/       # Modelos (M)
│   │   ├── controllers/  # Controladores (C)
│   │   ├── views/        # Vistas (V)
│   │   ├── services/     # Servicios API
│   │   └── styles/
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Tests
Use `backend/tests/provisioner.rest` con VSCode REST Client para probar los endpoints
