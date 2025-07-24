/**
 * @fileoverview Tab de visão geral das estatísticas de keywords
 * @module components/keywords/KeywordsOverviewTab
 */

import { ReactElement } from "react";
import { 
  TagIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  LightBulbIcon 
} from "@heroicons/react/24/outline";
import { formatNumber, formatDate } from "@/lib/utils";

interface OverviewTabProps {
  dbStats: any;
}

export function KeywordsOverviewTab({ dbStats }: OverviewTabProps): ReactElement {
  const stats = [
    { name: 'Main Keywords', value: dbStats?.mainKeywords || 0, icon: TagIcon, color: 'blue' },
    { name: 'Variações', value: dbStats?.variations || 0, icon: DocumentTextIcon, color: 'green' },
    { name: 'Clusters', value: dbStats?.clusters || 0, icon: CubeIcon, color: 'indigo' },
    { name: 'Oportunidades', value: (dbStats?.contentOpportunitiesCategories || 0) + (dbStats?.contentOpportunitiesClusters || 0), icon: LightBulbIcon, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Estatísticas do Banco de Dados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white border rounded-lg p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stat.value, 'pt-BR')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-blue-900 mb-2">Fluxo de Dados</h4>
        <p className="text-sm text-blue-700">
          <strong>1. Main Keywords</strong> → Palavras-chave principais inseridas manualmente ou importadas<br />
          <strong>2. DataForSEO API</strong> → Busca variações e dados de SEO para cada main keyword<br />
          <strong>3. Clusterização</strong> → Agrupamento por intenção de busca e similaridade<br />
          <strong>4. Oportunidades</strong> → Geração de ideias de conteúdo baseadas em clusters e categorias
        </p>
      </div>
    </div>
  );
}