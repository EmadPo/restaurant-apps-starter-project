async function fetchRestaurants() {
  try {
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    const jsonResponse = await response.json();
    return jsonResponse.restaurants;
  } catch (error) {
    console.error('Error saat melakukan fetch data:', error);
    alert('Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.');
    return null;
  }
}

async function renderRestaurants() {
  try {
    const restaurantContainer = document.getElementById('daftar-restoran');
    const restaurants = await fetchRestaurants();

    if (!restaurants) {
      restaurantContainer.innerHTML = '<p>Error fetching data</p>';
      displayErrorNotification('Data tidak ditemukan');
      return;
    }

    restaurantContainer.innerHTML = '';

    restaurants.forEach((restaurant) => {
      const { id, name, pictureId, city, rating, description } = restaurant;

      const restaurantElement = document.createElement('div');
      restaurantElement.classList.add('card');

      restaurantElement.innerHTML = `
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
      `;

      restaurantElement
        .querySelector('.btn-custom')
        .addEventListener('click', redirectToDetailPage);
      restaurantContainer.appendChild(restaurantElement);
    });

    removeErrorNotification();
  } catch {
    return null;
  }
}

function displayErrorNotification(message, error) {
  console.error(message, error); // Menampilkan error di konsol untuk debug
  const errorNotification = document.createElement('div');
  errorNotification.classList.add('error-notification');
  errorNotification.textContent =
    message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.';

  document.body.appendChild(errorNotification);
}

function removeErrorNotification() {
  const errorNotification = document.querySelector('.error-notification');

  if (errorNotification) {
    errorNotification.remove();
  }
}

function redirectToDetailPage(event) {
  event.preventDefault(); // Prevent default link behavior
  const id = event.target.getAttribute('data-id');
  window.location.href = `detail.html?id=${id}`;
}

document.querySelectorAll('.nav-line').forEach((link) => {
  link.addEventListener('click', function (event) {
    event.preventDefault();

    const url = this.getAttribute('href');

    window.location.href = url;
  });
});

document.addEventListener('DOMContentLoaded', function () {
  renderRestaurants();
});
