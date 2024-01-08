const browser = document.querySelector('#browser');
const pokeCard = document.querySelector('#pokecard')
const pokeName = document.querySelector('#poke-name')
const pokeImgContainer = document.querySelector('#poke-img-container')
const pokeImg = document.querySelector('#poke-img')
const pokeId = document.querySelector('#poke-id')
const pokeHeightWeight = document.querySelector('#poke-height-weight')
const pokeTypes = document.querySelector('#poke-types')
const pokeStats = document.querySelector('#poke-stats')

const busquedaPokemon = (event) => {
    event.preventDefault();
    const { value } = event.target.browser;
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
}

const mostrarError = () => {
    pokeName.textContent = 'Pokémon no encontrado, inténtalo de nuevo';
    pokeImg.src = './assets/img/pokeshadow.png'; // Ruta a la imagen de fallo
    pokeId.textContent = '';
    pokeHeightWeight.textContent = '';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
}

const informacionPokemon = data => {
    const spritesFront = data.sprites.other["official-artwork"].front_default;
    const {name, id, height, weight, types, stats} = data;

    pokeName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    pokeImg.src = spritesFront;
    pokeId.textContent = `ID: #${id}`;
    pokeHeightWeight.textContent = `Height: ${height} in | Weight: ${weight} lb`;

    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.textContent = type.type.name;
        pokeTypes.appendChild(typeElement);
    });

    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        pokeStats.appendChild(statElement);
    });
}






