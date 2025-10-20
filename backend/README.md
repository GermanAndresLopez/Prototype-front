# Multi-Cloud Backend API

Backend del sistema de aprovisionamiento multi-nube construido con Node.js y Express.

## Instalación

```bash
cd backend
npm install
```

## Iniciar el Servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints API

### GET `/api/v1/config`
Obtiene las configuraciones disponibles (proveedores, tipos de máquinas, regiones, etc.)

### POST `/api/v1/provision`
Aprovisiona una nueva infraestructura.

**Body:**
```json
{
  "provider": "aws|azure|gcp|onpremise",
  "builderType": "standard",
  "choice": "web",
  "specs": {
    "region": "us-east-1",
    "storageType": "gp3",
    "name": "mi-servidor"
  }
}
```

### POST `/api/v1/template`
Guarda un template de infraestructura.

**Body:**
```json
{
  "name": "mi-template",
  "infra": { ... }
}
```

### POST `/api/v1/template/clone`
Clona un template existente con overrides opcionales.

**Body:**
```json
{
  "name": "mi-template",
  "overrides": {
    "vm": { "size": "large" }
  }
}
```

## Puerto

Por defecto: `3000`

Configurable con variable de entorno `PORT`
