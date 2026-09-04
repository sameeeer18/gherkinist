import fs from 'fs';
import path from 'path';
import { AnalysisResult, DashboardStats, User } from '../src/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const ANALYSES_FILE = path.join(DATA_DIR, 'analyses.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed Users
const DEFAULT_USER: User = {
  id: 'usr_enterprise_demo',
  name: 'Alex Morgan',
  email: 'alex.morgan@fintech-enterprise.io',
  role: 'Lead QA Architect & Principal BA',
  company: 'Apex Global Financial Services'
};

// Seed Analyses
const SEED_ANALYSES: AnalysisResult[] = [
  {
    id: 'ANL-2026-PAY-01',
    userId: 'usr_enterprise_demo',
    fileName: 'payment_processing.feature',
    fileSize: '4 KB',
    featureTitle: 'Payment Processing & Settlement',
    featureNarrative: 'As a verified customer\nI want to make an instant merchant payment\nSo that I can complete my purchase securely',
    originalGherkin: `@REQ-PAY-101 @payment @fintech
Feature: Payment Processing & Settlement

  As a verified customer
  I want to make an instant merchant payment
  So that I can complete my purchase securely

  Background:
    Given the banking gateway is operational
    And customer "CUST-9901" is logged in

  @smoke @priority-1
  Scenario: Successfully process payment when balance is sufficient
    Given customer "CUST-9901" has an active wallet balance of INR 5000
    When customer "CUST-9901" initiates a transfer of INR 1200 to merchant "Apex Store"
    Then the transaction status should be "COMPLETED"
    And a receipt reference "TXN-OK-99" should be created
    And the wallet balance should be INR 3800

  Scenario: Refund
    Given payment exists
    When refund is triggered
    Then something happens`,
    requirementText: `REQUIREMENT REQ-PAY-101: Digital Wallet Instant Payment
1. Customer must have an authenticated session and sufficient funds.
2. System must execute settlement and update account balance atomically.
3. AC-01: Valid payments must return 200 OK and generate unique transaction reference.
4. AC-02: Payments with insufficient funds must be rejected without account debit.
5. AC-03: Gateway timeouts must be marked PENDING_VERIFICATION and queued for automated reconciliation.`,
    requirementFileName: 'REQ-PAY-101_Spec.txt',
    overallScore: 88,
    developmentScore: 93,
    qaScore: 84,
    sprintReady: true,
    finalVerdict: 'NEEDS REVISION',
    fourLayers: {
      structuralSyntax: {
        name: 'Structural / Syntax',
        layer: 'structuralSyntax',
        score: 3,
        maxScore: 3,
        status: 'Meets Bar',
        summary: 'Gherkin structure adheres to standard keywords and step sequencing.',
        checksPassed: 6,
        totalChecks: 6
      },
      coverageCompleteness: {
        name: 'Coverage / Completeness',
        layer: 'coverageCompleteness',
        score: 2,
        maxScore: 3,
        status: 'Needs Revision',
        summary: 'Core happy path present; missing negative failure path and timeout handling.',
        checksPassed: 4,
        totalChecks: 6
      },
      coherenceConsistency: {
        name: 'Coherence / Consistency',
        layer: 'coherenceConsistency',
        score: 3,
        maxScore: 3,
        status: 'Meets Bar',
        summary: 'Terminology and business rules across scenarios are aligned.',
        checksPassed: 5,
        totalChecks: 5
      },
      traceability: {
        name: 'Traceability',
        layer: 'traceability',
        score: 2,
        maxScore: 3,
        status: 'Needs Revision',
        summary: 'AC-01 covered; AC-02 and AC-03 require explicit scenario coverage.',
        checksPassed: 2,
        totalChecks: 3
      }
    },
    totalFrameworkScore: 10,
    maxFrameworkScore: 12,
    issues: [
      {
        id: 'ISS-001',
        layer: 'coverageCompleteness',
        severity: 'HIGH',
        line: 18,
        scenario: 'Payment Processing',
        title: 'Missing negative payment failure scenario (Insufficient Balance)',
        description: 'The feature covers successful payment but does not define what happens when the customer account has insufficient funds or payment fails.',
        whyItMatters: 'Failure behavior cannot be verified by automation test suites, creating risk of unhandled payment exceptions in production.',
        suggestedFix: 'Add a scenario covering payment failure due to insufficient funds, verifying "FAILED" status and zero wallet debit.',
        aiAgreement: { chatgpt: true, claude: true, gemini: true },
        consensusRatio: '3/3',
        consensusLevel: 'Strong Consensus',
        confidence: 100,
        modelFindings: {
          chatgpt: 'Absence of negative payment scenario violates FinTech QA coverage standards.',
          claude: 'Preconditions and error messages for failed transactions are completely undefined.',
          gemini: 'Critical business rule AC-02 lacks any verifying scenario.'
        }
      },
      {
        id: 'ISS-002',
        layer: 'structuralSyntax',
        severity: 'HIGH',
        line: 21,
        scenario: 'Refund',
        title: 'Placeholder expected result detected ("Then something happens")',
        description: 'Line 21 uses vague placeholder text "something happens" instead of asserting an observable business postcondition.',
        whyItMatters: 'Placeholders cannot be executed by Cucumber/Behave and provide zero functional specification for developers.',
        suggestedFix: 'Replace with: "Then the refund status should be \'COMPLETED\' And the original payment account should be credited".',
        aiAgreement: { chatgpt: true, claude: true, gemini: true },
        consensusRatio: '3/3',
        consensusLevel: 'Strong Consensus',
        confidence: 100,
        modelFindings: {
          chatgpt: 'Flagged placeholder step "something happens" as invalid Gherkin practice.',
          claude: 'Requires concrete assertion of refund status and credit ledger.',
          gemini: 'Identified mechanical defect blocking QA automation.'
        }
      },
      {
        id: 'ISS-003',
        layer: 'coverageCompleteness',
        severity: 'MEDIUM',
        line: 14,
        scenario: 'Successfully process payment',
        title: 'Missing payment gateway timeout & retry idempotency',
        description: 'Feature does not specify behavior when banking gateway response times exceed SLA.',
        whyItMatters: 'Gateway timeouts without idempotency keys create double-debit vulnerabilities in FinTech systems.',
        suggestedFix: 'Add timeout scenario ensuring status transitions to "PENDING_VERIFICATION" and scheduling automated reconciliation.',
        aiAgreement: { chatgpt: true, claude: true, gemini: false },
        consensusRatio: '2/3',
        consensusLevel: 'Partial Consensus',
        confidence: 67,
        modelFindings: {
          chatgpt: 'Recommends adding network latency and timeout scenario.',
          claude: 'Timeout should assert pending status rather than failure.',
          gemini: 'Considers this secondary to basic functional coverage.'
        }
      },
      {
        id: 'ISS-004',
        layer: 'coherenceConsistency',
        severity: 'LOW',
        line: 18,
        scenario: 'Refund',
        title: 'Non-descriptive Scenario Title ("Scenario: Refund")',
        description: 'Title is too concise and fails to specify the specific scenario condition under test.',
        whyItMatters: 'Test execution logs will not clearly communicate what refund permutation passed or failed.',
        suggestedFix: 'Rename to: "Scenario: Successfully process full refund for completed payment".',
        aiAgreement: { chatgpt: true, claude: false, gemini: false },
        consensusRatio: '1/3',
        consensusLevel: 'Low Consensus',
        confidence: 33,
        modelFindings: {
          chatgpt: 'Minor style issue; title could be more descriptive.',
          claude: 'Acceptable in small feature files.',
          gemini: 'Low priority.'
        }
      }
    ],
    missingScenarios: [
      {
        id: 'MSC-01',
        category: 'Negative Path',
        title: 'Payment fails due to insufficient wallet balance',
        description: 'Verifies transaction rejection, error code dispatch, and confirms wallet balance remains unchanged.',
        suggestedGherkin: `@negative @payment
Scenario: Payment fails due to insufficient balance
  Given customer "CUST-9901" has an active wallet balance of INR 500
  When customer "CUST-9901" initiates a transfer of INR 1200 to merchant "Apex Store"
  Then the transaction should be rejected with code "ERR_INSUFFICIENT_FUNDS"
  And the customer should see "Available balance is insufficient for this transaction"
  And the wallet balance should remain INR 500`
      },
      {
        id: 'MSC-02',
        category: 'Error Handling',
        title: 'Payment gateway timeout with idempotent retry handling',
        description: 'Verifies handling when gateway exceeds 10s SLA without creating duplicate debits.',
        suggestedGherkin: `@timeout @reliability @idempotency
Scenario: Payment gateway timeout sets transaction to pending
  Given customer "CUST-9901" initiates a payment of INR 1500 with idempotency key "IDEM-9921"
  When the banking gateway response exceeds the 10000ms SLA timeout
  Then the transaction status should be recorded as "PENDING_VERIFICATION"
  And an automated reconciliation job should be scheduled
  And duplicate debit requests for key "IDEM-9921" should be blocked`
      },
      {
        id: 'MSC-03',
        category: 'Boundary',
        title: 'Payment exceeds maximum single transaction limit',
        description: 'Tests regulatory limit enforcement for unverified or Tier-1 wallets.',
        suggestedGherkin: `@boundary @compliance
Scenario: Payment exceeds wallet maximum transaction limit
  Given customer "CUST-9901" has a wallet limit of INR 50000
  When customer "CUST-9901" attempts a payment of INR 50001
  Then the payment should be blocked before gateway dispatch
  And the system should notify "Maximum single transaction limit is INR 50,000"`
      }
    ],
    aiConsensus: {
      consensusRate: 91,
      disagreementsCount: 1,
      models: [
        {
          modelName: 'OpenAI ChatGPT',
          modelId: 'chatgpt',
          avatarColor: 'bg-emerald-600',
          status: 'COMPLETED',
          score: 90,
          verdict: 'Action Required',
          keyFinding: 'Identified critical coverage deficit in negative failure handling and placeholder steps.',
          issuesCount: 4
        },
        {
          modelName: 'Anthropic Claude',
          modelId: 'claude',
          avatarColor: 'bg-amber-600',
          status: 'COMPLETED',
          score: 86,
          verdict: 'Coverage Gaps Identified',
          keyFinding: 'Flagged missing preconditions and undefined error state transitions in refund flow.',
          issuesCount: 3
        },
        {
          modelName: 'Google Gemini',
          modelId: 'gemini',
          avatarColor: 'bg-indigo-600',
          status: 'COMPLETED',
          score: 88,
          verdict: 'Quality Bar Passed',
          keyFinding: 'Validated core syntax and emphasized adding AC-02 and AC-03 requirement mappings.',
          issuesCount: 2
        }
      ]
    },
    traceabilityData: {
      requirementId: 'REQ-PAY-101',
      title: 'Digital Wallet Instant Payment',
      description: 'Instant settlement between verified customer wallet and registered merchant terminal.',
      mappedScenarios: [
        { scenarioTitle: 'Successfully process payment when balance is sufficient', status: 'VERIFIED', requirementTag: '@REQ-PAY-101-AC01' },
        { scenarioTitle: 'Refund', status: 'MISSING', requirementTag: '@REQ-PAY-101-AC02' }
      ],
      acceptanceCriteria: [
        { acId: 'AC-01', description: 'Valid payments return 200 OK and generate unique transaction reference', status: 'COVERED', mappedScenarios: ['Successfully process payment when balance is sufficient'] },
        { acId: 'AC-02', description: 'Payments with insufficient funds must be rejected without account debit', status: 'MISSING', mappedScenarios: [] },
        { acId: 'AC-03', description: 'Gateway timeouts must be marked PENDING_VERIFICATION and queued for automated reconciliation', status: 'MISSING', mappedScenarios: [] }
      ],
      orphanScenarios: [],
      traceabilityStatus: 'PARTIAL',
      notes: 'AC-01 is verified. AC-02 (Insufficient balance) and AC-03 (Timeout handling) require dedicated scenarios.'
    },
    improvedGherkin: `@REQ-PAY-101 @payment @fintech @quality-gate
Feature: Payment Processing & Settlement

  As a verified customer
  I want to make an instant merchant payment
  So that I can complete my purchase securely and track my transactions

  Background:
    Given the banking gateway is operational
    And the customer "CUST-9901" is authenticated with Tier-1 KYC

  @smoke @priority-1 @happy-path
  Scenario: Successfully process payment when balance is sufficient
    Given customer "CUST-9901" has an active wallet balance of INR 5000
    When customer "CUST-9901" initiates a transfer of INR 1200 to merchant "Apex Store"
    Then the transaction status should be "COMPLETED"
    And a unique transaction reference ID should be generated
    And the wallet balance should be updated to INR 3800
    And a confirmation notification should be dispatched to customer "CUST-9901"

  @negative @coverage @AC-02
  Scenario: Payment fails due to insufficient balance
    Given customer "CUST-9901" has an active wallet balance of INR 500
    When customer "CUST-9901" initiates a transfer of INR 1200 to merchant "Apex Store"
    Then the transaction should be rejected with code "ERR_INSUFFICIENT_FUNDS"
    And the customer should see "Available balance is insufficient for this transaction"
    And the wallet balance should remain INR 500

  @timeout @reliability @AC-03
  Scenario: Payment gateway timeout sets transaction to pending verification
    Given customer "CUST-9901" initiates a payment of INR 1500 with idempotency key "IDEM-9921"
    When the banking gateway response exceeds the 10000ms SLA timeout
    Then the transaction status should be recorded as "PENDING_VERIFICATION"
    And an automated reconciliation job should be scheduled
    And duplicate debit requests for key "IDEM-9921" should be blocked

  @refund @lifecycle
  Scenario: Successfully process full refund for completed payment
    Given an existing completed payment "TXN-OK-99" of INR 1200 exists for customer "CUST-9901"
    When merchant "Apex Store" initiates a full refund for "TXN-OK-99"
    Then the refund status should be "COMPLETED"
    And the wallet balance of customer "CUST-9901" should be credited INR 1200
    And the original payment status should be updated to "REFUNDED"`,
    improvementsCount: 8,
    executiveSummary: 'Payment Processing & Settlement feature analysis completed. Detected 4 quality issues across Structure, Coverage, and Traceability layers with 91% multi-AI consensus. Feature is Sprint Compatible but requires adding failure and timeout handling before QA automation begins.',
    strengths: [
      'Well-formed primary happy path scenario with clear Given/When/Then assertions',
      'Realistic FinTech state verification in primary payment flow',
      'Appropriate use of Feature Background for banking gateway status'
    ],
    recommendations: [
      'Incorporate explicit failure and timeout scenarios for robust automation',
      'Replace vague placeholder step outcomes with observable assertions',
      'Ensure all business rules are mapped to tagged acceptance criteria'
    ],
    version: 1,
    fintechTagsDetected: ['PAYMENT', 'REFUND', 'WALLET', 'SETTLEMENT', 'INR'],
    createdAt: '2026-08-28T14:30:00.000Z'
  },
  {
    id: 'ANL-2026-KYC-02',
    userId: 'usr_enterprise_demo',
    fileName: 'kyc_aadhaar_verification.feature',
    fileSize: '3 KB',
    featureTitle: 'Aadhaar & PAN KYC Onboarding',
    featureNarrative: 'As a newly registered applicant\nI want to submit my Aadhaar OTP and PAN card\nSo that my account is verified for high-value transactions',
    originalGherkin: `@REQ-KYC-302 @compliance @fintech
Feature: Aadhaar & PAN KYC Onboarding

  As a newly registered applicant
  I want to submit my Aadhaar OTP and PAN card
  So that my account is verified for high-value transactions

  Scenario: Complete KYC with valid OTP
    Given applicant "APP-102" is on KYC verification page
    When applicant enters Aadhaar number "123456789012"
    And applicant enters valid OTP "449911"
    Then KYC status should be "VERIFIED"

  Scenario: Invalid OTP
    Given applicant enters OTP "000000"
    Then error is shown`,
    requirementFileName: 'REQ-KYC-302_Spec.txt',
    overallScore: 76,
    developmentScore: 82,
    qaScore: 69,
    sprintReady: true,
    finalVerdict: 'NEEDS REVISION',
    fourLayers: {
      structuralSyntax: { name: 'Structural / Syntax', layer: 'structuralSyntax', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Syntax valid.', checksPassed: 6, totalChecks: 6 },
      coverageCompleteness: { name: 'Coverage / Completeness', layer: 'coverageCompleteness', score: 2, maxScore: 3, status: 'Needs Revision', summary: 'Missing OTP retry limits, expiration, and invalid PAN format.', checksPassed: 3, totalChecks: 6 },
      coherenceConsistency: { name: 'Coherence / Consistency', layer: 'coherenceConsistency', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Clean terminology.', checksPassed: 5, totalChecks: 5 },
      traceability: { name: 'Traceability', layer: 'traceability', score: 2, maxScore: 3, status: 'Needs Revision', summary: 'Partial coverage of regulatory guidelines.', checksPassed: 2, totalChecks: 3 }
    },
    totalFrameworkScore: 10,
    maxFrameworkScore: 12,
    issues: [
      {
        id: 'ISS-KYC-01',
        layer: 'coverageCompleteness',
        severity: 'HIGH',
        line: 13,
        scenario: 'Invalid OTP',
        title: 'Missing OTP Retry Limit & Account Lockout Scenario',
        description: 'Regulatory compliance requires biometric/OTP flows to lock after 3 invalid attempts.',
        whyItMatters: 'Omitting retry limits leaves the endpoint exposed to brute-force OTP attacks.',
        suggestedFix: 'Add scenario testing 3 failed OTP entries triggering a 15-minute temporary lockout.',
        aiAgreement: { chatgpt: true, claude: true, gemini: true },
        consensusRatio: '3/3',
        consensusLevel: 'Strong Consensus',
        confidence: 100
      }
    ],
    missingScenarios: [
      {
        id: 'MSC-KYC-01',
        category: 'Security',
        title: 'Account lockout after 3 consecutive invalid OTP submissions',
        description: 'Verifies brute-force protection and security cooldown period.',
        suggestedGherkin: `@security @kyc
Scenario: 3 invalid OTP attempts locks verification for 15 minutes
  Given applicant "APP-102" has attempted invalid OTP 2 times
  When applicant enters invalid OTP "999999" on 3rd attempt
  Then the KYC session should be locked for 15 minutes
  And an alert "Maximum verification attempts exceeded. Please try again after 15 minutes." should be displayed`
      }
    ],
    aiConsensus: {
      consensusRate: 94,
      disagreementsCount: 0,
      models: [
        { modelName: 'OpenAI ChatGPT', modelId: 'chatgpt', avatarColor: 'bg-emerald-600', status: 'COMPLETED', score: 78, verdict: 'Revision Required', keyFinding: 'Identified missing OTP expiration and retry limit handling.', issuesCount: 3 },
        { modelName: 'Anthropic Claude', modelId: 'claude', avatarColor: 'bg-amber-600', status: 'COMPLETED', score: 74, verdict: 'Security Gaps', keyFinding: 'Emphasized KYC security thresholds.', issuesCount: 3 },
        { modelName: 'Google Gemini', modelId: 'gemini', avatarColor: 'bg-indigo-600', status: 'COMPLETED', score: 76, verdict: 'Needs Revision', keyFinding: 'Suggested Scenario Outline for PAN format validation.', issuesCount: 2 }
      ]
    },
    improvedGherkin: `@REQ-KYC-302 @compliance @fintech @quality-gate
Feature: Aadhaar & PAN KYC Onboarding

  As a newly registered applicant
  I want to submit my Aadhaar OTP and PAN card
  So that my account is verified for high-value transactions

  Background:
    Given the UIDAI Aadhaar verification service is online
    And the NSDL PAN validation service is online

  @smoke @happy-path
  Scenario: Complete KYC verification with valid Aadhaar OTP
    Given applicant "APP-102" is on the KYC onboarding screen
    When applicant enters a valid 12-digit Aadhaar number "123456789012"
    And applicant enters the valid 6-digit OTP "449911"
    Then the Aadhaar verification status should be "VERIFIED"
    And the applicant KYC tier should be upgraded to "FULL_KYC"

  @security @negative
  Scenario: 3 invalid OTP attempts locks verification for 15 minutes
    Given applicant "APP-102" has attempted invalid OTP 2 times
    When applicant enters invalid OTP "999999" on 3rd attempt
    Then the KYC session should be locked for 15 minutes
    And an alert "Maximum verification attempts exceeded. Please try again after 15 minutes." should be displayed`,
    improvementsCount: 6,
    executiveSummary: 'KYC Onboarding feature evaluated. Needs revision to add regulatory OTP attempt limits and expired token handling.',
    strengths: ['Clear happy path for standard Aadhaar verification', 'Proper tagging'],
    recommendations: ['Add retry boundary limits', 'Assert UI error codes'],
    version: 1,
    fintechTagsDetected: ['KYC', 'OTP', 'AUTHENTICATION'],
    createdAt: '2026-08-27T10:15:00.000Z'
  },
  {
    id: 'ANL-2026-UPI-03',
    userId: 'usr_enterprise_demo',
    fileName: 'upi_autopay_mandate.feature',
    fileSize: '5 KB',
    featureTitle: 'UPI Autopay Recurring Mandate Management',
    featureNarrative: 'As a subscribed user\nI want to authorize a recurring UPI mandate\nSo that my monthly subscription renewal is debited automatically',
    originalGherkin: `@REQ-UPI-204 @upi @autopay @fintech
Feature: UPI Autopay Recurring Mandate Management

  As a subscribed user
  I want to authorize a recurring UPI mandate
  So that my monthly subscription renewal is debited automatically

  Background:
    Given the NPCI UPI Autopay switch is connected
    And user has an active UPI VPA "alex@okhdfcbank"

  @smoke @priority-1
  Scenario: Successfully create recurring mandate within limit
    Given the subscription plan costs INR 999 monthly
    When user authorizes UPI mandate with UPI PIN for amount INR 999
    Then mandate "UMRN-88190" should be generated with status "ACTIVE"
    And next debit date should be scheduled for "+30 days"

  @negative @compliance
  Scenario: Mandate creation fails when requested amount exceeds NPCI limit
    When user attempts to set an unauthenticated mandate of INR 20000
    Then the mandate request should be rejected with code "LIMIT_EXCEEDED"
    And the user should be prompted for Additional Factor of Authentication`,
    overallScore: 94,
    developmentScore: 96,
    qaScore: 92,
    sprintReady: true,
    finalVerdict: 'DEVELOPMENT + QA READY',
    fourLayers: {
      structuralSyntax: { name: 'Structural / Syntax', layer: 'structuralSyntax', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Exceptional structural compliance.', checksPassed: 6, totalChecks: 6 },
      coverageCompleteness: { name: 'Coverage / Completeness', layer: 'coverageCompleteness', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Covers happy path, limits, and authentication.', checksPassed: 6, totalChecks: 6 },
      coherenceConsistency: { name: 'Coherence / Consistency', layer: 'coherenceConsistency', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Strict FinTech domain vocabulary.', checksPassed: 5, totalChecks: 5 },
      traceability: { name: 'Traceability', layer: 'traceability', score: 3, maxScore: 3, status: 'Meets Bar', summary: 'Traceable to NPCI Circular guidelines.', checksPassed: 3, totalChecks: 3 }
    },
    totalFrameworkScore: 12,
    maxFrameworkScore: 12,
    issues: [
      {
        id: 'ISS-UPI-01',
        layer: 'coverageCompleteness',
        severity: 'LOW',
        line: 14,
        scenario: 'Mandate creation fails',
        title: 'Explicit Mandate Pause/Revoke Lifecycle Scenario Recommended',
        description: 'UPI Autopay features benefit from explicit scenarios covering mandate revocation or pause before next execution cycle.',
        whyItMatters: 'Mandate cancellation is a regulatory requirement under RBI UPI Autopay guidelines.',
        suggestedFix: 'Add scenario testing customer-initiated mandate pause and subsequent automatic resumption.',
        aiAgreement: { chatgpt: true, claude: true, gemini: true },
        consensusRatio: '3/3',
        consensusLevel: 'Strong Consensus',
        confidence: 90
      }
    ],
    missingScenarios: [],
    aiConsensus: {
      consensusRate: 98,
      disagreementsCount: 0,
      models: [
        { modelName: 'OpenAI ChatGPT', modelId: 'chatgpt', avatarColor: 'bg-emerald-600', status: 'COMPLETED', score: 95, verdict: 'Production Ready', keyFinding: 'High quality Gherkin with complete NPCI mandate compliance.', issuesCount: 1 },
        { modelName: 'Anthropic Claude', modelId: 'claude', avatarColor: 'bg-amber-600', status: 'COMPLETED', score: 93, verdict: 'Ready for Development', keyFinding: 'Comprehensive coverage of limits and negative states.', issuesCount: 1 },
        { modelName: 'Google Gemini', modelId: 'gemini', avatarColor: 'bg-indigo-600', status: 'COMPLETED', score: 94, verdict: 'Quality Gate Passed', keyFinding: 'Clear assertions and strong semantic structure.', issuesCount: 1 }
      ]
    },
    improvedGherkin: `@REQ-UPI-204 @upi @autopay @fintech @quality-gate
Feature: UPI Autopay Recurring Mandate Management

  As a subscribed user
  I want to authorize a recurring UPI mandate
  So that my monthly subscription renewal is debited automatically

  Background:
    Given the NPCI UPI Autopay switch is connected
    And user has an active UPI VPA "alex@okhdfcbank"

  @smoke @priority-1
  Scenario: Successfully create recurring mandate within limit
    Given the subscription plan costs INR 999 monthly
    When user authorizes UPI mandate with UPI PIN for amount INR 999
    Then mandate "UMRN-88190" should be generated with status "ACTIVE"
    And next debit date should be scheduled for "+30 days"

  @negative @compliance
  Scenario: Mandate creation fails when requested amount exceeds NPCI limit
    When user attempts to set an unauthenticated mandate of INR 20000
    Then the mandate request should be rejected with code "LIMIT_EXCEEDED"
    And the user should be prompted for Additional Factor of Authentication`,
    improvementsCount: 2,
    executiveSummary: 'UPI Autopay feature passed all four layers with 98% multi-AI consensus. Meets both Development and QA readiness bars.',
    strengths: ['Thorough compliance with NPCI regulations', 'Precise status and error code assertions', 'Clean background and step structure'],
    recommendations: ['Optionally include mandate pause/resume scenarios in next iteration'],
    version: 1,
    fintechTagsDetected: ['UPI', 'AUTOPAY', 'MANDATE', 'INR', 'AUTHENTICATION'],
    createdAt: '2026-08-26T18:20:00.000Z'
  }
];

class Database {
  private analyses: Map<string, AnalysisResult> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load Users
    try {
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const list: User[] = JSON.parse(raw);
        list.forEach(u => this.users.set(u.id, u));
      } else {
        this.users.set(DEFAULT_USER.id, DEFAULT_USER);
        this.saveUsers();
      }
    } catch (e) {
      this.users.set(DEFAULT_USER.id, DEFAULT_USER);
    }

    // Load Analyses
    try {
      if (fs.existsSync(ANALYSES_FILE)) {
        const raw = fs.readFileSync(ANALYSES_FILE, 'utf-8');
        const list: AnalysisResult[] = JSON.parse(raw);
        list.forEach(a => this.analyses.set(a.id, a));
      } else {
        SEED_ANALYSES.forEach(a => this.analyses.set(a.id, a));
        this.saveAnalyses();
      }
    } catch (e) {
      SEED_ANALYSES.forEach(a => this.analyses.set(a.id, a));
    }
  }

  private saveAnalyses() {
    try {
      fs.writeFileSync(ANALYSES_FILE, JSON.stringify(Array.from(this.analyses.values()), null, 2));
    } catch (e) {
      console.error('Failed to save analyses:', e);
    }
  }

  private saveUsers() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(Array.from(this.users.values()), null, 2));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }

  public getAllAnalyses(): AnalysisResult[] {
    return Array.from(this.analyses.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getAnalysisById(id: string): AnalysisResult | undefined {
    return this.analyses.get(id);
  }

  public saveAnalysis(analysis: AnalysisResult): AnalysisResult {
    this.analyses.set(analysis.id, analysis);
    this.saveAnalyses();
    return analysis;
  }

  public deleteAnalysis(id: string): boolean {
    const deleted = this.analyses.delete(id);
    if (deleted) this.saveAnalyses();
    return deleted;
  }

  public getDashboardStats(): DashboardStats {
    const all = this.getAllAnalyses();
    const count = all.length;
    if (count === 0) {
      return {
        filesAnalyzed: 0,
        averageScore: 0,
        developmentReadyCount: 0,
        qaReadyCount: 0,
        sprintReadyCount: 0,
        needsRevisionCount: 0,
        totalIssuesFound: 0,
        criticalIssuesCount: 0,
        consensusAverage: 0,
        scoreTrend: [],
        layerAverages: [],
        recentAnalyses: []
      };
    }

    const totalScore = all.reduce((sum, a) => sum + a.overallScore, 0);
    const devReady = all.filter(a => a.developmentScore >= 85).length;
    const qaReady = all.filter(a => a.qaScore >= 80).length;
    const sprintReady = all.filter(a => a.sprintReady).length;
    const needsRevision = all.filter(a => !a.sprintReady || a.finalVerdict === 'NEEDS REVISION' || a.finalVerdict === 'NOT READY').length;
    const totalIssues = all.reduce((sum, a) => sum + a.issues.length, 0);
    const criticalIssues = all.reduce((sum, a) => sum + a.issues.filter(i => i.severity === 'CRITICAL').length, 0);
    const consensusSum = all.reduce((sum, a) => sum + a.aiConsensus.consensusRate, 0);

    const scoreTrend = all.slice(0, 7).reverse().map(a => ({
      date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: a.overallScore,
      dev: a.developmentScore,
      qa: a.qaScore
    }));

    const layerAverages = [
      { layer: 'Structure', score: Math.round((all.reduce((s, a) => s + a.fourLayers.structuralSyntax.score, 0) / count) * 10) / 10, max: 3 },
      { layer: 'Coverage', score: Math.round((all.reduce((s, a) => s + a.fourLayers.coverageCompleteness.score, 0) / count) * 10) / 10, max: 3 },
      { layer: 'Coherence', score: Math.round((all.reduce((s, a) => s + a.fourLayers.coherenceConsistency.score, 0) / count) * 10) / 10, max: 3 },
      { layer: 'Traceability', score: Math.round((all.reduce((s, a) => s + a.fourLayers.traceability.score, 0) / count) * 10) / 10, max: 3 }
    ];

    const recentAnalyses = all.slice(0, 10).map(a => ({
      id: a.id,
      fileName: a.fileName,
      featureTitle: a.featureTitle,
      overallScore: a.overallScore,
      developmentScore: a.developmentScore,
      qaScore: a.qaScore,
      sprintReady: a.sprintReady,
      finalVerdict: a.finalVerdict,
      issuesCount: a.issues.length,
      createdAt: a.createdAt,
      version: a.version
    }));

    return {
      filesAnalyzed: count,
      averageScore: Math.round(totalScore / count),
      developmentReadyCount: devReady,
      qaReadyCount: qaReady,
      sprintReadyCount: sprintReady,
      needsRevisionCount: needsRevision,
      totalIssuesFound: totalIssues,
      criticalIssuesCount: criticalIssues,
      consensusAverage: Math.round(consensusSum / count),
      scoreTrend,
      layerAverages,
      recentAnalyses
    };
  }

  public getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public saveUser(user: User): User {
    this.users.set(user.id, user);
    this.saveUsers();
    return user;
  }
}

export const db = new Database();
