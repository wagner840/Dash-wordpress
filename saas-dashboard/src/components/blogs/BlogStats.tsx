/**
 * @fileoverview Componente para exibir estatísticas dos blogs
 * @module components/blogs/BlogStats
 */

import { ReactElement } from "react";
import { useBlogs, usePostsStats, useKeywordsStats } from "@/hooks/useBlogs";
import { formatNumber } from "@/lib/utils";

interface BlogStatsProps {
  /** Número máximo de blogs para exibir */
  maxBlogs?: number;
}

interface PostData {
  id: string;
  status: string;
  word_count: number;
  readability_score: number | null;
  seo_score: number | null;
  blogs: {
    name: string;
    domain: string;
  };
}

interface KeywordData {
  id: string;
  keyword: string;
  msv: number;
  kw_difficulty: number;
  cpc: number;
  is_used: boolean;
  blogs: {
    name: string;
    domain: string;
  };
}

/**
 * Componente para exibir estatísticas dos blogs
 */
export function BlogStats({ maxBlogs = 4 }: BlogStatsProps): ReactElement {
  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
  } = useBlogs();
  const {
    data: postsStats,
    isLoading: postsLoading,
    error: postsError,
  } = usePostsStats();
  const {
    data: keywordsStats,
    isLoading: keywordsLoading,
    error: keywordsError,
  } = useKeywordsStats();

  if (blogsLoading || postsLoading || keywordsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: maxBlogs }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (blogsError || postsError || keywordsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar estatísticas dos blogs</p>
      </div>
    );
  }

  // Processar dados para estatísticas
  const processedStats =
    blogs?.slice(0, maxBlogs).map((blog) => {
      const blogPosts =
        (postsStats as unknown as PostData[])?.filter(
          (post: PostData) => post.blogs?.name === blog.name
        ) || [];
      const blogKeywords =
        (keywordsStats as unknown as KeywordData[])?.filter(
          (keyword: KeywordData) => keyword.blogs?.name === blog.name
        ) || [];

      const totalPosts = blogPosts.length;
      const publishedPosts = blogPosts.filter(
        (post: PostData) => post.status === "published"
      ).length;
      const draftPosts = blogPosts.filter(
        (post: PostData) => post.status === "draft"
      ).length;
      const scheduledPosts = blogPosts.filter(
        (post: PostData) => post.status === "scheduled"
      ).length;

      const totalKeywords = blogKeywords.length;
      const usedKeywords = blogKeywords.filter(
        (keyword: KeywordData) => keyword.is_used
      ).length;
      const unusedKeywords = totalKeywords - usedKeywords;

      const avgMsv =
        blogKeywords.length > 0
          ? blogKeywords.reduce(
              (sum: number, keyword: KeywordData) => sum + (keyword.msv || 0),
              0
            ) / blogKeywords.length
          : 0;

      const avgDifficulty =
        blogKeywords.length > 0
          ? blogKeywords.reduce(
              (sum: number, keyword: KeywordData) =>
                sum + (keyword.kw_difficulty || 0),
              0
            ) / blogKeywords.length
          : 0;

      const avgCpc =
        blogKeywords.length > 0
          ? blogKeywords.reduce(
              (sum: number, keyword: KeywordData) => sum + (keyword.cpc || 0),
              0
            ) / blogKeywords.length
          : 0;

      return {
        blog,
        totalPosts,
        publishedPosts,
        draftPosts,
        scheduledPosts,
        totalKeywords,
        usedKeywords,
        unusedKeywords,
        avgMsv,
        avgDifficulty,
        avgCpc,
      };
    }) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {processedStats.map((stats) => (
        <div key={stats.blog.id} className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {stats.blog.name}
              </h3>
              <p className="text-sm text-gray-600">{stats.blog.domain}</p>
            </div>
            <div
              className={`h-3 w-3 rounded-full ${
                stats.blog.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="space-y-3">
            {/* Posts */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posts</span>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                  {formatNumber(stats.totalPosts)}
                </span>
                <div className="text-xs text-gray-500">
                  {stats.publishedPosts} publicados, {stats.draftPosts}{" "}
                  rascunhos
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Keywords</span>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                  {formatNumber(stats.totalKeywords)}
                </span>
                <div className="text-xs text-gray-500">
                  {stats.usedKeywords} usadas, {stats.unusedKeywords}{" "}
                  disponíveis
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">MSV médio:</span>
                  <div className="font-medium">
                    {formatNumber(Math.round(stats.avgMsv))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Dificuldade:</span>
                  <div className="font-medium">
                    {Math.round(stats.avgDifficulty)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">CPC médio:</span>
                  <div className="font-medium">
                    R$ {stats.avgCpc.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Nicho:</span>
                  <div className="font-medium">{stats.blog.niche}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
