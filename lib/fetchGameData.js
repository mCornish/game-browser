export default async function fetchGameData(games) {
  try {
    const token = (await fetchAuthToken()).access_token;
    return await Promise.all(games.map(fetchData(token)));
  } catch(err) { 
    throw err;
  }
}

// Note: Not using async/await since fetch does not support it
function fetchData(token) {
  return async (game) => {
    const resultsResponse = await fetch(`https://api.rawg.io/api/games?search=${game.title}`);
    const { results } = await resultsResponse.json();

    if (!results.length) return game;

    const result = results[0];
    const url = `https://rawg.io/games/${result.slug}`;

    // Fetch twitch streams
    const twitchGames = await fetchTwitchGames(token, game.title);
    const twitchGame = twitchGames[0];
    const streams = twitchGame ? await fetchTwitchStreams(token, twitchGame.id) : [];

    return {
      ...game,
      id: result.id,
      thumbnail: twitchGame.box_art_url,
      backgroundImage: result.background_image,
      score: result.metacritic,
      streams,
      url
    };
  }
}

async function fetchAuthToken() {
  // FIXME: Move app secret to .env
  // https://www.npmjs.com/package/react-native-dotenv
  const formData = new FormData();
  formData.append('client_id', 'unobk7nvhs2fuz7myai6p486giv2tu');
  formData.append('client_secret', 't7dww4k3r9h6yc3ogu2h84u6qof9y7');
  formData.append('grant_type', 'client_credentials');

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: formData
  });
  
  return res.json();
}

async function fetchTwitchGames(token, name) {
  const res = await fetch(`https://api.twitch.tv/helix/games?name=${name}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-ID': 'unobk7nvhs2fuz7myai6p486giv2tu'
    }
  });

  const { data } = await res.json();
  return data;
}

async function fetchTwitchStreams(token, gameId) {
  const res = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}&first=6`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-ID': 'unobk7nvhs2fuz7myai6p486giv2tu'
    }
  });

  const { data } = await res.json();
  return data;
}
