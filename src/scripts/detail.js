import 'regenerator-runtime';

document.addEventListener('DOMContentLoaded', function () {
  const favoriteButton = document.getElementById('favorite-button');
  const removeFavoriteButton = document.getElementById(
    'remove-favorite-button'
  );
  if (favoriteButton) {
    favoriteButton.removeEventListener('click', toggleFavorite);
    favoriteButton.addEventListener('click', toggleFavorite);
  }
  if (removeFavoriteButton) {
    removeFavoriteButton.removeEventListener('click', toggleRemoveFavorite);
    removeFavoriteButton.addEventListener('click', toggleRemoveFavorite);
  }
  renderRestaurantDetail();
});

async function renderRestaurantDetail() {
  try {
    const restaurantContainer = document.getElementById(
      'detail-restoran-detail'
    );
    if (!restaurantContainer) {
      console.error(
        'Element dengan ID detail-restoran-detail tidak ditemukan.'
      );
      return;
    }

    const restaurant = await fetchRestaurantDetail();

    if (restaurant.error) {
      restaurantContainer.innerHTML = `<p>${restaurant.message}</p>`;
      return;
    }

    const {
      id,
      name,
      pictureId,
      city,
      address,
      rating,
      description,
      categories,
      menus,
      customerReviews,
    } = restaurant;

    document.getElementById('restaurant-title').textContent = name;
    updateFavoriteButton(await isRestaurantFavorite(id));

    restaurantContainer.innerHTML = `
      <h1>${name}</h1>
      <div class="restaurant-detail">
        <img src="https://restaurant-api.dicoding.dev/images/medium/${pictureId}" alt="${name}" class="restaurant-img">
        <p class="restaurant-city">Kota: ${city}</p>
        <p class="restaurant-address">Alamat: ${address}</p>
        <p class="restaurant-rating">Rating: ${rating}</p>
        <p class="restaurant-description">${description}</p>
        <h3>Kategori</h3>
        <div class="btn-kategori">
          ${categories
            .map(
              (category) =>
                `<div class="btn-custom-kategori">${category.name}</div>`
            )
            .join('')}
        </div>
        <h3 class="text-center">Daftar Menu</h3>
        <div class="data-detail-menu">
          <div class="data-subdetail-menu">
            <h4 class="text-center">Makanan</h4>
            <ol class="restaurant-menus">
              ${menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
            </ol>
          </div>
          <div class="data-subdetail-menu">
            <h4 class="text-center">Minuman</h4>
            <ol class="restaurant-menus">
              ${menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
            </ol>
          </div>
        </div>
        <h3>Ulasan Pelanggan</h3>
        <ul class="customer-reviews">
          ${customerReviews
            .map(
              (review) => `
            <li>
              <p><strong>${review.name}</strong> (${review.date}):</p>
              <p>${review.review}</p>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    `;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    const restaurantContainer = document.getElementById(
      'detail-restoran-detail'
    );
    restaurantContainer.innerHTML = `<p>Terjadi kesalahan saat memuat detail restoran. Silakan coba lagi nanti.</p>`;
  }
}

async function toggleFavorite() {
  try {
    const restaurant = await fetchRestaurantDetail();
    const id = restaurant.id;

    if (updateFavoriteButton) {
      await addRestaurantToFavorites(restaurant);
      updateFavoriteButton(true);
      alert('Restoran ditambahkan ke favorit.');
    } else {
      await removeRestaurantFromFavorites(id);
      updateFavoriteButton(false);
      alert('Restoran dihapus dari favorit.');
    }
    updateFavoriteButton(await isRestaurantFavorite(id));
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    alert('Terjadi kesalahan saat memproses favorit.');
  }
}

async function toggleRemoveFavorite() {
  try {
    const restaurant = await fetchRestaurantDetail();
    const id = restaurant.id;

    if (updateFavoriteButton) {
      await removeRestaurantFromFavorites(id);
      alert('Restoran dihapus dari favorit.');
    } else {
      alert('Restoran tidak ada dalam daftar favorit.');
    }
    updateFavoriteButton(await isRestaurantFavorite(id));
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    alert('Terjadi kesalahan saat memproses favorit.');
  }
}

async function addRestaurantToFavorites(restaurant) {
  const db = await openDatabase();
  const tx = db.transaction('favorites', 'readwrite');
  const store = tx.objectStore('favorites');
  await store.add(restaurant);
}

async function removeRestaurantFromFavorites(id) {
  const db = await openDatabase();
  const tx = db.transaction('favorites', 'readwrite');
  const store = tx.objectStore('favorites');
  await store.delete(id);
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

function updateFavoriteButton(isFavorite) {
  const favoriteButton = document.getElementById('favorite-button');
  const removeFavoriteButton = document.getElementById(
    'remove-favorite-button'
  );

  if (isFavorite) {
    favoriteButton.style.display = 'none';
    removeFavoriteButton.style.display = 'block';
  } else {
    favoriteButton.style.display = 'block';
    removeFavoriteButton.style.display = 'none';
  }
}

async function fetchRestaurantDetail() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      return { error: true, message: 'ID tidak ditemukan di URL' };
    }

    const response = await fetch(
      `https://restaurant-api.dicoding.dev/detail/${id}`
    );

    if (!response.ok) {
      throw new Error('Gagal memuat detail restoran dari server.');
    }

    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      return { error: true, message: jsonResponse.message };
    }

    return jsonResponse.restaurant;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    alert('Terjadi kesalahan saat mengambil detail restoran.');
    return {
      error: true,
      message: 'Terjadi kesalahan saat mengambil detail restoran.',
    };
  }
}

async function isRestaurantFavorite(id) {
  const db = await openDatabase();
  const tx = db.transaction('favorites', 'readonly');
  const store = tx.objectStore('favorites');
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = function () {
      // Remove the unused event parameter
      resolve(!!request.result); // Use request.result directly
    };
    request.onerror = function () {
      // Remove the unused event parameter
      reject('Gagal memeriksa status favorit restoran.');
    };
  });
}
