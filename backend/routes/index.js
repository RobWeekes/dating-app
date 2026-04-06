// backend/routes/index.js

const express = require('express');
const path = require("path");
const router = express.Router();

// All the API routes will be served at URL"s starting with /api/
const apiRouter = require('./api');

// Mount all API routes at /api
// All the URLs of the routes in the api router will be prefixed with /api
router.use('/api', apiRouter);
// This is the key piece that turns it into a single-page app instead of a server that only serves /

// Static routes

// Production-only frontend serving
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.resolve(__dirname, "../../frontend/build");
  const indexHtmlPath = path.join(frontendBuildPath, "index.html");

  // Serve the static assets in the frontend's build folder
  router.use(express.static(frontendBuildPath));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    return res.sendFile(indexHtmlPath);
  });
} // This route is essential for proper functioning of a React single page app with client-side routing when deployed to production, where both the frontend & backend are served from the same server. It ensures that all non-API routes serve the React application, allowing React Router to handle the client-side routing.

module.exports = router;
