module.exports = {
    expo: {
        name: 'Coptish',
        slug: 'coptish-app-reactnative',
        newArchEnabled: true,
        version: '1.0.0',
        orientation: 'default',
        icon: './assets/images/icon.png',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/images/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#FFFFFF',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.coptish.coptish',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'com.coptish.coptish',
        },
        plugins: [
            'expo-asset',
            ['expo-screen-orientation', { initialOrientation: 'DEFAULT' }],
            'expo-font',
            ['@sentry/react-native/expo', { organization: 'coptish', project: 'coptish-app' }],
        ],
        extra: {
            storybookEnabled: process.env.STORYBOOK_ENABLED,
            eas: {
                projectId: '3ce3ddf8-890b-4c2b-a8e7-7dfefccc3f27',
            },
        },
    },
}
