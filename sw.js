// service worker for PWA


var cacheName = "phaser-valley-cache1";
var fileCacheLsit = [
    '/',
    '/index.html',
    '/manifest.json',
    '/lib/phaser.js',
    '/locales/ar/translation.js',
    '/locales/ch/translations.js',
    '/locales/en/translations.js',
    '/src/main.js',
    '/src/prefabs/Player.js',
    '/src/prefabs/languageManager.js',
    '/src/scenes/Load.js',
    '/src/scenes/Play.js',
    '/src/scenes/Title.js',
    '/src/scenes/Win.js',
    '/cofig/scenario.yaml',
    '/assets/Title.png',
    '/assets/logo.png',
    '/assets/mystic_woods_free/read_me.txt',
    '/assets/mystic_woods_free/sprites/characters/README.txt',
    '/assets/mystic_woods_free/sprites/characters/player.png',
    '/assets/mystic_woods_free/sprites/characters/skeleton.png',
    '/assets/mystic_woods_free/sprites/characters/skeleton_swordless.png',
    '/assets/mystic_woods_free/sprites/characters/slime.png',
    '/assets/mystic_woods_free/sprites/objects/chest_01.png',
    '/assets/mystic_woods_free/sprites/objects/chest_02.png',
    '/assets/mystic_woods_free/sprites/objects/objects.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water-sheet.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_01-sheet.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_01.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_02.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_03.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_04.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_05.png',
    '/assets/mystic_woods_free/sprites/objects/rock_in_water_06.png',
    '/assets/mystic_woods_free/sprites/particles/dust_particles_01.png',
    '/assets/mystic_woods_free/sprites/tilesets/decor_16x16.png',
    '/assets/mystic_woods_free/sprites/tilesets/decor_8x8.png',
    '/assets/mystic_woods_free/sprites/tilesets/fences.png',
    '/assets/mystic_woods_free/sprites/tilesets/floors/carpet.png',
    '/assets/mystic_woods_free/sprites/tilesets/floors/flooring.png',
    '/assets/mystic_woods_free/sprites/tilesets/floors/wooden.png',
    '/assets/mystic_woods_free/sprites/tilesets/grass.png',
    '/assets/mystic_woods_free/sprites/tilesets/plains.png',
    '/assets/mystic_woods_free/sprites/tilesets/walls/walls.png',
    '/assets/mystic_woods_free/sprites/tilesets/walls/wooden_door.png',
    '/assets/mystic_woods_free/sprites/tilesets/walls/wooden_door_b.png',
    '/assets/mystic_woods_free/sprites/tilesets/water-sheet.png',
    '/assets/mystic_woods_free/sprites/tilesets/water1.png',
    '/assets/mystic_woods_free/sprites/tilesets/water2.png',
    '/assets/mystic_woods_free/sprites/tilesets/water3.png',
    '/assets/mystic_woods_free/sprites/tilesets/water4.png',
    '/assets/mystic_woods_free/sprites/tilesets/water5.png',
    '/assets/mystic_woods_free/sprites/tilesets/water6.png',
    '/assets/mystic_woods_free/sprites/tilesets/water_decorations.png',
    '/assets/mystic_woods_free/sprites/tilesets/water_lillies.png',
    '/assets/red.png',
    '/assets/screenshots/square.png',
    '/assets/screenshots/wide.png',
    '/assets/tiny_swords/spritesheet.png',
    '/assets/tiny_swords/spritesheet1.png',
    '/assets/tiny_swords/spritesheet2.png',
    '/assets/tiny_swords/spritesheet3.png'
];



// JS code to install list of caches files
self.addEventListener('install', function(event) {
    console.log('sw sw install'); // HACK
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('sw caching');  // HACK
            return cache.addAll(fileCacheLsit);
        }).catch((err_msg) => {
            console.log(err_msg);
        })
    )
})


self.addEventListener('fetch', (event) => {
    console.log('sw fetch');  // HACK
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch((err_msg) => {
            console.log(err_msg);
        })
    )
})