/**
 * @fileoverview Página de gestão de keywords refatorada
 * @module pages/KeywordsManagement
 */

import { ReactElement, useState, useMemo } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import { 
  useMainKeywordsComplete,
  useCreateMainKeyword,
  useUpdateMainKeyword,
  useDeleteMainKeyword,
  useKeywordRelatedData,
  useDatabaseStats
} from "@/hooks/useKeywordManagement";
import { Button } from "@/components/ui/Button";
import { AnalyticsSkeleton } from "@/components/ui/Skeleton";
import { KeywordsOverviewTab } from "@/components/keywords/KeywordsOverviewTab";
import { KeywordsTable } from "@/components/keywords/KeywordsTable";
import { VariationsTab } from "@/components/keywords/VariationsTab";
import { AnalyticsTab } from "@/components/keywords/AnalyticsTab";
import { ClustersAndOpportunities } from "@/components/keywords/ClustersAndOpportunities";
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
  TagIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

type TabType = 'overview' | 'keywords' | 'variations' | 'analytics';

export function KeywordsManagement(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedBlog, setSelectedBlog] = useState<string>('');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Hooks para dados
  const { data: blogs, isLoading: blogsLoading } = useBlogs();
  const { data: keywords, isLoading: keywordsLoading } = useMainKeywordsComplete(selectedBlog);
  const { data: relatedData, isLoading: relatedLoading } = useKeywordRelatedData(selectedKeyword);
  const { data: dbStats, isLoading: statsLoading } = useDatabaseStats();

  const isLoading = blogsLoading || keywordsLoading || statsLoading;

  // Filtrar keywords por busca
  const filteredKeywords = useMemo(() => {
    if (!keywords || !searchQuery) return keywords || [];
    
    return keywords.filter(keyword => 
      keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      keyword.blogs?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [keywords, searchQuery]);

  // Tabs configuration
  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: ChartBarIcon, count: dbStats?.mainKeywords },
    { id: 'keywords', name: 'Main Keywords', icon: TagIcon, count: keywords?.length },
    { id: 'variations', name: 'Variações', icon: DocumentTextIcon, count: relatedData?.variations.length },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keywords Management</h1>
          <p className="text-gray-600 mt-1">
            Controle completo dos dados de keywords, variações e oportunidades de conteúdo
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Main Keyword
          </Button>
          <Button>
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            Busca Semântica
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="blog-select" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Blog
            </label>
            <select
              id="blog-select"
              value={selectedBlog}
              onChange={(e) => setSelectedBlog(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos os blogs</option>
              {blogs?.map((blog) => (
                <option key={blog.id} value={blog.id}>
                  {blog.name} ({blog.domain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Keywords
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredKeywords.length} keywords encontradas
              {selectedKeyword && (
                <span className="ml-4 text-blue-600 font-medium">
                  • Keyword selecionada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.count !== undefined && (
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <KeywordsOverviewTab dbStats={dbStats} />}
          {activeTab === 'keywords' && (
            <KeywordsTable 
              keywords={filteredKeywords} 
              onSelectKeyword={setSelectedKeyword}
              selectedKeyword={selectedKeyword}
            />
          )}
          {activeTab === 'variations' && (
            selectedKeyword ? (
              <VariationsTab data={relatedData?.variations || []} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Selecione uma keyword na aba "Main Keywords" para ver suas variações</p>
              </div>
            )
          )}
          {activeTab === 'analytics' && <AnalyticsTab keywords={keywords || []} />}
        </div>
      </div>

      {/* Seção de Clusters e Oportunidades */}
      {selectedKeyword && relatedData && (
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Clusters e Oportunidades de Conteúdo
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Clusters de keywords e suas respectivas oportunidades de conteúdo
            </p>
          </div>
          
          <div className="p-6">
            <ClustersAndOpportunities data={relatedData} />
          </div>
        </div>
      )}
    </div>
  );
}