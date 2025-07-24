# Configuración de la Base de Datos

## Pasos para configurar la base de datos

### 1. Instalar PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose en tu sistema.

### 2. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/central_imamultidev"

# JWT Secret Key
JWT_SECRET="your-super-secret-jwt-key-for-development"

# Environment
NODE_ENV="development"
```

**Nota:** Ajusta los valores según tu configuración de PostgreSQL:

- `postgres`: usuario de la base de datos
- `password`: contraseña del usuario
- `localhost:5432`: host y puerto de PostgreSQL
- `central_imamultidev`: nombre de la base de datos

### 3. Crear la base de datos

```bash
# Crear la base de datos (si no existe)
createdb central_imamultidev

# O usando psql:
psql -U postgres -c "CREATE DATABASE central_imamultidev;"
```

### 4. Ejecutar migraciones de Prisma

```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar el esquema a la base de datos
npx prisma db push

# (Opcional) Verificar la conexión
node scripts/setup-db.js
```

### 5. Verificar la configuración

El script `setup-db.js` verificará:

- ✅ Conexión a la base de datos
- ✅ Creación de usuario por defecto
- ✅ Configuración correcta

### 6. Ejecutar el proyecto

```bash
npm run dev
```

## Solución de problemas

### Error: "Error al crear curso"

- Verifica que PostgreSQL esté ejecutándose
- Confirma que la URL de la base de datos sea correcta
- Ejecuta `npx prisma db push` para aplicar el esquema

### Error: "No autorizado"

- El script creará automáticamente un usuario por defecto
- En desarrollo, no se requiere autenticación real

### Error: "Connection refused"

- Verifica que PostgreSQL esté ejecutándose en el puerto 5432
- Confirma que las credenciales sean correctas
