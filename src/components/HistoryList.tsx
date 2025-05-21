"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react"; // atau ilustrasi lain


export type HistoryItem = {
  sessionName: string;
  mode: string;
  duration: number;
  finishedAt: string;
};

export default function HistoryList({
  history,
  clearHistory,
}: {
  history: HistoryItem[];
  clearHistory: () => void;
}) {
  const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

  const formatTime = (timeStr: string) => {
  // Ambil hanya jam & menit + AM/PM, buang detik
  const [time, period] = timeStr.split(' ')
  const [hour, minute] = time.split(':')

  return `${hour}:${minute} ${period}`
}


  return (
    <div className="mt-6 w-full h-full p-6 rounded-xl max-w-sm border border-neutral-700">
      <h3 className="text-black dark:text-white text-lg font-semibold mb-4">
        Task History
      </h3>
      <ScrollArea className="h-64 rounded border border-black/20 dark:border-white/10">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-neutral-500 dark:text-neutral-400">
            <img src="/empty-icon.svg" className="w-[64px] h-auto mt-14 mb-3" alt="" />
            <h4 className="font-medium text-lg text-white">No History</h4>
            <p className="text-sm">No task history for today.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {history.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center px-4 py-3 text-black dark:text-neutral-200 border-b border-white/10 text-sm"
              >
                <div>
                  <h4 className="font-medium">{item.sessionName}</h4>
                  <p className="text-neutral-400">
                    {capitalize(item.mode)} - {Math.floor(item.duration / 60)}m{" "}
                    {item.duration % 60}s
                  </p>
                </div>
                <div className="opacity-70">{formatTime(item.finishedAt)}</div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={clearHistory}
        disabled={history.length === 0}
      >
        Clear History
      </Button>
    </div>
  );
}
