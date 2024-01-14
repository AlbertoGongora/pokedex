'use strict';

// Importaciones
import { selectedPokemonID, maxPokemons, cerrarModal } from './main.js';

// Variables para la gestion de que pokemon se muestra
const pokeCard = document.querySelector('#pokecard');
let currentPokemonID = null;

// Colores
const typeColors = {
    electric: '#eed535',
    normal: '#a4acaf',
    fire: '#fd7d24',
    water: '#4592c4',
    ice: '#51c4e7',
    rock: '#a38c21',
    flying: '#A890F0',
    grass: '#9bcc50',
    psychic: '#f366b9',
    ghost: '#7b62a3',
    bug: '#729f3f',
    poison: '#b97fc9',
    ground: '#ab9842',
    dragon: '#f16e57',
    steel: '#9eb7b8',
    fighting: '#d56723',
    dark: '#7b62a3',
    fairy: '#fdb9e9',
    unknown: '#68A090',
    shadow: '#000000'
};

// Traducciones de los tipos de los pokemons
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

// Traducciones de las estadísticas
const statsTranslations = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad'
}

// Llamada a la API para obtener los detalles del pokemon
async function informacionPokemon() {
    try {

        const pokemonID = currentPokemonID === null ? selectedPokemonID : currentPokemonID;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonID || pokemonID}/`);
        const pokemonDetails = await response.json();

        if (!pokemonDetails || pokemonDetails.detail) {
            console.error('No se pudo obtener la información detallada del Pokémon.');
            return;
        }

        mostrarPokedex({ pokemonDetails });
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error);
    }
}

// Funcion para sumar o restar el ID y asi mostrar el pokemon correspondiente en la navegacion
function cambiarPokemon(operacion) {
    const numeroIDActual = currentPokemonID === null ? selectedPokemonID : currentPokemonID;
    currentPokemonID = numeroIDActual;
    currentPokemonID += operacion;

    informacionPokemon();
}

// Funcion para mostrar la informacion del pokemon
function mostrarPokedex({ pokemonDetails}) {

    // Destructurar el objeto pokemonDetails
    const { name, id, sprites, height, weight, types, stats } = pokemonDetails;
    
    // Crear elementos del DOM
    //Imagen de fondo
    const imgFondoPokeball = document.createElement('img');
    
    //Nombre del Pokemon
    const pokeName = document.createElement('li');

    //Contenerdor con la imagen del Pokemon y las flechas para poder navegar entre pokemones
    const pokeImgContainer = document.createElement('figure');
    const pokeImg = document.createElement('img');
    const flechaderecha = document.createElement('img');
    const flechaizquierda = document.createElement('img');
    
    //Carta donde estan los datos de los pokemon
    const cardForm = document.createElement('ul');
    
    //Contenedor con ID y boton de cambio de imagen
    const pokemonImgShinyContainer = document.createElement('li');
    const shinyButton = document.createElement('button');
    const pokeId = document.createElement('p');

    //Contenedor con los datos de altura y peso
    const pokeHeightWeight = document.createElement('li');

    //Contenedor con los tipos y estadisticas, asociados a unas funciones
    const pokeTypes = PokemonTypes(types);
    const pokeStats = PokemonStats(stats);

    // Imagenes de los pokemones
    const spritesFront = sprites.other['official-artwork'].front_default;
    const pokemonShiny = sprites.other['official-artwork'].front_shiny;

    // Asociar clases a los elementos
    imgFondoPokeball.classList.add('img-pokeball-background');
    pokeName.classList.add('poke-name');
    pokeImgContainer.classList.add('poke-img-container');
    pokeImg.classList.add('poke-img');
    flechaderecha.classList.add('flechaderecha');
    flechaizquierda.classList.add('flechaizquierda');
    pokemonImgShinyContainer.classList.add('pokemon-img-shiny-container');
    shinyButton.classList.add('shiny-button');
    pokeId.classList.add('poke-id');
    pokeHeightWeight.classList.add('poke-height-weight');
    pokeTypes.classList.add('poke-types');
    pokeStats.classList.add('poke-stats');
    cardForm.classList.add('card-form');

    // Variables para ajustar el peso y altura de los pokemones de los datos de la PokeAPI
    const centimetros = 10;
    const kilogramos = 10;

    // Asociar atributos a los elementos
    imgFondoPokeball.src = './assets/img/pokeballBackground.svg';
    pokeName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    flechaizquierda.src = './assets/img/chevron_left.svg';
    flechaderecha.src = './assets/img/chevron_right.svg';

    // Logica para asignar imagen y si no tiene mostrar otra imagen por defecto
    if (spritesFront === null) {
        pokeImg.src = './assets/img/imagenNoDisponiblePikaPika.png'
    } else {
        pokeImg.src = spritesFront;
    }
    
    pokeId.textContent = `ID: #${id}`;
    shinyButton.textContent = 'Ver shiny';
    pokeHeightWeight.textContent = `Altura: ${height * centimetros} cm | Peso: ${weight / kilogramos} kg`;

    // Agregar elementos al DOM
    pokeCard.innerHTML = '';
    pokeCard.appendChild(imgFondoPokeball);
    pokeCard.appendChild(pokeName);
    pokeCard.appendChild(pokeImgContainer);
    pokeImgContainer.appendChild(flechaizquierda);
    pokeImgContainer.appendChild(pokeImg);
    pokeImgContainer.appendChild(flechaderecha);

    pokeCard.appendChild(cardForm);

    cardForm.appendChild(pokemonImgShinyContainer);
    pokemonImgShinyContainer.appendChild(pokeId);
    pokemonImgShinyContainer.appendChild(shinyButton);
    cardForm.appendChild(pokeHeightWeight);
    cardForm.appendChild(pokeTypes);
    cardForm.appendChild(pokeStats);

    // DIFERENTES FUNCIONALIDADES DE LA POKEDEX

    // Cambiar imagen shiny con el botón y volver a la imagen normal
    let shinyOffOn = false;

    // Funcion para cambiar la imagen de shiny
    function toggleShiny() {
        // Logica para asignar imagen y si no tiene mostrar otra imagen por defecto
        if (shinyOffOn) {
            if (spritesFront === null) {
                pokeImg.src = './assets/img/imagenNoDisponiblePikaPika.png'
            } else {
                pokeImg.src = spritesFront;
            }
        } else {
            if (pokemonShiny === null) {
                pokeImg.src = './assets/img/imagenNoDisponiblePikaPika.png'
            } else {
                pokeImg.src = pokemonShiny;
            }
        }
        // Cambiar el estado de shiny al ejecutarlo
        shinyOffOn = !shinyOffOn;

    // Cambiar el estilo del boton al ejecutarlo
    shinyButton.style.backgroundColor = shinyOffOn ? '#fa607a' : '#dc0a2d';
    shinyButton.style.color = shinyOffOn ? 'black' : 'white';
    }

    // Agregar evento al boton de cambio de imagen
    shinyButton.addEventListener('click', toggleShiny);

    // Activar transicion de imagen, agranda cuando estamos encima y disminuye cuando estamos fuera de ella
    pokeImg.addEventListener('mouseover', encimaDeImg);
    pokeImg.addEventListener('mouseout', fueraDeImg);

    // Activar transicion de imagen, agranda cuando estamos encima 
    function encimaDeImg() {
        pokeImg.style.transition = 'transform 0.4s ease-in';
        pokeImg.style.transform = 'scale(1.2)';
    }
    
    // Activar transicion de imagen, disminuye cuando estamos fuera de ella
    function fueraDeImg() {
        pokeImg.style.transition = 'transform 0.4s ease-in';
        pokeImg.style.transform = 'scale(1)';
    }

    //cambiar color barra depende de los tipos, cogiendo por defecto el segundo tipo, si no hay segundo tipo se toma el primero
    const type = types[1] || types[0];
    const barInner = document.querySelectorAll('.bar-inner');

    barInner.forEach((barInner, index) => {
        barInner.style.backgroundColor = typeColors[type.type.name];
    });

    //Al estar al inicio y al final de la pokedex, no muestra las flechas hacia donde no quedan Pokemons
    if (id ===1) {
        // Si estas en el numero uno no muestra la flecha izquierda
        flechaizquierda.style.display = 'none';
        }
    
    // Si estas en el numero maximo no muestra la flecha derecha
        if (id === maxPokemons) {
            flechaderecha.style.display = 'none';
    }

    // Eventos para navegar por la pokedex
    flechaizquierda.addEventListener('click', () => cambiarPokemon(-1));
    flechaderecha.addEventListener('click', () => cambiarPokemon(1));
}

// Funcion para obtener los tipos y que se tengan el estilo segun el color correspondiente al tipo
const PokemonTypes = (types) => {
    // Crea contenedor para los tipos y asocia una clase
    const typesContainer = document.createElement('li');  
    typesContainer.classList.add('poke-types');

    // Crea un elemento para cada tipo
    types.forEach(type => {
        // Crea un elemento li y asocia una clase para cada tipo
        const typeElement = document.createElement('p'); 
        typeElement.classList.add('type');

        // Asigna el color correspondiente al tipo
        typeElement.style.backgroundColor = typeColors[type.type.name];

        // Variables que determinan el color que se le asigna al tipo
        const firstType = types[0].type.name;
        const typeName = type.type.name;

        // Asigna el color de fondo del primer tipo de ese pokemon
        pokeCard.style.backgroundColor = typeColors[firstType];

        // Traduce el nombre del tipo con la función typeTranslations
        const translatedTypeName = typeTranslations[typeName] || typeName;

        // Asigna el texto del tipo traducido
        typeElement.textContent = translatedTypeName.charAt(0).toUpperCase() + translatedTypeName.slice(1);

        // Agregar el elemento al contenedor pokeTypes
        typesContainer.appendChild(typeElement);
    });

    // Devuelve el contenedor de los tipos
    return typesContainer;
}

// Funcion para obtener los estadisticas
const PokemonStats = (stats) => {
    // Crea contenedor para las estadisticas
    const statsContainer = document.createElement('menu');
    statsContainer.classList.add('poke-stats'); 

    // Crea un elemento para cada estadistica
    stats.forEach(stat => {
        // Crea un elemento li y asocia una clase para cada estadistica
        const statElement = document.createElement('ul');
        const statName = stat.stat.name;
        let valorEstado = stat.base_stat;

        // Asigna el valor minimo de la estadistica, para que no se pase de 250
        valorEstado = Math.min(valorEstado, 250);

        // Traduce el nombre de la estadistica con la función statsTranslations
        const statNameTranslated = statsTranslations[statName] || statName;

        // Asigna el texto de la estadistica traducido
        statElement.innerHTML = `
        <ul class="stat-row">
            <li class="stat-desc">${statNameTranslated.charAt(0).toUpperCase() + statNameTranslated.slice(1)}</li>
        <ul class="stat-bar">
            <li class="bar-inner" style="width: ${valorEstado / 250 * 100}%"></li>
        </ul>
            <li class="stat-number">${valorEstado}</li>
        </ul>
        `;

        // Agregar el elemento al contenedor pokeStats
        statsContainer.appendChild(statElement);
    });

    // Devuelve el contenedor de las estadisticas
    return statsContainer;
}

// Funcion para que cuando se cierre el modal el valor currentPokemonID sea null, exportado a main.js
function setCurrentPokemonID(value) {
    currentPokemonID = value;
}

// Exportar las funciones
export { informacionPokemon, currentPokemonID, setCurrentPokemonID };