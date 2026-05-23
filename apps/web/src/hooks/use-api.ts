import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';

export function usePortfolioSummary(portfolioId: string) {
  return useQuery({
    queryKey: ['portfolioSummary', portfolioId],
    queryFn: () => ApiClient.getPortfolioSummary(portfolioId),
    enabled: !!portfolioId,
  });
}

export function useAssetAllocation(portfolioId: string) {
  return useQuery({
    queryKey: ['assetAllocation', portfolioId],
    queryFn: () => ApiClient.getAssetAllocation(portfolioId),
    enabled: !!portfolioId,
  });
}

export function useAIInsights(portfolioId: string) {
  return useQuery({
    queryKey: ['aiInsights', portfolioId],
    queryFn: () => ApiClient.getInsights(portfolioId),
    enabled: !!portfolioId,
  });
}

export function useCopilotConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ['copilot', conversationId],
    queryFn: () => conversationId ? ApiClient.getCopilotHistory(conversationId) : null,
    enabled: !!conversationId,
  });
}

export function useStartCopilot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (portfolioId: string) => ApiClient.startCopilot(portfolioId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['copilot'] });
    },
  });
}

export function useSendCopilotMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) => 
      ApiClient.sendCopilotMessage(conversationId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['copilot', variables.conversationId] });
    },
  });
}
