import React from 'react';
import { StyleSheet, Image, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import colors from '../lib/colors';

import GameStream from './GameStream';

export default function GamePage({ game }) {
  return (
    <View style={{ 
      marginTop: 80, 
    }}>
      <Image 
        source={{ uri: game.backgroundImage }} 
        style={{ 
          position: 'absolute',
          top: 50, 
          left: 0,
          bottom: 50,
          right: 0,
          opacity: .1
        }} 
      />
    
    <ScrollView style={{
      padding: 30,
      marginVertical: 30,
    }}>
      <View style={{ marginBottom: 50 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 30,
            fontWeight: 'bold',
          }}>{game.title}</Text>
          <Text style={{ color: colors.text }}>Metacritic Score: {game.score}</Text>
        </View>

        <View style={{ marginVertical: 50 }}>
          <Text style={{ 
            color: colors.text ,
            fontSize: 20,
            fontWeight: 'bold'
          }}>Watch on Twitch</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {game.streams.map(stream => (
              <GameStream key={stream.id} {...stream} />
            ))}
          </View>
        </View>

        <View>
          <Text style={{ color: colors.text }}>Learn more about this game</Text>
          <QRCode value={game.url} />
        </View>
      </View>
    </ScrollView>
    </View>
  )
}
