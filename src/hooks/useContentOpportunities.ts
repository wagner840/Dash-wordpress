/**
 * @fileoverview Hook para buscar content opportunities do Supabase
 * @module hooks/useContentOpportunities
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Interface para Content Opportunities Clusters
 */
interface ContentOpportunityCluster {
  id: string;
  blog_id: string;
  cluster_id: string;
  title: string;
  description: string | null;
  content_type: string;
  priority_score: number;
  estimated_traffic: number;
  difficulty_score: number;
  status: "identified" | "planned" | "in_progress" | "completed" | "cancelled";
  target_keywords: string[] | null;
  content_outline: string | null;
  notes: string | null;
  assigned_to: string | null;
  due_date: string | null;
  final_title: string | null;
  final_description: string | null;
  main_keyword_id: string | null;
  created_at: string;
  blogs: {
    name: string;
    domain: string;
  } | null;
  authors: {
    name: string;
  } | null;
  main_keywords: {
    keyword: string;
  } | null;
}

/**
 * Interface para Content Opportunities Categories
 */
interface ContentOpportunityCategory {
  id: string;
  blog_id: string;
  category_id: string;
  title: string;
  description: string | null;
  priority_score: number;
  estimated_traffic: number;
  difficulty_score: number;
  status: "identified" | "planned" | "in_progress" | "completed" | "cancelled";
  target_keywords: string[] | null;
  content_outline: string | null;
  notes: string | null;
  assigned_to: string | null;
  due_date: string | null;
  main_keyword_id: string | null;
  created_at: string;
  blogs: {
    name: string;
    domain: string;
  } | null;
  authors: {
    name: string;
  } | null;
  main_keywords: {
    keyword: string;
  } | null;
  keyword_categories: {
    name: string;
  } | null;
}

/**
 * Hook para buscar content opportunities clusters
 */
export function useContentOpportunityClusters(blogId?: string) {
  return useQuery({
    queryKey: ["content-opportunity-clusters", blogId],
    queryFn: async (): Promise<ContentOpportunityCluster[]> => {
      let query = supabase
        .from("content_opportunities_clusters")
        .select(
          `
          *,
          blogs (
            name,
            domain
          ),
          authors (
            name
          ),
          main_keywords (
            keyword
          )
        `
        )
;

      if (blogId) {
        query = query.eq("blog_id", blogId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw new Error(
          `Erro ao buscar content opportunities clusters: ${error.message}`
        );
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar content opportunities categories
 */
export function useContentOpportunityCategories(blogId?: string) {
  return useQuery({
    queryKey: ["content-opportunity-categories", blogId],
    queryFn: async (): Promise<ContentOpportunityCategory[]> => {
      let query = supabase
        .from("content_opportunities_categories")
        .select(
          `
          *,
          blogs (
            name,
            domain
          ),
          authors (
            name
          ),
          main_keywords (
            keyword
          ),
          keyword_categories (
            name
          )
        `
        )
;

      if (blogId) {
        query = query.eq("blog_id", blogId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw new Error(
          `Erro ao buscar content opportunities categories: ${error.message}`
        );
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar estatísticas de content opportunities
 */
export function useContentOpportunityStats(blogId?: string) {
  return useQuery({
    queryKey: ["content-opportunity-stats-v2", blogId],
    queryFn: async () => {
      let clustersQuery = supabase
        .from("content_opportunities_clusters")
        .select("status, priority_score, estimated_traffic")
;

      let categoriesQuery = supabase
        .from("content_opportunities_categories")
        .select("status, priority_score, estimated_traffic")
;

      if (blogId) {
        clustersQuery = clustersQuery.eq("blog_id", blogId);
        categoriesQuery = categoriesQuery.eq("blog_id", blogId);
      }

      const [clustersResult, categoriesResult] = await Promise.all([
        clustersQuery,
        categoriesQuery,
      ]);

      if (clustersResult.error) {
        throw new Error(
          `Erro ao buscar estatísticas de clusters: ${clustersResult.error.message}`
        );
      }

      if (categoriesResult.error) {
        throw new Error(
          `Erro ao buscar estatísticas de categorias: ${categoriesResult.error.message}`
        );
      }

      const clusters = clustersResult.data || [];
      const categories = categoriesResult.data || [];

      const allOpportunities = [...clusters, ...categories];

      // Detailed breakdown by type
      const clusterStats = {
        total: clusters.length,
        identified: clusters.filter((o) => o.status === "identified").length,
        planned: clusters.filter((o) => o.status === "planned").length,
        in_progress: clusters.filter((o) => o.status === "in_progress").length,
        completed: clusters.filter((o) => o.status === "completed").length,
      };

      const categoryStats = {
        total: categories.length,
        identified: categories.filter((o) => o.status === "identified").length,
        planned: categories.filter((o) => o.status === "planned").length,
        in_progress: categories.filter((o) => o.status === "in_progress").length,
        completed: categories.filter((o) => o.status === "completed").length,
      };

      return {
        // Overall stats
        total_opportunities: allOpportunities.length,
        identified: allOpportunities.filter((o) => o.status === "identified")
          .length,
        planned: allOpportunities.filter((o) => o.status === "planned").length,
        in_progress: allOpportunities.filter((o) => o.status === "in_progress")
          .length,
        completed: allOpportunities.filter((o) => o.status === "completed")
          .length,
        avg_priority_score:
          allOpportunities.length > 0
            ? allOpportunities.reduce(
                (sum, o) => sum + (o.priority_score || 0),
                0
              ) / allOpportunities.length
            : 0,
        total_estimated_traffic: allOpportunities.reduce(
          (sum, o) => sum + (o.estimated_traffic || 0),
          0
        ),
        
        // Detailed breakdown
        clusters: clusterStats,
        categories: categoryStats,
        
        // Debug info
        blogId: blogId,
        timestamp: new Date().toISOString()
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar content opportunities por status
 */
export function useContentOpportunitiesByStatus(
  status: string,
  blogId?: string
) {
  return useQuery({
    queryKey: ["content-opportunities-by-status", status, blogId],
    queryFn: async () => {
      // Buscar clusters
      let clustersQuery = supabase
        .from("content_opportunities_clusters")
        .select(
          `
          *,
          blogs (
            name,
            domain
          ),
          authors (
            name
          ),
          main_keywords (
            keyword
          )
        `
        )
        .eq("status", status)
;

      // Buscar categorias
      let categoriesQuery = supabase
        .from("content_opportunities_categories")
        .select(
          `
          *,
          blogs (
            name,
            domain
          ),
          authors (
            name
          ),
          main_keywords (
            keyword
          ),
          keyword_categories (
            name
          )
        `
        )
        .eq("status", status)
;

      if (blogId) {
        clustersQuery = clustersQuery.eq("blog_id", blogId);
        categoriesQuery = categoriesQuery.eq("blog_id", blogId);
      }

      const [clustersResult, categoriesResult] = await Promise.all([
        clustersQuery,
        categoriesQuery,
      ]);

      if (clustersResult.error) {
        throw new Error(
          `Erro ao buscar clusters por status: ${clustersResult.error.message}`
        );
      }

      if (categoriesResult.error) {
        throw new Error(
          `Erro ao buscar categorias por status: ${categoriesResult.error.message}`
        );
      }

      return {
        clusters: clustersResult.data || [],
        categories: categoriesResult.data || [],
      };
    },
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
