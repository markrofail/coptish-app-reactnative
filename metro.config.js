const { getDefaultConfig } = require('@expo/metro-config')

const configs = getDefaultConfig(__dirname)
configs.resolver.assetExts.push('yml')

module.exports = configs
