/**
 * @fileoverview Tabela de posts do WordPress
 * @module components/wordpress/WordPressPostsTable
 */

import { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { ArrowTopRightOnSquareIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

interface WordPressPost {
  id: number;
  title: { rendered: string };
  status: string;
  date: string;
  modified: string;
  link: string;
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
}

interface WordPressPostsTableProps {
  posts: WordPressPost[];
  currentBlog: any;
  onUpdateStatus?: (postId: number, newStatus: string) => void;
}

export function WordPressPostsTable({ 
  posts, 
  currentBlog, 
  onUpdateStatus 
}: WordPressPostsTableProps): ReactElement {
  const getEditUrl = (postId: number) => {
    if (!currentBlog) return '#';
    return `https://${currentBlog.domain}/wp-admin/post.php?post=${postId}&action=edit`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'publish': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'private': 'bg-blue-100 text-blue-800',
      'future': 'bg-purple-100 text-purple-800',
      'trash': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'publish': 'Publicado',
      'draft': 'Rascunho',
      'private': 'Privado',
      'future': 'Agendado',
      'trash': 'Lixeira'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Modificação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div 
                      className="text-sm font-medium text-gray-900 break-words"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    {post.excerpt?.rendered && (
                      <div 
                        className="text-sm text-gray-500 mt-1 break-words line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                        }}
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                    {getStatusLabel(post.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(post.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(post.modified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {post.status === 'publish' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(post.link, '_blank')}
                        title="Ver post publicado"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getEditUrl(post.id), '_blank')}
                      title="Editar no WordPress"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://${currentBlog?.domain}/wp-admin/edit.php`, '_blank')}
                      title="Abrir painel do WordPress"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
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