/**
 * @fileoverview WordPress control page refatorada
 * @module pages/WordPress
 */

import { ReactElement, useState, useMemo } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import { useWordPressPosts, useWordPressStatusTest } from "@/hooks/useWordPress";
import { AnalyticsSkeleton } from "@/components/ui/Skeleton";
import { WordPressFilters } from "@/components/wordpress/WordPressFilters";
import { WordPressPostsTable } from "@/components/wordpress/WordPressPostsTable";
import { WordPressActions } from "@/components/wordpress/WordPressActions";
import { WordPressPagination } from "@/components/wordpress/WordPressPagination";

export function WordPress(): ReactElement {
  const [selectedBlog, setSelectedBlog] = useState<string>("");
  const [postsPerPage, setPostsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("publish");
  
  // Buscar blogs
  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogs();

  // Testar status suportados
  const {
    data: supportedStatuses,
    isLoading: statusTestLoading,
  } = useWordPressStatusTest(selectedBlog);

  // Buscar posts
  const {
    data: allPosts,
    isLoading: postsLoading,
    error: postsError,
  } = useWordPressPosts(selectedBlog, statusFilter);

  // Blog atual
  const currentBlog = useMemo(() => {
    return blogs?.find(blog => blog.id === selectedBlog);
  }, [blogs, selectedBlog]);

  // Paginação
  const { paginatedPosts, totalPages } = useMemo(() => {
    if (!allPosts) return { paginatedPosts: [], totalPages: 0 };
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginated = allPosts.slice(startIndex, endIndex);
    const pages = Math.ceil(allPosts.length / postsPerPage);
    
    return { paginatedPosts: paginated, totalPages: pages };
  }, [allPosts, currentPage, postsPerPage]);

  // Reset página quando mudar filtros
  const handleBlogChange = (blogId: string) => {
    setSelectedBlog(blogId);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const isLoading = blogsLoading || postsLoading || statusTestLoading;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (blogsError || postsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erro ao carregar dados do WordPress
          </h3>
          <p className="text-gray-600">
            Verifique as configurações de API ou tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WordPress Control</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus posts do WordPress diretamente do dashboard
          </p>
        </div>
      </div>

      {/* Filtros */}
      <WordPressFilters
        blogs={blogs || []}
        selectedBlog={selectedBlog}
        setSelectedBlog={handleBlogChange}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusChange}
        supportedStatuses={supportedStatuses}
      />

      {/* Ações Rápidas */}
      <WordPressActions
        currentBlog={currentBlog}
        totalPosts={allPosts?.length || 0}
        isLoading={postsLoading}
      />

      {/* Lista de Posts */}
      {selectedBlog && (
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Posts do WordPress
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentBlog?.name} • Status: {statusFilter} • {allPosts?.length || 0} posts
            </p>
          </div>

          {allPosts && allPosts.length > 0 ? (
            <>
              <div className="p-6">
                <WordPressPostsTable
                  posts={paginatedPosts}
                  currentBlog={currentBlog}
                />
              </div>
              
              <WordPressPagination
                currentPage={currentPage}
                totalPages={totalPages}
                postsPerPage={postsPerPage}
                totalPosts={allPosts.length}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                {selectedBlog 
                  ? `Nenhum post encontrado com status "${statusFilter}"`
                  : "Selecione um blog para ver os posts"
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mensagem quando nenhum blog está selecionado */}
      {!selectedBlog && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Selecione um blog para começar
          </h3>
          <p className="text-gray-600">
            Escolha um blog acima para visualizar e gerenciar seus posts do WordPress.
          </p>
        </div>
      )}
    </div>
  );
}