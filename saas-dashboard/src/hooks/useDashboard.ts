/**
 * @fileoverview Hooks para buscar dados do dashboard
 * @module hooks/useDashboard
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Hook para buscar estatísticas gerais do dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Buscar estatísticas básicas
      const { data: blogs, error: blogsError } = await supabase
        .from("blogs")
        .select("id")
        .eq("is_active", true);

      const { data: posts, error: postsError } = await supabase
        .from("content_posts")
        .select("id, status")
;

      const { data: keywords, error: keywordsError } = await supabase
        .from("main_keywords")
        .select("id")
;

      if (blogsError || postsError || keywordsError) {
        throw new Error("Erro ao buscar estatísticas do dashboard");
      }

      const total_blogs = blogs?.length || 0;
      const total_posts = posts?.length || 0;
      const total_keywords = keywords?.length || 0;
      const published_posts =
        posts?.filter((post) => post.status === "published").length || 0;
      const draft_posts =
        posts?.filter((post) => post.status === "draft").length || 0;
      const scheduled_posts =
        posts?.filter((post) => post.status === "scheduled").length || 0;

      return {
        total_posts,
        total_blogs,
        total_keywords,
        published_posts,
        draft_posts,
        scheduled_posts,
        avg_readability_score: 0,
        avg_seo_score: 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar posts recentes
 */
export function useRecentPosts() {
  return useQuery({
    queryKey: ["recent-posts"],
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
          blogs (
            name,
            domain
          ),
          authors (
            name
          )
        `
        )
        .eq("blogs.is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        throw new Error(`Erro ao buscar posts recentes: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar estatísticas por blog
 */
export function useBlogStats() {
  return useQuery({
    queryKey: ["blog-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          id,
          name,
          domain,
          niche,
          description,
          is_active,
          created_at
        `
        )
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
