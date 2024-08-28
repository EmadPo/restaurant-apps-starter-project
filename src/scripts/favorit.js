import 'regenerator-runtime';

document.addEventListener('DOMContentLoaded', async () => {
  const restaurantContainer = document.getElementById(
    'daftar-restoran-favorit'
  );

  if (
    restaurantContainer &&
    !restaurantContainer.hasAttribute('data-rendered')
  ) {
    restaurantContainer.setAttribute('data-rendered', 'true');
    await renderFavoriteRestaurants();
  }
});

async function renderFavoriteRestaurants() {
  const restaurantContainer = document.getElementById(
    'daftar-restoran-favorit'
  );

  if (!restaurantContainer) {
    console.error("Element with id 'daftar-restoran-favorit' not found.");
    return;
  }

  restaurantContainer.innerHTML = '';

  const db = await openDatabase();
  const tx = db.transaction('favorites', 'readonly');
  const store = tx.objectStore('favorites');

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const restaurant = cursor.value;
      const { id, name, city, rating, description, pictureId } = restaurant;

      const restaurantElement = document.createElement('div');
      restaurantElement.classList.add('card');

      restaurantElement.innerHTML = `
          <div class="card">
            <img src="https://restaurant-api.dicoding.dev/images/medium/${pictureId}" alt="${name}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">Kota: ${city}</p>
              <p class="card-text">Rating: ${rating}</p>
              <p class="card-text">${description}</p>
            </div>
            <div class="btn-detail">
              <a class="btn-custom" data-id="${id}" href="#">Detail</a>
            </div>
          </div>
        `;

      restaurantElement
        .querySelector('.btn-custom')
        .addEventListener('click', () => redirectToDetailPage(id));
      restaurantContainer.appendChild(restaurantElement);
      cursor.continue();
    }
  };
}

async function redirectToDetailPage(restaurantId) {
  window.location.href = `detail.html?id=${restaurantId}`;
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('restaurant-favorites', 1);
    request.onerror = () => reject('Gagal membuka database');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('favorites', { keyPath: 'id' });
    };
  });
}
