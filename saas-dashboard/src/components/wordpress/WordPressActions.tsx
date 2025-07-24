/**
 * @fileoverview Ações rápidas para WordPress
 * @module components/wordpress/WordPressActions
 */

import { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { PlusIcon, CogIcon } from "@heroicons/react/24/outline";

interface WordPressActionsProps {
  currentBlog: any;
  totalPosts: number;
  isLoading: boolean;
}

export function WordPressActions({ 
  currentBlog, 
  totalPosts, 
  isLoading 
}: WordPressActionsProps): ReactElement {
  if (!currentBlog) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">Selecione um blog para ver as ações disponíveis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentBlog.name} • {totalPosts} posts encontrados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Criar Novo Post */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Novo Post</h4>
          <p className="text-sm text-gray-600 mb-3">
            Criar um novo post diretamente no WordPress
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(`https://${currentBlog.domain}/wp-admin/post-new.php`, '_blank')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Criar Post
          </Button>
        </div>

        {/* Painel Admin */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Painel Admin</h4>
          <p className="text-sm text-gray-600 mb-3">
            Acessar o painel administrativo do WordPress
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(`https://${currentBlog.domain}/wp-admin/`, '_blank')}
          >
            <CogIcon className="h-4 w-4 mr-2" />
            Abrir Admin
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Estatísticas</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total de posts:</span>
              <span className="font-medium">{totalPosts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">
                {isLoading ? 'Carregando...' : 'Conectado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}