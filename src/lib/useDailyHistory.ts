import { useEffect, useState } from 'react'
import type { HistoryItem } from '@/components/HistoryList'

const STORAGE_KEY = 'daily-history'

type StoredData = {
  date: string
  items: HistoryItem[]
}

export function useDailyHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load data dari localStorage saat mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const data: StoredData = JSON.parse(raw)
        const today = new Date().toISOString().split('T')[0]
        if (data.date === today) {
          setHistory(data.items)
        } else {
          // tanggal beda → reset
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        console.error('Failed to parse history from localStorage')
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Simpan ke localStorage setiap kali history berubah
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const data: StoredData = { date: today, items: history }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [history])

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return [history, setHistory, clearHistory] as const
}
