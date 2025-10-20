# Guía de Inicio Rápido

## Paso 1: Iniciar el Backend

Abre una terminal y ejecuta:

```bash
cd backend
npm install
npm start
```

Verás el mensaje: `Server listening on 3000`

## Paso 2: Iniciar el Frontend

Abre **otra terminal** y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

Verás algo como:
```
➜  Local:   http://localhost:5173/
```

## Paso 3: Usar la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Selecciona un proveedor cloud (AWS, Azure, GCP, On-Premise)
3. Selecciona el tipo de builder
4. Elige la categoría de máquina
5. Elige el tipo de máquina (verás vCPU y RAM)
6. Selecciona la región
7. Selecciona el tipo de almacenamiento
8. Dale un nombre al recurso
9. Haz clic en "Aprovisionar Infraestructura"

## Solución de Problemas

### Error: "Error al cargar configuración"
- Verifica que el backend esté corriendo en el puerto 3000
- Abre `http://localhost:3000/api/v1/config` en tu navegador para verificar

### El formulario no muestra opciones
- Recarga la página
- Verifica la consola del navegador (F12) para ver errores

### Puerto 3000 o 5173 en uso
- Backend: Cambia el puerto en `backend/src/app.js` (línea `const PORT = process.env.PORT || 3000;`)
- Frontend: Cambia el puerto en `vite.config.js` y actualiza la URL en `frontend/src/services/ApiService.js`
