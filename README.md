# Risk Analysis

The Risk Analysis is a Next.js web application designed to parse, analyze, and visualize security audit logs from a large JSON dataset. It provides a user-friendly interface to quickly identify at-risk users.

## ✨ Features

- **Statistics Dashboard**: Displays key metrics like total records, unique users, and unique risks.
- **At-Risk User Identification**: Groups records by user and calculates a total risk score, highlighting the most vulnerable users.
- **Detailed User View**: Provides a comprehensive page for each user, listing all their associated audit records.
- **Responsive Data Tables**: Uses Shadcn/ui Data Table to present data in a sortable and interactive format.
- **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS for a clean and modern user experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.x or later recommended)
- [pnpm](https://pnpm.io/installation) (or your preferred package manager like npm or yarn)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Pum8i/risk-analysis.git
    cd risk-analysis
    ```

2.  **Install dependencies:**

    Using pnpm:

    ```bash
    pnpm install
    ```

### Data Setup

This application requires a JSON audit log file to function.

1.  Obtain your `audit.json` file.
2.  Place it in the `data/` directory at the root of the project. The application is configured to read from `data/audit.json`. You can either rename your file or update the path in `lib/actions.ts`.

The JSON file must have the following structure:

```json
{
  "RECORDS": [
    {
      "id": "...",
      "created": "...",
      "email": "...",
      "risk": "...",
      "risk_level": "...",
      "meta": "{\"browser_uuid\":\"...\", ...}",
      "active": "..."
    }
  ]
}
```

### Running the Development Server

Once the dependencies are installed and the data file is in place, you can start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

## ☁️ Deployment

This application is optimized for deployment on Vercel, the platform from the creators of Next.js.

### Deploying on Vercel

1.  **Push to a Git Repository**:
    Push your project code, including the `data/audit.json` file, to a GitHub, GitLab, or Bitbucket repository.

2.  **Import Project on Vercel**:

    - Go to your Vercel dashboard and click **Add New... > Project**.
    - Import your Git repository.
    - Vercel will automatically detect that you are using Next.js and will configure the build settings for you.

3.  **Deploy**:
    - No environment variables are required for the base functionality.
    - Click the **Deploy** button.

Vercel will build and deploy your application. The data file will be included in the deployment, and the application will read it from the filesystem just as it does in the local environment.

## 🔮 Recommendations for Future Improvements

While the current implementation is performant for its specific constraints, here are several ways the application could be enhanced for greater scalability, performance, and resilience.

### 1. Pre-process the JSON Data

The application currently parses the entire JSON file on its first load, which can be memory-intensive and slow if the file is extremely large. A significant improvement would be to add a pre-processing step.

- **How**: Create a script (e.g., `pnpm preprocess-data`) that runs before starting the application (or as part of the build step).
- **What**: This script would read the `audit.json` file, parse the nested `meta` JSON string for each record, and write the flattened, fully-parsed data to a new, optimized file (e.g., `audit.processed.json`).
- **Benefit**: This moves the expensive parsing logic out of the request lifecycle, leading to a much faster initial server startup and lower memory usage during runtime.

### 2. Migrate to a Database

For true scalability and to handle datasets that cannot fit into memory, migrating the data to a database is the best long-term solution.

- **How**:
  - Set up a database like **PostgreSQL**, **MySQL**, or a serverless option like **Turso (SQLite)**, **Neon**, or **PlanetScale**.
  - Create a one-time script to ingest the JSON data into the database.
  - Refactor the data-fetching functions in `lib/actions.ts` to query the database using an ORM like Drizzle ORM or Prisma.
- **Benefit**:
  - **Scalability**: The application would no longer be limited by server memory.
  - **Performance**: Database queries with proper indexing are far more efficient for filtering, sorting, and paginating data than in-memory operations.
  - **Data Management**: Simplifies data updates and management without needing to replace a large JSON file.

### 4. Limit Data by Using Date Ranges

The current UI loads and processes the entire dataset. For very large log files, this can be slow and inefficient. A powerful improvement would be to allow users to filter the data by a specific date range.

- **How**:
  - Add date range pickers to the UI (e.g., using `react-day-picker` from Shadcn/ui).
  - Pass the selected `startDate` and `endDate` to the data-fetching functions.
  - Modify the data processing logic in `lib/actions.ts` to filter records based on the provided date range.
- **Benefit**:
  - **Improved Performance**: Reduces the amount of data processed and sent to the client, leading to faster page loads.
  - **Enhanced User Experience**: Allows users to focus their analysis on specific time periods, making it easier to investigate incidents.

### 5. Robust Error Handling and Logging

The current implementation in `getAllAuditData` logs parsing errors for individual records to the console. In a production environment, these transient errors should be captured for analysis without failing the entire data-loading process.

- **How**:
  - Inside the `catch` block where each record's `meta` field is parsed, instead of just logging to the console, send the error details (like `record.id`, the error message, and a timestamp) to a dedicated logging service or a specific "Errors" table in a database (e.g., using a service like Sentry, or directly to your database).
  - Ensure that the mapping process continues even if some records fail to parse, so that the application can still function with the valid data.
  - Add a data table under the /errors page to display the errors for easy analysis.
- **Benefit**:
  - **Resilience**: The application can handle malformed records gracefully without crashing or losing all data.
  - **Analytics & Debugging**: Provides a persistent log of data quality issues, which can be used to debug the data source or improve the parser over time.

### 6. Add Unit Tests

To improve code quality and prevent regressions, a comprehensive suite of unit tests should be added.

- **How**: Use a testing framework like [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for any component tests.
- **What to test**:
  - **Utility Functions**: Create tests for `lib/utils.ts`, especially `parseWithDateFns`, to ensure it handles various date formats correctly, including edge cases and invalid inputs.
  - **Data Actions**: Write tests for the data fetching and processing logic in `lib/actions.ts`. Mock the `fs` module to provide controlled JSON inputs and verify that:
    - `getAllAuditData` correctly parses and transforms records.
    - `getAuditStatistics` calculates the correct metrics.
    - `getRiskData` and `getUserProfileByBrowserId` correctly filter, group, and aggregate data.
- **Benefit**:
  - **Reliability**: Ensures that data processing logic is correct and handles edge cases gracefully.
  - **Maintainability**: Allows for confident refactoring of data logic in the future without introducing bugs.
