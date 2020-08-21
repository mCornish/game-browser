import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import colors from '../lib/colors';
import GameResult from './GameResult';

export default function GameSearch({ games, onSelectGame, onSearch }) {
  const inputRef = useRef();

  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <TouchableHighlight onPress={() => inputRef.current.focus()}>
          <Text 
            style={{ 
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 20
            }}
          >Search: </Text>
        </TouchableHighlight>
        <TextInput
          ref={inputRef}
          onChangeText={text => onSearch(text)}
          placeholder="Fall Guys"
          placeholderTextColor={colors.placeholder}
          style={{
            borderBottomWidth: 1,
            borderColor: colors.primary,
            paddingVertical: 3,
            paddingHorizontal: 10,
            color: colors.primary,
            fontSize: 30
          }}
        />
      </View>

      <View style={{ 
        alignContent: 'space-between',
        marginTop: 30 
      }}>
        {games.map(game => (
          <GameResult
            key={game.id}
            game={game}
            onSelect={onSelectGame}
          />
        ))}
      </View>
    </View>
  );
}
