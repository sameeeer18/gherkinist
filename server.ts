import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { analyzeGherkinFeature } from './server/aiService';
import { AnalysisResult } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS & Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Gherkinist Multi-AI Engine',
      version: '2.4.0',
      timestamp: new Date().toISOString()
    });
  });

  // Auth routes
  app.get('/api/auth/me', (req, res) => {
    const user = db.getUser('usr_enterprise_demo');
    res.json({ success: true, user });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    let user = db.getUserByEmail(email || 'alex.morgan@fintech-enterprise.io');
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: email ? email.split('@')[0] : 'Alex Morgan',
        email: email || 'alex.morgan@fintech-enterprise.io',
        role: 'Lead QA Architect',
        company: 'FinTech Corp'
      };
      db.saveUser(user);
    }
    res.json({ success: true, user, token: 'mock-jwt-token-gherkiniq-enterprise' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, company, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = {
      id: `usr_${Date.now()}`,
      name: name || 'Enterprise Engineer',
      email,
      company: company || 'FinTech Enterprise',
      role: role || 'Product & QA Lead'
    };
    db.saveUser(user);
    res.json({ success: true, user, token: 'mock-jwt-token-gherkiniq-enterprise' });
  });

  // Dashboard Stats
  app.get('/api/dashboard/stats', (req, res) => {
    const stats = db.getDashboardStats();
    res.json(stats);
  });

  // Analyze Gherkin Feature File
  app.post('/api/analyze', async (req, res) => {
    try {
      const { gherkinContent, requirementContent, fileName } = req.body;
      if (!gherkinContent || typeof gherkinContent !== 'string' || gherkinContent.trim().length === 0) {
        return res.status(400).json({ error: 'Gherkin feature file content is required' });
      }

      const result = await analyzeGherkinFeature(
        gherkinContent,
        requirementContent,
        fileName || 'feature.feature'
      );

      db.saveAnalysis(result);
      res.status(201).json({ success: true, analysis: result });
    } catch (err: any) {
      console.error('Error analyzing Gherkin:', err);
      res.status(500).json({
        error: 'Failed to analyze Gherkin feature file',
        details: err?.message || 'Unknown processing error'
      });
    }
  });

  // History endpoint (before :id)
  app.get('/api/analyze/history', (req, res) => {
    try {
      const list = db.getAllAnalyses();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch history', details: err?.message });
    }
  });

  // Get Analysis by ID
  app.get('/api/analyze/:id', (req, res) => {
    const analysis = db.getAnalysisById(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis record not found' });
    res.json(analysis);
  });

  // Delete Analysis
  app.delete('/api/analyze/:id', (req, res) => {
    const deleted = db.deleteAnalysis(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Analysis not found or already deleted' });
    res.json({ success: true, message: 'Analysis deleted successfully' });
  });

  // Re-analyze
  app.post('/api/analyze/:id/reanalyze', async (req, res) => {
    try {
      const existing = db.getAnalysisById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Original analysis record not found' });
      const newGherkin = req.body.gherkinContent || existing.originalGherkin;
      const newReq = req.body.requirementContent !== undefined ? req.body.requirementContent : existing.requirementText;
      const newResult = await analyzeGherkinFeature(newGherkin, newReq, existing.fileName);
      newResult.version = (existing.version || 1) + 1;
      newResult.previousAnalysisId = existing.id;
      newResult.improvementDelta = newResult.overallScore - existing.overallScore;
      db.saveAnalysis(newResult);
      res.json({ success: true, analysis: newResult });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to re-analyze feature', details: err.message });
    }
  });

  // Generate Improved Gherkin
  app.post('/api/analyze/:id/improve', (req, res) => {
    const analysis = db.getAnalysisById(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    res.json({
      success: true,
      improvedGherkin: analysis.improvedGherkin,
      improvementsCount: analysis.improvementsCount,
      recommendations: analysis.recommendations
    });
  });

  // Version Comparison
  app.post('/api/analyze/:id/compare', (req, res) => {
    const target = db.getAnalysisById(req.params.id);
    if (!target) return res.status(404).json({ error: 'Target analysis not found' });
    const { compareWithId } = req.body;
    let base = compareWithId ? db.getAnalysisById(compareWithId) : undefined;
    if (!base && target.previousAnalysisId) {
      base = db.getAnalysisById(target.previousAnalysisId);
    }
    if (!base) {
      const all = db.getAllAnalyses().filter(a => a.id !== target.id);
      base = all[0];
    }
    if (!base) return res.status(400).json({ error: 'No baseline analysis found for comparison' });

    const scoreDelta = target.overallScore - base.overallScore;
    res.json({
      baseVersion: {
        id: base.id,
        version: base.version,
        score: base.overallScore,
        devScore: base.developmentScore,
        qaScore: base.qaScore,
        structure: base.fourLayers.structuralSyntax.score,
        coverage: base.fourLayers.coverageCompleteness.score,
        coherence: base.fourLayers.coherenceConsistency.score,
        traceability: base.fourLayers.traceability.score,
        issuesCount: base.issues.length
      },
      targetVersion: {
        id: target.id,
        version: target.version,
        score: target.overallScore,
        devScore: target.developmentScore,
        qaScore: target.qaScore,
        structure: target.fourLayers.structuralSyntax.score,
        coverage: target.fourLayers.coverageCompleteness.score,
        coherence: target.fourLayers.coherenceConsistency.score,
        traceability: target.fourLayers.traceability.score,
        issuesCount: target.issues.length
      },
      metrics: {
        scoreDelta,
        scoreDeltaSign: scoreDelta >= 0 ? `+${scoreDelta}` : `${scoreDelta}`,
        fixedIssuesCount: Math.max(0, base.issues.length - target.issues.length),
        newIssuesCount: target.issues.filter(ti => !base!.issues.some(bi => bi.title === ti.title)).length,
        remainingIssuesCount: target.issues.length
      }
    });
  });

  // Preloaded Samples
  app.get('/api/samples', (req, res) => {
    res.json([
      {
        id: 'sample-prepaid',
        title: 'Prepaid Card Issuance (PPI Limits & Kit Allocation)',
        fileName: 'prepaid_card_issuance.feature',
        description: 'RBI Master Directions on PPIs: Small-KYC reload cap and card lock.',
        badge: 'Card Issuance: Prepaid Card',
        gherkin: `@REQ-PPI-401 @prepaid @ppi\nFeature: Prepaid Card Issuance & PPI Lifecycle\n\n  Background:\n    Given the Prepaid Payment Instrument core ledger is operational\n\n  Scenario: Successfully reload Full-KYC prepaid card\n    Given cardholder "CH-9021" has verified Full-KYC status\n    When cardholder loads INR 10000 via linked UPI VPA\n    Then the card available balance should be INR 25000`,
        requirement: `REQUIREMENT REQ-PPI-401: Prepaid Card Issuance\nAC-01: Full-KYC cards permitted up to INR 2,00,000 maximum balance.`
      }
    ]);
  });

  // Vite middleware / Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/.data/**', '**/node_modules/**', '**/.git/**'],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 Gherkinist Studio running at: http://localhost:${PORT}/\n`);
  });
}

startServer();