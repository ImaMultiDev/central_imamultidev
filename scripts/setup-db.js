import { PrismaClient } from '@prisma/client';

async function setupDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Verificando conexión a la base de datos...');

        // Verificar conexión
        await prisma.$connect();
        console.log('✅ Conexión exitosa a la base de datos');

        // Verificar si hay usuarios
        const userCount = await prisma.user.count();
        console.log(`📊 Usuarios en la base de datos: ${userCount}`);

        if (userCount === 0) {
            console.log('👤 Creando usuario por defecto...');
            const user = await prisma.user.create({
                data: {
                    email: 'dev@example.com',
                    name: 'Usuario Desarrollo',
                    password: 'password123',
                },
            });
            console.log('✅ Usuario creado:', user.email);
        }

        console.log('🎉 Base de datos configurada correctamente');
    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error);
        console.log('\n📋 Pasos para solucionar:');
        console.log('1. Asegúrate de que PostgreSQL esté ejecutándose');
        console.log('2. Crea un archivo .env con DATABASE_URL');
        console.log('3. Ejecuta: npx prisma db push');
        console.log('4. Ejecuta: npx prisma generate');
    } finally {
        await prisma.$disconnect();
    }
}

setupDatabase(); 