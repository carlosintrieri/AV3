import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Carrega email salvo ao montar componente
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 TENTANDO LOGIN:', { email });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log('📥 RESPOSTA DA API:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // ✅ LOGIN SUCESSO
      console.log('✅ LOGIN SUCESSO:', data.user);

      // Salva usuário no localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Se "Lembrar-me" estiver marcado, salva email
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redireciona para dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('❌ ERRO NO LOGIN:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">AEROCODE</h1>
          <p className="text-gray-600 text-sm text-center">Sistema de Gestão de Produção Aeronáutica</p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">❌ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>ENTRANDO...</span>
              </>
            ) : (
              'ENTRAR'
            )}
          </button>
        </form>

        {/* Credenciais Padrão (apenas para desenvolvimento) */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold mb-2">🔑 Credenciais Padrão:</p>
          <p className="text-xs text-blue-700">Email: admin@aerocode.com</p>
          <p className="text-xs text-blue-700">Senha: admin123</p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2024 Aerocode. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;