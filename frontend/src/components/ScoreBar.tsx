import React from 'react';

function percent(score: number) {
  return Math.min(100, Math.max(0, Math.round((score / 9) * 100)));
}

function barColor(score: number) {
  if (score >= 7.5) return 'bg-emerald-500';
  if (score >= 6.5) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = percent(score);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700">{label}</div>
        <div className="font-medium text-gray-900">{score.toFixed(1)}</div>
      </div>
      <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
        <div className={`h-2.5 rounded-full ${barColor(score)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
