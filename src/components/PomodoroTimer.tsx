"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, StopCircle, VolumeX, Volume2 } from "lucide-react";

import { motion, useAnimation } from "framer-motion";

const MODES = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

type ModeType = keyof typeof MODES;

export default function PomodoroTimer({
  setHistory,
}: {
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [mode, setMode] = useState<ModeType>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODES["pomodoro"]);
  const [sessionName, setSessionName] = useState("");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (lofiAudio.current) lofiAudio.current.muted = muted;
    if (meowAudio.current) meowAudio.current.muted = muted;
  }, [muted]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = MODES[mode];
  const percent = ((total - timeLeft) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const lofiAudio = useRef<HTMLAudioElement | null>(null);
  const meowAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Autoplay workaround for Chrome
    lofiAudio.current = new Audio("/lofi.mp3");
    lofiAudio.current.loop = true;
    lofiAudio.current.volume = 0.3;

    meowAudio.current = new Audio("/listen.mp3");
  }, []);

  const startTimer = () => {
    if (intervalRef.current) return;

    setHasStarted(true);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        return t - 1;
      });
    }, 1000);
    lofiAudio.current?.play().catch(() => {});
  };

  useEffect(() => {
    if (timeLeft === 0 && hasStarted) {
      stopTimer();
    }
  }, [timeLeft, hasStarted]);

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    lofiAudio.current?.pause();
  };

  const resetTimer = () => {
    pauseTimer();
    setIsRunning(false);
    setHasStarted(false);
    setTimeLeft(MODES[mode]);
    lofiAudio.current?.pause();
    lofiAudio.current!.currentTime = 0;
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setHasStarted(false);
    lofiAudio.current?.pause();
    lofiAudio.current!.currentTime = 0;

    meowAudio.current?.play();

    setHistory((prev) => [
      {
        sessionName: sessionName || "Untitled",
        mode,
        duration: total - timeLeft,
        finishedAt: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setTimeLeft(MODES[mode]);
  };

  const changeMode = (m: ModeType) => {
    if (hasStarted) return;
    pauseTimer();
    setMode(m);
    setTimeLeft(MODES[m]);
    setIsRunning(false);
    setHasStarted(false);
  };

  useEffect(() => {
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    const label =
      mode === "pomodoro"
        ? "Pomodoro"
        : mode === "short"
        ? "Short Break"
        : "Long Break";
    document.title = `${m}:${s} - ${label}${
      sessionName ? ` | ${sessionName}` : ""
    }`;
  }, [minutes, seconds, mode, sessionName]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-2xl border dark:border-neutral-700">
      <Tabs value={mode} onValueChange={(val) => changeMode(val as ModeType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pomodoro" disabled={hasStarted}>
            Pomodoro
          </TabsTrigger>
          <TabsTrigger value="short" disabled={hasStarted}>
            Short Break
          </TabsTrigger>
          <TabsTrigger value="long" disabled={hasStarted}>
            Long Break
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-64 h-64">
        <svg className="w-full h-full rotate-[-90deg]">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <circle
            cx="50%"
            cy="50%"
            r="100"
            className="stroke-neutral-600"
            strokeWidth="20"
            fill="none"
          />

          <motion.circle
            cx="50%"
            cy="50%"
            r="100"
            stroke="url(#blueGradient)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={Math.PI * 2 * 100}
            animate={{
              strokeDashoffset: Math.PI * 2 * 100 * ((100 - percent) / 100),
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
          <h2 className="text-black dark:text-white text-5xl font-medium">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm opacity-60 mt-1">
            {sessionName || "No Session Name"}
          </p>
          <Button className="mt-2 w-fit h-fit" variant="outline" onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
          </Button>
        </div>
      </div>

      <Input
        placeholder="Session name (optional)"
        className="max-w-sm"
        value={sessionName}
        disabled={hasStarted}
        onChange={(e) => setSessionName(e.target.value)}
      />

      <div className="flex gap-3 items-center">
        <Button variant="outline" size="icon" onClick={resetTimer}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          className="text-white w-fit h-fit"
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? (
            <Pause className="size-8 fill-current stroke-none text-white" />
          ) : (
            <Play className="size-8 fill-current stroke-none text-white" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={stopTimer}
          disabled={!isRunning && timeLeft === MODES[mode]}
        >
          <StopCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
