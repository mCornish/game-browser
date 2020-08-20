const games = [{
    title: "Fall Guys",
    releaseDate: "8/4/20",
    genre: "Battle Royale",
    platforms: ['Playstation 4', 'PC']
  },
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
    title: "Forza Horizon 4",
    releaseDate: "10/2/18",
    genre: "Racing",
    platforms: ['PC', 'Xbox One']
  }
];

export default async function() {
  return await Promise.all(games.map(fetchData));
}

// Note: Not using async/await since fetch does not support it
function fetchData(game, index) {
  return fetch(`https://api.rawg.io/api/games?search=${game.title}`)
    .then((res) => res.json())
    .then(({ results = [] } = {}) => {
      if (!results.length) return game;

      const result = results[0];
      
      return {
        ...game,
        id: result.id,
        thumbnail: result.preview,
        backgroundImage: result.background_image,
        score: result.metacritic
      }
    });
}
