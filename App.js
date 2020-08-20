import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, Linking, ScrollView,  StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import searchFor from './lib/searchFor';
import fetchGames from './assets/gameLibrary';

const colors = {
  base: '#0F0F0F',
  placeholder: '#481C29',
  primary: '#F23F77',
  secondary: '#1EABBD',
  text: 'white'
}

export default function App() {
  return (
    <View style={styles.container}>
      <GameBrowser />
    </View>
  );
}

function GameBrowser() {
  const initialGames = useRef();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openedGame, setOpenedGame] = useState(null);

  const searchGames = searchFor(initialGames.current);

  useEffect(() => {
    (async () => {
      try {
        const fetchedGames = await fetchGames();
        initialGames.current = fetchedGames;
        setGames(fetchedGames);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();

    const backAction = () => {
      if (!openedGame) return false;
      setOpenedGame(null);
      return true;
    };


    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    }
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

  return (
    <View>
      <TouchableHighlight
        onPress={() => setOpenedGame(null)}
        title="Back"
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          flexDirection: 'row',
          opacity: openedGame ? 1 : 0,
          zIndex: 10,
          color: colors.primary,
          borderColor: colors.primary,
          borderWidth: 2,
          borderRadius: 3,
          paddingVertical: 3,
          paddingHorizontal: 10
        }}
      >
        <Text style={{
          color: colors.primary,
          fontSize: 20
        }}>Back</Text>
      </TouchableHighlight>

      <View>
        {openedGame ?
          <GamePage
            game={openedGame}
          /> :
          <GameSearch 
            games={games} 
            onSelectGame={setOpenedGame} 
            onSearch={filterGames}
          />
        }
      </View>
    </View>
  );

  function filterGames(searchTerm) {
    setGames(searchGames(searchTerm, 'title'));
  }
}

function GameSearch({ games, onSelectGame, onSearch }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Text 
          style={{ 
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 20
          }}
        >Search: </Text>
        <TextInput
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

function GameResult({ game, onSelect }) {
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
        <Text style={{ color: colors.text }}>{game.title}</Text>
        <Text style={{ color: colors.text }}>{'>'}</Text>
      </View>
    </TouchableHighlight>
  );
}

function GamePage({ game }) {
  return (
    <View style={{ marginTop: 80 }}>
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
      padding: 30
    }}>
      <Text style={{ color: colors.text }}>{game.title}</Text>
      <Text style={{ color: colors.text }}>Metacritic Score: {game.score}</Text>
      <QRCode value={game.url} />

      <Text style={{ color: colors.text }}>Watch on Twitch</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {game.streams.map(stream => (
          <GameStream key={stream.id} {...stream} />
        ))}
      </View>
    </ScrollView>
    </View>
  )
}

function GameStream({ thumbnail_url, user_name, viewer_count }) {
  const splitPoint = thumbnail_url.lastIndexOf('-');
  const thumbnailUrl = thumbnail_url.substr(0, splitPoint) + '.jpg';

  return (
    <TouchableHighlight onPress={openStream}>
      <View>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: 135, height: 100 }}
        />
        <Text style={{ color: colors.text }}>User: {user_name}</Text>
        <Text style={{ color: colors.text }}>{viewer_count} viewers</Text>
      </View>
    </TouchableHighlight>
  )

  function openStream() {
    Linking.openURL(`https://twitch.tv/${user_name}`);
  }
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
