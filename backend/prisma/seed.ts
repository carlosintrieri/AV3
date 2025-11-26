import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('');
    console.log('🌱 ========================================');
    console.log('🌱 INICIANDO SEED DO BANCO DE DADOS');
    console.log('🌱 ========================================');
    console.log('');

    const adminEmail = 'admin@aerocode.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrador';

    try {
        // 1️⃣ Verifica se usuário já existe
        console.log('🔍 Verificando se usuário já existe...');
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log('⚠️  USUÁRIO JÁ EXISTE!');
            console.log('');
            console.log('📋 Dados do usuário existente:');
            console.log(`   ID: ${existingUser.id}`);
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Nome: ${existingUser.name}`);
            console.log('');
            console.log('💡 Para recriar, delete o usuário primeiro:');
            console.log('   DELETE FROM User WHERE email = "admin@aerocode.com";');
            console.log('');
        } else {
            // 2️⃣ Cria hash da senha
            console.log('🔐 Gerando hash da senha...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            console.log('✅ Hash gerado:', hashedPassword.substring(0, 30) + '...');
            console.log('');

            // 3️⃣ Cria usuário
            console.log('👤 Criando usuário admin...');
            const adminUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: adminName
                }
            });

            console.log('');
            console.log('🎉 ========================================');
            console.log('🎉 USUÁRIO CRIADO COM SUCESSO!');
            console.log('🎉 ========================================');
            console.log('');
            console.log('📋 Informações do usuário:');
            console.log(`   ID: ${adminUser.id}`);
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Nome: ${adminUser.name}`);
            console.log(`   Senha: ${adminPassword}`);
            console.log(`   Hash: ${adminUser.password.substring(0, 30)}...`);
            console.log('');
        }

        // 4️⃣ Mostra credenciais
        console.log('🔑 ========================================');
        console.log('🔑 CREDENCIAIS DE LOGIN:');
        console.log('🔑 ========================================');
        console.log('');
        console.log('   📧 Email: admin@aerocode.com');
        console.log('   🔒 Senha: admin123');
        console.log('');
        console.log('✅ Use estas credenciais para fazer login!');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ ========================================');
        console.error('❌ ERRO AO CRIAR USUÁRIO');
        console.error('❌ ========================================');
        console.error('');
        console.error(error);
        console.error('');
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error('❌ ERRO FATAL:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
