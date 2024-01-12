const browser = document.querySelector('#searchBox');
const pokeCard = document.querySelector('#pokecard');
const pokeName = document.querySelector('#poke-name');
const pokeImg = document.querySelector('#poke-img');
const pokeImgContainer = document.querySelector('#poke-img-container');
const pokeId = document.querySelector('#poke-id');
const pokeHeightWeight = document.querySelector('#poke-height-weight');
const pokeTypes = document.querySelector('#poke-types');
const pokeStats = document.querySelector('#poke-stats');
const shinyButton = document.querySelector('.shiny-button');

const typeColors = {
    electric: '#F8D030',
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    ice: '#98D8D8',
    rock: '#B8A038',
    flying: '#A890F0',
    grass: '#78C850',
    psychic: '#F85888',
    ghost: '#705898',
    bug: '#A8B820',
    poison: '#A040A0',
    ground: '#E0C068',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fighting: '#C03028',
    dark: '#705848',
    fairy: '#EE99AC',
    unknown: '#68A090',
    shadow: '#000000'
};

const typeTranslations = {
    electric: 'eléctrico',
    normal: 'normal',
    fire: 'fuego',
    water: 'agua',
    ice: 'hielo',
    rock: 'roca',
    flying: 'volador',
    grass: 'Planta',
    psychic: 'psíquico',
    ghost: 'fantasma',
    bug: 'bicho',
    poison: 'veneno',
    ground: 'tierra',
    dragon: 'dragón',
    steel: 'acero',
    fighting: 'lucha',
    dark: 'siniestro',
    fairy: 'hada',
    unknown: 'desconocido',
    shadow: 'sombra'
};

const statsTranslations = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad'
}

const informacionPokemon = pokemonID => {
    const pokemon = allPokemons.find(p => p.url.split('/')[6] === pokemonID);

    if (!pokemon) {
        console.error('No se encontró el Pokémon en allPokemons');
        mostrarError();
        return;
    }

    const spritesFront = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`;
    const pokemonShiny = spritesFront; // Reemplaza con la URL del sprite shiny si la tienes

    const { name, id, height, weight, types, stats } = pokemon;
    const centimetros = 10;
    const kilogramos = 10;

    browser.value = '';
    pokeName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    pokeImg.src = spritesFront;
    pokeId.textContent = `ID: #${id}`;
    pokeHeightWeight.textContent = `Altura: ${height * centimetros} cm  |  Peso: ${weight / kilogramos} kg`;
    PokemonTypes(types);
    PokemonStats(stats);
    activarTransicion();

    let shinyOffOn = false;

    function toggleShiny() {
        if (shinyOffOn) {
            pokeImg.src = spritesFront;
        } else {
            pokeImg.src = pokemonShiny;
        }
        shinyOffOn = !shinyOffOn;
    }

    shinyButton.addEventListener('click', toggleShiny);
}

const PokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.classList.add('type');
        typeElement.style.backgroundColor = typeColors[type.type.name];
        const typeName = type.type.name;

        const translatedTypeName = typeTranslations[typeName] || typeName;

        typeElement.textContent = translatedTypeName.charAt(0).toUpperCase() + translatedTypeName.slice(1);
        pokeTypes.appendChild(typeElement);
    });   
}

const PokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement('menu');
        const statName = stat.stat.name;
        let valorEstado = stat.base_stat;

        valorEstado = Math.min(valorEstado, 250);

        const statNameTranslated = statsTranslations[statName] || statName;

        statElement.innerHTML = `
            <ul class="stat-row">
                <li class="stat-desc">${statNameTranslated.charAt(0).toUpperCase() + statNameTranslated.slice(1)}</li>
                <li class="stat-bar">
                    <li class="bar-inner" style="width: ${valorEstado / 250 * 100}%"></li>
                </li>
                <li class="stat-number">${valorEstado}</li>
            </ul>
        `;
        pokeStats.appendChild(statElement);
    });
}

const mostrarError = () => {
    browser.value = '';
    browser.placeholder = 'Inténtalo de nuevo';
    pokeName.textContent = 'Pokémon no encontrado...';
    pokeImg.src = './assets/img/pokeshadow.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    desactivarTransicion();
}

const mostrarErrorIdNoEncontrado = () => {
    browser.value = '';
    browser.placeholder = 'Inténtalo de nuevo';
    pokeName.textContent = 'ID no encontrado...';
    pokeImg.src = './assets/img/noPikaPika.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    desactivarTransicion();
}

const mostrarErrorNombreNoIntroducido = () => {
    browser.value = '';
    browser.placeholder = 'Introduce un nombre o un #id';
    pokeName.textContent = 'Nombre no introducido...';
    pokeImg.src = './assets/img/errorPikaPika.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    desactivarTransicion();
}

const reiniciarBusqueda = () => {
    pokeName.textContent = 'Encuentra tu Pokémon';
    pokeImg.src = './assets/img/bolapoke.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    browser.value = '';
    browser.placeholder = 'Nombre Pokémon o #Id';
    desactivarTransicion();
}

function activarTransicion() {
    pokeImg.addEventListener('mouseover', encimaDeImg);
    pokeImg.addEventListener('mouseout', fueraDeImg);
}

function encimaDeImg() {
    pokeImg.style.transition = 'transform 0.4s ease-in';
    pokeImg.style.transform = 'scale(1.2)';
}

function fueraDeImg() {
    pokeImg.style.transition = 'transform 0.4s ease-in';
    pokeImg.style.transform = 'scale(1)';
}

function desactivarTransicion() {
    pokeImg.removeEventListener('mouseover', encimaDeImg);
    pokeImg.removeEventListener('mouseout', fueraDeImg);
}
