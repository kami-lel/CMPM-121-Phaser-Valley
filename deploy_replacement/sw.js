// service worker for PWA


var cacheName = "phaser-valley-cache1";
var fileCacheList = [
    '/ucsc-cmpm121-phaser-valley/',
    '/ucsc-cmpm121-phaser-valley/index.html',
    '/ucsc-cmpm121-phaser-valley/manifest.json',
    '/ucsc-cmpm121-phaser-valley/lib/phaser.js',
    '/ucsc-cmpm121-phaser-valley/locales/ar/translation.js',
    '/ucsc-cmpm121-phaser-valley/locales/ch/translations.js',
    '/ucsc-cmpm121-phaser-valley/locales/en/translations.js',
    '/ucsc-cmpm121-phaser-valley/src/main.js',
    '/ucsc-cmpm121-phaser-valley/src/prefabs/Player.js',
    '/ucsc-cmpm121-phaser-valley/src/prefabs/languageManager.js',
    '/ucsc-cmpm121-phaser-valley/src/scenes/Load.js',
    '/ucsc-cmpm121-phaser-valley/src/scenes/Play.js',
    '/ucsc-cmpm121-phaser-valley/src/scenes/Title.js',
    '/ucsc-cmpm121-phaser-valley/src/scenes/Win.js',
    '/ucsc-cmpm121-phaser-valley/config/scenario.yaml',
    '/ucsc-cmpm121-phaser-valley/assets/Title.png',
    '/ucsc-cmpm121-phaser-valley/assets/logo.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/read_me.txt',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/characters/README.txt',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/characters/player.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/characters/skeleton.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/characters/skeleton_swordless.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/characters/slime.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/chest_01.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/chest_02.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/objects.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water-sheet.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_01-sheet.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_01.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_02.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_03.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_04.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_05.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/objects/rock_in_water_06.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/particles/dust_particles_01.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/decor_16x16.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/decor_8x8.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/fences.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/floors/carpet.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/floors/flooring.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/floors/wooden.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/grass.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/plains.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/walls/walls.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/walls/wooden_door.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/walls/wooden_door_b.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water-sheet.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water1.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water2.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water3.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water4.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water5.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water6.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water_decorations.png',
    '/ucsc-cmpm121-phaser-valley/assets/mystic_woods_free/sprites/tilesets/water_lillies.png',
    '/ucsc-cmpm121-phaser-valley/assets/red.png',
    '/ucsc-cmpm121-phaser-valley/assets/screenshots/square.png',
    '/ucsc-cmpm121-phaser-valley/assets/screenshots/wide.png',
    '/ucsc-cmpm121-phaser-valley/assets/tiny_swords/spritesheet.png',
    '/ucsc-cmpm121-phaser-valley/assets/tiny_swords/spritesheet1.png',
    '/ucsc-cmpm121-phaser-valley/assets/tiny_swords/spritesheet2.png',
    '/ucsc-cmpm121-phaser-valley/assets/tiny_swords/spritesheet3.png'
];

// remain parts of the service worker remains unchanged




// JS code to install list of caches files
self.addEventListener('install', function(event) {
    console.log('sw sw install'); // HACK
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('sw caching');  // HACK
            return cache.addAll(fileCacheList);
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