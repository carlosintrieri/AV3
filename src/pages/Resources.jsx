import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const API_URL = 'http://localhost:3001/api';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de dados
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modais de adicionar
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    qty: '',
    supplier: '',
    status: 'OK',
    category: 'Metais',
    contact: '',
    rating: '5',
    role: 'Gerente de Produção',
    projects: '0',
    maintenance: '',
    usage: '0'
  });

  // Modais de editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editResource, setEditResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/resources`);

      if (!response.ok) {
        throw new Error('Erro ao carregar recursos');
      }

      const data = await response.json();
      console.log('✅ RECURSOS CARREGADOS DA API:', data);
      setResources(data);
    } catch (err) {
      console.error('❌ Erro:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getResourcesByType = (type) => {
    return resources.filter(r => r.type === type);
  };

  const materials = getResourcesByType('Material');
  const suppliers = getResourcesByType('Fornecedor');
  const team = getResourcesByType('Equipe');
  const equipment = getResourcesByType('Equipamento');

  console.log('📊 DADOS POR TIPO:');
  console.log('Materiais:', materials);
  console.log('Fornecedores:', suppliers);
  console.log('Equipe:', team);
  console.log('Equipamentos:', equipment);

  const alerts = ['Titânio Baixo', 'Rebites Críticos', 'Compressor em 5K horas'];

  const tabs = [
    { id: 'materials', label: 'Materiais' },
    { id: 'suppliers', label: 'Fornecedores' },
    { id: 'team', label: 'Equipe' },
    { id: 'equipment', label: 'Equipamentos' },
  ];

  // ==========================================
  // 🔥 ADICIONAR RECURSOS
  // ==========================================

  const handleAdd = async (e) => {
    e.preventDefault();

    let resourceData = {};

    if (activeTab === 'materials') {
      resourceData = {
        name: newResource.name,
        type: 'Material',
        quantity: parseInt(newResource.qty) || 0,
        unit: 'kg',
        status: newResource.status === 'OK' ? 'available' :
          newResource.status === 'BAIXO' ? 'unavailable' : 'critical',
        description: newResource.supplier
      };
    } else if (activeTab === 'suppliers') {
      resourceData = {
        name: newResource.name,
        type: 'Fornecedor',
        status: 'active',
        contact: newResource.contact, // 🔥 EMAIL
        rating: parseInt(newResource.rating) || 5,
        description: newResource.category
      };
      console.log('🏢 ADICIONANDO FORNECEDOR:', resourceData);
    } else if (activeTab === 'team') {
      resourceData = {
        name: newResource.name,
        type: 'Equipe',
        status: newResource.status === 'Ativo' ? 'active' : 'on_leave',
        role: newResource.role, // 🔥 FUNÇÃO
        projects: parseInt(newResource.projects) || 0 // 🔥 PROJETOS
      };
      console.log('👥 ADICIONANDO MEMBRO:', resourceData);
    } else if (activeTab === 'equipment') {
      resourceData = {
        name: newResource.name,
        type: 'Equipamento',
        status: newResource.status === 'Operacional' ? 'operational' : 'maintenance',
        maintenance: new Date(newResource.maintenance).toISOString(), // 🔥 DATA
        usage: parseInt(newResource.usage) || 0 // 🔥 USO %
      };
      console.log('🔧 ADICIONANDO EQUIPAMENTO:', resourceData);
    }

    try {
      console.log('📤 ENVIANDO PARA API:', resourceData);

      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar recurso');
      }

      const savedData = await response.json();
      console.log('✅ SALVO NO BANCO:', savedData);

      await fetchResources();

      setShowAddModal(false);
      setNewResource({
        name: '',
        qty: '',
        supplier: '',
        status: 'OK',
        category: 'Metais',
        contact: '',
        rating: '5',
        role: 'Gerente de Produção',
        projects: '0',
        maintenance: '',
        usage: '0'
      });
    } catch (err) {
      console.error('❌ Erro ao adicionar:', err);
      alert('Erro ao adicionar recurso: ' + err.message);
    }
  };

  // ==========================================
  // EDITAR RECURSOS
  // ==========================================

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editResource) return;

    let resourceData = {};

    if (activeTab === 'materials') {
      resourceData = {
        name: editResource.name,
        type: 'Material',
        quantity: parseInt(editResource.quantity) || 0,
        unit: editResource.unit || 'kg',
        status: editResource.status === 'OK' ? 'available' :
          editResource.status === 'BAIXO' ? 'unavailable' : 'critical',
        description: editResource.description
      };
    } else if (activeTab === 'suppliers') {
      resourceData = {
        name: editResource.name,
        type: 'Fornecedor',
        status: 'active',
        contact: editResource.contact, // 🔥 EMAIL
        rating: parseInt(editResource.rating) || 5,
        description: editResource.description
      };
      console.log('🏢 EDITANDO FORNECEDOR:', resourceData);
    } else if (activeTab === 'team') {
      resourceData = {
        name: editResource.name,
        type: 'Equipe',
        status: editResource.status === 'Ativo' ? 'active' : 'on_leave',
        role: editResource.role, // 🔥 FUNÇÃO
        projects: parseInt(editResource.projects) || 0 // 🔥 PROJETOS
      };
      console.log('👥 EDITANDO MEMBRO:', resourceData);
    } else if (activeTab === 'equipment') {
      resourceData = {
        name: editResource.name,
        type: 'Equipamento',
        status: editResource.status === 'Operacional' ? 'operational' : 'maintenance',
        maintenance: new Date(editResource.maintenance).toISOString(), // 🔥 DATA
        usage: parseInt(editResource.usage) || 0 // 🔥 USO %
      };
      console.log('🔧 EDITANDO EQUIPAMENTO:', resourceData);
    }

    try {
      console.log('📤 ENVIANDO EDIÇÃO PARA API:', resourceData);

      const response = await fetch(`${API_URL}/resources/${editResource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        throw new Error('Erro ao editar recurso');
      }

      const updatedData = await response.json();
      console.log('✅ ATUALIZADO NO BANCO:', updatedData);

      await fetchResources();

      setShowEditModal(false);
      setEditResource(null);
    } catch (err) {
      console.error('❌ Erro ao editar:', err);
      alert('Erro ao editar recurso: ' + err.message);
    }
  };

  // ==========================================
  // ABRIR MODAL DE EDIÇÃO
  // ==========================================

  const openEditModal = (resource) => {
    console.log('📝 ABRINDO MODAL DE EDIÇÃO PARA:', resource);

    let displayStatus = resource.status;

    if (activeTab === 'materials') {
      displayStatus = resource.status === 'available' ? 'OK' :
        resource.status === 'unavailable' ? 'BAIXO' : 'CRÍTICO';
    } else if (activeTab === 'team') {
      displayStatus = resource.status === 'active' ? 'Ativo' : 'Férias';
    } else if (activeTab === 'equipment') {
      displayStatus = resource.status === 'operational' ? 'Operacional' : 'Manutenção';
    }

    const editData = {
      id: resource.id,
      name: resource.name,
      quantity: resource.quantity || 0,
      unit: resource.unit || 'kg',
      status: displayStatus,
      description: resource.description || '',
      contact: resource.contact || '', // 🔥 EMAIL
      rating: resource.rating || 5, // 🔥 ESTRELAS
      role: resource.role || 'Gerente de Produção', // 🔥 FUNÇÃO
      projects: resource.projects || 0, // 🔥 PROJETOS
      maintenance: resource.maintenance ? new Date(resource.maintenance).toISOString().split('T')[0] : '', // 🔥 DATA
      usage: resource.usage || 0 // 🔥 USO %
    };

    console.log('✅ DADOS PREPARADOS PARA EDIÇÃO:', editData);
    setEditResource(editData);
    setShowEditModal(true);
  };

  // ==========================================
  // RENDERIZAR TABELAS
  // ==========================================

  const getStatusColor = (status) => {
    const colors = {
      'OK': 'text-green-600 bg-green-50',
      'BAIXO': 'text-yellow-600 bg-yellow-50',
      'CRÍTICO': 'text-red-600 bg-red-50',
      'available': 'text-green-600 bg-green-50',
      'unavailable': 'text-yellow-600 bg-yellow-50',
      'critical': 'text-red-600 bg-red-50',
      'Operacional': 'text-green-600 bg-green-50',
      'operational': 'text-green-600 bg-green-50',
      'Manutenção': 'text-yellow-600 bg-yellow-50',
      'maintenance': 'text-yellow-600 bg-yellow-50',
      'Ativo': 'text-green-600 bg-green-50',
      'active': 'text-green-600 bg-green-50',
      'Férias': 'text-blue-600 bg-blue-50',
      'on_leave': 'text-blue-600 bg-blue-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const renderStars = (rating) => '⭐'.repeat(rating || 0);

  const renderTabContent = () => {
    if (activeTab === 'materials') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materials.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}{item.unit}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status === 'available' ? 'OK' : item.status === 'unavailable' ? 'BAIXO' : 'CRÍTICO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.description || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'suppliers') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suppliers.map((item) => {
                  console.log('🏢 RENDERIZANDO FORNECEDOR:', item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.description || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                        {item.contact ? (
                          <a href={`mailto:${item.contact}`} className="hover:underline">
                            {item.contact}
                          </a>
                        ) : (
                          <span className="text-gray-400">Sem email</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">{renderStars(item.rating || 5)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'team') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projetos</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map((item) => {
                  console.log('👥 RENDERIZANDO MEMBRO:', item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.role ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            {item.role}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sem função</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === 'active' ? 'Ativo' : 'Férias'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {item.projects !== null && item.projects !== undefined ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {item.projects} projeto{item.projects !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">0 projetos</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'equipment') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próx. Manutenção</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uso</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {equipment.map((item) => {
                  console.log('🔧 RENDERIZANDO EQUIPAMENTO:', item);
                  const usageValue = item.usage !== null && item.usage !== undefined ? item.usage : 0;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === 'operational' ? 'Operacional' : 'Manutenção'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.maintenance ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                            📅 {new Date(item.maintenance).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sem data</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${usageValue}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700 min-w-[45px] text-right">
                            {usageValue}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="mt-16 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando recursos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="mt-16 p-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-red-600">Erro: {error}</p>
            <button
              onClick={fetchResources}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gerenciamento de Recursos</h1>
            <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-300">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <span className="text-sm text-yellow-700 font-medium">{alerts.length} alertas</span>
            </div>
          </div>

          <div className="bg-white p-1 rounded-lg shadow mb-6 overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-3 text-base font-medium rounded transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap">
              Filtros
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>

          {renderTabContent()}
        </div>
      </main>

      {/* ========================================== */}
      {/* MODAL: ADICIONAR */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Adicionar {activeTab === 'materials' ? 'Material' :
                activeTab === 'suppliers' ? 'Fornecedor' :
                  activeTab === 'team' ? 'Membro' : 'Equipamento'}
            </h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome {activeTab === 'team' && 'Completo'}
                  </label>
                  <input
                    type="text"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                {activeTab === 'materials' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (kg)</label>
                      <input
                        type="number"
                        value={newResource.qty}
                        onChange={(e) => setNewResource({ ...newResource, qty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                      <input
                        type="text"
                        value={newResource.supplier}
                        onChange={(e) => setNewResource({ ...newResource, supplier: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={newResource.status}
                        onChange={(e) => setNewResource({ ...newResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="OK">OK</option>
                        <option value="BAIXO">Baixo</option>
                        <option value="CRÍTICO">Crítico</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'suppliers' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select
                        value={newResource.category}
                        onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Metais">Metais</option>
                        <option value="Compósitos">Compósitos</option>
                        <option value="Ferragens">Ferragens</option>
                        <option value="Elétricos">Elétricos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📧 Email de Contato
                      </label>
                      <input
                        type="email"
                        value={newResource.contact}
                        onChange={(e) => setNewResource({ ...newResource, contact: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="contato@fornecedor.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação: <span className="text-lg font-bold text-blue-600">{newResource.rating} ⭐</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newResource.rating}
                        onChange={(e) => setNewResource({ ...newResource, rating: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 ⭐</span>
                        <span>2 ⭐</span>
                        <span>3 ⭐</span>
                        <span>4 ⭐</span>
                        <span>5 ⭐</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'team' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">👔 Função</label>
                      <select
                        value={newResource.role}
                        onChange={(e) => setNewResource({ ...newResource, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Gerente de Produção">Gerente de Produção</option>
                        <option value="Engenheiro Aeronáutico">Engenheiro Aeronáutico</option>
                        <option value="Técnico de Montagem">Técnico de Montagem</option>
                        <option value="Controlador de Qualidade">Controlador de Qualidade</option>
                        <option value="Engenheiro de Sistemas">Engenheiro de Sistemas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={newResource.status}
                        onChange={(e) => setNewResource({ ...newResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Férias">Férias</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📊 Projetos Alocados
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={newResource.projects}
                        onChange={(e) => setNewResource({ ...newResource, projects: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'equipment' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Data da Próxima Manutenção
                      </label>
                      <input
                        type="date"
                        value={newResource.maintenance}
                        onChange={(e) => setNewResource({ ...newResource, maintenance: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={newResource.status}
                        onChange={(e) => setNewResource({ ...newResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Operacional">Operacional</option>
                        <option value="Manutenção">Em Manutenção</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⚡ Uso: <span className="text-lg font-bold text-blue-600">{newResource.usage}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newResource.usage}
                        onChange={(e) => setNewResource({ ...newResource, usage: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDITAR */}
      {/* ========================================== */}
      {showEditModal && editResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Editar {activeTab === 'materials' ? 'Material' :
                activeTab === 'suppliers' ? 'Fornecedor' :
                  activeTab === 'team' ? 'Membro' : 'Equipamento'}
            </h2>
            <form onSubmit={handleEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome {activeTab === 'team' && 'Completo'}
                  </label>
                  <input
                    type="text"
                    value={editResource.name}
                    onChange={(e) => setEditResource({ ...editResource, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                {activeTab === 'materials' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (kg)</label>
                      <input
                        type="number"
                        value={editResource.quantity}
                        onChange={(e) => setEditResource({ ...editResource, quantity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                      <input
                        type="text"
                        value={editResource.description || ''}
                        onChange={(e) => setEditResource({ ...editResource, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editResource.status}
                        onChange={(e) => setEditResource({ ...editResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="OK">OK</option>
                        <option value="BAIXO">Baixo</option>
                        <option value="CRÍTICO">Crítico</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'suppliers' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select
                        value={editResource.description || ''}
                        onChange={(e) => setEditResource({ ...editResource, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Metais">Metais</option>
                        <option value="Compósitos">Compósitos</option>
                        <option value="Ferragens">Ferragens</option>
                        <option value="Elétricos">Elétricos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📧 Email de Contato
                      </label>
                      <input
                        type="email"
                        value={editResource.contact || ''}
                        onChange={(e) => setEditResource({ ...editResource, contact: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avaliação: <span className="text-lg font-bold text-blue-600">{editResource.rating} ⭐</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={editResource.rating || 5}
                        onChange={(e) => setEditResource({ ...editResource, rating: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 ⭐</span>
                        <span>2 ⭐</span>
                        <span>3 ⭐</span>
                        <span>4 ⭐</span>
                        <span>5 ⭐</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'team' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">👔 Função</label>
                      <select
                        value={editResource.role || 'Gerente de Produção'}
                        onChange={(e) => setEditResource({ ...editResource, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Gerente de Produção">Gerente de Produção</option>
                        <option value="Engenheiro Aeronáutico">Engenheiro Aeronáutico</option>
                        <option value="Técnico de Montagem">Técnico de Montagem</option>
                        <option value="Controlador de Qualidade">Controlador de Qualidade</option>
                        <option value="Engenheiro de Sistemas">Engenheiro de Sistemas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editResource.status}
                        onChange={(e) => setEditResource({ ...editResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Férias">Férias</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📊 Projetos Alocados
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editResource.projects || 0}
                        onChange={(e) => setEditResource({ ...editResource, projects: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'equipment' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Data da Próxima Manutenção
                      </label>
                      <input
                        type="date"
                        value={editResource.maintenance || ''}
                        onChange={(e) => setEditResource({ ...editResource, maintenance: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editResource.status}
                        onChange={(e) => setEditResource({ ...editResource, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="Operacional">Operacional</option>
                        <option value="Manutenção">Em Manutenção</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⚡ Uso: <span className="text-lg font-bold text-blue-600">{editResource.usage}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editResource.usage || 0}
                        onChange={(e) => setEditResource({ ...editResource, usage: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditResource(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;