import React, { useMemo, useState } from 'react';
import { api, rateEssay, ingestUrls, API_BASE } from '../lib/api';
import type { RateResponse, IngestResponse } from '../types/api';
import { ScoreBar } from '../components/ScoreBar';
import { SectionCard } from '../components/SectionCard';

function parseUrls(input: string): string[] {
  const parts = input
    .split(/\s|,|\n|;|\t/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(parts.filter((u) => /^https?:\/\//i.test(u))));
}

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [essay, setEssay] = useState('');
  const [targetBand, setTargetBand] = useState<number | ''>('');
  const [topK, setTopK] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RateResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'criteria' | 'recommendations' | 'context'>('overview');
  const [activeAction, setActiveAction] = useState<'rate' | 'ingest'>('rate');
  // Ingest state
  const [ingestInput, setIngestInput] = useState('');
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [ingestResult, setIngestResult] = useState<IngestResponse | null>(null);

  const overall = data?.rating.band_scores.overall ?? null;

  const canSubmit = useMemo(() => {
    return title.trim().length > 4 && essay.trim().length > 50 && !loading;
  }, [title, essay, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const payload = {
        title,
        essay_text: essay,
        target_band: targetBand === '' ? undefined : (targetBand as number),
        top_k: topK,
      };
      const res = await rateEssay(payload);
      setData(res);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const parsedUrls = useMemo(() => parseUrls(ingestInput), [ingestInput]);
  async function handleIngestUrls(e: React.FormEvent) {
    e.preventDefault();
    setIngestError(null);
    setIngestResult(null);
    const urls = parsedUrls;
    if (urls.length === 0) {
      setIngestError('Enter at least one valid URL (must start with http/https).');
      return;
    }
    try {
      setIngestLoading(true);
      const res = await ingestUrls(urls);
      setIngestResult(res);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to ingest URLs';
      setIngestError(msg);
    } finally {
      setIngestLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                IELTS Essay Rater
              </span>
            </h1>
            <p className="text-gray-600 mt-1">Rate your Task 2 essay and enrich the knowledge base with URLs.</p>
          </div>
          <div className="mt-2">
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveAction('rate')}
                className={
                  'px-4 py-1.5 text-sm font-medium rounded-full transition ' +
                  (activeAction === 'rate' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900')
                }
              >
                Rate Essay
              </button>
              <button
                type="button"
                onClick={() => setActiveAction('ingest')}
                className={
                  'px-4 py-1.5 text-sm font-medium rounded-full transition ' +
                  (activeAction === 'ingest' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900')
                }
              >
                Ingest URLs
              </button>
            </div>
          </div>
        </div>

        {activeAction === 'rate' && (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Some people think governments should invest more in public transport..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Essay</label>
              <textarea
                className="mt-1 h-64 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your Task 2 essay here (at least 150-200 words for best results)."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
              />
              <div className="mt-1 text-xs text-gray-500">{essay.trim().length} characters</div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Band (optional)</label>
              <input
                type="number"
                min={0}
                max={9}
                step={0.5}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={targetBand}
                onChange={(e) => setTargetBand(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Top K (context size)</label>
              <input
                type="number"
                min={2}
                max={12}
                step={1}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
              />
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scoring…' : 'Rate Essay'}
            </button>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </form>
  )}

  {activeAction === 'ingest' && (
  <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard title="Add URLs to Knowledge Base">
              <form onSubmit={handleIngestUrls} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">URLs</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder={`One or many URLs separated by spaces, new lines, or commas.\nExample:\nhttps://www.ielts.org/about-ielts/ielts-assessment-criteria\nhttps://www.cambridgeenglish.org/learning-english/exams/ielts/`}
                  value={ingestInput}
                  onChange={(e) => setIngestInput(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {parsedUrls.map((u) => (
                    <span key={u} className="rounded-full bg-gray-100 px-2 py-1">{u}</span>
                  ))}
                  {parsedUrls.length === 0 && <span>Enter at least one http(s) URL</span>}
                </div>
                {ingestError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{ingestError}</div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Parsed {parsedUrls.length} URL(s)</div>
                  <button
                    type="submit"
                    disabled={ingestLoading || parsedUrls.length === 0}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ingestLoading ? 'Ingesting…' : 'Ingest URLs'}
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
          <div className="lg:col-span-1">
            <SectionCard title="Ingestion Result">
              {ingestResult ? (
                <div className="space-y-2 text-sm">
                  <div className="text-gray-700">{ingestResult.message}</div>
                  <div className="flex justify-between"><span>Added</span><span className="font-medium">{ingestResult.added_docs}</span></div>
                  <div className="flex justify-between"><span>Total</span><span className="font-medium">{ingestResult.total_docs}</span></div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No ingestion performed yet.</div>
              )}
            </SectionCard>
          </div>
        </div>
  )}

        {/* Loading skeleton */}
  {activeAction === 'rate' && loading && (
          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="h-48 rounded-xl bg-gray-200"></div>
              <div className="h-48 rounded-xl bg-gray-200 lg:col-span-2"></div>
            </div>
            <div className="h-40 rounded-xl bg-gray-200"></div>
          </div>
        )}

  {activeAction === 'rate' && data && (
          <div className="mt-8">
            {/* Header card with overall and quick facts */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="text-sm font-medium text-gray-600">Overall Band</div>
                  <div className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
                    {overall?.toFixed ? overall.toFixed(1) : overall}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Estimated if actions addressed: <span className="font-semibold text-gray-700">{data.rating.estimated_band_if_addressed}</span>
                  </div>
                </div>
                <div className="grid w-full gap-3 sm:w-auto sm:min-w-[360px]">
                  <ScoreBar label="Task Response" score={data.rating.band_scores.task_response} />
                  <ScoreBar label="Coherence & Cohesion" score={data.rating.band_scores.coherence_and_cohesion} />
                  <ScoreBar label="Lexical Resource" score={data.rating.band_scores.lexical_resource} />
                  <ScoreBar label="Grammar Range & Accuracy" score={data.rating.band_scores.grammatical_range_and_accuracy} />
                </div>
              </div>
              {/* Tabs */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'criteria', label: 'Criteria' },
                    { id: 'recommendations', label: 'Recommendations' },
                    { id: 'context', label: 'Context' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      type="button"
                      className={
                        'rounded-full px-3 py-1.5 text-sm font-medium transition ' +
                        (activeTab === (t.id as any)
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab panels */}
            {activeTab === 'overview' && (
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <SectionCard title="Prioritized Actions" right={<span className="text-xs text-gray-500">do first</span>}>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {data.rating.prioritized_actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title="Strengths">
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {data.rating.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title="Weaknesses">
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {data.rating.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            )}

            {activeTab === 'criteria' && (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.rating.criterion_feedback.map((c, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold text-gray-900">{c.criterion}</div>
                      <div className="text-sm text-gray-700">{c.score.toFixed(1)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div className={`h-2.5 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, Math.round((c.score / 9) * 100)))}%` }} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-800">{c.justification}</p>
                    {c.examples?.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                        {c.examples.map((ex, j) => (
                          <li key={j}>{ex}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SectionCard title="Improved Essay">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{data.recommendation.improved_essay}</p>
                </SectionCard>
                <div className="space-y-6">
                  <SectionCard title="Bullet Suggestions">
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {data.recommendation.bullet_point_suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </SectionCard>
                  <SectionCard title="High-Value Patterns">
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {data.recommendation.high_value_patterns.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>
              </div>
            )}

            {activeTab === 'context' && (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {data.retrieved.map((r, i) => (
                  <details key={i} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {r.source || 'Unknown source'}
                      </div>
                      <span className="text-xs text-gray-500 group-open:hidden">Show</span>
                      <span className="text-xs text-gray-500 hidden group-open:inline">Hide</span>
                    </summary>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">{r.snippet}</p>
                  </details>
                ))}
              </div>
            )}

            {/* Ingest UI moved above; removed ingest tab */}
          </div>
        )}
      </div>
    </div>
  );
}
