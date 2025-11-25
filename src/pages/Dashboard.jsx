import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalAircraft: 0,
    avgCompletion: 0,
    efficiency: 0,
    alerts: 0
  });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    //  ATUALIZAR E SALVAR AUTOMATICAMENTE A CADA 5 MINUTOS
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      //  Fetch Metrics (SALVA AUTOMATICAMENTE NO BANCO)
      const metricsRes = await fetch('http://localhost:3001/api/dashboard/metrics');
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        console.log('✅ Métricas carregadas e salvas no banco:', metricsData);
        setMetrics(metricsData);
      } else {
        console.error('❌ Erro ao carregar métricas:', metricsRes.status, metricsRes.statusText);
        setMetrics({ totalAircraft: 0, avgCompletion: 0, efficiency: 0, alerts: 0 });
      }

      //  Fetch Chart Data (Produção por Aeronave)
      const chartRes = await fetch('http://localhost:3001/api/dashboard/chart');
      if (chartRes.ok) {
        const chartDataResponse = await chartRes.json();
        console.log('✅ Gráfico de produção carregado:', chartDataResponse.length, 'aeronaves');
        setChartData(Array.isArray(chartDataResponse) ? chartDataResponse : []);
      } else {
        console.error('❌ Erro ao carregar dados do gráfico:', chartRes.status, chartRes.statusText);
        setChartData([]);
      }

      //  Fetch Recent Activities
      const activitiesRes = await fetch('http://localhost:3001/api/activities?limit=5');
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        console.log('✅ Atividades carregadas:', activitiesData.length);
        const formattedActivities = Array.isArray(activitiesData) ? activitiesData.map(act => ({
          text: act.description,
          date: new Date(act.createdAt).toLocaleDateString('pt-BR'),
          type: act.type
        })) : [];
        setActivities(formattedActivities);
      } else {
        console.error('❌ Erro ao carregar atividades:', activitiesRes.status, activitiesRes.statusText);
        setActivities([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Erro ao conectar com a API do Dashboard:', err);
      setMetrics({ totalAircraft: 0, avgCompletion: 0, efficiency: 0, alerts: 0 });
      setChartData([]);
      setActivities([]);
      setLoading(false);
    }
  };

  const metricsDisplay = [
    { label: 'Aeronaves em Produção', value: metrics.totalAircraft, color: 'bg-blue-500', icon: '✈️' },
    { label: 'Taxa de Conclusão', value: `${metrics.avgCompletion}%`, color: 'bg-green-500', icon: '✓' },
    { label: 'Eficiência Operacional', value: `${metrics.efficiency}%`, color: 'bg-purple-500', icon: '⚡' },
    { label: 'Alertas Ativos', value: metrics.alerts, color: 'bg-red-500', icon: '⚠️' },
  ];

  const getActivityColor = (type) => {
    if (type === 'success') return 'bg-green-500';
    if (type === 'progress') return 'bg-blue-500';
    if (type === 'alert') return 'bg-red-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-16 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              🔄 Atualizar
            </button>
          </div>

          {/* CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {metricsDisplay.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">{metric.label}</p>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-blue-600">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* INDICADOR DE SALVAMENTO AUTOMÁTICO */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">💾</span>
              <div>
                <p className="text-sm font-semibold text-green-800">Salvamento Automático Ativo</p>
                <p className="text-xs text-green-700">Todas as métricas são salvas automaticamente no banco de dados a cada atualização</p>
              </div>
            </div>
          </div>

          {/* GRÁFICO DE PRODUÇÃO POR AERONAVE */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
              📈 Tendência de Produção por Aeronave
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Progresso (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '10px'
                    }}
                    formatter={(value) => [`${value}%`, 'Progresso']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    name="Progresso da Produção"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>📊 Nenhum dado disponível para o gráfico</p>
                <p className="text-sm mt-2">Adicione aeronaves em "Projetos" para visualizar o gráfico</p>
              </div>
            )}
          </div>

          {/* ATIVIDADES RECENTES */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
            {activities.length > 0 ? (
              <ul className="space-y-4">
                {activities.map((activity, index) => (
                  <li key={index} className="flex items-start hover:bg-gray-50 p-3 rounded transition-colors">
                    <div className={`w-3 h-3 ${getActivityColor(activity.type)} rounded-full mt-1.5 mr-3 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <span className="text-gray-800 font-medium block">{activity.text}</span>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>📝 Nenhuma atividade registrada</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;