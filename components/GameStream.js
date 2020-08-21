import React from 'react';
import { StyleSheet, Image, Linking, Text, TouchableHighlight, View } from 'react-native';
import colors from '../lib/colors';

export default function GameStream({ thumbnail_url, user_name, viewer_count }) {
  const splitPoint = thumbnail_url.lastIndexOf('-');
  const thumbnailUrl = thumbnail_url.substr(0, splitPoint) + '.jpg';

  return (
    <TouchableHighlight onPress={openStream} style={{ marginTop: 30 }}>
      <View>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: 135, height: 100 }}
        />
        <Text style={{ color: colors.text }}>User: {user_name}</Text>
        <Text style={{ color: colors.secondary }}>{viewer_count} viewers</Text>
      </View>
    </TouchableHighlight>
  )

  function openStream() {
    Linking.openURL(`https://twitch.tv/${user_name}`);
  }
}
