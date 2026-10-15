
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Star,
} from "lucide-react";
import Navbar from "./Navbar";
import "./Home.css";

const biryaniImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAeM--kcAn8g8dvZYNLyZM6el8YPgyMvIZDroYe-OpPP2u_Y3widj8CSQ&s";

const dishes = [
  {
    name: "Chicken Biryani",
    category: "INDIAN FAVOURITE",
    price: 249,
    image: biryaniImage,
  },
  {
    name: "Paneer Butter Masala",
    category: "NORTH INDIAN",
    price: 219,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&auto=format&fit=crop&q=85",
  },
  {
    name: "Margherita Pizza",
    category: "ITALIAN CLASSIC",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&auto=format&fit=crop&q=85",
  },
];

const categories = [
  { name: "Indian", emoji: "🍛" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Drinks", emoji: "🥤" },
];

function Home() {
  return (
    <div className="home-shell">
      <Navbar />

      <main className="home-page">
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-eyebrow">
              <UtensilsCrossed size={16} />
              GOOD FOOD, BEAUTIFUL MOMENTS
            </span>

            <h1>
              Every meal tells
              <br />
              <span>a beautiful story.</span>
            </h1>

            <p>
              Discover thoughtfully prepared dishes, timeless flavours,
              and unforgettable moments at Saffron & Sage.
            </p>

            <div className="home-hero-actions">
              <Link to="/food-order" className="home-btn home-btn-primary">
                Explore Our Menu <ArrowRight size={18} />
              </Link>

              <Link to="/table-booking" className="home-btn home-btn-outline">
                Book a Table
              </Link>
            </div>

            <div className="home-highlights">
              <div>
                <strong>Fresh</strong>
                <span>Quality ingredients</span>
              </div>

              <div>
                <strong>Made with care</strong>
                <span>Every single dish</span>
              </div>
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src={biryaniImage}
              alt="Chicken biryani"
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900&auto=format&fit=crop&q=85";
              }}
            />

            <div className="home-image-note">
              <span>✦ TODAY'S FAVOURITE</span>
              <strong>Chicken Biryani</strong>
              <small>Rich flavour. Beautifully prepared.</small>
            </div>

            <div className="home-rating">
              <Star size={17} fill="currentColor" />
              <span>Made with love</span>
            </div>
          </div>
        </section>

        <section className="home-categories">
          <div className="home-section-heading">
            <div>
              <span className="home-section-label">EXPLORE YOUR CRAVINGS</span>
              <h2>What sounds delicious?</h2>
              <p>A little something for every craving.</p>
            </div>

            <Link to="/food-order" className="home-text-link">
              View all dishes <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-category-grid">
            {categories.map((category) => (
              <Link
                to="/food-order"
                className="home-category-card"
                key={category.name}
              >
                <span className="home-category-emoji">{category.emoji}</span>
                <strong>{category.name}</strong>
                <span className="home-category-arrow">
                  <ArrowRight size={17} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-popular">
          <div className="home-section-heading">
            <div>
              <span className="home-section-label">LOVED BY FOOD LOVERS</span>
              <h2>Our popular dishes</h2>
              <p>Good ingredients. Wonderful flavours. Happy moments.</p>
            </div>

            <Link to="/food-order" className="home-text-link">
              Full menu <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-dish-grid">
            {dishes.map((dish) => (
              <article className="home-dish-card" key={dish.name}>
                <Link to="/food-order" className="home-dish-image">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                  />
                </Link>

                <div className="home-dish-info">
                  <span className="home-dish-category">{dish.category}</span>
                  <h3>{dish.name}</h3>

                  <div className="home-dish-bottom">
                    <strong>₹{dish.price}</strong>

                    <Link
                      to="/food-order"
                      aria-label={`Order ${dish.name}`}
                    >
                      <ArrowRight size={19} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-experience">
          <div className="home-experience-icon">
            <ChefHat size={36} />
          </div>

          <div className="home-experience-content">
            <span className="home-section-label">MORE THAN JUST A MEAL</span>
            <h2>Bring the joy of cooking into your home.</h2>
            <p>
              Explore recipes, discover new flavours, and make something
              delicious with our step-by-step recipe collection.
            </p>

            <Link to="/recipes" className="home-btn home-btn-primary">
              Explore Recipes <ArrowRight size={18} />
            </Link>
          </div>

          <div className="home-experience-time">
            <Clock size={21} />
            <span>Find your next favourite recipe</span>
          </div>
        </section>

        <section className="home-booking">
          <div>
            <span className="home-section-label">YOUR TABLE IS WAITING</span>
            <h2>Good food is even better together.</h2>
            <p>
              Planning a dinner or a special occasion? Reserve your table.
            </p>
          </div>

          <Link to="/table-booking" className="home-btn home-btn-light">
            Reserve Your Table <ArrowRight size={18} />
          </Link>
        </section>

        <footer className="home-footer">
          <Link to="/" className="home-footer-brand">
            Saffron <span>& Sage</span>
          </Link>
          <p>Thoughtful food. Beautiful moments.</p>
          <span>© {new Date().getFullYear()} Saffron & Sage</span>
        </footer>
      </main>
    </div>
  );
}

export default Home;
