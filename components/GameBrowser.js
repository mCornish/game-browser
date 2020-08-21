import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, BackHandler, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import colors from '../lib/colors';
import searchFor from '../lib/searchFor';
import fetchGameData from '../lib/fetchGameData';

import GameSearch from './GameSearch';
import GamePage from './GamePage';

export default function GameBrowser({ games: initialGames = [] }) {
  const fetchedGames = useRef([]);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openedGame, setOpenedGame] = useState(null);

  const searchGames = searchFor(fetchedGames.current, 'title');

  useEffect(() => {
    (async () => {
      try {
        const gamesWithData = await fetchGameData(initialGames);
        fetchedGames.current = gamesWithData;
        setGames(gamesWithData);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (!openedGame) return false;
      setOpenedGame(null);
      return true;
    };


    const backHandler =BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [openedGame]);

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
    setGames(searchGames(searchTerm));
  }
}

GameBrowser.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object)
};
