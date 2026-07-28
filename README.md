# Keepme Automation Project

A production-grade E2E testing framework for Chatbot and CRM platforms, built with **Playwright**, **Cucumber (BDD)**, and **TypeScript**.

## 🚀 Tech Stack

- **Automation Framework**: [Playwright](https://playwright.dev/)
- **Test Runner**: [Cucumber.js](https://cucumber.io/docs/installation/javascript/)
- **Package Manager**: [Yarn](https://yarnpkg.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv), [cross-env](https://github.com/kentcdodds/cross-env)
- **Reporting**: [multiple-cucumber-html-reporter](https://github.com/danmackinlay/multiple-cucumber-html-reporter)
- **Logging**: [Winston](https://github.com/winstonjs/winston)

---

## 🏗️ Architecture Overview
1. This framework is designed for:
2. Multi-environment testing (dev / stg / prod)
3. Multi-client support (30+ clients)
4. Multi-CRM integrations (Zoho, HubSpot, Keepme, etc.)
5. CI/CD scalability
6. Clean configuration layering

## 🧠 Design Principles

### 1. Page Object Model (POM)
Separation of concerns is maintained by dividing UI interaction logic from test steps.
- **Pages** (`src/pages/`): Contains page classes that encapsulate browser actions.
- **Locators** (`src/locators/`): Centralized placement of UI selectors to ensure reusability and easy maintenance.

### 2. BDD (Behavior Driven Development)
Tests are written in Gherkin syntax (`.feature` files) to ensure readability for both technical and non-technical stakeholders.
- **Features** (`src/features/`): Feature files defining test scenarios.
- **Step Definitions** (`src/steps/`): TypeScript implementations of Gherkin steps.

### 3. Centralized Configuration
Environment and client-specific settings are managed through a centralized configuration system.
- **Environments** (`configs/env/`): Supports `dev`, `stg`, and `prod`.
- **Clients** (`configs/clients/`): Dynamic selection of client configurations for multi-tenant testing.
    base.env
        ↓
    environment (dev / stg / prod)
         ↓
    client configuration
        ↓
    crm configuration

---

## 📂 Directory Structure
```text
configs/
├── clients/
│   ├──ClientA.env
│   ├──ClientB.env
│   ├──ClientC.env
│   └──ClientD.env
├── crm/
│   ├──ClientA.crm.env
│   ├──ClientB.crm.env
│   ├──ClientC.crm.env
│   └──ClientD.crm.env
├── env/
│   ├── base.env
│   ├── dev.env
│   ├── stg.env
│   └── prod.env
```
All execution depends on runtime variables:
```bash
ENV
CLIENT
CRM
HEADLESS
TAGS
```


## 📂 Project Structure
```text
├── configs/            # Environment and client-specific configurations
├── scripts/            # Helper scripts (e.g., multi-client test runners)
├── src/
│   ├── commons/        # Shared utilities and helpers
│   ├── features/       # BDD feature files
│   ├── locators/       # UI element selectors (grouped by page)
│   ├── pages/          # Page Object classes
│   ├── steps/          # Cucumber step definitions
│   ├── types/          # Custom TypeScript interfaces
│   └── hooks.ts        # Setup and teardown (Cucumber hooks)
├── reports/            # Test execution reports
├── screenshots/        # Failure screenshots
├── videos/             # Test execution recordings
├── cucumber.js         # Cucumber configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```
---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) (1.22+)

### Installation
```bash
# Install dependencies
yarn install

# Install Playwright browsers
npx playwright install chromium
```

---

## 🏃 Running Tests

The project provides several scripts for different testing needs:

| Command | Description |
| :--- | :--- |
| `yarn test` | Run all Cucumber tests |
| `yarn test:smoke` | Run tests tagged with `@smoke` |
| `yarn test:reg` | Run tests tagged with `@regression` |
| `yarn test:headed` | Run smoke tests in headed mode |
| `yarn test:multi-client` | Run tests across multiple client configurations |

## Examples
Run Smoke (Single Client)
```bash
ENV=dev CLIENT=cedardale CRM=hubspot yarn test:smoke
```

Run Regression (Staging)
```bash
ENV=stg CLIENT=keepme CRM=zoho yarn test:reg
```

Debug Mode
```bash
ENV=dev CLIENT=keepme CRM=keepme yarn test:debug
```

### Environment Overrides
You can specify the execution environment and browser behavior via environment variables:
```bash
ENV=stg HEADLESS=false yarn test:smoke
```
🔁 Multi-Client Execution

Runs all clients defined in:
```bash
configs/clients.ts
```
Example:
```bash
ENV=stg HEADLESS=true yarn test:multi-client
```
This executes:
```bash
client × crm matrix (sequentially)
```
---

## 📊 Reporting
After test execution, a detailed HTML report is generated in `reports/html/index.html`. 
Screenshots and videos for failed tests are automatically captured and attached to the report.

## 🏢 Enterprise Scalability

This framework supports:
- 30+ clients
- 10+ CRM integrations
- Multi-tenant SaaS architecture
- CI matrix execution
- Clean separation of environment/client/crm logic
- Zero script explosion

## 🧠 Future Enhancements

Planned improvements:
- Parallel client matrix execution
- Allure reporting
- Dockerized execution
- GitHub Actions CI templates
- Tag filtering per CRM