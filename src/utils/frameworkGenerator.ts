export type SupportedFramework = 
  | 'cucumber-java'
  | 'cucumber-js'
  | 'playwright-bdd'
  | 'cypress-bdd'
  | 'python-behave'
  | 'specflow-csharp'
  | 'karate';

export interface FrameworkInfo {
  id: SupportedFramework;
  name: string;
  language: string;
  category: string;
  iconColor: string;
  extension: string;
  runnerCommand: string;
  description: string;
}

export const SUPPORTED_FRAMEWORKS: FrameworkInfo[] = [
  {
    id: 'cucumber-java',
    name: 'Cucumber Java',
    language: 'Java / JUnit 5',
    category: 'Enterprise Java',
    iconColor: 'bg-orange-500',
    extension: '.java',
    runnerCommand: 'mvn test -Dcucumber.filter.tags="@smoke"',
    description: 'Standard Cucumber JVM step definitions with annotations (@Given, @When, @Then).'
  },
  {
    id: 'cucumber-js',
    name: 'Cucumber.js / TS',
    language: 'TypeScript / Node',
    category: 'JavaScript Ecosystem',
    iconColor: 'bg-emerald-600',
    extension: '.ts',
    runnerCommand: 'npx cucumber-js --tags "@smoke"',
    description: 'Modern TypeScript step definitions using @cucumber/cucumber functions.'
  },
  {
    id: 'playwright-bdd',
    name: 'Playwright BDD',
    language: 'TypeScript',
    category: 'Modern Web Automation',
    iconColor: 'bg-rose-600',
    extension: '.steps.ts',
    runnerCommand: 'npx bddgen && npx playwright test',
    description: 'Playwright BDD integration using createBdd() and modern async page fixtures.'
  },
  {
    id: 'cypress-bdd',
    name: 'Cypress BDD',
    language: 'JavaScript / TypeScript',
    category: 'Browser Testing',
    iconColor: 'bg-teal-600',
    extension: '.steps.js',
    runnerCommand: 'npx cypress run --spec "cypress/e2e/**/*.feature"',
    description: 'Badeball Cypress Cucumber Preprocessor step definitions.'
  },
  {
    id: 'python-behave',
    name: 'Python Behave',
    language: 'Python 3',
    category: 'Python BDD',
    iconColor: 'bg-blue-600',
    extension: '.py',
    runnerCommand: 'behave features/ --tags=@smoke',
    description: 'Python step implementations with behave decorators (@given, @when, @then).'
  },
  {
    id: 'specflow-csharp',
    name: 'SpecFlow .NET',
    language: 'C# / .NET Core',
    category: 'Microsoft .NET',
    iconColor: 'bg-purple-600',
    extension: '.cs',
    runnerCommand: 'dotnet test --filter "Category=smoke"',
    description: 'SpecFlow Binding class with [Binding] and [Given], [When], [Then] attributes.'
  },
  {
    id: 'karate',
    name: 'Karate DSL',
    language: 'Karate / Java',
    category: 'API & Web Automation',
    iconColor: 'bg-amber-600',
    extension: '.feature',
    runnerCommand: 'mvn test -Dtest=KarateTestRunner',
    description: 'Karate DSL native HTTP REST and Web automation steps.'
  }
];

export function extractStepsFromGherkin(gherkinText: string): { keyword: string; text: string }[] {
  const lines = gherkinText.split('\n');
  const steps: { keyword: string; text: string }[] = [];
  const seen = new Set<string>();

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    const match = trimmed.match(/^(Given|When|Then|And|But)\s+(.+)$/i);
    if (match) {
      const keyword = match[1].toLowerCase();
      const text = match[2].trim();
      const key = `${keyword}:${text}`;
      if (!seen.has(key)) {
        seen.add(key);
        steps.push({ keyword, text });
      }
    }
  }

  if (steps.length === 0) {
    return [
      { keyword: 'given', text: 'customer has active account balance INR 5000' },
      { keyword: 'when', text: 'customer initiates payment of INR 1000' },
      { keyword: 'then', text: 'payment status should be "COMPLETED"' }
    ];
  }

  return steps;
}

export function generateStepDefinitions(
  framework: SupportedFramework,
  gherkinText: string,
  featureTitle: string = 'Feature'
): string {
  const steps = extractStepsFromGherkin(gherkinText);
  const safeName = featureTitle.replace(/[^a-zA-Z0-9]/g, '');

  switch (framework) {
    case 'cucumber-java':
      return `package com.automation.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.junit.jupiter.api.Assertions;

public class ${safeName || 'Payment'}StepDefinitions {

${steps.map(s => {
  const capKey = s.keyword === 'and' || s.keyword === 'but' ? 'And' : s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1);
  const sanitizedText = s.text.replace(/"/g, '\\"');
  const methodName = s.text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 45);

  return `    @${capKey}("${sanitizedText}")
    public void ${methodName}() {
        // TODO: Implement business action or assertion
        System.out.println("Executing step: ${sanitizedText}");
    }`;
}).join('\n\n')}
}
`;

    case 'cucumber-js':
      return `import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

${steps.map(s => {
  const capKey = s.keyword === 'and' || s.keyword === 'but' ? 'When' : s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1);
  const sanitizedText = s.text.replace(/"/g, '\\"');

  return `${capKey}('${sanitizedText}', async function () {
  // TODO: Implement test step logic
  // Example: await this.page.click('#submit-btn');
});`;
}).join('\n\n')}
`;

    case 'playwright-bdd':
      return `import { createBdd } from 'playwright-bdd';
import { test, expect } from './fixtures';

const { Given, When, Then } = createBdd(test);

${steps.map(s => {
  const capKey = s.keyword === 'and' || s.keyword === 'but' ? 'When' : s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1);
  const sanitizedText = s.text.replace(/"/g, '\\"');

  return `${capKey}('${sanitizedText}', async ({ page }) => {
  // TODO: Automate with Playwright page fixture
  // await expect(page.locator('.status-badge')).toBeVisible();
});`;
}).join('\n\n')}
`;

    case 'cypress-bdd':
      return `import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

${steps.map(s => {
  const capKey = s.keyword === 'and' || s.keyword === 'but' ? 'When' : s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1);
  const sanitizedText = s.text.replace(/"/g, '\\"');

  return `${capKey}("${sanitizedText}", () => {
  // TODO: Cypress step implementation
  // cy.get('[data-testid="transaction-status"]').should('contain', 'COMPLETED');
});`;
}).join('\n\n')}
`;

    case 'python-behave':
      return `from behave import given, when, then
from assertpy import assert_that

${steps.map(s => {
  const fnName = s.text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 45);
  const key = s.keyword === 'and' || s.keyword === 'but' ? 'then' : s.keyword;

  return `@${key}('${s.text}')
def step_impl(context):
    # TODO: Implement step logic with context
    pass`;
}).join('\n\n')}
`;

    case 'specflow-csharp':
      return `using System;
using TechTalk.SpecFlow;
using NUnit.Framework;

namespace Automation.StepDefinitions
{
    [Binding]
    public class ${safeName || 'Feature'}Steps
    {
${steps.map(s => {
  const capKey = s.keyword === 'and' || s.keyword === 'but' ? 'Then' : s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1);
  const sanitizedText = s.text.replace(/"/g, '\\"');
  const methodName = s.text
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .substring(0, 40);

  return `        [${capKey}(@"${sanitizedText}")]
        public void ${capKey}${methodName}()
        {
            // TODO: Implement SpecFlow step
        }`;
}).join('\n\n')}
    }
}
`;

    case 'karate':
      return `# Karate DSL Scenario Implementation
Feature: ${featureTitle}

  Background:
    * url baseUrl
    * header Accept = 'application/json'

  Scenario: Execute automated API validation
    Given path '/api/v1/transactions'
    And request { accountId: 'ACC_9921', amount: 1000 }
    When method POST
    Then status 200
    And match response.status == 'COMPLETED'
    And match response.transactionId == '#present'
`;
  }
}
