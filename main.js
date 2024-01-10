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

// Definición de traducciones
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


// ! Contante para intentar abreviar el nombre de la estadística si no cabe el texto
// const abreviacionStats = {
//     Vida: 'HP',
//     Ataque: 'ATK',
//     Defensa: 'DEF',
//     'Ataque-Especial': 'SATK',
//     'Defensa-Especial': 'SDEF',
//     Velocidad: 'SPD'
// }

// Función para buscar un pokemon introducido por el usuario convierta en minusculas de el texto introducido
const busquedaPokemon = (event) => {
    event.preventDefault();
    const { value } = event.target.browser;

    // Verifica si el valor ingresado es un número
    const siEsNumero = /^\d+$/.test(value);
    let resultadoDelInput;

    if (siEsNumero) {
        // Si es un número, utiliza la búsqueda por número
        const pokemonId = parseInt(value);
        if (pokemonId > 0 && pokemonId <= 1017) {
            resultadoDelInput = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        } else {
            console.error('ID no válido');            
            mostrarErrorIdNoEncontrado();
            return;
        }
    } else {
        if (value === '') {
            console.error('No has introducido ningún pokémon');
            mostrarErrorNombreNoIntroducido();
            return;
        } else {
            // Si no es un número, utiliza la búsqueda por nombre
            resultadoDelInput = `https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`;
        }
    }

    fetch(resultadoDelInput)
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
}

// Función para mostrar la información del pokemon 
const informacionPokemon = data => {
    const spritesFront = data.sprites.other["official-artwork"].front_default;
    const {name, id, height, weight, types, stats} = data;
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

}

// Funcion para insertar los tipos, traducirlos y dar el color de los tipos
const PokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.classList.add('type'); 
        typeElement.style.backgroundColor = typeColors[type.type.name];
        const typeName = type.type.name;
 
        // Traduce el nombre del tipo si hay una traducción disponible
        const translatedTypeName = typeTranslations[typeName] || typeName;

        typeElement.textContent = translatedTypeName.charAt(0).toUpperCase() + translatedTypeName.slice(1); // Capitaliza el nombre del tipo
        pokeTypes.appendChild(typeElement);
    });   
}

// Funcion para insertar las estadísticas
const PokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement('div');
        const statName = stat.stat.name;
        let valorEstado = stat.base_stat;

        // Limitar el valor a 155 si es mayor
        valorEstado = Math.min(valorEstado, 250);

        // Traduce el nombre de la estadística si hay una traducción disponible
        const statNameTranslated = statsTranslations[statName] || statName;

        statElement.innerHTML = `
            <div class="stat-row">
                <div class="stat-desc">${statNameTranslated.charAt(0).toUpperCase() + statNameTranslated.slice(1)}</div>
                <div class="stat-bar">
                    <div class="bar-inner" style="width: ${valorEstado / 155 * 100}%"></div>
                </div>
                <div class="stat-number">${valorEstado}</div>
            </div>
        `;
        pokeStats.appendChild(statElement);
    });
}

// ! Funcion que hace que el maximo de la barra de estados sea el valor maximo de la estadistica
// // Funcion para insertar las estadísticas
// const PokemonStats = stats => {
//     pokeStats.innerHTML = '';
//     let nivelMaximoEstado = 0;

//     // Encontrar el valor máximo de las estadísticas
//     stats.forEach(stat => {
//         nivelMaximoEstado = Math.max(nivelMaximoEstado, stat.base_stat);
//     });

//     stats.forEach(stat => {
//         const statElement = document.createElement('div');
//         const statName = stat.stat.name;
//         const valorEstado = stat.base_stat;

//         // Ajustar el valor al máximo encontrado
//         const adjustedStatValue = Math.min(valorEstado, 250);
//         const anchoBarra = (adjustedStatValue / nivelMaximoEstado) * 100;

//         // Traduce el nombre de la estadística si hay una traducción disponible
//         const statNameTranslated = statsTranslations[statName] || statName;

//         statElement.innerHTML = `
//             <div class="stat-row">
//                 <div class="stat-desc">${statNameTranslated.charAt(0).toUpperCase() + statNameTranslated.slice(1)}</div>
//                 <div class="stat-bar">
//                     <div class="bar-inner" style="width: ${anchoBarra}%"></div>
//                 </div>
//                 <div class="stat-number">${valorEstado}</div>
//             </div>
//         `;
//         pokeStats.appendChild(statElement);
//     });
// }



// Función para mostrar un error por busqueda de nombre
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

// Función para mostrar un error por busqueda de ID
const mostrarErrorIdNoEncontrado = () => {
    browser.value = ''; // Limpia el campo de búsqueda;
    browser.placeholder = 'Inténtalo de nuevo';
    pokeName.textContent = 'ID no encontrado...';
    pokeImg.src = './assets/img/pokeshadow.png';
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    desactivarTransicion();
}

// Función para mostrar error por nombre no introducido
// Holi

const mostrarErrorNombreNoIntroducido = () => {
    browser.value = ''; // Limpia el campo de búsqueda;
    browser.placeholder = 'Introduce un nombre o un #id';
    pokeName.textContent = 'Nombre no introducido...';
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
    pokeImg.style.transition = 'transform 0.4s ease-in';
    pokeImg.style.transform = 'scale(1.2)';
}

function fueraDeImg() {
    pokeImg.style.transition = 'transform 0.4s ease-in';
    pokeImg.style.transform = 'scale(1)';
}

// Función para desactivar la transición en pokeImg
function desactivarTransicion() {
    pokeImg.removeEventListener('mouseover', encimaDeImg);
    pokeImg.removeEventListener('mouseout', fueraDeImg);
}


