/**
 * @fileoverview Hook para buscar dados em tempo real da API do WordPress
 * @module hooks/useWordPress
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createWordPressClient } from "@/lib/wordpress/client";
import { getWordPressConfig, getBlogSiteId } from "@/lib/wordpress/config";
import { WordPressPost } from "@/types/wordpress";

// Helper type for API response that might have different _links structure
type WordPressAPIResponse = Omit<WordPressPost, '_links' | 'meta'> & {
  _links?: any;
  meta?: any;
};

/**
 * Hook para testar quais status são aceitos pelo WordPress REST API
 */
export function useWordPressStatusTest(blogId: string) {
  return useQuery({
    queryKey: ["wordpress-status-test", blogId],
    queryFn: async (): Promise<string[]> => {
      const siteId = getBlogSiteId(blogId);
      const config = getWordPressConfig(siteId);
      const client = createWordPressClient(config);
      
      const statusToTest = ['publish', 'draft', 'pending', 'private', 'future', 'trash'];
      const validStatuses: string[] = [];
      
      for (const status of statusToTest) {
        try {
          await client.posts.getPosts({
            status: [status],
            per_page: 1,
          });
          validStatuses.push(status);
          console.log(`✅ Status "${status}" aceito`);
        } catch (error: any) {
          console.log(`❌ Status "${status}" rejeitado: ${error.response?.status === 400 ? 'Status não suportado ou sem permissão' : error.message}`);
        }
      }
      
      // Testar "any" separadamente
      try {
        await client.posts.getPosts({
          status: ["any"],
          per_page: 1,
        });
        validStatuses.push("any");
        console.log(`✅ Status "any" aceito`);
      } catch (error: any) {
        console.log(`❌ Status "any" rejeitado: ${error.response?.status === 400 ? 'Status não suportado ou sem permissão' : error.message}`);
      }
      
      return validStatuses;
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutos - testa uma vez e guarda
  });
}

/**
 * Hook para buscar TODOS os posts de um blog do WordPress
 * A paginação é feita no frontend, não no backend
 */
export function useWordPressPosts(
  blogId: string,
  statusFilter: string = "publish"
) {
  return useQuery({
    queryKey: ["wordpress-all-posts", blogId, statusFilter],
    queryFn: async (): Promise<WordPressPost[]> => {
      // Mapear UUID do blogId para o site correto
      const siteId = getBlogSiteId(blogId);
      const config = getWordPressConfig(siteId);
      const client = createWordPressClient(config);

      let allPosts: WordPressPost[] = [];
      let page = 1;
      let hasMorePosts = true;

      // Estratégia: Se não é "publish", tentar com filtro primeiro, depois fallback para filtro manual
      const shouldTryStatusFilter = statusFilter === 'publish';
      let useManualFiltering = false;

      while (hasMorePosts) {
        try {
          let requestParams;
          let posts: WordPressAPIResponse[] = [];

          // Primeiro, tentar com filtro de status se não for "publish" e ainda não estivermos usando filtragem manual
          if (!useManualFiltering && !shouldTryStatusFilter) {
            try {
              requestParams = {
                status: [statusFilter],
                per_page: 100,
                page: page,
                orderby: "date" as const,
                order: "desc" as const,
              };
              console.log(`Tentando buscar posts - página ${page} com status filter:`, requestParams);
              posts = await client.posts.getPosts(requestParams) as WordPressAPIResponse[];
            } catch (statusError: any) {
              if (statusError.response?.status === 400) {
                console.log(`❌ Status "${statusFilter}" não suportado, mudando para filtragem manual`);
                useManualFiltering = true;
              } else {
                throw statusError;
              }
            }
          }

          // Se falhou ou estamos usando filtragem manual, buscar todos os posts e filtrar manualmente
          if (useManualFiltering || (posts.length === 0 && !shouldTryStatusFilter)) {
            requestParams = {
              per_page: 100,
              page: page,
              orderby: "date" as const,
              order: "desc" as const,
            };
            console.log(`Buscando posts - página ${page} sem filtro de status:`, requestParams);
            posts = await client.posts.getPosts(requestParams) as WordPressAPIResponse[];
          }

          // Para "publish" ou quando conseguimos buscar com filtro de status
          if (shouldTryStatusFilter || (!useManualFiltering && posts.length > 0)) {
            if (shouldTryStatusFilter) {
              requestParams = {
                status: [statusFilter],
                per_page: 100,
                page: page,
                orderby: "date" as const,
                order: "desc" as const,
              };
              console.log(`Buscando posts - página ${page} com status "publish":`, requestParams);
              posts = await client.posts.getPosts(requestParams) as WordPressAPIResponse[];
            }
            
            allPosts = [...allPosts, ...posts.map(post => ({
              ...post,
              meta: post.meta || {},
              _links: post._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
            } as WordPressPost))];
            console.log(`Página ${page}: ${posts.length} posts com status "${statusFilter}"`);
          } else if (useManualFiltering) {
            // Filtrar manualmente pelos posts do status desejado
            const filteredPosts = posts.filter(post => {
              if (statusFilter === 'any') return true;
              return post.status === statusFilter;
            });
            allPosts = [...allPosts, ...filteredPosts.map(post => ({
              ...post,
              meta: post.meta || {},
              _links: post._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
            } as WordPressPost))];
            console.log(`Página ${page}: ${posts.length} posts total, ${filteredPosts.length} com status "${statusFilter}"`);
          }
          
          // Se retornou menos de 100 posts, não há mais páginas
          hasMorePosts = posts.length === 100;
          page++;
          
          // Limitar a 5 páginas para evitar loop infinito em casos de erro
          if (page > 5) {
            console.warn("Interrompendo busca após 5 páginas para evitar loop infinito");
            break;
          }
        } catch (error: any) {
          console.error(`Erro ao buscar posts (página ${page}):`, error.message);
          break;
        }
      }

      console.log(`Total encontrado: ${allPosts.length} posts com status "${statusFilter}"`);
      return allPosts;
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar posts recentes de todos os blogs WordPress
 */
export function useAllWordPressPosts(limit: number = 5) {
  return useQuery({
    queryKey: ["all-wordpress-posts", limit],
    queryFn: async (): Promise<WordPressPost[]> => {
      const optmilConfig = getWordPressConfig("optmil");
      const einsof7Config = getWordPressConfig("einsof7");
      const optmilClient = createWordPressClient(optmilConfig);
      const einsof7Client = createWordPressClient(einsof7Config);

      const [optmilPosts, einsof7Posts] = await Promise.all([
        optmilClient.posts.getPosts({
          status: ["publish"],
          per_page: Math.ceil(limit / 2),
          orderby: "date",
          order: "desc",
        }),
        einsof7Client.posts.getPosts({
          status: ["publish"],
          per_page: Math.ceil(limit / 2),
          orderby: "date",
          order: "desc",
        }),
      ]);

      // Combinar e ordenar por data
      const allPosts = [...optmilPosts, ...einsof7Posts].map(post => ({
        ...post,
        meta: (post as WordPressAPIResponse).meta || {},
        _links: (post as WordPressAPIResponse)._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
      } as WordPressPost));
      return allPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar estatísticas de posts por blog WordPress
 */
export function useWordPressStats(blogId: string) {
  return useQuery({
    queryKey: ["wordpress-stats", blogId],
    queryFn: async () => {
      const siteId = getBlogSiteId(blogId);
      const config = getWordPressConfig(siteId);
      const client = createWordPressClient(config);

      const publishedPosts = await client.posts.getPosts({ 
        status: ["publish"], 
        per_page: 100 
      });
      
      // Tentar buscar todos os posts (inclui drafts se autorizado)
      let allPosts = [];
      try {
        allPosts = await client.posts.getPosts({ per_page: 100 });
      } catch (error) {
        allPosts = publishedPosts; // Fallback se não conseguir buscar todos
      }
      
      const draftPosts = allPosts.filter(post => post.status === 'draft');
      
      return {
        total_posts: allPosts.length,
        published_posts: publishedPosts.length,
        draft_posts: draftPosts.length,
        scheduled_posts: 0, // WordPress não tem status 'scheduled' por padrão
      };
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para atualizar status de um post do WordPress
 */
export function useUpdatePostStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      blogId, 
      postId, 
      status 
    }: { 
      blogId: string; 
      postId: number; 
      status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
    }) => {
      const siteId = getBlogSiteId(blogId);
      const config = getWordPressConfig(siteId);
      const client = createWordPressClient(config);
      
      return await client.posts.updatePost({
        id: postId,
        status
      });
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ 
        queryKey: ["wordpress-posts", variables.blogId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["wordpress-stats", variables.blogId] 
      });
    }
  });
}
