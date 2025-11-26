import { Request, Response } from 'express';
import prisma from './database';
import bcrypt from 'bcrypt';
const STAGE_NAMES = ['Fuselagem', 'Asas', 'Motores', 'Sistemas', 'Testes'];

const aircraftImages = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop&q=80',
    'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://aeroin.net/wp-content/uploads/2021/08/Embraer-concept-turbo-1024x683.jpg',
];

// ==========================================
//  SEED INICIAL DAS 6 AERONAVES
// ==========================================
export const seedInitialAircraft = async (req: Request, res: Response) => {
    try {
        const existingProjects = await prisma.project.count();

        if (existingProjects > 0) {
            return res.json({
                message: 'Aeronaves já existem no banco',
                count: existingProjects
            });
        }

        const initialAircraft = [
            {
                name: 'Boeing 737 MAX',
                model: 'Boeing 737 MAX',
                deadline: new Date('2025-03-15'),
                progress: 40,
                efficiency: 85,
                alerts: 0,
                image: aircraftImages[0],
                queuePosition: 1,
                canEdit: true,
                currentStage: 2,
            },
            {
                name: 'Embraer E195',
                model: 'Embraer E195',
                deadline: new Date('2025-04-20'),
                progress: 0,
                efficiency: 0,
                alerts: 0,
                image: aircraftImages[1],
                queuePosition: 2,
                canEdit: false,
                currentStage: 0,
            },
            {
                name: 'Cessna Citation',
                model: 'Cessna Citation X',
                deadline: new Date('2025-05-10'),
                progress: 0,
                efficiency: 0,
                alerts: 0,
                image: aircraftImages[2],
                queuePosition: 3,
                canEdit: false,
                currentStage: 0,
            },
            {
                name: 'Airbus A320',
                model: 'Airbus A320neo',
                deadline: new Date('2025-06-05'),
                progress: 0,
                efficiency: 0,
                alerts: 0,
                image: aircraftImages[3],
                queuePosition: 4,
                canEdit: false,
                currentStage: 0,
            },
            {
                name: 'Gulfstream G650',
                model: 'Gulfstream G650ER',
                deadline: new Date('2025-07-12'),
                progress: 0,
                efficiency: 0,
                alerts: 0,
                image: aircraftImages[4],
                queuePosition: 5,
                canEdit: false,
                currentStage: 0,
            },
            {
                name: 'Bombardier Global',
                model: 'Bombardier Global 7500',
                deadline: new Date('2025-08-18'),
                progress: 0,
                efficiency: 0,
                alerts: 0,
                image: aircraftImages[5],
                queuePosition: 6,
                canEdit: false,
                currentStage: 0,
            },
        ];

        for (const aircraft of initialAircraft) {
            const project = await prisma.project.create({
                data: aircraft,
            });

            for (let i = 0; i < STAGE_NAMES.length; i++) {
                await prisma.stage.create({
                    data: {
                        projectId: project.id,
                        name: STAGE_NAMES[i],
                        order: i,
                        completed: i < aircraft.currentStage,
                        completedAt: i < aircraft.currentStage ? new Date() : null,
                    },
                });
            }

            await prisma.activity.create({
                data: {
                    projectId: project.id,
                    description: `Aeronave ${aircraft.name} adicionada ao sistema`,
                    type: 'progress',
                },
            });
        }

        res.json({
            message: 'Aeronaves iniciais criadas com sucesso!',
            count: initialAircraft.length
        });
    } catch (error) {
        console.error('❌ Erro ao criar aeronaves iniciais:', error);
        res.status(500).json({
            message: 'Erro ao criar aeronaves iniciais',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

// ==========================================
//  PROJECTS CONTROLLERS
// ==========================================

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                stages: { orderBy: { order: 'asc' } },
            },
            orderBy: { queuePosition: 'asc' },
        });

        console.log(`✅ ${projects.length} aeronaves encontradas`);
        res.json(projects);
    } catch (error) {
        console.error('❌ Erro ao buscar projetos:', error);
        res.json([]);
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: {
                stages: { orderBy: { order: 'asc' } },
                activities: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        console.log(`✅ Projeto encontrado: ${project.name}`);
        res.json(project);
    } catch (error) {
        console.error('❌ Erro ao buscar projeto:', error);
        res.status(404).json({ message: 'Projeto não encontrado' });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        console.log('📥 Recebendo novo projeto:', req.body);

        const { name, model, deadline, efficiency, alerts } = req.body;

        if (!name || !model || !deadline) {
            console.log('⚠️ Dados incompletos');
            return res.status(400).json({ message: 'Nome, modelo e prazo são obrigatórios' });
        }

        const maxQueue = await prisma.project.findFirst({
            orderBy: { queuePosition: 'desc' },
        });

        const queuePosition = (maxQueue?.queuePosition || 0) + 1;

        const editableProject = await prisma.project.findFirst({
            where: { canEdit: true },
        });

        const canEdit = !editableProject;
        const image = aircraftImages[Math.floor(Math.random() * aircraftImages.length)];

        console.log('📝 Criando projeto no banco...');

        const project = await prisma.project.create({
            data: {
                name,
                model,
                deadline: new Date(deadline),
                efficiency: parseInt(efficiency as string) || 0,
                alerts: parseInt(alerts as string) || 0,
                progress: 0,
                image,
                queuePosition,
                canEdit,
                currentStage: 0,
            },
        });

        console.log('✅ Projeto criado:', project.id);

        const stages = await Promise.all(
            STAGE_NAMES.map((stageName, index) =>
                prisma.stage.create({
                    data: {
                        projectId: project.id,
                        name: stageName,
                        order: index,
                        completed: false,
                    },
                })
            )
        );

        await prisma.activity.create({
            data: {
                projectId: project.id,
                description: `Nova aeronave ${name} adicionada ao sistema`,
                type: canEdit ? 'progress' : 'alert',
            },
        });

        console.log('🎉 PROJETO CRIADO COM SUCESSO!');

        res.status(201).json({ ...project, stages });
    } catch (error) {
        console.error('❌ ERRO AO CRIAR PROJETO:', error);
        res.status(500).json({
            message: 'Erro ao criar projeto',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, model, deadline, efficiency, alerts } = req.body;

        const project = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(model && { model }),
                ...(deadline && { deadline: new Date(deadline) }),
                ...(efficiency !== undefined && { efficiency: parseInt(efficiency as string) }),
                ...(alerts !== undefined && { alerts: parseInt(alerts as string) }),
            },
            include: {
                stages: { orderBy: { order: 'asc' } },
            },
        });

        res.json(project);
    } catch (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        res.status(500).json({ message: 'Erro ao atualizar projeto' });
    }
};

export const advanceStage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const projectId = parseInt(id);

        console.log(`📈 Avançando etapa do projeto ${projectId}`);

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { stages: { orderBy: { order: 'asc' } } },
        });

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        if (!project.canEdit) {
            return res.status(403).json({ message: 'Projeto não está liberado para edição' });
        }

        const currentStageIndex = project.currentStage;

        if (currentStageIndex >= STAGE_NAMES.length) {
            return res.status(400).json({ message: 'Projeto já completou todas as etapas' });
        }

        await prisma.stage.update({
            where: { id: project.stages[currentStageIndex].id },
            data: {
                completed: true,
                completedAt: new Date(),
            },
        });

        const nextStageIndex = currentStageIndex + 1;
        const progress = Math.round((nextStageIndex / STAGE_NAMES.length) * 100);

        //  VERIFICA SE É A ÚLTIMA ETAPA
        const isLastStage = nextStageIndex === STAGE_NAMES.length;

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                currentStage: nextStageIndex,
                progress,
                //  Se for a última etapa, bloqueia a edição
                ...(isLastStage && { canEdit: false }),
            },
            include: { stages: { orderBy: { order: 'asc' } } },
        });

        await prisma.activity.create({
            data: {
                projectId,
                description: isLastStage
                    ? `Aeronave ${project.name} concluída com sucesso!`
                    : `Etapa "${STAGE_NAMES[currentStageIndex]}" concluída para ${project.name}`,
                type: 'success',
            },
        });

        //  SE FOR A ÚLTIMA ETAPA, LIBERA A PRÓXIMA AERONAVE DA FILA
        if (isLastStage) {
            console.log(`🏁 Projeto ${project.name} concluído! Liberando próxima aeronave...`);

            const nextProject = await prisma.project.findFirst({
                where: {
                    canEdit: false,
                    progress: { lt: 100 },
                },
                orderBy: { queuePosition: 'asc' },
            });

            if (nextProject) {
                await prisma.project.update({
                    where: { id: nextProject.id },
                    data: { canEdit: true },
                });

                await prisma.activity.create({
                    data: {
                        projectId: nextProject.id,
                        description: `Aeronave ${nextProject.name} liberada para produção`,
                        type: 'progress',
                    },
                });

                console.log(`🔓 Próxima aeronave liberada: ${nextProject.name}`);
            }
        }

        console.log(`✅ Etapa avançada: ${progress}%`);

        res.json(updatedProject);
    } catch (error) {
        console.error('❌ Erro ao avançar etapa:', error);
        res.status(500).json({ message: 'Erro ao avançar etapa' });
    }
};

export const completeProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const projectId = parseInt(id);

        console.log(`🏁 Concluindo projeto ${projectId}`);

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { stages: true },
        });

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        if (!project.canEdit) {
            return res.status(403).json({ message: 'Projeto não está liberado para edição' });
        }

        const allCompleted = project.stages.every((stage) => stage.completed);

        if (!allCompleted) {
            return res.status(400).json({ message: 'Nem todas as etapas estão completas' });
        }

        await prisma.project.update({
            where: { id: projectId },
            data: {
                canEdit: false,
                progress: 100,
                currentStage: STAGE_NAMES.length,
            },
        });

        console.log(`✅ Projeto ${project.name} concluído!`);

        const nextProject = await prisma.project.findFirst({
            where: {
                canEdit: false,
                progress: { lt: 100 },
            },
            orderBy: { queuePosition: 'asc' },
        });

        if (nextProject) {
            await prisma.project.update({
                where: { id: nextProject.id },
                data: { canEdit: true },
            });

            await prisma.activity.create({
                data: {
                    projectId: nextProject.id,
                    description: `Aeronave ${nextProject.name} liberada para produção`,
                    type: 'progress',
                },
            });

            console.log(`🔓 Próxima aeronave liberada: ${nextProject.name}`);
        }

        await prisma.activity.create({
            data: {
                projectId,
                description: `Aeronave ${project.name} concluída com sucesso!`,
                type: 'success',
            },
        });

        const updatedProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: { stages: { orderBy: { order: 'asc' } } },
        });

        res.json(updatedProject);
    } catch (error) {
        console.error('❌ Erro ao concluir projeto:', error);
        res.status(500).json({ message: 'Erro ao concluir projeto' });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.project.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        res.status(500).json({ message: 'Erro ao deletar projeto' });
    }
};

// ==========================================
//  DASHBOARD CONTROLLERS
// ==========================================

export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany();

        const totalProjects = projects.length;
        const avgCompletion = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects || 0;
        const avgEfficiency = projects.reduce((sum, p) => sum + p.efficiency, 0) / totalProjects || 0;
        const totalAlerts = projects.reduce((sum, p) => sum + p.alerts, 0);

        const metricsData = {
            totalAircraft: totalProjects,
            avgCompletion: Math.round(avgCompletion),
            efficiency: Math.round(avgEfficiency),
            alerts: totalAlerts,
        };

        //  SALVAR AUTOMATICAMENTE NO BANCO
        try {
            await prisma.dashboardSnapshot.create({
                data: {
                    totalProjects: totalProjects,
                    avgCompletion: Math.round(avgCompletion),
                    avgEfficiency: Math.round(avgEfficiency),
                    totalAlerts: totalAlerts,
                },
            });
            console.log('✅ Snapshot salvo automaticamente no banco:', metricsData);
        } catch (snapshotError) {
            console.error('⚠️ Erro ao salvar snapshot (não crítico):', snapshotError);
            // Continua mesmo se falhar ao salvar
        }

        res.json(metricsData);
    } catch (error) {
        console.error('❌ Erro ao buscar métricas:', error);
        res.json({ totalAircraft: 0, avgCompletion: 0, efficiency: 0, alerts: 0 });
    }
};

export const getChartData = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            select: {
                name: true,
                progress: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }, // Do mais antigo para o mais recente
        });

        //  Formato para o gráfico de linha
        const chartData = projects.map(project => ({
            name: project.name.substring(0, 15), // Limita o nome para caber no eixo X
            progress: project.progress
        }));

        console.log('📊 Dados do gráfico de linha:', chartData);

        res.json(chartData);
    } catch (error) {
        console.error('❌ Erro ao buscar dados do gráfico:', error);
        res.json([]);
    }
};
// ==========================================
//  ACTIVITIES CONTROLLERS
// ==========================================

export const getRecentActivities = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const activities = await prisma.activity.findMany({
            include: {
                project: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        res.json(activities);
    } catch (error) {
        console.error('❌ Erro ao buscar atividades:', error);
        res.json([]);
    }
};

export const getProjectActivities = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        const activities = await prisma.activity.findMany({
            where: { projectId: parseInt(projectId) },
            orderBy: { createdAt: 'desc' },
        });

        res.json(activities);
    } catch (error) {
        console.error('❌ Erro ao buscar atividades do projeto:', error);
        res.json([]);
    }
};

// ==========================================
//  RESOURCES CONTROLLERS
// ==========================================

export const getAllResources = async (req: Request, res: Response) => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' },
        });

        console.log(`✅ ${resources.length} recursos encontrados`);
        res.json(resources);
    } catch (error) {
        console.error('❌ Erro ao buscar recursos:', error);
        res.json([]);
    }
};

export const getResourceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const resource = await prisma.resource.findUnique({
            where: { id: parseInt(id) },
        });

        if (!resource) {
            return res.status(404).json({ message: 'Recurso não encontrado' });
        }

        res.json(resource);
    } catch (error) {
        console.error('❌ Erro ao buscar recurso:', error);
        res.status(404).json({ message: 'Recurso não encontrado' });
    }
};

//  CRIAR RECURSO - GARANTIDO QUE SALVA TODOS OS CAMPOS
export const createResource = async (req: Request, res: Response) => {
    try {
        const {
            name,
            type,
            quantity,
            unit,
            status,
            location,
            description,
            contact,      // 📧 Email do fornecedor
            rating,       // ⭐ Avaliação 1-5
            role,         // 👔 Função da equipe
            projects,     // 📊 Número de projetos
            maintenance,  // 📅 Data da manutenção
            usage         // ⚡ Porcentagem de uso
        } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Nome e tipo são obrigatórios' });
        }

        console.log('📥 RECEBENDO DADOS PARA CRIAR RECURSO:');
        console.log('   Nome:', name);
        console.log('   Tipo:', type);
        console.log('   📧 Contact:', contact);
        console.log('   ⭐ Rating:', rating);
        console.log('   👔 Role:', role);
        console.log('   📊 Projects:', projects);
        console.log('   📅 Maintenance:', maintenance);
        console.log('   ⚡ Usage:', usage);

        const resource = await prisma.resource.create({
            data: {
                name,
                type,
                status: status || 'available',
                // Campos opcionais básicos
                ...(quantity !== undefined && quantity !== null && { quantity: parseInt(quantity as string) }),
                ...(unit && { unit }),
                ...(location && { location }),
                ...(description && { description }),
                // 🔥 CAMPOS ESPECÍFICOS - GARANTIDO QUE SALVA
                ...(contact && { contact: String(contact) }),
                ...(rating !== undefined && rating !== null && { rating: parseInt(String(rating)) }),
                ...(role && { role: String(role) }),
                ...(projects !== undefined && projects !== null && { projects: parseInt(String(projects)) }),
                ...(maintenance && { maintenance: new Date(maintenance) }),
                ...(usage !== undefined && usage !== null && { usage: parseInt(String(usage)) }),
            },
        });

        console.log('✅ RECURSO CRIADO NO BANCO COM SUCESSO:');
        console.log('   ID:', resource.id);
        console.log('   📧 Contact salvo:', (resource as any).contact);
        console.log('   ⭐ Rating salvo:', (resource as any).rating);
        console.log('   👔 Role salvo:', (resource as any).role);
        console.log('   📊 Projects salvo:', (resource as any).projects);
        console.log('   📅 Maintenance salvo:', (resource as any).maintenance);
        console.log('   ⚡ Usage salvo:', (resource as any).usage);

        res.status(201).json(resource);
    } catch (error) {
        console.error('❌ ERRO AO CRIAR RECURSO:', error);
        res.status(500).json({
            message: 'Erro ao criar recurso',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

//  ATUALIZAR RECURSO - GARANTIDO QUE ATUALIZA TODOS OS CAMPOS
export const updateResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            type,
            quantity,
            unit,
            status,
            location,
            description,
            contact,      // 📧 Email
            rating,       // ⭐ Estrelas
            role,         // 👔 Função
            projects,     // 📊 Projetos
            maintenance,  // 📅 Manutenção
            usage         // ⚡ Uso
        } = req.body;

        console.log('📝 ATUALIZANDO RECURSO ID:', id);
        console.log('   📧 Contact:', contact);
        console.log('   ⭐ Rating:', rating);
        console.log('   👔 Role:', role);
        console.log('   📊 Projects:', projects);
        console.log('   📅 Maintenance:', maintenance);
        console.log('   ⚡ Usage:', usage);

        const resource = await prisma.resource.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(quantity !== undefined && { quantity: quantity === null ? null : parseInt(String(quantity)) }),
                ...(unit !== undefined && { unit }),
                ...(status && { status }),
                ...(location !== undefined && { location }),
                ...(description !== undefined && { description }),
                // 🔥 ATUALIZAR CAMPOS ESPECÍFICOS - GARANTIDO
                ...(contact !== undefined && { contact: contact || null }),
                ...(rating !== undefined && { rating: rating === null ? null : parseInt(String(rating)) }),
                ...(role !== undefined && { role: role || null }),
                ...(projects !== undefined && { projects: projects === null ? null : parseInt(String(projects)) }),
                ...(maintenance !== undefined && { maintenance: maintenance ? new Date(maintenance) : null }),
                ...(usage !== undefined && { usage: usage === null ? null : parseInt(String(usage)) }),
            },
        });

        console.log('✅ RECURSO ATUALIZADO NO BANCO:');
        console.log('   📧 Contact atualizado:', (resource as any).contact);
        console.log('   ⭐ Rating atualizado:', (resource as any).rating);
        console.log('   👔 Role atualizado:', (resource as any).role);
        console.log('   📊 Projects atualizado:', (resource as any).projects);
        console.log('   📅 Maintenance atualizado:', (resource as any).maintenance);
        console.log('   ⚡ Usage atualizado:', (resource as any).usage);

        res.json(resource);
    } catch (error) {
        console.error('❌ ERRO AO ATUALIZAR RECURSO:', error);
        res.status(500).json({
            message: 'Erro ao atualizar recurso',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.resource.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Recurso deletado com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao deletar recurso:', error);
        res.status(500).json({ message: 'Erro ao deletar recurso' });
    }
};

export const seedResources = async (req: Request, res: Response) => {
    try {
        const defaultResources = [
            {
                name: 'Chapas de Alumínio',
                type: 'Material',
                quantity: 500,
                unit: 'kg',
                status: 'available',
                location: 'Galpão A',
                description: 'Chapas de alumínio aeronáutico liga 7075',
            },
            {
                name: 'Motores Turbo-Fan',
                type: 'Componente',
                quantity: 12,
                unit: 'unidade',
                status: 'available',
                location: 'Estoque de Motores',
                description: 'Motores de última geração para aeronaves comerciais',
            },
            {
                name: 'Sistemas de Aviônica',
                type: 'Componente',
                quantity: 8,
                unit: 'conjunto',
                status: 'available',
                location: 'Sala Limpa B',
                description: 'Sistemas completos de aviônica digital',
            },
            {
                name: 'Rebites Aeronáuticos',
                type: 'Material',
                quantity: 50000,
                unit: 'unidade',
                status: 'available',
                location: 'Galpão A',
                description: 'Rebites especiais para montagem de fuselagem',
            },
            {
                name: 'Trens de Pouso',
                type: 'Componente',
                quantity: 6,
                unit: 'conjunto',
                status: 'available',
                location: 'Estoque de Componentes',
                description: 'Trens de pouso hidráulicos retráteis',
            },
            {
                name: 'Tintas Aeroespaciais',
                type: 'Material',
                quantity: 300,
                unit: 'litro',
                status: 'available',
                location: 'Galpão C',
                description: 'Tintas especiais resistentes a alta altitude',
            },
        ];

        const resources = await Promise.all(
            defaultResources.map((resource) =>
                prisma.resource.create({ data: resource })
            )
        );

        res.json({ message: 'Recursos criados com sucesso', count: resources.length });
    } catch (error) {
        console.error('❌ Erro ao criar recursos:', error);
        res.status(500).json({ message: 'Erro ao criar recursos' });
    }
};

// ==========================================
//  METRICS CONTROLLERS (Mock)
// ==========================================

export const getMetricsSummary = async (req: Request, res: Response) => {
    res.json([]);
};

export const getLatencyMetrics = async (req: Request, res: Response) => {
    res.json([]);
};

export const getProcessingTimeMetrics = async (req: Request, res: Response) => {
    res.json([]);
};

export const getResponseTimeMetrics = async (req: Request, res: Response) => {
    res.json([]);
};

export const getAllMetrics = async (req: Request, res: Response) => {
    res.json([]);
};

export const clearMetrics = async (req: Request, res: Response) => {
    res.json({ message: 'Métricas limpas com sucesso' });
};

// ==========================================
//  DASHBOARD SNAPSHOT CONTROLLERS
// ==========================================

//  SALVAR SNAPSHOT DO DASHBOARD
export const saveDashboardSnapshot = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany();

        const totalProjects = projects.length;
        const avgCompletion = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) || 0;
        const avgEfficiency = Math.round(projects.reduce((sum, p) => sum + p.efficiency, 0) / totalProjects) || 0;
        const totalAlerts = projects.reduce((sum, p) => sum + p.alerts, 0);

        const snapshot = await prisma.dashboardSnapshot.create({
            data: {
                totalProjects,
                avgCompletion,
                avgEfficiency,
                totalAlerts,
            },
        });

        console.log('📸 Snapshot do Dashboard salvo:', snapshot.id);

        res.json({
            message: 'Snapshot salvo com sucesso!',
            snapshot,
        });
    } catch (error) {
        console.error('❌ Erro ao salvar snapshot:', error);
        res.status(500).json({ message: 'Erro ao salvar snapshot' });
    }
};

//  BUSCAR HISTÓRICO DE SNAPSHOTS (últimos 30 dias)
export const getDashboardHistory = async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const snapshots = await prisma.dashboardSnapshot.findMany({
            where: {
                date: {
                    gte: startDate,
                },
            },
            orderBy: { date: 'asc' },
        });

        console.log(`📊 Histórico de ${snapshots.length} snapshots retornado`);

        res.json(snapshots);
    } catch (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        res.json([]);
    }
};

//  BUSCAR ÚLTIMO SNAPSHOT
export const getLatestSnapshot = async (req: Request, res: Response) => {
    try {
        const snapshot = await prisma.dashboardSnapshot.findFirst({
            orderBy: { date: 'desc' },
        });

        if (!snapshot) {
            return res.status(404).json({ message: 'Nenhum snapshot encontrado' });
        }

        res.json(snapshot);
    } catch (error) {
        console.error('❌ Erro ao buscar último snapshot:', error);
        res.status(404).json({ message: 'Erro ao buscar snapshot' });
    }
};

// LIMPAR SNAPSHOTS ANTIGOS (manter últimos 90 dias)
export const cleanOldSnapshots = async (req: Request, res: Response) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        const result = await prisma.dashboardSnapshot.deleteMany({
            where: {
                date: {
                    lt: cutoffDate,
                },
            },
        });

        console.log(`🗑️ ${result.count} snapshots antigos deletados`);

        res.json({
            message: `${result.count} snapshots antigos deletados`,
            cutoffDate,
        });
    } catch (error) {
        console.error('❌ Erro ao limpar snapshots:', error);
        res.status(500).json({ message: 'Erro ao limpar snapshots' });
    }
};


// =====================================================
// LOGIN DO USUÁRIO
// =====================================================
export const login = async (req: Request, res: Response) => {
    console.log('');
    console.log('🔐 ========================================');
    console.log('🔐 REQUISIÇÃO DE LOGIN RECEBIDA');
    console.log('🔐 ========================================');

    try {
        const { email, password } = req.body;

        // LOG 1: Dados recebidos
        console.log('📥 DADOS RECEBIDOS:');
        console.log('   Email:', email);
        console.log('   Senha:', password ? '***' + password.substring(3) : 'VAZIA');
        console.log('');

        // Validação básica
        if (!email || !password) {
            console.log('❌ ERRO: Email ou senha não fornecidos');
            console.log('');
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        // LOG 2: Buscando usuário
        console.log('🔍 BUSCANDO USUÁRIO NO BANCO...');
        console.log('   Email procurado:', email);

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // LOG 3: Resultado da busca
        if (!user) {
            console.log('❌ USUÁRIO NÃO ENCONTRADO');
            console.log('   Email não existe no banco:', email);
            console.log('');
            return res.status(401).json({
                error: 'Email ou senha incorretos'
            });
        }

        console.log('✅ USUÁRIO ENCONTRADO:');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Nome:', user.name);
        console.log('   Hash no banco:', user.password.substring(0, 30) + '...');
        console.log('');

        // LOG 4: Validando senha
        console.log('🔐 VALIDANDO SENHA...');
        console.log('   Senha recebida:', password);
        console.log('   Hash no banco:', user.password.substring(0, 30) + '...');

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('   Resultado da comparação:', isPasswordValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');
        console.log('');

        if (!isPasswordValid) {
            console.log('❌ SENHA INCORRETA');
            console.log('');
            return res.status(401).json({
                error: 'Email ou senha incorretos'
            });
        }

        // LOG 5: Login bem-sucedido
        console.log('✅ ========================================');
        console.log('✅ LOGIN BEM-SUCEDIDO!');
        console.log('✅ ========================================');
        console.log('');

        // Retorna usuário sem senha
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            message: 'Login realizado com sucesso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('');
        console.error('❌ ERRO NO LOGIN:', error);
        console.error('');
        return res.status(500).json({
            error: 'Erro ao fazer login'
        });
    }
};


















