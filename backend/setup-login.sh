#!/bin/bash

# =====================================================
# 🔥 SCRIPT ALL-IN-ONE - CONFIGURAR LOGIN AUTOMÁTICO
# =====================================================
# ARQUIVO: backend/setup-login.sh
#
# Execute: bash setup-login.sh
# =====================================================

echo ""
echo "🔥 ================================================"
echo "🔥 CONFIGURAÇÃO AUTOMÁTICA DE LOGIN"
echo "🔥 ================================================"
echo ""

# Vai para pasta backend
cd "$(dirname "$0")"

echo "📂 Pasta atual: $(pwd)"
echo ""

# Instala dependências se necessário
echo "📦 Verificando dependências..."
if ! npm list bcrypt &> /dev/null; then
    echo "   Instalando bcrypt..."
    npm install bcrypt
    npm install --save-dev @types/bcrypt
fi

if ! npm list @prisma/client &> /dev/null; then
    echo "   Instalando @prisma/client..."
    npm install @prisma/client
fi

echo "   ✅ Dependências OK"
echo ""

# Gera Prisma Client
echo "⚙️  Gerando Prisma Client..."
npx prisma generate
echo "   ✅ Prisma Client gerado"
echo ""

# Sincroniza schema com banco
echo "🗄️  Sincronizando schema com banco..."
npx prisma db push
echo "   ✅ Schema sincronizado"
echo ""

# Executa setup de login
echo "🔐 Criando usuário admin..."
npx ts-node src/setupLogin.ts

echo ""
echo "🎉 ================================================"
echo "🎉 CONFIGURAÇÃO CONCLUÍDA!"
echo "🎉 ================================================"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Inicie o backend: npm run dev"
echo "   2. Acesse: http://localhost:3000"
echo "   3. Login com:"
echo "      📧 Email: admin@aerocode.com"
echo "      🔒 Senha: admin123"
echo ""