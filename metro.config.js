// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add pdf to asset extensions so Metro bundles PDF files
config.resolver.assetExts.push('pdf');

module.exports = config;
