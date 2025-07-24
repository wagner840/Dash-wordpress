/**
 * @fileoverview Tab de analytics de keywords
 * @module components/keywords/AnalyticsTab
 */

import { ReactElement } from "react";
import { formatNumber } from "@/lib/utils";

interface AnalyticsTabProps {
  keywords: any[];
}

export function AnalyticsTab({ keywords }: AnalyticsTabProps): ReactElement {
  const totalMSV = keywords.reduce((sum, k) => sum + (k.msv || 0), 0);
  const avgDifficulty = keywords.length ? keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) / keywords.length : 0;
  const usedKeywords = keywords.filter(k => k.is_used).length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900">Volume Total de Busca</h4>
          <p className="text-3xl font-bold text-blue-600 mt-2">{formatNumber(totalMSV, 'pt-BR')}</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-yellow-900">Dificuldade Média</h4>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{Math.round(avgDifficulty)}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-green-900">Taxa de Utilização</h4>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {keywords.length ? Math.round((usedKeywords / keywords.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}