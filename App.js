import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import searchFor from './lib/searchFor';
import fetchGames from './assets/gameLibrary';

export default function App() {
  return (
    <View style={styles.container}>
      <GameBrowser />
    </View>
  );
}

function GameBrowser() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openedGame, setOpenedGame] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const initialGames = await fetchGames();
        setGames(initialGames);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (isLoading) return (
    <View
      style={{
        flexDirection: 'row'
      }}
    >
      <ActivityIndicator />
      <Text>&nbsp;Loading Games...</Text>
    </View>
  );

  return openedGame ?
    <GamePage game={openedGame} /> :
    <GameSearch games={games} onSelectGame={setOpenedGame} />;
}

function GameSearch({ games, onSelectGame }) {
  const searchGames = searchFor(games);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <Text>Search: </Text>
        <TextInput
          onChangeText={text => filterGames(text)}
          placeholder="Fall Guys"
        />
      </View>

      <View>
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

  function filterGames(searchTerm) {
    setGames(searchGames.current(searchTerm, 'title'));
  }
}

function GameResult({ game, onSelect }) {
  return (
    <TouchableHighlight onPress={() => onSelect(game)}>
      <Text>{game.title}</Text>
    </TouchableHighlight>
  );
}

function GamePage({ game }) {
  return (
    <View>
      <Text>{game.title}</Text>
      <QRCode value={game.url} />

      <Text>Watch on Twitch</Text>
      {game.streams.map(stream => (
        <GameStream key={stream.id} stream={stream} />
      ))}
    </View>
  )
}

function GameStream({ stream }) {
  return (
    <View>
      <Text>{stream.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
