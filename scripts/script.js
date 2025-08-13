const pokemonImg = document.getElementById('pokemon-img');
const pokemonId = document.getElementById('pokemon-id');
const pokemonName = document.getElementById('name');
const pokemonType = document.getElementById('type');
const searchInput = document.getElementById('searchPokemon');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const search = document.querySelector('.search');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const card = document.querySelector('.card');
const pokemonContainer = document.getElementById('pokemon-container');
const loadMoreButton = document.getElementById('load-more');

let currentPokemonId = 1;
let offset = 1; //beginning offset for loading Pokémon
const limit = 3; //how many Pokémon to load at once

// Find pokémon by name or ID
const fetchPokemon = async (pokemon) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
  const response = await fetch(url);

  if (response.status === 200) {
    return await response.json();
  }
  if (response.status === 404 && pokemonName && pokemonId && pokemonType && pokemonImg) {
    pokemonName.textContent = 'Pokémon not found';
    pokemonId.textContent = '';
    pokemonType.textContent = '';
    pokemonImg.src = 'images/loadingpoke.gif';
    return null;
  }
};

//render Pokémon in pokedex
const renderPokemon = async (pokemon) => {
  const pokemonData = await fetchPokemon(pokemon);
  if (!pokemonData || !pokemonId || !pokemonName || !pokemonType || !pokemonImg || !card) return;

  currentPokemonId = pokemonData.id;
  const animatedSprite = pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default;
  const defaultSprite = pokemonData.sprites.front_default;

  pokemonImg.src = (pokemonData.id <= 649 && animatedSprite) ? animatedSprite : defaultSprite;
  pokemonId.textContent = `#${pokemonData.id}`;
  pokemonName.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

  const types = pokemonData.types.map(type => type.type.name); 
  pokemonType.textContent = types.join(' / ');

  viewMoreBtn.addEventListener('click', () => {
    window.location.href = `pokemon-detail.html?id=${pokemonData.id}`;
  });

  

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
};

//navegation buttons
if (search && searchInput) {
  search.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(searchInput.value);
    searchInput.value = '';
  });
}

if (nextButton) {
  nextButton.addEventListener('click', async () => {
    const nextId = currentPokemonId + 1;
    const data = await fetchPokemon(nextId);
    if (data) renderPokemon(nextId);
  });
}

if (backButton) {
  backButton.addEventListener('click', async () => {
    if (currentPokemonId > 1) {
      const prevId = currentPokemonId - 1;
      const data = await fetchPokemon(prevId);
      if (data) renderPokemon(prevId);
    }
  });
}

// cerate card for each pokemon in grid
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
  button.addEventListener('click', () => {
    window.location.href = `pokemon-detail.html?id=${pokemonData.id}`;
  });

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

// load pokemon in grid
const loadPokemonBatch = async () => {
  for (let i = offset; i < offset + limit; i++) {
    const data = await fetchPokemon(i);
    if (data && pokemonContainer) {
      const card = createCard(data);
      pokemonContainer.appendChild(card);
    }
  }
  offset += limit; // change offset for next batch
};

if (loadMoreButton && pokemonContainer) {
  loadMoreButton.addEventListener('click', loadPokemonBatch);
  loadPokemonBatch(); // Load initial batch of Pokémon
}

if (pokemonId && pokemonName && pokemonType && pokemonImg && card) {
  renderPokemon(currentPokemonId);
}

// Pokemon detail (pokemon-detail.html)
if (window.location.pathname.includes('pokemon-detail.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonIdParam = urlParams.get('id');

  const fetchSpecies = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    return await res.json();
  };

  const fetchEvolutionChain = async (url) => {
    const res = await fetch(url);
    return await res.json();
  };

  const renderEvolutionChain = async (chain) => {
    const evolutionContainer = document.getElementById('evolution');
    evolutionContainer.innerHTML = '';

    let evoData = chain;
    while (evoData) {
      const name = evoData.species.name;
      const pokemonData = await fetchPokemon(name);
      const imgUrl = pokemonData.sprites.other['official-artwork'].front_default;

      const stage = document.createElement('div');
      stage.classList.add('evolution-stage');
      stage.innerHTML = `<img src="${imgUrl}" alt="${name}"><br>${name.charAt(0).toUpperCase() + name.slice(1)}`;
      evolutionContainer.appendChild(stage);

      if (evoData.evolves_to.length > 0) {
        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.textContent = '➡';
        evolutionContainer.appendChild(arrow);
      }

      evoData = evoData.evolves_to[0];
    }
  };

  const renderPokemonDetail = async () => {
    const data = await fetchPokemon(pokemonIdParam);
    const speciesData = await fetchSpecies(pokemonIdParam);
    const evoChainData = await fetchEvolutionChain(speciesData.evolution_chain.url);

    const container = document.getElementById('pokemon-detail');
    container.innerHTML = `
      <h2>#${data.id} ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
      <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="pokemon-img">
    <div class="pokemon-info">
      <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(' / ')}</p>
      <p><strong>Height:</strong> ${data.height}</p>
      <p><strong>Weight:</strong> ${data.weight}</p>
      <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}</p>
    </div>
    `;

    renderEvolutionChain(evoChainData.chain);
  };

  renderPokemonDetail();
}

 function toggleMenu() {
    const menu = document.querySelector('.menu');
    const card = document.querySelector('.card');

    menu.classList.toggle('show');

    if (menu.classList.contains('show')) {
      card.style.marginTop = '250px'; 
    } else {
      card.style.marginTop = '20px'; 
    }
  }