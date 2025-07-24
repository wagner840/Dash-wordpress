/**
 * @fileoverview Página de blogs com dados em tempo real do WordPress e Supabase
 * @module pages/Blogs
 */

import { ReactElement } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import { useWordPressStats } from "@/hooks/useWordPress";
import { useKeywordStats } from "@/hooks/useKeywords";
import { useContentOpportunityStats } from "@/hooks/useContentOpportunities";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AnalyticsSkeleton } from "@/components/ui/Skeleton";

interface BlogData {
  id: string;
  name: string;
  domain: string;
  niche: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  wordpress_stats?: {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
  };
  keyword_stats?: {
    total_keywords: number;
    used_keywords: number;
    avg_msv: number;
    avg_difficulty: number;
  };
  content_stats?: {
    total_opportunities: number;
    identified: number;
    planned: number;
    in_progress: number;
    completed: number;
  };
}

export function Blogs(): ReactElement {
  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogs();

  // Buscar estatísticas do WordPress para cada blog
  const optmilStats = useWordPressStats("25228f83-0b0d-47c7-926f-1ab6d7255f7b");
  const einsof7Stats = useWordPressStats("718d1bf5-ba1a-4c86-8fa4-c13599eb4952");

  // Buscar estatísticas de keywords
  const optmilKeywords = useKeywordStats("25228f83-0b0d-47c7-926f-1ab6d7255f7b");
  const einsof7Keywords = useKeywordStats("718d1bf5-ba1a-4c86-8fa4-c13599eb4952");

  // Buscar estatísticas de content opportunities
  const optmilContent = useContentOpportunityStats("25228f83-0b0d-47c7-926f-1ab6d7255f7b");
  const einsof7Content = useContentOpportunityStats("718d1bf5-ba1a-4c86-8fa4-c13599eb4952");

  const isLoading =
    blogsLoading ||
    optmilStats.isLoading ||
    einsof7Stats.isLoading ||
    optmilKeywords.isLoading ||
    einsof7Keywords.isLoading ||
    optmilContent.isLoading ||
    einsof7Content.isLoading;

  const hasError =
    blogsError ||
    optmilStats.error ||
    einsof7Stats.error ||
    optmilKeywords.error ||
    einsof7Keywords.error ||
    optmilContent.error ||
    einsof7Content.error;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (hasError) {
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

  // Processar dados dos blogs com estatísticas
  const processedBlogs: BlogData[] =
    blogs?.map((blog) => {
      // Usar ID específico do blog em vez de nome para identificação
      const isOptmil = blog.id === "25228f83-0b0d-47c7-926f-1ab6d7255f7b";
      const wordpressStats = isOptmil ? optmilStats.data : einsof7Stats.data;
      const keywordStats = isOptmil
        ? optmilKeywords.data
        : einsof7Keywords.data;
      const contentStats = isOptmil ? optmilContent.data : einsof7Content.data;

      return {
        ...blog,
        wordpress_stats: wordpressStats,
        keyword_stats: keywordStats,
        content_stats: contentStats,
      };
    }) || [];

  // Calcular totais
  const totalBlogs = processedBlogs.length;
  const totalPosts = processedBlogs.reduce(
    (sum, blog) => sum + (blog.wordpress_stats?.total_posts || 0),
    0
  );
  const totalPublishedPosts = processedBlogs.reduce(
    (sum, blog) => sum + (blog.wordpress_stats?.published_posts || 0),
    0
  );
  const totalKeywords = processedBlogs.reduce(
    (sum, blog) => sum + (blog.keyword_stats?.total_keywords || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus blogs WordPress e visualize estatísticas
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Adicionar Blog</Button>
          <Button>Criar Post</Button>
        </div>
      </div>

      {/* Cards dos Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {processedBlogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6">
            {/* Header do Blog */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {blog.name}
                </h3>
                <p className="text-sm text-gray-600">{blog.domain}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  blog.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {blog.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>

            {/* Descrição */}
            {blog.description && (
              <p className="text-gray-600 mb-6 line-clamp-2">
                {blog.description}
              </p>
            )}

            {/* Estatísticas do WordPress */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Posts WordPress
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(
                      blog.wordpress_stats?.total_posts || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(
                      blog.wordpress_stats?.published_posts || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Publicados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(
                      blog.wordpress_stats?.draft_posts || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Rascunhos</p>
                </div>
              </div>
            </div>

            {/* Estatísticas de Keywords */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Keywords
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">
                    {formatNumber(
                      blog.keyword_stats?.total_keywords || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">
                    {formatNumber(
                      blog.keyword_stats?.used_keywords || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Utilizadas</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(
                      Math.round(blog.keyword_stats?.avg_msv || 0),
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">MSV Médio</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(
                      Math.round(blog.keyword_stats?.avg_difficulty || 0),
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Dificuldade</p>
                </div>
              </div>
            </div>

            {/* Estatísticas de Content Opportunities */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Oportunidades de Conteúdo
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-indigo-600">
                    {formatNumber(
                      blog.content_stats?.total_opportunities || 0,
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {formatNumber(blog.content_stats?.completed || 0, "pt-BR")}
                  </p>
                  <p className="text-xs text-gray-600">Concluídas</p>
                </div>
              </div>
              
              {/* Detalhamento por tipo */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">
                    {formatNumber((blog.content_stats as any)?.clusters?.total || 0, "pt-BR")}
                  </p>
                  <p className="text-xs text-gray-600">Clusters</p>
                  <p className="text-xs text-green-600">
                    {(blog.content_stats as any)?.clusters?.completed || 0} concluídos
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-purple-600">
                    {formatNumber((blog.content_stats as any)?.categories?.total || 0, "pt-BR")}
                  </p>
                  <p className="text-xs text-gray-600">Categorias</p>
                  <p className="text-xs text-green-600">
                    {(blog.content_stats as any)?.categories?.completed || 0} concluídas
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Ver Posts
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Ver Keywords
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Ver Oportunidades
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo Geral */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {formatNumber(totalBlogs, "pt-BR")}
            </p>
            <p className="text-sm text-gray-600">Blogs Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatNumber(totalPosts, "pt-BR")}
            </p>
            <p className="text-sm text-gray-600">Total de Posts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {formatNumber(totalPublishedPosts, "pt-BR")}
            </p>
            <p className="text-sm text-gray-600">Posts Publicados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {formatNumber(totalKeywords, "pt-BR")}
            </p>
            <p className="text-sm text-gray-600">Keywords</p>
          </div>
        </div>
      </div>
    </div>
  );
}
