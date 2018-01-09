# Configuration
This file provides information about all configuration available for slotlist-frontend.

## Config values
All configuration is transpiled into the JavaScript source code and only changable before the build step. Any config changes require a complete rebuild of the project.  
Configuration can be changed via the `build/webpack.ENV.js` files for the `dev` and `prod` environment respectively.

| Variable | Description |
|---|---|
| NODE_ENV | Node environemnt to use, for toggling debugging functionality |
| BASE_URL | Public base URL of frontend |
| BASE_API_URL | Public base URL of backend instance |
| MOCK_AXIOS_RESPONSES | Toggles mocking of API responses (currently non-functional) |
| FRONTEND_VERSION | Current version of frontend, retrieved from `package.json` |
| SENTRY_DSN | Public DSN for Sentry reporting, retrieve from env variable |
