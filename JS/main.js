'use strict';

// Importaciones0
import { informacionPokemon, setCurrentPokemonID } from "./pokedex_main.js";

// Variables
const maxPokemons = 1010; // Cantidad máxima de pokemones Oficiales a dia de hoy
const listContent = document.querySelector('.list-content'); // Lista de pokemones  
const browser = document.querySelector('#browser-search-input'); // Buscador
const closeButton = document.querySelector(".browser-close");
const pokemonNoEncontradoTexto = document.querySelector('.mensajeError'); // Pokemon no encontrado
const pokemonNoEncontradoImg = document.querySelector('.img-mensajeError'); // Pokemon no encontrado

// Matriz de pokemones 
let allPokemons = []; // Array de pokemones
let selectedPokemonID = 1;

// Carga inicial de pokemones
const localStoragePokemonList = JSON.parse(localStorage.getItem('allPokemons'));

// Verifica si hay pokemones guardados en el localStorage, si no los hay, obtiene los pokemones
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
        });
}

// Visualiza los pokemones
function visualizarPokemons(pokemon) {
    listContent.innerHTML = '';

    // Visualiza los pokemones
    pokemon.forEach((pokemon) => {
        // Obtiene el ID del pokemon
        const pokemonID = pokemon.url.split('/')[6];

        // Crea el elemento
        const listObject = document.createElement('ul');
        listObject.className = "list-object";

        // Crea el HTML
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

        // Agrega el elemento
        listContent.appendChild(listObject);
    });
}

// Evento para que se actualice la lista de pokemones cada vez que introducis un valor
browser.addEventListener('keyup', controlBusquedaInput);

// Controla la búsqueda cuando introduces un valor
function controlBusquedaInput() {
    // Obtiene el valor del input
    const busquedaElemento = browser.value.toLowerCase();
    let filtradoDePokemons;

    // Verifica si es un número
    const siEsNumero = /^\d+$/.test(busquedaElemento);

    // Filtra los pokemones
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

    // Visualiza los pokemones
    visualizarPokemons(filtradoDePokemons);

    // Verifica si hay pokemones
    if (filtradoDePokemons.length === 0) {
        pokemonNoEncontradoTexto.style.display = 'block';
        pokemonNoEncontradoImg.style.display = 'block';
    } else {
        pokemonNoEncontradoTexto.style.display = 'none';
        pokemonNoEncontradoImg.style.display = 'none';
    }
}

// Evento click para limpiar el buscador
closeButton.addEventListener("click", clearSearch);

// Limpia el buscador
function clearSearch() {
    // Limpia el input
    browser.value = "";
    // Llama a la función para visualizar los pokemones
    visualizarPokemons(allPokemons);
    // Desactiva la visualización de pokemones no encontrados
    pokemonNoEncontradoTexto.style.display = 'none';
    pokemonNoEncontradoImg.style.display = 'none';
}

// Abrir el modal
function abrirModal(selectedPokemonID) {
    // Mostrar el modal
    const modal = document.getElementById('pokedex-modal');
    modal.style.display = 'flex';

    // Llamar a la función informacionPokemon con el ID del Pokémon seleccionado
    informacionPokemon(selectedPokemonID);
}

// cerrar el modal
function cerrarModal(event) {
    // Obtener el modal
    const modal = document.getElementById('pokedex-modal');
    
    // Cerrar el modal con el boton cerrar o al hacer click afuera
    if (
        !event.target.closest('.pokedex-modal-int') ||
        event.target.classList.contains('close')
    ) {
        modal.style.display = 'none';

        // Limpia el valor de currentPokemonID dandole un null para que el algoritmo de cambiarPokemon y seleccionar  funcione
        setCurrentPokemonID(null);
    }
}

// Actualiza el evento click en cada list-object para abrir el modal
listContent.addEventListener('click', function (event) {
    event.preventDefault();

    // Obtener el elemento
    const target = event.target.closest('.list-object');

    // Verifica que se haya seleccionado
    if (target) {
        // Obtener el ID del Pokémon al hacer clic
        const numeroPokemonElement = target.querySelector('.seleccionID');
        if (numeroPokemonElement) {
            // Obtener el ID
            const numeroID = numeroPokemonElement.textContent.slice(1);

            // Convierte el ID a un numero
            selectedPokemonID = parseInt(numeroID);

            // Llama a la función abrirModal
            abrirModal(selectedPokemonID);
        } else {
            // Manejo de errores
            console.error('Elemento numero-pokemon no encontrado.');
        }
    }
});

// Evento click para cerrar el modal, por el boton y por el fondo
document.querySelector('.close').addEventListener('click', cerrarModal);
document.querySelector('.pokedex-modal-ext').addEventListener('click', cerrarModal);

window.addEventListener('blur', () => { 
    setTimeout(() => { 
        document.title = '¡Hazte con todos!';
    }, 10000);
});

window.addEventListener('focus', () => {
    document.title = '¡Has vuelto, A por ellos!';
});

// Exportar las variables
export { selectedPokemonID, maxPokemons, cerrarModal };