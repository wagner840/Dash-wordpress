/**
 * @fileoverview Hook para buscar dados dos blogs do Supabase
 * @module hooks/useBlogs
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/supabase";

/**
 * Hook para buscar todos os blogs ativos
 */
export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async (): Promise<Blog[]> => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar blogs: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar estatísticas de posts por blog
 */
export function usePostsStats() {
  return useQuery({
    queryKey: ["posts-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select(
          `
          id,
          status,
          word_count,
          readability_score,
          seo_score,
          blogs!inner(name, domain)
        `
        )
;

      if (error) {
        throw new Error(
          `Erro ao buscar estatísticas de posts: ${error.message}`
        );
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar posts recentes
 */
export function useRecentPosts(limit: number = 10) {
  return useQuery({
    queryKey: ["recent-posts", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select(
          `
          id,
          title,
          status,
          created_at,
          updated_at,
          word_count,
          readability_score,
          seo_score,
          blogs!inner(name, domain),
          authors!inner(name)
        `
        )
        .eq("blogs.is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Erro ao buscar posts recentes: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para buscar estatísticas de keywords
 */
export function useKeywordsStats() {
  return useQuery({
    queryKey: ["keywords-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("main_keywords")
        .select(
          `
          id,
          keyword,
          msv,
          kw_difficulty,
          cpc,
          is_used,
          blogs!inner(name, domain)
        `
        )
;

      if (error) {
        throw new Error(
          `Erro ao buscar estatísticas de keywords: ${error.message}`
        );
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
