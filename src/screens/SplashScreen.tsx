import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export const SplashScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size="large" color="white" />
        </View>
    )
}
