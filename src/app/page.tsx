"use client";

import PomodoroTimer from "@/components/PomodoroTimer";
import HistoryList from "@/components/HistoryList";
import { useDailyHistory } from "@/lib/useDailyHistory";

export default function Home() {
  const [history, setHistory, clearHistory] = useDailyHistory();

  return (
    <div className="mt-20">
      <h1 className="text-center mb-16">Galaxy Timer</h1>
      <div className="flex flex-col lg:flex-row items-start justify-center gap-24">
        <PomodoroTimer setHistory={setHistory} />
        <HistoryList history={history} clearHistory={clearHistory} />
      </div>
    </div>
  );
}
