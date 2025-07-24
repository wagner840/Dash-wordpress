/**
 * @fileoverview Hook para buscar dados em tempo real da API do WordPress
 * @module hooks/useWordPress
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createWordPressClient } from "@/lib/wordpress";
import { getWordPressConfig, getBlogSiteId } from "@/lib/wordpress/config";
import { WordPressPost } from "@/types/wordpress";

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
          console.log(`❌ Status "${status}" rejeitado:`, error.message);
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
        console.log(`❌ Status "any" rejeitado:`, error.message);
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

      // Estratégia: Se não é "publish", buscar sem filtro de status e filtrar manualmente
      const shouldFilterManually = statusFilter !== 'publish';

      while (hasMorePosts) {
        try {
          const requestParams = shouldFilterManually 
            ? {
                per_page: 100,
                page: page,
                orderby: "date" as const,
                order: "desc" as const,
                // Não incluir status - deixar WordPress decidir o que mostrar
              }
            : {
                status: [statusFilter], // Apenas para "publish"
                per_page: 100,
                page: page,
                orderby: "date" as const,
                order: "desc" as const,
              };

          console.log(`Buscando posts - página ${page}, params:`, requestParams);
          const posts = await client.posts.getPosts(requestParams);

          if (shouldFilterManually) {
            // Filtrar manualmente pelos posts do status desejado
            const filteredPosts = posts.filter(post => {
              if (statusFilter === 'any') return true;
              return post.status === statusFilter;
            });
            allPosts = [...allPosts, ...filteredPosts.map(post => ({
              ...post,
              _links: post._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
            }))];
            console.log(`Página ${page}: ${posts.length} posts total, ${filteredPosts.length} com status "${statusFilter}"`);
          } else {
            allPosts = [...allPosts, ...posts.map(post => ({
              ...post,
              _links: post._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
            }))];
            console.log(`Página ${page}: ${posts.length} posts com status "publish"`);
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
        _links: post._links || { self: [], collection: [], about: [], author: [], replies: [], 'version-history': [], 'wp:attachment': [], 'wp:term': [], curies: [] }
      }));
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
