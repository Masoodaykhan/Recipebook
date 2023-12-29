const addRecipeBtn = document.getElementById('addRecipeBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementsByClassName('close')[0];
const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
let editing = false;
let recipes = [];

// Load recipes from localStorage on page load
window.addEventListener('load', () => {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
  }
});

addRecipeBtn.addEventListener('click', () => {
  editing = false;
  openModal();
});

closeBtn.addEventListener('click', closeModal);

recipeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (editing) {
    const editedRecipe = {
      id: recipeToEdit.id,
      name: document.getElementById('recipeName').value,
      ingredients: document.getElementById('ingredients').value,
      instructions: document.getElementById('instructions').value,
    };

    const index = recipes.findIndex(recipe => recipe.id === editedRecipe.id);
    if (index !== -1) {
      recipes[index] = editedRecipe;
      saveRecipesToLocalStorage();
      displayRecipes();
    }
  } else {
    const newRecipe = {
      id: generateUniqueId(),
      name: document.getElementById('recipeName').value,
      ingredients: document.getElementById('ingredients').value,
      instructions: document.getElementById('instructions').value,
    };

    recipes.push(newRecipe);
    saveRecipesToLocalStorage();
    displayRecipes();
  }

  closeModal();
});

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  recipeForm.reset();
}

function displayRecipes() {
  recipeList.innerHTML = '';

  recipes.forEach((recipe) => {
    const recipeElement = createRecipeElement(recipe);
    recipeList.appendChild(recipeElement);
  });

  addRecipeListeners();
}

function createRecipeElement(recipe) {
  const recipeElement = document.createElement('div');
  recipeElement.classList.add('recipe');
  recipeElement.setAttribute('data-id', recipe.id);
  recipeElement.innerHTML = `
    <h3>${recipe.name}</h3>
    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
    <button class="editBtn">Edit</button>
    <button class="deleteBtn">Delete</button>
  `;
  return recipeElement;
}

function addRecipeListeners() {
  const editButtons = document.querySelectorAll('.editBtn');
  const deleteButtons = document.querySelectorAll('.deleteBtn');

  editButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      editing = true;
      openModal();
      const recipeId = e.target.parentElement.getAttribute('data-id');
      recipeToEdit = recipes.find((recipe) => recipe.id === recipeId);
      populateForm(recipeToEdit);
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const recipeId = e.target.parentElement.getAttribute('data-id');
      recipes = recipes.filter((recipe) => recipe.id !== recipeId);
      saveRecipesToLocalStorage();
      displayRecipes();
    });
  });
}

function populateForm(recipe) {
  document.getElementById('recipeName').value = recipe.name;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('instructions').value = recipe.instructions;
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveRecipesToLocalStorage() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Fetch recipes from localStorage when the page loads
window.addEventListener('load', () => {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
  }
});