import express, { Request, Response } from 'express';
import cors from 'cors';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    advanceStage,
    getProjectActivities,
    getAllResources,
    createResource,
    updateResource,
    login,
    getDashboardMetrics,
    getChartData,
    getRecentActivities
} from './controllers';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '🚀 API AEROCODE funcionando!',
        version: '1.0.0'
    });
});

// 🔐 AUTENTICAÇÃO
app.post('/api/auth/login', login);

// 📋 PROJETOS
app.get('/api/projects', getAllProjects);
app.get('/api/projects/:id', getProjectById);
app.post('/api/projects', createProject);
app.put('/api/projects/:id', updateProject);
app.delete('/api/projects/:id', deleteProject);
app.put('/api/projects/:id/advance', advanceStage);
app.get('/api/projects/:id/activities', getProjectActivities);

// 🔧 RECURSOS
app.get('/api/resources', getAllResources);
app.post('/api/resources', createResource);
app.put('/api/resources/:id', updateResource);

// 📊 DASHBOARD - ADICIONE ESTAS 3 ROTAS
app.get('/api/dashboard/metrics', getDashboardMetrics);
app.get('/api/dashboard/chart', getChartData);
app.get('/api/activities', getRecentActivities);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path,
        method: req.method
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('');
    console.log('🚀 SERVIDOR AEROCODE INICIADO!');
    console.log(`📡 API: http://localhost:${PORT}`);
    console.log('🔑 Login: admin@aerocode.com / admin123');
    console.log('✅ Servidor pronto!');
    console.log('');
});

export default app;