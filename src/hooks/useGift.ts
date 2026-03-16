// src/hooks/useGifts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Gift } from '@/src/types'
import { api } from '@/lib/axios'

/* =========================
   API Response Type
========================= */

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/* =========================
   Fetch Gifts
========================= */

export const useGifts = () => {
  return useQuery<Gift[], Error>({
    queryKey: ['gifts'],
    queryFn: async (): Promise<Gift[]> => {
      const { data } = await api.get<ApiResponse<Gift[]>>('/gifts')

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch gifts')
      }

      return data.data
    },

    staleTime: 1000 * 60, // 1 minute cache
    refetchOnWindowFocus: false,
  })
}

/* =========================
   Create Gift
========================= */

export const useCreateGift = () => {
  const queryClient = useQueryClient()

  return useMutation<Gift, Error, Omit<Gift, 'id'>>({
    mutationFn: async (giftData) => {
      const { data } = await api.post<ApiResponse<Gift>>('/gifts', giftData)

      if (!data.success) {
        throw new Error(data.error || 'Failed to create gift')
      }

      return data.data
    },

    onSuccess: (newGift) => {
      queryClient.setQueryData<Gift[]>(['gifts'], (old) => [
        ...(old || []),
        newGift,
      ])
    },
  })
}

/* =========================
   Update Gift
========================= */

export const useUpdateGift = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Gift,
    Error,
    { id: number; giftData: Omit<Gift, 'id'> }
  >({
    mutationFn: async ({ id, giftData }) => {
      const { data } = await api.put<ApiResponse<Gift>>(
        `/gifts/${id}`,
        giftData
      )

      if (!data.success) {
        throw new Error(data.error || 'Failed to update gift')
      }

      return data.data
    },

    onSuccess: (updatedGift) => {
      queryClient.setQueryData<Gift[]>(['gifts'], (old) =>
        (old || []).map((g) =>
          g.id === updatedGift.id ? updatedGift : g
        )
      )
    },
  })
}

/* =========================
   Delete Gift
========================= */

export const useDeleteGift = () => {
  const queryClient = useQueryClient()

  return useMutation<number, Error, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete<ApiResponse<null>>(
        `/gifts/${id}`
      )

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete gift')
      }

      return id
    },

    onSuccess: (id) => {
      queryClient.setQueryData<Gift[]>(['gifts'], (old) =>
        (old || []).filter((g) => g.id !== id)
      )
    },
  })
}