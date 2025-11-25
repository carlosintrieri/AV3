import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useProjects, STAGE_NAMES } from '../context/ProjectContext';

const API_URL = 'http://localhost:3001/api';

const ProductionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, fetchProjects, loading: contextLoading, projects: allProjects } = useProjects();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  const [project, setProject] = useState(null);

  useEffect(() => {
    const currentProject = getProjectById(id);
    setProject(currentProject);
  }, [id, getProjectById, allProjects]);

  const isLoading = contextLoading || !project;
  const isCompleted = project ? project.currentStage >= STAGE_NAMES.length : false;

  const [projectData, setProjectData] = useState({
    model: project ? project.name : '',
    responsible: 'Eng. Silva',
    deadline: '45',
    status: isCompleted ? 'Concluído' : 'Pendente',
    completion: project ? project.progress : 0
  });

  const [editData, setEditData] = useState({
    model: projectData.model,
    responsible: projectData.responsible,
    deadline: projectData.deadline
  });

  useEffect(() => {
    if (project) {
      setProjectData({
        model: project.name,
        responsible: 'Eng. Silva',
        deadline: '45',
        status: project.currentStage >= STAGE_NAMES.length ? 'Concluído' : 'Pendente',
        completion: project.progress
      });
      setEditData({
        model: project.name,
        responsible: 'Eng. Silva',
        deadline: '45'
      });
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="mt-16 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando aeronave...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="mt-16 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Aeronave não encontrada</h1>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar para Projetos
          </button>
        </div>
      </div>
    );
  }

  //  RENDERIZA AS 5 BOLINHAS BASEADAS NO currentStage
  const stages = STAGE_NAMES.map((stageName, index) => {
    let stageStatus = 'pending';
    if (index < project.currentStage) {
      stageStatus = 'completed'; // Verde ✓
    } else if (index === project.currentStage && project.canEdit) {
      stageStatus = 'inProgress'; // Azul ◐
    }
    return {
      id: index + 1,
      name: stageName,
      status: stageStatus
    };
  });

  const timeline = [
    { event: 'Início montagem', date: '18/06/2024', status: 'completed' },
    { event: 'Conclusão fuselagem', date: '20/06/2024', status: 'completed' },
    { event: 'Instalação motores', date: '10/12/2024', status: 'inProgress' },
    { event: 'Testes avionics', date: '05/12/2024', status: 'pending' },
  ];

  const alerts = [
    { type: 'critical', message: 'Material crítico em falta: Rebites 2mm', time: '2h atrás' },
    { type: 'warning', message: 'Atraso na entrega de painéis compósitos', time: '5h atrás' },
    { type: 'info', message: 'Manutenção programada equipamento A', time: '1 dia atrás' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'inProgress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return '✓';
    if (status === 'inProgress') return '◐';
    return '○';
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setProjectData({
      ...projectData,
      model: editData.model,
      responsible: editData.responsible,
      deadline: editData.deadline
    });
    setShowEditModal(false);
  };

  //  ESTA É A FUNÇÃO QUE FAZ AS BOLINHAS AVANÇAREM! 
  const handleAdvance = async () => {
    try {
      console.log('🚀 Avançando etapa...');
      console.log('📊 Stage ANTES:', project.currentStage, '| Progress:', project.progress + '%');

      // 1. Chama o backend para avançar a etapa
      const response = await fetch(`${API_URL}/projects/${project.id}/advance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao avançar');
      }

      // 2. Pega o projeto atualizado do backend
      const updatedProject = await response.json();
      console.log('✅ Stage DEPOIS:', updatedProject.currentStage, '| Progress:', updatedProject.progress + '%');

      // 3. 🔥 ATUALIZA O ESTADO LOCAL - ISSO FAZ AS BOLINHAS MUDAREM!
      setProject(updatedProject);

      // 4. Atualiza também o contexto global (para dashboard refletir)
      await fetchProjects();

      // 5. Fecha o modal
      setShowAdvanceModal(false);

      console.log('✅ Bolinhas atualizadas! Nova renderização em 3... 2... 1...');

    } catch (error) {
      console.error('❌ Erro:', error.message);
      alert(`Erro ao avançar: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-16 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 text-sm text-gray-600">
            <button onClick={() => navigate('/projects')} className="hover:text-blue-600">
              Projetos
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{projectData.model} - Produção</span>
          </div>

          {!project.canEdit && !isCompleted && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg">
              <p className="text-yellow-800 font-semibold flex items-center">
                <span className="text-2xl mr-2">⏳</span>
                Esta aeronave está aguardando na fila. Finalize a aeronave anterior para poder avançar esta.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="mb-6 bg-green-50 border-2 border-green-500 p-4 rounded-lg">
              <p className="text-green-800 font-semibold flex items-center">
                <span className="text-2xl mr-2">✓</span>
                Projeto Concluído! Todas as etapas foram finalizadas.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <div className="h-48 md:h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={projectData.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Modelo</p>
                    <p className="font-semibold text-gray-800">{projectData.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Status</p>
                    <p className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                      {isCompleted ? 'Concluído' : 'Pendente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Responsável</p>
                    <p className="font-semibold text-gray-800">{projectData.responsible}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Prazo</p>
                    <p className="font-semibold text-gray-800">{projectData.deadline} dias</p>
                  </div>
                </div>
              </div>

              {/*  AS 5 BOLINHAS QUE AVANÇAM! */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Etapas de Produção</h2>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(stage.status)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        {getStatusIcon(stage.status)}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${stage.status === 'completed' ? 'text-gray-800' : stage.status === 'inProgress' ? 'text-blue-600' : 'text-gray-500'}`}>
                          {stage.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stage.status === 'completed' ? 'Concluído' : stage.status === 'inProgress' ? 'Em andamento' : 'Pendente'}
                        </p>
                      </div>
                      {index < stages.length - 1 && (
                        <div className={`h-8 w-0.5 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} ml-5 mt-2`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Timeline do Projeto</h2>
                <div className="space-y-3">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-start hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className={`w-3 h-3 ${getStatusColor(item.status)} rounded-full mt-1.5 mr-3 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.event}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-4 text-base md:text-lg">Progresso Geral</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-blue-200">
                    <div
                      style={{ width: `${project.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow space-y-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm md:text-base"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm md:text-base"
                >
                  📊 Relatório
                </button>
                <button
                  onClick={() => setShowAlertsModal(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm md:text-base"
                >
                  ⚠️ Alertas ({alerts.length})
                </button>
                <button
                  onClick={() => setShowAdvanceModal(true)}
                  disabled={!project.canEdit || isCompleted}
                  className={`w-full px-4 py-3 rounded transition-colors font-medium text-sm md:text-base ${!project.canEdit || isCompleted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : project.currentStage === STAGE_NAMES.length - 1
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {isCompleted
                    ? '✓ Concluído'
                    : project.currentStage === STAGE_NAMES.length - 1
                      ? '✓ Concluir'
                      : '▶ Avançar atividade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Projeto</h2>
            <form onSubmit={handleEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={editData.model}
                    onChange={(e) => setEditData({ ...editData, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editData.responsible}
                    onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (dias)</label>
                  <input
                    type="number"
                    value={editData.deadline}
                    onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Relatório de Produção</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Informações Gerais</h3>
                <p className="text-sm text-gray-600">Projeto: {projectData.model}</p>
                <p className="text-sm text-gray-600">Status: {project.progress}% Concluído</p>
                <p className="text-sm text-gray-600">Responsável: {projectData.responsible}</p>
                <p className="text-sm text-gray-600">Prazo: {projectData.deadline} dias</p>
                <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Etapas Concluídas</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {stages.map(stage => (
                    <li key={stage.id}>
                      {stage.status === 'completed' ? '✓' : stage.status === 'inProgress' ? '◐' : '○'} {stage.name} - {
                        stage.status === 'completed' ? '100%' :
                          stage.status === 'inProgress' ? '50%' : '0%'
                      }
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Observações</h3>
                <p className="text-sm text-gray-600">
                  {isCompleted
                    ? 'Projeto concluído com sucesso. Todas as etapas foram finalizadas conforme o planejado.'
                    : 'Projeto em andamento conforme o cronograma previsto. Atenção aos alertas críticos.'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Fechar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Alertas do Projeto</h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <p className="font-medium mb-1">{alert.message}</p>
                  <p className="text-xs opacity-75">{alert.time}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAlertsModal(false)}
              className="w-full px-4 py-2 mt-6 border border-gray-300 rounded hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {showAdvanceModal && project.canEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Avançar Atividade</h2>
            <p className="text-gray-600 mb-6">
              {project.currentStage < STAGE_NAMES.length - 1
                ? `Deseja avançar para a próxima etapa: "${STAGE_NAMES[project.currentStage + 1]}"?`
                : 'Esta é a última etapa. Ao avançar, o projeto será marcado como Concluído e a próxima aeronave da fila será liberada automaticamente.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvanceModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdvance}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionDetails;
