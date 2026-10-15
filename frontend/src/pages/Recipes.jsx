
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Search,
  UtensilsCrossed,
  X,
} from "lucide-react";
import "./Recipes.css";

const recipes = [
  {
    id: 1,
    name: "Chicken Biryani",
    category: "Main Course",
    time: "50 mins",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAeM--kcAn8g8dvZYNLyZM6el8YPgyMvIZDroYe-OpPP2u_Y3widj8CSQ&s",
    description: "Aromatic basmati rice layered with spiced chicken.",
    ingredients: [
      "500 g chicken",
      "2 cups basmati rice",
      "2 onions, sliced",
      "2 tomatoes",
      "Ginger-garlic paste",
      "Biryani masala",
      "Mint and coriander",
      "Curd, oil and salt",
    ],
    steps: [
      "Wash and soak the basmati rice for 20 minutes.",
      "Marinate chicken with curd, spices and ginger-garlic paste.",
      "Fry onions until golden, then cook the chicken with tomatoes and herbs.",
      "Boil rice until it is about 70% cooked and drain.",
      "Layer rice over the chicken, cover and cook on low heat until done.",
      "Gently mix and serve hot with raita.",
    ],
  },
  {
    id: 2,
    name: "Masala Dosa",
    category: "Vegetarian",
    time: "30 mins",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=900&auto=format&fit=crop&q=85",
    description: "Crispy dosa filled with flavourful potato masala.",
    ingredients: [
      "Dosa batter",
      "3 boiled potatoes",
      "1 onion",
      "Mustard seeds",
      "Curry leaves",
      "Turmeric and salt",
      "Oil",
    ],
    steps: [
      "Heat oil and splutter mustard seeds with curry leaves.",
      "Add sliced onion and cook until soft.",
      "Add mashed potatoes, turmeric and salt.",
      "Spread dosa batter thinly on a hot pan.",
      "Drizzle oil, cook until crisp and add potato masala.",
      "Fold and serve with chutney and sambar.",
    ],
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    category: "Vegetarian",
    time: "35 mins",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&auto=format&fit=crop&q=85",
    description: "Soft paneer in a creamy tomato-based curry.",
    ingredients: [
      "250 g paneer",
      "3 tomatoes",
      "1 onion",
      "Ginger-garlic paste",
      "Butter",
      "Cream",
      "Garam masala",
      "Salt and chilli powder",
    ],
    steps: [
      "Cook chopped onion and tomatoes with ginger-garlic paste.",
      "Cool and blend the mixture into a smooth puree.",
      "Heat butter and add the puree with spices.",
      "Simmer until the gravy thickens.",
      "Add paneer cubes and cook gently for a few minutes.",
      "Finish with cream and serve with roti or rice.",
    ],
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "Desserts",
    time: "40 mins",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85",
    description: "Rich chocolate brownies with a soft, fudgy centre.",
    ingredients: [
      "100 g dark chocolate",
      "100 g butter",
      "3/4 cup sugar",
      "2 eggs",
      "1/2 cup flour",
      "2 tbsp cocoa powder",
      "1 tsp vanilla extract",
    ],
    steps: [
      "Preheat the oven to 175°C.",
      "Melt chocolate and butter together, then cool slightly.",
      "Whisk eggs and sugar until combined.",
      "Mix in the melted chocolate and vanilla.",
      "Fold in flour and cocoa powder without overmixing.",
      "Bake in a lined tin for approximately 20–25 minutes, then cool before slicing.",
    ],
  },
  {
    id: 5,
    name: "Fresh Fruit Salad",
    category: "Desserts",
    time: "10 mins",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=900&auto=format&fit=crop&q=85",
    description: "A refreshing bowl of seasonal fruits.",
    ingredients: [
      "1 apple",
      "1 banana",
      "1 cup grapes",
      "1 orange",
      "1 cup watermelon",
      "Lemon juice",
      "Honey (optional)",
    ],
    steps: [
      "Wash all fruits thoroughly.",
      "Peel and cut fruits into bite-sized pieces.",
      "Combine the fruits in a bowl.",
      "Add a little lemon juice and honey if desired.",
      "Toss gently and serve fresh.",
    ],
  },
  {
    id: 6,
    name: "Chicken Tikka",
    category: "Starters",
    time: "45 mins",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900&auto=format&fit=crop&q=85",
    description: "Spiced, marinated chicken pieces cooked until smoky.",
    ingredients: [
      "500 g boneless chicken",
      "1/2 cup thick curd",
      "Ginger-garlic paste",
      "Chilli powder",
      "Garam masala",
      "Lemon juice",
      "Salt and oil",
    ],
    steps: [
      "Cut chicken into even-sized pieces.",
      "Mix curd, spices, ginger-garlic paste, lemon juice and salt.",
      "Coat the chicken and marinate in the refrigerator for at least 30 minutes.",
      "Thread onto skewers or arrange on a baking tray.",
      "Grill until cooked through, turning occasionally.",
      "Serve hot with lemon wedges and mint chutney.",
    ],
  },
];

const categories = [
  "All",
  "Main Course",
  "Vegetarian",
  "Starters",
  "Desserts",
];

function Recipes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.some((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      category === "All" || recipe.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="recipes-page">
      <header className="recipes-header">
        <Link to="/user" className="recipes-brand">
          <UtensilsCrossed size={24} />
          Saffron & Sage
        </Link>
        <Link to="/user" className="recipes-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <section className="recipes-hero">
        <span className="recipes-eyebrow">FROM OUR KITCHEN</span>
        <h1>Discover recipes worth sharing.</h1>
        <p>
          Find inspiration, explore ingredients and bring delicious meals
          to your own kitchen.
        </p>
      </section>

      <section className="recipes-content">
        <div className="recipes-toolbar">
          <div className="recipes-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search dishes or ingredients..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search recipes"
            />
          </div>

          <div className="recipes-count">
            {filteredRecipes.length} recipes
          </div>
        </div>

        <div className="recipes-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "recipes-category active"
                  : "recipes-category"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <div className="recipe-image-wrap">
                  <img src={recipe.image} alt={recipe.name} />
                  <span className="recipe-category-tag">
                    {recipe.category}
                  </span>
                </div>

                <div className="recipe-card-content">
                  <div className="recipe-time">
                    <Clock size={15} /> {recipe.time}
                  </div>

                  <h2>{recipe.name}</h2>
                  <p>{recipe.description}</p>

                  <button
                    className="recipe-view-button"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View recipe <ChefHat size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="recipes-empty">
            <ChefHat size={35} />
            <h2>No recipes found</h2>
            <p>Try another dish name, ingredient or category.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {selectedRecipe && (
        <div
          className="recipe-modal-overlay"
          onClick={() => setSelectedRecipe(null)}
        >
          <section
            className="recipe-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="recipe-modal-close"
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe"
            >
              <X size={21} />
            </button>

            <img
              className="recipe-modal-image"
              src={selectedRecipe.image}
              alt={selectedRecipe.name}
            />

            <div className="recipe-modal-content">
              <span className="recipes-eyebrow">
                {selectedRecipe.category} · {selectedRecipe.time}
              </span>
              <h2 id="recipe-modal-title">{selectedRecipe.name}</h2>
              <p>{selectedRecipe.description}</p>

              <h3>Ingredients</h3>
              <ul className="recipe-ingredients">
                {selectedRecipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>

              <h3>Cooking instructions</h3>
              <ol className="recipe-steps">
                {selectedRecipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      )}

      <footer className="recipes-footer">
        Saffron & Sage · Cook something memorable.
      </footer>
    </main>
  );
}

export default Recipes;
