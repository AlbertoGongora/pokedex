const pokeCard = document.querySelector('#pokecard')
const pokeName = document.querySelector('#poke-name')
const pokeImgContainer = document.querySelector('#poke-img-container')
const pokeImg = document.querySelector('#poke-img')
const pokeId = document.querySelector('#poke-id')
const pokeHeightWeight = document.querySelector('#poke-height-weight')
const pokeTypes = document.querySelector('#poke-types')
const pokeStats = document.querySelector('#poke-stats')

const busquedaPokemon = event => { 
    event.preventDefault();
    const {nombrePokemon} = event.target.browser
    fetch(`http://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`)
        .then(data => data.json())
        .then(response => informacionPokemon(response))
} 


const informacionPokemon = data => { 
    const sprite = data.sprite.front_default;
    const {stats, types} = data;
    console.log(data);
}

console.log(informacionPokemon);






