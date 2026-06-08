async function getPokemonInfo(nameOrId) {
            const url = `https://pokeapi.co/api/v2/pokemon/${String(nameOrId).toLowerCase()}`;

            try {
                const respuesta = await fetch(url);
                if (!respuesta.ok) throw new Error('Pokémon not found');

                const data = await respuesta.json();

                return {
                    pokedexNumber: data.id,
                    name: data.name,
                    types: data.types.map(t => t.type.name),
                    height: data.height,
                    weight: data.weight
                };
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        async function buscarPokemon() {
            const input = document.getElementById('buscador').value;
            const infoDiv = document.getElementById('pokemonInfo');

            if (!input) {
                infoDiv.innerHTML = '<p>Ingrese un pokémon o un número.</p>';
                return;
            }

            infoDiv.innerHTML = '<p>Buscando...</p>';

            const pokemon = await getPokemonInfo(input);

            if (pokemon) {
                infoDiv.innerHTML = `
                    <div class="card">
                        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                        <p><strong>Número de Pokédex:</strong> ${pokemon.pokedexNumber}</p>
                        <p><strong>Tipo(s):</strong> ${pokemon.types.join(', ')}</p>
                        <p><strong>Altura:</strong> ${pokemon.height} dm</p>
                        <p><strong>Peso:</strong> ${pokemon.weight} hg</p>
                    </div>
                `;
            } else {
                infoDiv.innerHTML = `<p>No se pudo encontrar "${input}". Revise su texto.</p>`;
            }
        }

        // Presionar Enter para buscar
        document.getElementById('buscador').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscarPokemon();
        });