/**
 * @fileoverview Filtros e controles para WordPress
 * @module components/wordpress/WordPressFilters
 */

import { ReactElement } from "react";

interface WordPressFiltersProps {
  blogs: any[];
  selectedBlog: string;
  setSelectedBlog: (value: string) => void;
  postsPerPage: number;
  setPostsPerPage: (value: number) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  supportedStatuses?: any[];
}

export function WordPressFilters({
  blogs,
  selectedBlog,
  setSelectedBlog,
  postsPerPage,
  setPostsPerPage,
  statusFilter,
  setStatusFilter,
  supportedStatuses
}: WordPressFiltersProps): ReactElement {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros e Configurações</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Seleção de Blog */}
        <div>
          <label htmlFor="blog-select" className="block text-sm font-medium text-gray-700 mb-2">
            Blog
          </label>
          <select
            id="blog-select"
            value={selectedBlog}
            onChange={(e) => setSelectedBlog(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um blog</option>
            {blogs?.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={!selectedBlog}
          >
            <option value="publish">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="private">Privados</option>
            <option value="future">Agendados</option>
            {supportedStatuses?.map((status, index) => (
              <option key={`${status.slug}-${index}`} value={status.slug}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Posts per Page */}
        <div>
          <label htmlFor="posts-per-page" className="block text-sm font-medium text-gray-700 mb-2">
            Posts por página
          </label>
          <select
            id="posts-per-page"
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Info */}
        <div className="flex items-end">
          <div className="text-sm text-gray-600">
            {selectedBlog ? "Blog selecionado" : "Selecione um blog para começar"}
          </div>
        </div>
      </div>
    </div>
  );
}