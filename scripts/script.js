const pokemonImg = document.getElementById('pokemon-img');
const pokemonId = document.getElementById('pokemon-id');
const pokemonName = document.getElementById('name');
const pokemonType = document.getElementById('type');
const searchInput = document.getElementById('searchPokemon'); 
const search = document.querySelector('.search');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const card = document.querySelector('.card');
const favButton = document.getElementById('fav-button');

let currentPokemonId = 1;



const fetchPokemon = async (pokemon) => {



    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(url);

    if (response.status === 200) {
        return await response.json();
    }
    if (response.status === 404) {
        pokemonName.textContent = 'Pokémon not found';
        pokemonId.textContent = '';
        pokemonType.textContent = '';
        pokemonImg.src = '../images/loadingpoke.gif';
    }
    
}

const renderPokemon = async (pokemon) => {
  const pokemonData = await fetchPokemon(pokemon);

  if (!pokemonData) {
    return;
  }
  
  currentPokemonId = pokemonData.id;
  const animatedSprite = pokemonData['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
  const defaultSprite = pokemonData['sprites']['front_default'];

  if (pokemonData.id <= 649 && animatedSprite) {
    pokemonImg.src = animatedSprite;
  } else {
    pokemonImg.src = defaultSprite; 
  }


  pokemonId.textContent = `#${pokemonData.id}`;
  pokemonName.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

  const types = pokemonData.types.map(type => type.type.name); 
  pokemonType.textContent = types.join(' / ');

  // Change card border color based on types
  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#b6d3ebff',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };

  const color1 = typeColors[types[0]];
  const color2 = types[1] ? typeColors[types[1]] : color1;

  card.style.borderWidth = '7px';
  card.style.borderStyle = 'solid';
  card.style.borderImageSlice = 1;
  card.style.borderImageSource = `linear-gradient(135deg, ${color1}, ${color2})`;
};

// Event Listeners search form submission
    search.addEventListener('submit', (event) => {
        event.preventDefault();
        renderPokemon(searchInput.value);
        searchInput.value = '';
    });


// Event Listeners for navigation buttons
nextButton.addEventListener('click', () => {
    currentPokemonId++;
    renderPokemon(currentPokemonId);
});

backButton.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        renderPokemon(currentPokemonId);
    }
});




//Pokemon grid rendering
const pokemonContainer = document.getElementById('pokemon-container');
const loadMoreButton = document.getElementById('load-more');

let offset = 1;
const limit = 3;

const createCard = (pokemonData) => {
  const card = document.createElement('div');
  card.classList.add('card');

  const animatedSprite = pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default;
  const defaultSprite = pokemonData.sprites.front_default;

  const img = document.createElement('img');
  img.src = (pokemonData.id <= 649 && animatedSprite) ? animatedSprite : defaultSprite;
  img.alt = pokemonData.name;


  const info = document.createElement('div');
  info.classList.add('pokemon-info');

  const title = document.createElement('h3');
  title.innerHTML = `<span>#${pokemonData.id}</span> <span>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</span>`;

  const type = document.createElement('p');
  const types = pokemonData.types.map(t => t.type.name);
  type.innerHTML = `<strong>${types.join(' / ')}</strong>`;

  const button = document.createElement('input');
  button.type = 'button';
  button.value = 'View more';

  info.appendChild(title);
  info.appendChild(type);
  info.appendChild(button);

  card.appendChild(img);
  card.appendChild(info);

  const typeColors = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#b6d3ebff', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
  };

  const color1 = typeColors[types[0]];
  const color2 = types[1] ? typeColors[types[1]] : color1;

  card.style.borderWidth = '7px';
  card.style.borderStyle = 'solid';
  card.style.borderImageSlice = 1;
  card.style.borderImageSource = `linear-gradient(135deg, ${color1}, ${color2})`;

  return card;
};


const loadPokemonBatch = async () => {
  for (let i = offset; i < offset + limit; i++) {
    const data = await fetchPokemon(i);
    if (data) {
      const card = createCard(data);
      pokemonContainer.appendChild(card);
    }
  }
  offset += limit;
};

loadMoreButton.addEventListener('click', loadPokemonBatch);


loadPokemonBatch();
renderPokemon(currentPokemonId);
