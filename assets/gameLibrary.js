const games = [
  {
    title: "Call of Duty: Warzone",
    releaseDate: "3/10/20",
    genre: "Shooter",
    platforms: ['Xbox One', 'Playstation 4', 'PC']
  },
  {
    title: "Call of Duty: Modern Warfare",
    releaseDate: "10/25/19",
    genre: "Shooter",
    platforms: ['Xbox One', 'Playstation 4', 'PC']
  },
  {
    title: "NBA 2K20",
    releaseDate: "9/5/19",
    genre: "Sports",
    platforms: ['Android', 'IOS', 'Nintendo Switch', 'Xbox One', 'PC', 'Playstation 4']
  },
  {
    title: "FIFA 20",
    releaseDate: "9/27/19",
    genre: "Sports",
    platforms: ['Nintendo Switch', 'Playstation 4', 'Xbox One', 'PC']
  },
  {
    title: "Madden NFL 20",
    releaseDate: "9/2/19",
    genre: "Sports",
    platforms: ['Xbox One', 'PC', 'Playstation 4']
  },
  {
    title: "Rocket League",
    releaseDate: "7/7/15",
    genre: "Indie",
    platforms: ['Linux', 'macOS', 'PC', 'Playstation 4', 'Xbox One', 'Nintendo Switch']
  },
  {
    title: "Super Smash Bros. Ultimate",
    releaseDate: "12/7/18",
    genre: "Fighting",
    platforms: ['Nintendo Switch']
  },
  {
    title: "Mario Kart 8",
    releaseDate: "5/29/14",
    genre: "Racing",
    platforms: ['Nintendo Switch']
  },
  {
    title: "Fall Guys",
    releaseDate: "8/4/20",
    genre: "Battle Royale",
    platforms: ['Playstation 4', 'PC']
  },
  {
    title: "Forza Horizon 4",
    releaseDate: "10/2/18",
    genre: "Racing",
    platforms: ['PC', 'Xbox One']
  }
];

export default async function() {
  try {
    const token = (await fetchAuthToken()).access_token;
    return await Promise.all(games.map(fetchData(token)));
  } catch(err) { 
    throw err;
  }
}

// Note: Not using async/await since fetch does not support it
function fetchData(token) {
  return async (game, index) => {
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
