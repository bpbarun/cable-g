// use a cacheName for cache versioning
var cacheName = 'v6:static';

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
    // once the SW is installed, go ahead and fetch the resources to make this work offline
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
          './',
          './bower_components/uikit/css/uikit.almost-flat.min.css',
          './assets/icons/flags/flags.min.css',
          './assets/css/style_switcher.min.css',
          './assets/css/main.min.css',
          './assets/css/themes/themes_combined.min.css',
          './assets/js/common.min.js',
          './assets/js/uikit_custom.min.js',
          './assets/js/altair_admin_common.min.js',
          './bower_components/d3/d3.min.js',
          './bower_components/metrics-graphics/dist/metricsgraphics.min.js',
          './bower_components/chartist/dist/chartist.min.js',
          './https://maps.google.com/maps/api/js?key=AIzaSyC2FodI8g-iCz1KHRFE7_4r8MFLA7Zbyhk',
          './bower_components/maplace-js/dist/maplace.min.js',
          './bower_components/peity/jquery.peity.min.js',
          './bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
          './bower_components/countUp.js/dist/countUp.min.js',
          './bower_components/handlebars/handlebars.min.js',
          './assets/js/custom/handlebars_helpers.min.js',
          './bower_components/clndr/clndr.min.js',
          './assets/js/pages/dashboard.min.js'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});