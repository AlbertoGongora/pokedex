import { selectedPokemonID } from './main.js';

const pokeCard = document.querySelector('#pokecard');


const typeColors = {
    electric: '#F8D030',
    normal: '#A8A878',
    fire: '#fd7d24',
    water: '#6890F0',
    ice: '#98D8D8',
    rock: '#B8A038',
    flying: '#A890F0',
    grass: '#9bcc50',
    psychic: '#f366b9',
    ghost: '#705898',
    bug: '#A8B820',
    poison: '#b97fc9',
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

function informacionPokemon() {
    // Usar el ID del Pokémon directamente desde la variable seleccionada
    const pokemonID = selectedPokemonID;

    // Realizar una segunda solicitud para obtener detalles específicos del Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/`)
        .then((response) => response.json())
        .then(pokemonDetails => {
            // Verificar si la solicitud fue exitosa
            if (!pokemonDetails || pokemonDetails.detail) {
                console.error('No se pudo obtener la información detallada del Pokémon.');
                return;
            }
            mostrarPokedex({ pokemonDetails });
        })
        .catch(error => {
            console.error('Error al obtener detalles del Pokémon:', error);
        });
}


function mostrarPokedex({ pokemonDetails}) {

    const { name, id, sprites, height, weight, types, stats } = pokemonDetails;
    
    const imgFondoPokeball = document.createElement('img');
    
    const pokeName = document.createElement('li');

    const pokeImgContainer = document.createElement('li');
    const pokeImg = document.createElement('img');
    const flechaderecha = document.createElement('img');
    const flechaizquierda = document.createElement('img');
    
    const cardForm = document.createElement('ul');
    
    const pokemonImgShinyContainer = document.createElement('ul');
    const shinyButton = document.createElement('button');
    const pokeId = document.createElement('li');

    const pokeHeightWeight = document.createElement('li');

    const pokeTypes = PokemonTypes(types);
    const pokeStats = PokemonStats(stats);

            
    const spritesFront = sprites.other['official-artwork'].front_default;
    const pokemonShiny = sprites.other['official-artwork'].front_shiny;

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

    const centimetros = 10;
    const kilogramos = 10;

    imgFondoPokeball.src = './assets/img/pokeballBackground.svg';
    pokeName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    flechaizquierda.src = './assets/img/chevron_left.svg';
    flechaderecha.src = './assets/img/chevron_right.svg';
    pokeImg.src = spritesFront;
    pokeId.textContent = `ID: #${id}`;
    shinyButton.textContent = 'Ver shiny';
    pokeHeightWeight.textContent = `Altura: ${height * centimetros} cm | Peso: ${weight / kilogramos} kg`;

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

    let shinyOffOn = false;

    function toggleShiny() {
        if (shinyOffOn) {
            pokeImg.src = spritesFront;
            
        } else {
            pokeImg.src = pokemonShiny;
        }
        shinyOffOn = !shinyOffOn;

        // Cambiar el color de fondo del botón
    shinyButton.style.backgroundColor = shinyOffOn ? '#fa607a' : '#dc0a2d';
    shinyButton.style.color = shinyOffOn ? 'black' : 'white';
    }

    shinyButton.addEventListener('click', toggleShiny);

    pokeImg.addEventListener('mouseover', encimaDeImg);
    pokeImg.addEventListener('mouseout', fueraDeImg);

    function encimaDeImg() {
        pokeImg.style.transition = 'transform 0.4s ease-in';
        pokeImg.style.transform = 'scale(1.2)';
    }
    
    function fueraDeImg() {
        pokeImg.style.transition = 'transform 0.4s ease-in';
        pokeImg.style.transform = 'scale(1)';
    }

    //cambiar color barra depende de los tipos
    const type = types[1] || types[0];
    const barInner = document.querySelectorAll('.bar-inner');

    barInner.forEach((barInner, index) => {
        barInner.style.backgroundColor = typeColors[type.type.name];
    });

}

const PokemonTypes = (types) => {
    const typesContainer = document.createElement('ul');  
    typesContainer.classList.add('poke-types');

    types.forEach(type => {
        const typeElement = document.createElement('li'); 
        typeElement.classList.add('type');
        typeElement.style.backgroundColor = typeColors[type.type.name];

        const firstType = types[0].type.name;
        const typeName = type.type.name;

        pokeCard.style.backgroundColor = typeColors[firstType];

        const translatedTypeName = typeTranslations[typeName] || typeName;

        typeElement.textContent = translatedTypeName.charAt(0).toUpperCase() + translatedTypeName.slice(1);

        // Agregar el elemento al contenedor pokeTypes
        typesContainer.appendChild(typeElement);
    });

    return typesContainer;
}

const PokemonStats = (stats) => {
    const statsContainer = document.createElement('div');
    statsContainer.classList.add('poke-stats'); 

    stats.forEach(stat => {
        const statElement = document.createElement('menu');
        const statName = stat.stat.name;
        let valorEstado = stat.base_stat;

        valorEstado = Math.min(valorEstado, 250);

        const statNameTranslated = statsTranslations[statName] || statName;

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

    return statsContainer;
}

export { informacionPokemon }

document.addEventListener('DOMContentLoaded', () => {
    const pokeCard = document.querySelector('#pokecard');
    
    informacionPokemon(pokeCard); 
});


