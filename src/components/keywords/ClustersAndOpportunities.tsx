/**
 * @fileoverview Seção de clusters e oportunidades com filtros
 * @module components/keywords/ClustersAndOpportunities
 */

import { ReactElement, useState } from "react";
import { formatDate } from "@/lib/utils";

interface ClustersAndOpportunitiesProps {
  data: any;
}

export function ClustersAndOpportunities({ data }: ClustersAndOpportunitiesProps): ReactElement {
  const [viewType, setViewType] = useState<'clusters' | 'categories' | 'both'>('both');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'in_progress'>('all');

  const clusters = data?.clusters || [];
  const contentOpportunitiesCategories = data?.contentOpportunitiesCategories || [];
  const contentOpportunitiesClusters = data?.contentOpportunitiesClusters || [];

  // Agrupar oportunidades por cluster
  const clustersWithOpportunities = clusters.map((cluster: any) => {
    const clusterOpportunities = contentOpportunitiesClusters.filter(
      (opp: any) => opp.cluster_id === cluster.id
    );
    return { ...cluster, opportunities: clusterOpportunities };
  });

  // Filtrar clusters baseado no status das oportunidades
  const filteredClustersWithOpportunities = clustersWithOpportunities.map((cluster: any) => {
    if (statusFilter === 'all') return cluster;
    
    const filteredOpportunities = cluster.opportunities.filter((opp: any) => {
      if (statusFilter === 'pending') {
        return opp.status === 'pending' || opp.status === 'identified';
      }
      return opp.status === statusFilter;
    });

    return { ...cluster, opportunities: filteredOpportunities };
  }).filter((cluster: any) => statusFilter === 'all' || cluster.opportunities.length > 0);

  // Filtrar oportunidades de categoria por status
  const filteredCategoryOpportunities = contentOpportunitiesCategories.filter((opp: any) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') {
      return opp.status === 'pending' || opp.status === 'identified';
    }
    return opp.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900">Total de Clusters</h4>
          <p className="text-2xl font-bold text-blue-600 mt-1">{clusters.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900">Oportunidades por Cluster</h4>
          <p className="text-2xl font-bold text-green-600 mt-1">{contentOpportunitiesClusters.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-900">Oportunidades por Categoria</h4>
          <p className="text-2xl font-bold text-purple-600 mt-1">{contentOpportunitiesCategories.length}</p>
        </div>
      </div>

      {/* Controles de Filtro */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visualizar</label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'clusters' | 'categories' | 'both')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="both">Clusters + Categorias</option>
                <option value="clusters">Apenas Clusters</option>
                <option value="categories">Apenas Categorias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed' | 'in_progress')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {(viewType === 'both' || viewType === 'clusters') && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {filteredClustersWithOpportunities.length} clusters
              </span>
            )}
            {(viewType === 'both' || viewType === 'categories') && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {filteredCategoryOpportunities.length} oportunidades
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clusters */}
      {(viewType === 'both' || viewType === 'clusters') && (
        <ClustersSection 
          clusters={filteredClustersWithOpportunities} 
          statusFilter={statusFilter} 
        />
      )}

      {/* Oportunidades por Categoria */}
      {(viewType === 'both' || viewType === 'categories') && filteredCategoryOpportunities.length > 0 && (
        <CategoriesSection opportunities={filteredCategoryOpportunities} />
      )}

      {/* Mensagem quando nenhum resultado é encontrado */}
      {((viewType === 'clusters' && filteredClustersWithOpportunities.length === 0) ||
        (viewType === 'categories' && filteredCategoryOpportunities.length === 0) ||
        (viewType === 'both' && filteredClustersWithOpportunities.length === 0 && filteredCategoryOpportunities.length === 0)) && (
        <NoResultsMessage viewType={viewType} statusFilter={statusFilter} />
      )}
    </div>
  );
}

function ClustersSection({ clusters, statusFilter }: { clusters: any[], statusFilter: string }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900">Clusters e suas Oportunidades</h4>
      
      {clusters.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster: any) => (
            <div key={cluster.id} className="border border-gray-200 rounded-lg p-6">
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-gray-900 break-words">
                  {cluster.cluster_name || cluster.name}
                </h5>
                <p className="text-sm text-gray-600 mt-1 break-words">{cluster.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Criado: {formatDate(cluster.created_at)}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {cluster.opportunities.length} oportunidades
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h6 className="text-sm font-medium text-gray-700">Oportunidades de Conteúdo:</h6>
                {cluster.opportunities.length > 0 ? (
                  cluster.opportunities.map((opp: any) => (
                    <div key={opp.id} className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 break-words text-sm">{opp.title}</h6>
                      <p className="text-xs text-gray-600 mt-1 break-words">{opp.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Priority: {opp.priority_score}</span>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          opp.status === 'completed' ? 'bg-green-100 text-green-800' :
                          opp.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {opp.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Nenhuma oportunidade encontrada para este cluster
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {statusFilter === 'all' 
              ? 'Nenhum cluster encontrado para esta keyword'
              : `Nenhum cluster encontrado com status "${statusFilter}"`
            }
          </p>
        </div>
      )}
    </div>
  );
}

function CategoriesSection({ opportunities }: { opportunities: any[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Oportunidades por Categoria</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp: any) => (
          <div key={opp.id} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 break-words text-sm">{opp.title}</h5>
            <p className="text-xs text-gray-600 mt-1 break-words">{opp.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Priority: {opp.priority_score}</span>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                opp.status === 'completed' ? 'bg-green-100 text-green-800' :
                opp.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {opp.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoResultsMessage({ viewType, statusFilter }: { viewType: string, statusFilter: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
        <p className="text-gray-500">
          {statusFilter === 'all' 
            ? `Nenhuma oportunidade encontrada para o tipo "${viewType === 'both' ? 'clusters e categorias' : viewType}"`
            : `Nenhuma oportunidade encontrada com status "${statusFilter}" para o tipo "${viewType === 'both' ? 'clusters e categorias' : viewType}"`
          }
        </p>
        <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros para ver mais resultados</p>
      </div>
    </div>
  );
}