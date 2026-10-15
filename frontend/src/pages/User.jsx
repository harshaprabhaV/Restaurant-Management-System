
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Clock,
  LogOut,
  ShoppingBag,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";
import "./User.css";

const features = [
  {
    title: "Order Food",
    description: "Explore the menu and order your favourite dishes.",
    icon: ShoppingBag,
    link: "/food-order",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&auto=format&fit=crop&q=85",
  },
  {
    title: "Book a Table",
    description: "Reserve your preferred table for a special occasion.",
    icon: CalendarDays,
    link: "/table-booking",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&auto=format&fit=crop&q=85",
  },
  {
    title: "Explore Recipes",
    description: "Discover recipes and learn how your favourites are made.",
    icon: ChefHat,
    link: "/recipes",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop&q=85",
  },
];

function User() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("saffron_user") || "null");
  const userName = savedUser?.name || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("saffron_token");
    navigate("/login");
  };

  const orders = JSON.parse(localStorage.getItem("saffron_orders") || "[]");

  return (
    <main className="user-dashboard">
      <header className="user-topbar">
        <Link to="/" className="user-brand">
          <UtensilsCrossed size={24} />
          <span>Saffron & Sage</span>
        </Link>

        <div className="user-top-actions">
          <Link to="/profile" className="user-profile-link">
            <UserRound size={17} />
            Profile
          </Link>
          <button className="user-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="user-welcome">
        <div>
          <span className="user-eyebrow">YOUR DINING SPACE</span>
          <h1>Welcome back, {userName.split(" ")[0]}!</h1>
          <p>Good food, good mood. What would you like today?</p>
        </div>

        <div className="user-welcome-icon">
          <UtensilsCrossed size={35} />
        </div>
      </section>

      <section className="user-features">
        <div className="user-section-heading">
          <div>
            <span className="user-eyebrow">EXPLORE</span>
            <h2>What are you craving?</h2>
          </div>
          <Link to="/" className="user-home-link">
            Visit home <ArrowRight size={15} />
          </Link>
        </div>

        <div className="user-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="user-feature-card" key={feature.title}>
                <img src={feature.image} alt={feature.title} />
                <div className="user-feature-content">
                  <span className="user-feature-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={feature.link} className="user-feature-link">
                    Explore <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="user-activity">
        <div className="user-section-heading">
          <div>
            <span className="user-eyebrow">YOUR ACTIVITY</span>
            <h2>Recent food orders</h2>
          </div>
          <Clock size={22} className="user-activity-icon" />
        </div>

        {orders.length > 0 ? (
          <div className="user-order-list">
            {orders.slice(0, 5).map((order, index) => (
              <div className="user-order-item" key={order.id || index}>
                <div className="user-order-symbol">
                  <ShoppingBag size={20} />
                </div>
                <div className="user-order-details">
                  <h3>{order.name || "Food order"}</h3>
                  <p>{order.date || "Recently ordered"}</p>
                </div>
                <span className="user-order-price">
                  ₹{Number(order.price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="user-empty-orders">
            <div className="user-empty-icon">
              <ShoppingBag size={28} />
            </div>
            <h3>No orders yet</h3>
            <p>Your delicious journey starts with your first order.</p>
            <button onClick={() => navigate("/food-order")}>
              Browse Menu <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>

      <footer className="user-footer">
        <span>Saffron & Sage</span>
        <p>Made for memorable meals.</p>
      </footer>
    </main>
  );
}

export default User;
