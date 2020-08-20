import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
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
        throw err;
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
    <Text>{game.title}</Text>
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
