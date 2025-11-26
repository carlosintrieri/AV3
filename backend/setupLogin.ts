
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setupLogin() {
    console.log('');
    console.log(' ================================================');
    console.log(' CONFIGURAÇÃO DEFINITIVA DE LOGIN');
    console.log('================================================');
    console.log('');

    const EMAIL = 'admin@aerocode.com';
    const PASSWORD = 'admin123';
    const NAME = 'Administrador';

    try {
        // =====================================================
        // ETAPA 1: DELETAR USUÁRIO ANTIGO
        // =====================================================
        console.log('  ETAPA 1: Limpando usuários antigos...');

        const deleted = await prisma.user.deleteMany({
            where: { email: EMAIL }
        });

        if (deleted.count > 0) {
            console.log(`   ✅ ${deleted.count} usuário(s) deletado(s)`);
        } else {
            console.log('   ℹ️  Nenhum usuário para deletar');
        }
        console.log('');

        // =====================================================
        // ETAPA 2: CRIAR HASH DA SENHA
        // =====================================================
        console.log(' ETAPA 2: Gerando hash da senha...');
        console.log(`   Senha original: ${PASSWORD}`);

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        console.log(`   Hash gerado: ${hashedPassword}`);
        console.log('');

        // =====================================================
        // ETAPA 3: CRIAR NOVO USUÁRIO
        // =====================================================
        console.log(' ETAPA 3: Criando novo usuário...');

        const user = await prisma.user.create({
            data: {
                email: EMAIL,
                password: hashedPassword,
                name: NAME
            }
        });

        console.log('   ✅ Usuário criado com sucesso!');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nome: ${user.name}`);
        console.log('');

        // =====================================================
        // ETAPA 4: TESTAR LOGIN
        // =====================================================
        console.log(' ETAPA 4: Testando login...');
        console.log(`   Testando senha: ${PASSWORD}`);

        const isValid = await bcrypt.compare(PASSWORD, hashedPassword);

        if (isValid) {
            console.log('   ✅ SENHA VALIDADA COM SUCESSO!');
        } else {
            console.log('   ❌ ERRO: Senha não valida!');
            throw new Error('Falha na validação da senha');
        }
        console.log('');

        // =====================================================
        // ETAPA 5: SIMULAR LOGIN COMPLETO
        // =====================================================
        console.log('ETAPA 5: Simulando login completo...');

        // Busca usuário (como o backend faz)
        const foundUser = await prisma.user.findUnique({
            where: { email: EMAIL }
        });

        if (!foundUser) {
            throw new Error('Usuário não encontrado após criação!');
        }
        console.log('   ✅ Usuário encontrado no banco');

        // Valida senha (como o backend faz)
        const loginValid = await bcrypt.compare(PASSWORD, foundUser.password);

        if (!loginValid) {
            throw new Error('Senha não valida no teste de login!');
        }
        console.log('   ✅ Senha validada no teste de login');
        console.log('');

        // =====================================================
        // RESULTADO FINAL
        // =====================================================
        console.log(' ================================================');
        console.log('🎉 SUCESSO! LOGIN CONFIGURADO CORRETAMENTE!');
        console.log(' ================================================');
        console.log('');
        console.log(' USE ESTAS CREDENCIAIS:');
        console.log('');
        console.log('    Email: admin@aerocode.com');
        console.log('    Senha: admin123');
        console.log('');
        console.log('✅ TESTADO E FUNCIONANDO!');
        console.log('');
        console.log(' Próximos passos:');
        console.log('   1. Reinicie o backend: npm run dev');
        console.log('   2. Acesse o frontend: http://localhost:3000');
        console.log('   3. Faça login com as credenciais acima');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ ================================================');
        console.error('❌ ERRO NA CONFIGURAÇÃO');
        console.error('❌ ================================================');
        console.error('');
        console.error(error);
        console.error('');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

setupLogin();












