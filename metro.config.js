const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const withStorybook = require('@storybook/react-native/metro/withStorybook')
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

module.exports = wrapWithReanimatedMetroConfig(
    withStorybook(config, {
        // Set to false to remove storybook specific options
        // you can also use a env variable to set this
        enabled: true,
        // Path to your storybook config
        configPath: path.resolve(__dirname, './.storybook'),
    }),
)
