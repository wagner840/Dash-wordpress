/**
 * @fileoverview Workflows page for automation management
 * @module pages/Workflows
 */

import { ReactElement } from 'react';
import { 
  PlayIcon, 
  PlusIcon, 
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Workflows management page component.
 * 
 * Provides interface for managing automation workflows.
 * This is a placeholder page for future workflow functionality.
 */
export function Workflows(): ReactElement {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows de Automação</h1>
          <p className="text-gray-600">
            Gerencie seus fluxos de trabalho automatizados
          </p>
        </div>
        
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Workflow
        </Button>
      </div>

      {/* Coming Soon Section */}
      <Card className="p-12">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Cog6ToothIcon className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Workflows em Desenvolvimento
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Esta seção estará disponível em breve com funcionalidades avançadas de automação 
            para otimizar seus processos de trabalho.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <PlayIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Automação</h3>
              <p className="text-sm text-gray-600">
                Automatize tarefas repetitivas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Integração</h3>
              <p className="text-sm text-gray-600">
                Conecte diferentes serviços
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Monitoramento</h3>
              <p className="text-sm text-gray-600">
                Acompanhe execuções
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" disabled>
              Em breve disponível
            </Button>
          </div>
        </div>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recursos Planejados
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Interface visual de arrastar e soltar
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Conectores para WordPress, email e APIs
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Agendamento e triggers automáticos
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Logs e histórico de execuções
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Casos de Uso
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Publicação automática de conteúdo
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Sincronização de dados entre sistemas
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Notificações e alertas automatizados
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Backup e arquivamento de dados
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}