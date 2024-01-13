import { informacionPokemon } from "./pokedex_main.js";

const maxPokemons = 1012; // Cantidad máxima de pokemones
const listContent = document.querySelector('.list-content'); // Lista de pokemones  
const browser = document.querySelector('#browser-search-input'); // Buscador
const closeButton = document.querySelector(".browser-close");
const pokemonNoEncontradoTexto = document.querySelector('.mensajeError'); // Pokemon no encontrado
const pokemonNoEncontradoImg = document.querySelector('.img-mensajeError'); // Pokemon no encontrado


// Matriz de pokemones 
let allPokemons = []; // Array de pokemones
let selectedPokemonID = 1; // ID del pokemon seleccionado y que pasara esa id al otro archivo para mostrar la informacion

const localStoragePokemonList = JSON.parse(localStorage.getItem('allPokemons'));

if (localStoragePokemonList) {
    allPokemons = localStoragePokemonList;
    visualizarPokemons(allPokemons);
} else {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemons}`)
        .then((response) => response.json())
        .then(data => {
            allPokemons = data.results;
            localStorage.setItem('allPokemons', JSON.stringify(allPokemons));
            visualizarPokemons(allPokemons);
            console.log(allPokemons);
        });
}



// Visualiza los pokemones
function visualizarPokemons(pokemon) {
    listContent.innerHTML = '';

    pokemon.forEach((pokemon) => {
            const pokemonID = pokemon.url.split('/')[6];
    const listObject = document.createElement('ul');
            listObject.className = "list-object";
            listObject.innerHTML = `
                    <li class="numero-pokemon">
                        <p class="seleccionID">#${pokemonID}</p> 
                    </li>
                    <li class="img-pokemon">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}"> 
                    </li>
                    <li class="nombre-pokemon">
                        <p class="titulo-fonts">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p> 
                    </li>
            `;           
            listContent.appendChild(listObject);

    });
}

browser.addEventListener('keyup', controlBusquedaInput);

// Controla la búsqueda cuando introduces un valor
function controlBusquedaInput() {
    const busquedaElemento = browser.value.toLowerCase();
    let filtradoDePokemons;

    const siEsNumero = /^\d+$/.test(busquedaElemento);

    if (siEsNumero) {
        filtradoDePokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split('/')[6];
            return pokemonID.startsWith(busquedaElemento);
        });
    } else if (busquedaElemento === '') {
        filtradoDePokemons = allPokemons;
    } else {
        filtradoDePokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().includes(busquedaElemento);
        });
    }

    visualizarPokemons(filtradoDePokemons);

    if (filtradoDePokemons.length === 0) {
        pokemonNoEncontradoTexto.style.display = 'block';
        pokemonNoEncontradoImg.style.display = 'block';
    } else {
        pokemonNoEncontradoTexto.style.display = 'none';
        pokemonNoEncontradoImg.style.display = 'none';
    }
}

closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  browser.value = "";
  visualizarPokemons(allPokemons);
  pokemonNoEncontradoTexto.style.display = 'none';
  pokemonNoEncontradoImg.style.display = 'none';
}

// Abrir el modal
function abrirModal(pokemonID) {
    const modal = document.getElementById('pokedex-modal');
    modal.style.display = 'flex';

    // Llamar a la función informacionPokemon con el ID del Pokémon seleccionado
    informacionPokemon(pokemonID);
}


// cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('pokedex-modal');
    modal.style.display = 'none';
}



// Actualiza el evento click en cada list-object para abrir el modal
listContent.addEventListener('click', function (event) {
    const target = event.target.closest('.list-object');
    if (target) {
        // Obtener el ID del Pokémon al hacer clic
        const numeroPokemonElement = target.querySelector('.seleccionID');
        if (numeroPokemonElement) {
            selectedPokemonID = numeroPokemonElement.textContent.slice(1);
            abrirModal(selectedPokemonID);
        } else {
            console.error('Elemento numero-pokemon no encontrado.');
        }
    }
});

document.querySelector('.close').addEventListener('click', cerrarModal);

export { selectedPokemonID};

