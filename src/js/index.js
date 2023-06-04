import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

let currentRequestToken = null;

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}

function clearCatInfo() {
  while (catInfo.firstChild) {
    catInfo.removeChild(catInfo.firstChild);
  }
}

function populateBreedSelect(breeds) {
  breeds.forEach(breed => {
    let option = document.createElement('option');
    option.value = breed.id;
    option.innerHTML = breed.name;
    breedSelect.appendChild(option);
  });

  breedSelect.style.display = 'block';
}

async function fetchBreedsList() {
  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
  } catch {
    hideLoader();
    showError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  breedSelect.style.display = 'none';
  hideLoader();
  fetchBreedsList();

  breedSelect.addEventListener('change', async () => {
    const breedId = breedSelect.value;
    showLoader();
    clearCatInfo();

    const requestToken = {};
    currentRequestToken = requestToken;

    try {
      const cat = await fetchCatByBreed(breedId);
      if (requestToken === currentRequestToken) {
        hideLoader();
        cat.html = `
            <img src="${cat.imageUrl}" width="500">  
            <div>
                <h2>${cat.breed}</h2>
                <p>${cat.description}</p>
                <p><b>Temperament:</b>${cat.temperament}</p>
            </div>      
        `;
        catInfo.insertAdjacentHTML('afterbegin', cat.html);
      }
    } catch {
      if (requestToken === currentRequestToken) {
        hideLoader();
        showError();
      }
    }
  });
});
