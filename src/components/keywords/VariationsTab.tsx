/**
 * @fileoverview Tab de variações de keywords
 * @module components/keywords/VariationsTab
 */

import { ReactElement } from "react";
import { formatNumber } from "@/lib/utils";

interface VariationsTabProps {
  data: any[];
}

export function VariationsTab({ data }: VariationsTabProps): ReactElement {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Keyword Variations ({data.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((variation) => (
          <div key={variation.id} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 break-words">{variation.keyword}</h4>
            <p className="text-sm text-gray-500 mt-1 break-words">{variation.variation_type}</p>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-gray-600 truncate">MSV: {formatNumber(variation.msv || 0, 'pt-BR')}</span>
              <span className="text-gray-600 truncate">Diff: {variation.kw_difficulty || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}