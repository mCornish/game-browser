import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from './lib/colors';

import GameBrowser from './components/GameBrowser';

export default function App() {
  return (
    <View style={styles.container}>
      <GameBrowser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    color: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
