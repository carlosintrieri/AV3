import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useProjects } from '../context/ProjectContext';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, addProject, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    model: '',
    deadline: '',
    progress: '0',
    efficiency: '0',
    alerts: '0'
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = async (e) => {
    e.preventDefault();

    // Chama a função do contexto que já faz o POST na API
    await addProject(newProject);

    setShowModal(false);
    setNewProject({
      name: '',
      model: '',
      deadline: '',
      progress: '0',
      efficiency: '0',
      alerts: '0'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando projetos...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Lista de Projetos</h1>

          {/* Dashboard Connection Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Conexão Ativa com Dashboard</p>
                  <p className="text-sm text-blue-100">
                    Todas as aeronaves aqui impactam as métricas em tempo real:
                    <span className="font-semibold"> Aeronaves em Produção ({projects.length})</span>,
                    <span className="font-semibold"> Taxa de Conclusão</span>,
                    <span className="font-semibold"> Eficiência Operacional</span> e
                    <span className="font-semibold"> Alertas Ativos</span>
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Sincronizado</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Filtros
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
            >
              + Nova Aeronave
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/production/${project.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-400"
              >
                <div className="h-40 sm:h-48 overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                    ✈️ {project.model}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">{project.name}</h3>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span className="font-medium">📊 Taxa de Conclusão</span>
                      <span className="font-bold text-blue-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dashboard Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="text-xs text-purple-600 font-medium">⚡ Eficiência</p>
                      <p className="text-lg font-bold text-purple-700">{project.efficiency}%</p>
                    </div>
                    <div className={`p-2 rounded-lg ${project.alerts > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                      <p className={`text-xs font-medium ${project.alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {project.alerts > 0 ? '⚠️ Alertas' : '✅ Sem Alertas'}
                      </p>
                      <p className={`text-lg font-bold ${project.alerts > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {project.alerts}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Link Indicator */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="text-xs text-blue-600 font-medium text-center">
                      🔗 Vinculado ao Dashboard
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum projeto encontrado</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">✈️ Nova Aeronave em Produção</h2>
            <p className="text-sm text-gray-600 mb-6">
              🔗 Os dados desta aeronave serão <span className="font-semibold text-blue-600">automaticamente vinculados ao Dashboard</span>
            </p>

            <form onSubmit={handleAddProject}>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-xs font-semibold text-blue-700 mb-3">📊 INFORMAÇÕES BÁSICAS</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ex: Boeing 737 - Unidade 001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modelo da Aeronave</label>
                      <input
                        type="text"
                        value={newProject.model}
                        onChange={(e) => setNewProject({ ...newProject, model: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ex: Boeing 737 MAX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prazo Final de Entrega</label>
                      <input
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-300">
                  <p className="text-xs font-bold text-blue-800 mb-1 flex items-center">
                    📈 MÉTRICAS DO DASHBOARD
                  </p>
                  <p className="text-xs text-blue-600 mb-4 italic">
                    Estes valores impactam diretamente as estatísticas do Dashboard
                  </p>

                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                        📊 Taxa de Conclusão (%)
                        <span className="ml-2 text-xs font-normal text-blue-600">→ Dashboard</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProject.progress}
                        onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Quanto % está pronto? (0-100)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Contribui para o cálculo da Taxa de Conclusão média</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                        ⚡ Eficiência Operacional (%)
                        <span className="ml-2 text-xs font-normal text-purple-600">→ Dashboard</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProject.efficiency}
                        onChange={(e) => setNewProject({ ...newProject, efficiency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Qual a eficiência? (0-100)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Contribui para o cálculo da Eficiência Operacional média</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center">
                        ⚠️ Número de Alertas Ativos
                        <span className="ml-2 text-xs font-normal text-red-600">→ Dashboard</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProject.alerts}
                        onChange={(e) => setNewProject({ ...newProject, alerts: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Quantos alertas? (0 = sem alertas)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Soma total de alertas aparece no Dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-300">
                  <p className="text-xs text-green-700">
                    ✅ <span className="font-semibold">Aeronaves em Produção</span> será incrementado automaticamente (+1)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                >
                  ✈️ Adicionar ao Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;