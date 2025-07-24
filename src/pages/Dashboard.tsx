/**
 * @fileoverview Dashboard principal com dados em tempo real do WordPress e Supabase
 * @module pages/Dashboard
 */

import { ReactElement } from "react";
import { useDashboardStats, useBlogStats } from "@/hooks/useDashboard";
import { useAllWordPressPosts } from "@/hooks/useWordPress";
import { useKeywordStats } from "@/hooks/useKeywords";
import { useContentOpportunityStats } from "@/hooks/useContentOpportunities";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AnalyticsSkeleton } from "@/components/ui/Skeleton";

export function Dashboard(): ReactElement {
  // Dados do Supabase
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogStats();

  // Dados do WordPress em tempo real
  const {
    data: wordpressPosts,
    isLoading: wpPostsLoading,
    error: wpPostsError,
  } = useAllWordPressPosts(5);

  // Keywords do Supabase
  const {
    data: keywordStats,
    isLoading: keywordLoading,
    error: keywordError,
  } = useKeywordStats();

  // Content Opportunities do Supabase
  const {
    data: contentStats,
    isLoading: contentLoading,
    error: contentError,
  } = useContentOpportunityStats();

  // Dashboard shows aggregated data from all blogs

  const isLoading =
    statsLoading ||
    blogsLoading ||
    wpPostsLoading ||
    keywordLoading ||
    contentLoading;
  const criticalError = statsError || blogsError || keywordError || contentError;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (criticalError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erro ao carregar dados
          </h3>
          <p className="text-gray-600">
            Tente recarregar a página ou entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui está o resumo dos seus blogs e conteúdo
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Ver Relatórios</Button>
          <Button>Criar Post</Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total de Posts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats?.total_posts || 0, "pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blogs Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats?.total_blogs || 0, "pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Keywords</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(keywordStats?.total_keywords || 0, "pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Oportunidades</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(contentStats?.total_opportunities || 0, "pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Recentes do WordPress */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Posts Recentes (WordPress)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Posts publicados recentemente nos blogs WordPress
          </p>
        </div>
        <div className="p-6">
          {wordpressPosts && wordpressPosts.length > 0 ? (
            <div className="space-y-4">
              {wordpressPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2">
                      {post.title.rendered}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(post.date, { locale: "pt-BR" })}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Publicado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum post recente encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Visão Geral dos Blogs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Visão Geral dos Blogs
          </h3>
        </div>
        <div className="p-6">
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{blog.name}</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {blog.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{blog.domain}</p>
                  {blog.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {blog.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum blog encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas de Keywords */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Estatísticas de Keywords
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(keywordStats?.total_keywords || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Total de Keywords</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(keywordStats?.used_keywords || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Keywords Utilizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(Math.round(keywordStats?.avg_msv || 0), "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">MSV Médio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas de Content Opportunities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Oportunidades de Conteúdo
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(contentStats?.identified || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Identificadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {formatNumber(contentStats?.planned || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Planejadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(contentStats?.in_progress || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Em Progresso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(contentStats?.completed || 0, "pt-BR")}
              </p>
              <p className="text-sm text-gray-600">Concluídas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
