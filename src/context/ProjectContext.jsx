import React, { createContext, useState, useContext, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

// 5 ETAPAS FIXAS
export const STAGE_NAMES = ['Fuselagem', 'Asas', 'Motores', 'Sistemas', 'Testes'];
const API_URL = 'http://localhost:3001/api';

export const ProjectProvider = ({ children }) => {
  const aircraftImages = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop&q=80',
    'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://aeroin.net/wp-content/uploads/2021/08/Embraer-concept-turbo-1024x683.jpg',
  ];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Adicionado estado de erro

  // 🔥 BUSCAR PROJETOS DA API AO CARREGAR
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true); // Inicia loading ao buscar
    setError(null); // Limpa erros anteriores
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('✅ Projetos carregados da API:', data.length);

      // 🔥 LÓGICA DE FILA APLICADA AQUI NO FRONTEND
      // 1. Ordena os projetos. Assumimos que 'createdAt' define a ordem da fila.
      // Se houver outro campo de prioridade (ex: 'priorityOrder'), use-o aqui.
      const sortedProjects = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      let firstEditableFound = false;
      const projectsWithCanEdit = sortedProjects.map(p => {
        // Se o projeto já está concluído, ele não pode ser editado
        if (p.currentStage >= STAGE_NAMES.length) {
          return { ...p, canEdit: false };
        }

        // Se ainda não encontramos o primeiro projeto editável
        if (!firstEditableFound) {
          firstEditableFound = true;
          return { ...p, canEdit: true }; // Este é o primeiro projeto não concluído, então ele é editável
        } else {
          return { ...p, canEdit: false }; // Todos os outros projetos não concluídos ficam em espera
        }
      });

      setProjects(projectsWithCanEdit); // Atualiza o estado com os projetos e o canEdit correto
    } catch (err) {
      console.error('❌ Erro ao conectar ou buscar projetos da API:', err);
      setError(err.message); // Define o erro
      setProjects([]); // Limpa projetos em caso de erro
    } finally {
      setLoading(false); // Finaliza loading
    }
  };

  const addProject = async (project) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          model: project.model,
          deadline: project.deadline,
          efficiency: parseInt(project.efficiency) || 0,
          alerts: parseInt(project.alerts) || 0,
          // O backend deve inicializar currentStage = 0, progress = 0.
          // A propriedade `canEdit` será definida pelo `fetchProjects` no frontend.
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const newProject = await res.json();
      console.log('✅ Projeto salvo no banco:', newProject);
      await fetchProjects(); // RECARREGA TODOS OS PROJETOS (garante dados frescos e reavalia a fila)
    } catch (err) {
      console.error('❌ Erro ao salvar projeto no banco:', err);
      setError(err.message);
    }
  };

  // 🔥 AVANÇAR UMA ETAPA (chamado quando clica no botão "Avançar atividade")
  const advanceStage = async (projectId) => {
    setError(null);
    try {
      console.log(`🚀 Tentando avançar estágio para o projeto ID: ${projectId}`);
      const res = await fetch(`${API_URL}/projects/${projectId}/advance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        // Se a resposta não for OK, tenta ler a mensagem de erro do backend
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.message || res.statusText}`);
      }

      const result = await res.json();
      console.log('✅ Etapa avançada no banco!', result);
      if (result.completed) {
        console.log('🎉 Projeto concluído! A fila será reavaliada.');
      }
      // 2️⃣ RECARREGA TODOS OS PROJETOS (garante fila atualizada)
      await fetchProjects();
      return true; // Indica sucesso
    } catch (err) {
      console.error('❌ Erro ao avançar etapa no banco:', err);
      setError(err.message);
      return false; // Indica falha
    }
  };

  // GET PROJECT BY ID
  const getProjectById = (id) => {
    return projects.find(p => p.id === parseInt(id));
  };

  // DASHBOARD METRICS
  const getDashboardMetrics = () => {
    const totalAircraft = projects.length;
    const avgCompletion = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;
    const efficiency = avgCompletion;
    // Aeronaves aguardando: são aquelas que não estão concluídas e não são a primeira da fila (canEdit: false)
    const alerts = projects.filter(p => p.currentStage < STAGE_NAMES.length && !p.canEdit).length;
    return {
      totalAircraft,
      avgCompletion,
      efficiency,
      alerts
    };
  };

  // CHART DATA
  const getChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthCounts = {};
    months.forEach(month => {
      monthCounts[month] = 0;
    });
    projects.forEach(project => {
      const date = new Date(project.createdAt);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      monthCounts[monthName]++;
    });
    const currentMonth = new Date().getMonth();
    const chartMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    return chartMonths.map(month => ({
      month,
      value: monthCounts[month] || 0,
      label: `${monthCounts[month] || 0} aeronaves`
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      setProjects,
      addProject,
      advanceStage,
      getProjectById,
      getDashboardMetrics,
      getChartData,
      loading,
      error, // Exporta o estado de erro
      fetchProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
