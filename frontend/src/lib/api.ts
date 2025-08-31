import axios from 'axios';
import type { RateResponse, IngestResponse } from '../types/api';

export const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export async function rateEssay(payload: {
  title: string;
  essay_text: string;
  target_band?: number;
  top_k: number;
}) {
  const { data } = await api.post<RateResponse>('/rate', payload);
  return data;
}

export async function ingestUrls(urls: string[]) {
  const { data } = await api.post<IngestResponse>('/ingest', { urls });
  return data;
}
