/**
 * @fileoverview Tabela de main keywords com seleção
 * @module components/keywords/KeywordsTable
 */

import { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import { 
  EyeIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

interface KeywordsTableProps {
  keywords: any[];
  onSelectKeyword: (id: string) => void;
  selectedKeyword: string;
}

export function KeywordsTable({ 
  keywords, 
  onSelectKeyword, 
  selectedKeyword 
}: KeywordsTableProps): ReactElement {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Main Keywords</h3>
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Keyword
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Blog
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                MSV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Dificuldade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Variações
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keywords.map((keyword) => (
              <tr 
                key={keyword.id}
                className={`hover:bg-gray-50 cursor-pointer ${selectedKeyword === keyword.id ? 'bg-blue-50' : ''}`}
                onClick={() => onSelectKeyword(keyword.id)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 break-words max-w-xs">{keyword.keyword}</div>
                  <div className="text-sm text-gray-500 break-words">{keyword.search_intent}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 break-words max-w-32">{keyword.blogs?.name}</div>
                  <div className="text-sm text-gray-500 break-words max-w-32">{keyword.blogs?.domain}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(keyword.msv || 0, 'pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (keyword.kw_difficulty || 0) < 30 ? 'bg-green-100 text-green-800' :
                    (keyword.kw_difficulty || 0) < 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {keyword.kw_difficulty || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {keyword.keyword_variations_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    keyword.is_used ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {keyword.is_used ? 'Utilizada' : 'Disponível'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}