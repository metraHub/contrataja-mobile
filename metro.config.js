const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro's file watcher (no Watchman on this machine, so it falls back to
// Node's fs.watch) crashes with ENOENT when a directory it's watching
// disappears mid-build. Native Android builds constantly create/delete
// ephemeral CMakeTmp scratch dirs under node_modules/*/android/.cxx while
// compiling native modules (expo-modules-core, react-native-webrtc/LiveKit),
// which trips this every time a native build runs while Metro is up.
// Metro never needs these paths — excluding them removes the crash without
// requiring Watchman to be installed.
config.resolver.blockList = [/.*\/android\/\.cxx\/.*/, /.*\/android\/build\/.*/, /.*\/android\/app\/build\/.*/];

module.exports = config;
