const pokemonImg = document.getElementById('pokemon-img');
const pokemonId = document.getElementById('pokemon-id');
const pokemonName = document.getElementById('name');
const pokemonType = document.getElementById('type');
const searchInput = document.getElementById('searchPokemon'); 
const search = document.querySelector('.search');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const card = document.querySelector('.card');

let currentPokemonId = 1;



const fetchPokemon = async (pokemon) => {

    pokemonName .textContent = 'Loading...';
    pokemonId.textContent = '';

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
        return null;
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

  const types = pokemonData.types.map(type => type.type.name); // <-- aqui corrige seu erro
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

renderPokemon(currentPokemonId);
