import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import colors from '../lib/colors';

export default function GameResult({ game, onSelect }) {
  return (
    <TouchableHighlight 
      onPress={() => onSelect(game)}
      style={{
        padding: 10,
        backgroundColor: 'rgba(255,255,255, .1)',
        marginTop: 10
      }}
    >
      <View style={{ 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ 
          paddingVertical: 5,
          color: colors.text, 
          fontSize: 15 
        }}>{game.title}</Text>
        <Text style={{ color: colors.text }}>{'>'}</Text>
      </View>
    </TouchableHighlight>
  );
}
