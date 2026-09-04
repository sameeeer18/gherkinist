import { AnalysisResult, DashboardStats, User } from '../types';

export interface SampleFeature {
  id: string;
  title: string;
  fileName: string;
  description: string;
  badge: string;
  gherkin: string;
  requirement?: string;
}

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  async login(email: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async register(name: string, email: string, company: string, role: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, role })
    });
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async analyze(gherkinContent: string, requirementContent?: string, fileName?: string): Promise<{ success: boolean; analysis: AnalysisResult }> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gherkinContent, requirementContent, fileName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to analyze Gherkin feature');
    }
    return res.json();
  },

  async getAnalysisById(id: string): Promise<AnalysisResult> {
    const res = await fetch(`/api/analyze/${id}`);
    if (!res.ok) throw new Error('Analysis not found');
    return res.json();
  },

  async getHistory(): Promise<AnalysisResult[]> {
    const res = await fetch('/api/analyze/history');
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async deleteAnalysis(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/analyze/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async reanalyze(id: string, gherkinContent?: string, requirementContent?: string): Promise<{ success: boolean; analysis: AnalysisResult }> {
    const res = await fetch(`/api/analyze/${id}/reanalyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gherkinContent, requirementContent })
    });
    if (!res.ok) throw new Error('Failed to reanalyze');
    return res.json();
  },

  async getSamples(): Promise<SampleFeature[]> {
    const res = await fetch('/api/samples');
    return res.json();
  },

  async compareVersions(targetId: string, compareWithId?: string) {
    const res = await fetch(`/api/analyze/${targetId}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compareWithId })
    });
    return res.json();
  },

  async getExecutiveReport(id: string) {
    const res = await fetch(`/api/reports/${id}`);
    return res.json();
  }
};
