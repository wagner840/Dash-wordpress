/**
 * @fileoverview Hook para buscar keywords e variações do Supabase
 * @module hooks/useKeywords
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Interface para Main Keywords
 */
interface MainKeyword {
  id: string;
  blog_id: string;
  keyword: string;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH" | null;
  search_intent:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional"
    | null;
  is_used: boolean;
  created_at: string;
  blogs: {
    name: string;
    domain: string;
  } | null;
}

/**
 * Interface para Keyword Variations
 */
interface KeywordVariation {
  id: string;
  main_keyword_id: string;
  keyword: string;
  variation_type:
    | "related"
    | "suggestion"
    | "idea"
    | "autocomplete"
    | "subtopic"
    | "people_also_ask"
    | null;
  msv: number | null;
  kw_difficulty: number | null;
  cpc: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH" | null;
  search_intent:
    | "informational"
    | "navigational"
    | "commercial"
    | "transactional"
    | null;
  answer: string | null;
  created_at: string;
}

/**
 * Hook para buscar main keywords de um blog
 */
export function useMainKeywords(blogId?: string) {
  return useQuery({
    queryKey: ["main-keywords", blogId],
    queryFn: async (): Promise<MainKeyword[]> => {
      let query = supabase
        .from("main_keywords")
        .select(
          `
          *,
          blogs (
            name,
            domain
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
        throw new Error(`Erro ao buscar main keywords: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar variações de keywords
 */
export function useKeywordVariations(mainKeywordId?: string) {
  return useQuery({
    queryKey: ["keyword-variations", mainKeywordId],
    queryFn: async (): Promise<KeywordVariation[]> => {
      let query = supabase
        .from("keyword_variations")
        .select("*")
        .order("msv", { ascending: false });

      if (mainKeywordId) {
        query = query.eq("main_keyword_id", mainKeywordId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Erro ao buscar variações de keywords: ${error.message}`
        );
      }

      return data || [];
    },
    enabled: !!mainKeywordId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar estatísticas de keywords
 */
export function useKeywordStats(blogId?: string) {
  return useQuery({
    queryKey: ["keyword-stats-v2", blogId],
    queryFn: async () => {
      let query = supabase
        .from("main_keywords")
        .select(
          `
          id,
          msv,
          kw_difficulty,
          is_used,
          blogs (
            name,
            domain
          )
        `
        );

      if (blogId) {
        query = query.eq("blog_id", blogId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Erro ao buscar estatísticas de keywords: ${error.message}`
        );
      }

      const keywords = data || [];

      return {
        total_keywords: keywords.length,
        used_keywords: keywords.filter((k) => k.is_used).length,
        avg_msv:
          keywords.length > 0
            ? keywords.reduce((sum, k) => sum + (k.msv || 0), 0) /
              keywords.length
            : 0,
        avg_difficulty:
          keywords.length > 0
            ? keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) /
              keywords.length
            : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar keywords por tipo de variação
 */
export function useKeywordVariationsByType(
  mainKeywordId: string,
  variationType: string
) {
  return useQuery({
    queryKey: ["keyword-variations-by-type", mainKeywordId, variationType],
    queryFn: async (): Promise<KeywordVariation[]> => {
      const { data, error } = await supabase
        .from("keyword_variations")
        .select("*")
        .eq("main_keyword_id", mainKeywordId)
        .eq("variation_type", variationType)
        .order("msv", { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar variações por tipo: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!mainKeywordId && !!variationType,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
