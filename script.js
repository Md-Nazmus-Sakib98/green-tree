let allPlants = [];

const loadPosts = () => {
  fetch('https://openapi.programming-hero.com/api/plants')
    .then(res => res.json())
    .then(data => {
      allPlants = data.plants;
      displayPosts(allPlants);
      loadCategory(); // Load categories after posts
    });
};

const displayPosts = (posts) => {
  const plantContainer = document.getElementById('plant-container');
  plantContainer.innerHTML = '';

  posts.forEach(post => {
    const plantCard = document.createElement('div');
    plantCard.className = 'plant-card p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition';
    plantCard.setAttribute('data-id', post.id);

    plantCard.innerHTML = `
      <img src="${post.image}" alt="${post.name}" class="w-full h-40 object-cover rounded" />
      <h2 class="text-lg font-semibold mt-2">${post.name}</h2>
      <p class="text-sm text-gray-600">${post.description}</p>
      <div class="mt-2">
        <h3 class="text-sm font-medium text-green-700">${post.category}</h3>
        <span class="text-sm">৳${post.price}</span>
      </div>
      <div class="mt-3">
        <button class="add-to-cart bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
          Add To Cart
        </button>
      </div>
    `;

    plantContainer.appendChild(plantCard);
  });
};

const loadCategory = () => {
  fetch('https://openapi.programming-hero.com/api/categories')
    .then(res => res.json())
    .then(data => {
      displayCategories(data.categories);
    });
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById('categories-sidebar');
  categoryContainer.innerHTML = '<h3 class="text-lg font-semibold mb-4">Categories</h3>';
  const ul = document.createElement('ul');
  ul.id = 'category-list';
  ul.className = 'text-gray-700 space-y-1';

  // Add "All" button
  const allBtn = document.createElement('li');
  allBtn.innerHTML = `
    <button class="category-button p-2 w-full text-left rounded bg-green-700 text-white">All</button>
  `;
  ul.appendChild(allBtn);
  allBtn.querySelector('button').addEventListener('click', () => {
    displayPosts(allPlants);
    document.getElementById('cart').classList.remove('hidden');
    highlightActiveCategory(allBtn.querySelector('button'));
  });

  categories.forEach(category => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="category-button p-2 w-full text-left rounded hover:bg-green-600 transition"
        data-name="${category.category_name}">
        ${category.category_name}
      </button>
    `;
    ul.appendChild(li);

    const btn = li.querySelector('button');
    btn.addEventListener('click', () => {
      const selectedName = btn.getAttribute('data-name');
      const filtered = allPlants.filter(plant => plant.category === selectedName);
      displayPosts(filtered);
      highlightActiveCategory(btn);
      document.getElementById('cart').classList.add('hidden');
    });
  });

  categoryContainer.appendChild(ul);
};

const highlightActiveCategory = (activeBtn) => {
  document.querySelectorAll('.category-button').forEach(btn => {
    btn.classList.remove('bg-green-700', 'text-white');
  });
  if (activeBtn) {
    activeBtn.classList.add('bg-green-700', 'text-white');
  }
};

// Add to cart
const addToCart = (itemName, itemPrice) => {
  const cartList = document.querySelector('#cart ul');

  const li = document.createElement('li');
  li.className = 'border-b border-gray-200 pb-2 mb-2';

  li.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <span class="font-medium">${itemName}</span>
        <div class="text-sm text-gray-600">৳${itemPrice}</div>
      </div>
      <button class="remove-from-cart text-red-600 hover:underline text-xl">×</button>
    </div>
  `;

  li.querySelector('.remove-from-cart').addEventListener('click', () => {
    li.remove();
    updateCartTotal();
  });

  cartList.appendChild(li);
  updateCartTotal();
};

const updateCartTotal = () => {
  const cartList = document.querySelector('#cart ul');
  const totalElement = document.getElementById('cart-total');

  let total = 0;
  [...cartList.children].forEach(li => {
    const priceText = li.querySelector('.text-sm')?.textContent || "৳0";
    const match = priceText.match(/৳(\d+)/);
    if (match) {
      total += parseInt(match[1]);
    }
  });

  totalElement.textContent = `৳${total}`;
};

// Handle add to cart
document.getElementById('plant-container').addEventListener('click', function (e) {
  const card = e.target.closest('.plant-card');
  if (!card) return;

  if (e.target.classList.contains('add-to-cart')) {
    const name = card.querySelector('h2').textContent;
    const price = card.querySelector('span').textContent.replace('৳', '');
    addToCart(name, price);
  } else {
    // Handle plant details fetch
    const plantId = card.getAttribute('data-id');
    fetch(`https://openapi.programming-hero.com/api/plant/${plantId}`)
      .then(res => res.json())
      .then(data => {
        const plant = data.plant;
        alert(`
          🌿 ${plant.name}
          🏷️ Category: ${plant.category}
          💰 Price: ৳${plant.price}
          📄 Description: ${plant.description}
        `);
      });
  }
});

// Initial load
loadPosts();

console.log("Card clicked, id:", plantId);
fetch("https://openapi.programming-hero.com/api/plant/${id}")
  .then(res => {
    console.log("Detail fetch status:", res.status);
    return res.json();
  })
  .then(data => {
    console.log("Plant detail data:", data);
    showPlantDetails(data.plant);
  })
  .catch(err => {
    console.error("Error fetching details:", err);
  });