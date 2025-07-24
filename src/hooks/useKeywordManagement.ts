/**
 * @fileoverview Hooks avançados para gestão completa de keywords e dados relacionados
 * @module hooks/useKeywordManagement
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Interface para Main Keywords completa
 */
interface MainKeywordComplete {
  id: string;
  blog_id: string;
  keyword: string;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH" | null;
  search_intent: "informational" | "navigational" | "commercial" | "transactional" | null;
  is_used: boolean;
  created_at: string;
  updated_at: string;
  blogs: {
    id: string;
    name: string;
    domain: string;
  } | null;
  keyword_variations_count?: number;
  clusters_count?: number;
}

/**
 * Interface para Keyword Variations
 */
interface KeywordVariation {
  id: string;
  main_keyword_id: string;
  keyword: string;
  variation_type: string | null;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH" | null;
  search_intent: string | null;
  answer: string | null;
  created_at: string;
}

/**
 * Interface para busca semântica
 */
interface SemanticSearchParams {
  query: string;
  table: string;
  column: string;
  limit?: number;
  threshold?: number;
}

/**
 * Hook para buscar main keywords com dados completos
 */
export function useMainKeywordsComplete(blogId?: string, limit: number = 50) {
  return useQuery({
    queryKey: ["main-keywords-complete", blogId, limit],
    queryFn: async (): Promise<MainKeywordComplete[]> => {
      let query = supabase
        .from("main_keywords")
        .select(`
          *,
          blogs (
            id,
            name,
            domain
          )
        `)
        .order("created_at", { ascending: false });

      if (blogId) {
        query = query.eq("blog_id", blogId);
      }

      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar main keywords: ${error.message}`);
      }

      // Buscar contadores para cada keyword usando estrutura correta das tabelas
      const keywordsWithCounts = await Promise.all(
        (data || []).map(async (keyword) => {
          try {
            // keyword_variations usa main_keyword_id (✓)
            const variationsCount = await supabase
              .from("keyword_variations")
              .select("id", { count: "exact" })
              .eq("main_keyword_id", keyword.id)
              .then(({ count, error }) => {
                if (error) {
                  console.warn(`Erro ao contar variations para ${keyword.id}:`, error.message);
                  return 0;
                }
                return count || 0;
              });


            // keyword_clusters usa main_keyword_id (✓)
            const clustersCount = await supabase
              .from("keyword_clusters")
              .select("id", { count: "exact" })
              .eq("main_keyword_id", keyword.id)
              .then(({ count, error }) => {
                if (error) {
                  console.warn(`Erro ao contar clusters para ${keyword.id}:`, error.message);
                  return 0;
                }
                return count || 0;
              });

            return {
              ...keyword,
              keyword_variations_count: variationsCount,
              clusters_count: clustersCount,
            };
          } catch (error) {
            console.warn(`Erro ao buscar contadores para keyword ${keyword.id}:`, error);
            return {
              ...keyword,
              keyword_variations_count: 0,
              clusters_count: 0,
            };
          }
        })
      );

      return keywordsWithCounts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar nova main keyword
 */
export function useCreateMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      blog_id: string;
      keyword: string;
      msv?: number;
      kw_difficulty?: number;
      cpc?: number;
      competition?: "LOW" | "MEDIUM" | "HIGH";
      search_intent?: "informational" | "navigational" | "commercial" | "transactional";
    }) => {
      const { data: result, error } = await supabase
        .from("main_keywords")
        .insert([data])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar keyword: ${error.message}`);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords-complete"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats-v2"] });
    },
  });
}

/**
 * Hook para atualizar main keyword
 */
export function useUpdateMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: Partial<MainKeywordComplete>;
    }) => {
      const { data: result, error } = await supabase
        .from("main_keywords")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar keyword: ${error.message}`);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords-complete"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats-v2"] });
    },
  });
}

/**
 * Hook para deletar main keyword
 */
export function useDeleteMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("main_keywords")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Erro ao deletar keyword: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords-complete"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats-v2"] });
    },
  });
}

/**
 * Hook para buscar todas as tabelas relacionadas a uma keyword
 * Usa estrutura correta baseada no schema real das tabelas
 */
export function useKeywordRelatedData(mainKeywordId: string) {
  return useQuery({
    queryKey: ["keyword-related-data", mainKeywordId],
    queryFn: async () => {
      // Primeiro buscar a main keyword para obter o blog_id
      const { data: mainKeyword } = await supabase
        .from("main_keywords")
        .select("blog_id")
        .eq("id", mainKeywordId)
        .single();

      if (!mainKeyword) {
        throw new Error("Main keyword não encontrada");
      }

      const results = {
        variations: [] as any[],
        clusters: [] as any[],
        clusterKeywords: [] as any[],
        contentOpportunitiesCategories: [] as any[],
        contentOpportunitiesClusters: [] as any[],
      };

      // keyword_variations usa main_keyword_id ✓
      try {
        const { data: variations } = await supabase
          .from("keyword_variations")
          .select("*")
          .eq("main_keyword_id", mainKeywordId)
          .order("msv", { ascending: false });
        results.variations = variations || [];
      } catch (error) {
        console.warn("Erro ao buscar keyword_variations:", error);
      }


      // keyword_clusters usa main_keyword_id ✓
      try {
        const { data: clusters } = await supabase
          .from("keyword_clusters")
          .select("*")
          .eq("main_keyword_id", mainKeywordId)
          .order("created_at", { ascending: false });
        results.clusters = clusters || [];
      } catch (error) {
        console.warn("Erro ao buscar keyword_clusters:", error);
      }

      // cluster_keywords usa cluster_id (precisamos buscar pelos clusters encontrados)
      if (results.clusters.length > 0) {
        try {
          const clusterIds = results.clusters.map(c => c.id);
          const { data: clusterKeywords } = await supabase
            .from("cluster_keywords")
            .select("*")
            .in("cluster_id", clusterIds)
            .order("created_at", { ascending: false });
          results.clusterKeywords = clusterKeywords || [];
        } catch (error) {
          console.warn("Erro ao buscar cluster_keywords:", error);
        }
      }

      // content_opportunities_categories usa main_keyword_id ✓
      try {
        const { data: contentOpportunitiesCategories } = await supabase
          .from("content_opportunities_categories")
          .select("*")
          .eq("main_keyword_id", mainKeywordId)
          .order("priority_score", { ascending: false });
        results.contentOpportunitiesCategories = contentOpportunitiesCategories || [];
      } catch (error) {
        console.warn("Erro ao buscar content_opportunities_categories:", error);
      }

      // content_opportunities_clusters usa main_keyword_id ✓
      try {
        const { data: contentOpportunitiesClusters } = await supabase
          .from("content_opportunities_clusters")
          .select("*")
          .eq("main_keyword_id", mainKeywordId)
          .order("priority_score", { ascending: false });
        results.contentOpportunitiesClusters = contentOpportunitiesClusters || [];
      } catch (error) {
        console.warn("Erro ao buscar content_opportunities_clusters:", error);
      }

      return results;
    },
    enabled: !!mainKeywordId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para busca semântica usando embeddings
 * Busca por similaridade nos vetores das tabelas
 */
export function useSemanticSearch(params: SemanticSearchParams) {
  return useQuery({
    queryKey: ["semantic-search", params],
    queryFn: async () => {
      // Tabelas que têm embeddings: keyword_variations, keyword_clusters, content_opportunities_*
      const tablesWithEmbeddings = [
        'keyword_variations',
        'keyword_clusters', 
        'content_opportunities_categories',
        'content_opportunities_clusters'
      ];

      if (!tablesWithEmbeddings.includes(params.table)) {
        // Fallback para busca textual em tabelas sem embeddings
        const { data, error } = await supabase
          .from(params.table)
          .select("*")
          .textSearch(params.column, params.query)
          .limit(params.limit || 10);

        if (error) {
          throw new Error(`Erro na busca textual: ${error.message}`);
        }

        return data || [];
      }

      // Para implementação real de busca semântica, você precisaria:
      // 1. Gerar embedding da query usando OpenAI/outro serviço
      // 2. Usar pgvector para buscar similaridade: ORDER BY embedding <-> query_embedding
      
      // Por enquanto, fazemos busca textual como fallback
      const searchColumns = {
        'keyword_variations': 'keyword',
        'keyword_clusters': 'cluster_name',
        'content_opportunities_categories': 'title',
        'content_opportunities_clusters': 'title'
      };

      const searchColumn = searchColumns[params.table as keyof typeof searchColumns] || params.column;

      const { data, error } = await supabase
        .from(params.table)
        .select("*")
        .ilike(searchColumn, `%${params.query}%`)
        .limit(params.limit || 10);

      if (error) {
        throw new Error(`Erro na busca semântica: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!params.query && !!params.table,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook para estatísticas avançadas do banco de dados
 */
export function useDatabaseStats() {
  return useQuery({
    queryKey: ["database-stats"],
    queryFn: async () => {
      const [
        mainKeywordsCount,
        variationsCount,
        clustersCount,
        clusterKeywordsCount,
        contentOpportunitiesCategoriesCount,
        contentOpportunitiesClustersCount,
      ] = await Promise.all([
        supabase.from("main_keywords").select("id", { count: "exact" }),
        supabase.from("keyword_variations").select("id", { count: "exact" }),
        supabase.from("keyword_clusters").select("id", { count: "exact" }),
        supabase.from("cluster_keywords").select("id", { count: "exact" }),
        supabase.from("content_opportunities_categories").select("id", { count: "exact" }),
        supabase.from("content_opportunities_clusters").select("id", { count: "exact" }),
      ]);

      return {
        mainKeywords: mainKeywordsCount.count || 0,
        variations: variationsCount.count || 0,
        clusters: clustersCount.count || 0,
        clusterKeywords: clusterKeywordsCount.count || 0,
        contentOpportunitiesCategories: contentOpportunitiesCategoriesCount.count || 0,
        contentOpportunitiesClusters: contentOpportunitiesClustersCount.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}