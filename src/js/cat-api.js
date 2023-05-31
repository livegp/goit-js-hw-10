const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
    'live_fIBOmRW6XGvxkhsLVRvJbmxQWgE3xBi562zxeN10OeK5MdywZkR0TGFG2q7wXZzW';

async function fetchBreeds() {
    const url = `${BASE_URL}/breeds`;
    const params = {
        headers: {
            'x-api-key': API_KEY,
        },
    };

    try {
        const response = await fetch(url, params);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data.map(breed => {
            return {
                id: breed.id,
                name: breed.name,
            };
        });
    } catch (error) {
        return console.log(error);
    }
}

async function fetchCatByBreed(breedId) {
    const url = `${BASE_URL}/images/search?breed_ids=${breedId}`;
    const params = {
        headers: {
            'x-api-key': API_KEY,
        },
    };

    return fetch(url, params)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const cat = data[0];
                const breedInfo = cat.breeds[0];

                return {
                    imageUrl: cat.url,
                    breed: breedInfo.name,
                    description: breedInfo.description,
                    temperament: breedInfo.temperament,
                };
            } else {
                throw new Error('No cat found for the specified breed.');
            }
        })
        .catch(error => console.log(error));
}

export { fetchBreeds, fetchCatByBreed };
