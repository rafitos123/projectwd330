const img = document.getElementById('pokemon-img');
const optionsDiv = document.getElementById('options');
const playAgainBtn = document.getElementById('play-again');
const loadingSpinner = document.getElementById('loading-spinner');

function showLoading() {
  loadingSpinner.style.display = 'flex';
}

function hideLoading() {
  loadingSpinner.style.display = 'none';
}

async function getPokemon(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar Pokémon');
    return await res.json();
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar Pokémon. Tente novamente.');
    hideLoading();
    throw error;
  }
}

function getRandomId() {
  return Math.floor(Math.random() * 898) + 1;
}

async function startGame() {
  showLoading();

  optionsDiv.innerHTML = '';
  playAgainBtn.classList.add('hidden');
  img.classList.remove('reveal');
  img.classList.add('silhouette');
  img.src = '';

  try {
    const correctPokemon = await getPokemon(getRandomId());
    const artwork = correctPokemon.sprites.other['official-artwork'].front_default;

    if (!artwork) {
      alert('Imagem do Pokémon não disponível.');
      hideLoading();
      return;
    }

    // Espera a imagem carregar antes de continuar
    await new Promise(resolve => {
      img.onload = resolve;
      img.src = artwork;
    });

    const correctName = correctPokemon.name;
    const names = [correctName];

    while (names.length < 4) {
      const poke = await getPokemon(getRandomId());
      if (!names.includes(poke.name)) names.push(poke.name);
    }

    const shuffled = names.sort(() => Math.random() - 0.5);

    shuffled.forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.className = 'option-btn';
      btn.onclick = () => {
        if (name === correctName) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
          const correctBtn = [...optionsDiv.children].find(b => b.textContent === correctName);
          correctBtn.classList.add('correct');
        }

        setTimeout(() => {
          img.classList.add('reveal');
          img.classList.remove('silhouette');
        }, 50);

        playAgainBtn.classList.remove('hidden');
      };
      optionsDiv.appendChild(btn);
    });


    hideLoading();

  } catch (error) {
    hideLoading();
  }
}


playAgainBtn.onclick = startGame;

startGame();
