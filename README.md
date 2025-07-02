# Paw Patroller UK Website

## Development Setup

- **Node Version:** Use Node.js v20+ (see `.nvmrc`).
- Install dependencies: `npm ci`
- Start development server: `npm run dev` (copies assets before starting Vite)
- For live asset copying: `npm run dev:watch` (watches for asset changes and re-copies them)

## Asset Management

- Source assets: `assets/` (reviews, badges, data)
- Copied to: `public/` via `copy-assets.js` (runs before dev and build)
- Add new review images to `assets/reviews/`, badges to `assets/badges/`, and data to `assets/data/`.
- If a required asset directory is missing, you will see a warning in the console.

## Component Loading & Path Resolution

- Components (navbar, footer, etc.) are loaded dynamically using BASE_URL-aware paths for GitHub Pages compatibility.
- Vite configures the base path dynamically for local and production builds.
- When deploying to GitHub Pages, all asset and component paths are automatically adjusted for the `/pawpatrolleruk2/` subdirectory.

## Production Build & Deployment

- Build for production: `npm run build`
- Preview production build locally: `npm run preview`
- GitHub Actions workflow sets `BASE_URL` for correct asset paths during deployment.

## Troubleshooting

- If assets are missing in development, ensure you have run `npm run copy-assets` or use the correct dev script.
- If assets are missing in production, check the GitHub Actions logs for asset copy or path issues.
- If navigation or components do not load on GitHub Pages, verify BASE_URL and component paths.

## Testing

- Run all tests: `npm run test`
- Run tests in watch mode: `npm run test:watch`
- Run coverage: `npm run test:coverage`

## Adding New Assets

- Place new review images in `assets/reviews/`.
- Place new badge images in `assets/badges/`.
- Place new data files in `assets/data/`.
- Run `npm run copy-assets` to update `public/`.

## FAQ

- **Why do I see different behavior between dev and production?**
  - Asset copying and path resolution are now unified. If you still see differences, check Node version and BASE_URL settings.
- **How do I test production locally?**
  - Use `npm run preview` after building.
- **What if a component fails to load?**
  - Check the browser console for a red error message in the component area and review asset paths.
