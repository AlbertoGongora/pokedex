// Variables
const browser = document.querySelector('#searchBox');
const pokeCard = document.querySelector('#pokecard');
const pokeName = document.querySelector('#poke-name');
const pokeImg = document.querySelector('#poke-img');
const pokeImgContainer = document.querySelector('#poke-img-container');
const pokeId = document.querySelector('#poke-id');
const pokeHeightWeight = document.querySelector('#poke-height-weight');
const pokeTypes = document.querySelector('#poke-types');
const pokeStats = document.querySelector('#poke-stats');

// Definición de colores
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

// Función para buscar un pokemon introducido por el usuario convierta en minusculas de el texto introducido
const busquedaPokemon = (event) => {
    event.preventDefault();
    const { value } = event.target.browser;
    const pokemonId = parseInt(value)

    if (pokemonId > 0 && pokemonId <= 1017) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontró el Pokémon');
            }
            return response.json();
        })
        .then(informacionPokemon)
        .catch(error => {
            console.error(error);
            mostrarError();
        });
    } else {
        console.error('Id no valida');
        mostrarError();
    }
}

// Función para mostrar la información del pokemon 
const informacionPokemon = data => {
    const spritesFront = data.sprites.other["official-artwork"].front_default;
    const {name, id, height, weight, types, stats} = data;
    const centimetros = 10; 
    const kilogramos = 10; 

    pokeName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    pokeImg.src = spritesFront;
    pokeId.textContent = `ID: #${id}`;
    pokeHeightWeight.textContent = `Altura: ${height * centimetros} cm  |  Peso: ${weight / kilogramos} kg`;
    PokemonTypes(types);
    PokemonStats(stats);
    activarTransicion();

}

// Funcion para insertar los tipos y el color de los tipos
const PokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.classList.add('type'); 
        typeElement.style.backgroundColor = typeColors[type.type.name];
        const typeName = type.type.name;
        typeElement.textContent = typeName.charAt(0).toUpperCase() + typeName.slice(1); // Capitaliza el nombre del tipo
        pokeTypes.appendChild(typeElement);
    });   
}

// Funcion para insertar las estadísticas
const PokemonStats = stats => {
pokeStats.innerHTML = '';
stats.forEach(stat => {
    const statElement = document.createElement('div');
    const statName = stat.stat.name;
    const statValue = stat.base_stat;

    statElement.innerHTML = `
        <div class="stat-row">
            <div class="stat-desc">${statName.charAt(0).toUpperCase() + statName.slice(1)}</div>
            <div class="stat-bar">
                <div class="bar-inner" style="width: ${statValue}%"></div>
            </div>
            <div class="stat-number">${statValue}</div>
        </div>
    `;
    pokeStats.appendChild(statElement);
    });
}

// Función para mostrar un error
const mostrarError = () => {
    browser.value = ''; // Limpia el campo de búsqueda;
    browser.placeholder = 'Inténtalo de nuevo';
    pokeName.textContent = 'Pokémon no encontrado...';
    pokeImg.src = './assets/img/pokeshadow.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    desactivarTransicion();
}
// Boton de reinicio de la barra de busqueda
const reiniciarBusqueda = () => {
    pokeName.textContent = 'Encuentra tu Pokémon';
    pokeImg.src = './assets/img/bolapoke.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    browser.value = '';
    browser.placeholder = 'Nombre Pokémon o #Id'; // Limpia el campo de búsqueda;
    desactivarTransicion();
}

// Función para activar la transición en pokeImg
function activarTransicion() {
    pokeImg.addEventListener('mouseover', encimaDeImg);
    pokeImg.addEventListener('mouseout', fueraDeImg);
}

// Funciones manejadoras para mouseover y mouseout
function encimaDeImg() {
    pokeImg.style.transition = 'transform 0.5s ease-in';
    pokeImg.style.transform = 'scale(1.2)';
}

function fueraDeImg() {
    pokeImg.style.transition = 'transform 0.5s ease-in';
    pokeImg.style.transform = 'scale(1)';
}

// Función para desactivar la transición en pokeImg
function desactivarTransicion() {
    pokeImg.removeEventListener('mouseover', encimaDeImg);
    pokeImg.removeEventListener('mouseout', fueraDeImg);
}






