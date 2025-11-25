import express, { Request, Response } from 'express';
import cors from 'cors';
import * as controllers from './controllers';

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'AeroCode API is running' });
});

// ==========================================
// SEED ROUTES
// ==========================================
app.post('/api/projects/seed-initial', controllers.seedInitialAircraft);
app.post('/api/resources/seed', controllers.seedResources);

// ==========================================
// PROJECT ROUTES
// ==========================================
app.get('/api/projects', controllers.getAllProjects);
app.get('/api/projects/:id', controllers.getProjectById);
app.post('/api/projects', controllers.createProject);
app.put('/api/projects/:id', controllers.updateProject);
app.put('/api/projects/:id/advance', controllers.advanceStage);
app.put('/api/projects/:id/complete', controllers.completeProject);
app.delete('/api/projects/:id', controllers.deleteProject);

// ==========================================
// DASHBOARD ROUTES
// ==========================================
app.get('/api/dashboard/metrics', controllers.getDashboardMetrics);
app.get('/api/dashboard/chart', controllers.getChartData);

// ==========================================
// ACTIVITIES ROUTES
// ==========================================
app.get('/api/activities', controllers.getRecentActivities);
app.get('/api/activities/project/:projectId', controllers.getProjectActivities);

// ==========================================
// RESOURCES ROUTES
// ==========================================
app.get('/api/resources', controllers.getAllResources);
app.get('/api/resources/:id', controllers.getResourceById);
app.post('/api/resources', controllers.createResource);
app.put('/api/resources/:id', controllers.updateResource);
app.delete('/api/resources/:id', controllers.deleteResource);
// ==========================================
// DASHBOARD SNAPSHOT ROUTES
// ==========================================
app.post('/api/dashboard/snapshot', controllers.saveDashboardSnapshot);
app.get('/api/dashboard/history', controllers.getDashboardHistory);
app.get('/api/dashboard/latest', controllers.getLatestSnapshot);
app.delete('/api/dashboard/clean-old', controllers.cleanOldSnapshots);
// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════╗');
    console.log('║    AEROCODE API INICIADA           ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('');
    console.log(` Servidor rodando em: http://localhost:${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log(' ROTAS DISPONÍVEIS:');
    console.log('   POST /api/projects/seed-initial');
    console.log('   POST /api/resources/seed');
    console.log('   GET  /api/projects');
    console.log('   GET  /api/resources');
    console.log('   GET  /api/dashboard/metrics');
    console.log('   GET  /api/activities');
    console.log('');
});

export default app;