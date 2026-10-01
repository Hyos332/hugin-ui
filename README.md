## Despliegue con Docker

### Usando Docker Compose (Recomendado)
Para construir la imagen y levantar el contenedor en segundo plano: a

```bash
docker compose up -d --build
```

La aplicación estará disponible en `http://localhost:8080`.

### Usando Docker CLI directamente

1. **Construir la imagen:**
   ```bash
   docker build -t hugin-ui .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -d -p 8080:80 --name hugin-ui hugin-ui
   ```

