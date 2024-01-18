const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for pages
const pageCache = new CacheFirst({
	cacheName: "page-cache",
	plugins: [
		new CacheableResponsePlugin({
			statuses: [0, 200],
		}),
		new ExpirationPlugin({
			maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
		}),
	],
});

// Pre-caching pages
warmStrategyCache({
	urls: ["/index.html", "/"],
	strategy: pageCache,
});

// Caching for navigational requests
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Asset Caching: Caching for styles, scripts, and workers
registerRoute(
	({ request }) => ["style", "script", "worker"].includes(request.destination),
	new StaleWhileRevalidate({
		cacheName: "asset-cache",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	})
);
