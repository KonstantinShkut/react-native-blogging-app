import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useStore } from '../store';
import { LOGOUT, ScreenProps } from '.';

export const Logout = ({ navigation }: ScreenProps<typeof LOGOUT>) => {
  const { auth } = useStore();

  useEffect(() => {
    (async () => {
      try {
        await auth.logout();
      } catch (e) {}
      // navigation.navigate('Home', { authenticated: false });
      navigation.navigate('Home');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
