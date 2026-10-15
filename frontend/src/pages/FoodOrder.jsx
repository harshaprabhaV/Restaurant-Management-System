import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Trash2,
  UtensilsCrossed,
  CheckCircle2,
} from "lucide-react";
import { API_BASE_URL } from "../services/api";
import "./FoodOrder.css";

const initialDishes = [
  {
    id: "demo-1",
    name: "Chicken Biryani",
    category: "Main Course",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900&auto=format&fit=crop&q=85",
    description: "Fragrant basmati rice with delicious chicken masala.",
    isVeg: false,
  },
  {
    id: "demo-2",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&auto=format&fit=crop&q=85",
    description: "Soft paneer in rich, creamy tomato gravy.",
    isVeg: true,
  },
  {
    id: "demo-3",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=900&auto=format&fit=crop&q=85",
    description: "Crispy dosa served with potato masala.",
    isVeg: true,
  },
  {
    id: "demo-4",
    name: "Chicken Tikka",
    category: "Starters",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900&auto=format&fit=crop&q=85",
    description: "Juicy chicken pieces with aromatic spices.",
    isVeg: false,
  },
  {
    id: "demo-5",
    name: "Fresh Fruit Salad",
    category: "Desserts",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=900&auto=format&fit=crop&q=85",
    description: "A refreshing mix of seasonal fruits.",
    isVeg: true,
  },
  {
    id: "demo-6",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85",
    description: "Rich chocolate brownie for your sweet cravings.",
    isVeg: true,
  },
];

const categories = [
  "All",
  "Main Course",
  "Breakfast",
  "Starters",
  "Desserts",
];

function FoodOrder() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [apiDishes, setApiDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Load the restaurant menu from Flask.
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/food/`);

        if (!response.ok) {
          throw new Error("Unable to load the restaurant menu.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid menu.");
        }

        setApiDishes(
          data.filter((dish) => dish.is_available !== false)
        );
        setMenuError("");
      } catch (error) {
        console.error("Menu loading error:", error);
        setMenuError(
          "Could not connect to the server. Showing sample dishes instead."
        );
      } finally {
        setLoadingDishes(false);
      }
    };

    fetchDishes();
  }, []);

  // Combine backend dishes with sample and locally saved owner dishes.
  const menu = useMemo(() => {
    const backendNames = new Set(
      apiDishes.map((dish) => dish.name.toLowerCase())
    );

    const backendMenu = apiDishes.map((dish) => ({
      ...dish,
      id: dish.id,
      image: dish.image_url || dish.image || "",
      description: dish.description || "Freshly prepared for you.",
      category: dish.category || "Main Course",
      isVeg: dish.isVeg ?? true,
    }));

    const sampleMenu = initialDishes
      .filter((dish) => !backendNames.has(dish.name.toLowerCase()))
      .map((dish) => ({
        ...dish,
        cartKey: dish.id,
      }));

    let ownerDishes = [];

    try {
      ownerDishes = JSON.parse(
        localStorage.getItem("saffron_dishes") || "[]"
      );
    } catch {
      ownerDishes = [];
    }

    const existingNames = new Set([
      ...backendNames,
      ...initialDishes.map((dish) => dish.name.toLowerCase()),
    ]);

    const extraOwnerDishes = ownerDishes
      .filter(
        (dish) =>
          dish.name &&
          !existingNames.has(dish.name.toLowerCase())
      )
      .map((dish, index) => ({
        ...dish,
        id: dish.id ?? `owner-${index}`,
        image: dish.image_url || dish.image || "",
        description: dish.description || "Freshly prepared for you.",
        category: dish.category || "Main Course",
        isVeg: dish.isVeg ?? true,
      }));

    return [...backendMenu, ...sampleMenu, ...extraOwnerDishes];
  }, [apiDishes]);

  const filteredDishes = menu.filter((dish) => {
    const query = search.toLowerCase();

    const matchesSearch =
      dish.name.toLowerCase().includes(query) ||
      (dish.description || "").toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || dish.category === category;

    return matchesSearch && matchesCategory;
  });

  const cartItems = menu
    .filter((dish) => (cart[dish.id] || 0) > 0)
    .map((dish) => ({
      ...dish,
      quantity: cart[dish.id],
    }));

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const updateQuantity = (id, amount) => {
    setCart((previous) => {
      const nextQuantity = (previous[id] || 0) + amount;
      const updated = { ...previous };

      if (nextQuantity <= 0) {
        delete updated[id];
      } else {
        updated[id] = nextQuantity;
      }

      return updated;
    });

    setMessage("");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || checkoutLoading) {
      return;
    }

    let savedUser = null;

    try {
      savedUser = JSON.parse(
        localStorage.getItem("saffron_user") || "null"
      );
    } catch {
      savedUser = null;
    }

    const email =
      savedUser?.email || savedUser?.user?.email || "";

    if (!email) {
      setMessage("Please sign in before placing your order.");
      return;
    }

    setCheckoutLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_email: email,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),
          total_amount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Unable to place your order."
        );
      }

      setCart({});
      setCartOpen(false);
      setMessage(
        `Order placed successfully! Order ID: ${data.order_id}`
      );
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="food-page">
      <header className="food-header">
        <Link to="/user" className="food-brand">
          <UtensilsCrossed size={24} />
          Saffron & Sage
        </Link>

        <div className="food-header-actions">
          <Link to="/user" className="food-dashboard-link">
            <ArrowLeft size={16} />
            Dashboard
          </Link>

          <button
            className="food-cart-button"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <ShoppingCart size={19} />
            Cart
            <span>{itemCount}</span>
          </button>
        </div>
      </header>

      <section className="food-hero">
        <div>
          <span className="food-eyebrow">
            FRESH FROM OUR KITCHEN
          </span>
          <h1>Good food. Great mood.</h1>
          <p>
            Find your favourites, add them to your cart, and enjoy
            something delicious today.
          </p>
        </div>
      </section>

      {message && (
        <div className="food-success-message" role="status">
          <CheckCircle2 size={19} />
          <span>{message}</span>
          <button onClick={() => setMessage("")}>Dismiss</button>
        </div>
      )}

      {menuError && (
        <div className="food-success-message" role="status">
          <span>{menuError}</span>
          <button onClick={() => setMenuError("")}>Dismiss</button>
        </div>
      )}

      <section className="food-content">
        <div className="food-menu-heading">
          <div>
            <span className="food-eyebrow">OUR MENU</span>
            <h2>Made with love</h2>
          </div>

          <div className="food-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search dishes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="food-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "food-category active"
                  : "food-category"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loadingDishes ? (
          <p>Loading menu...</p>
        ) : filteredDishes.length > 0 ? (
          <div className="food-grid">
            {filteredDishes.map((dish) => (
              <article className="food-card" key={dish.id}>
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} />
                ) : (
                  <div className="food-image-placeholder">
                    <UtensilsCrossed size={34} />
                  </div>
                )}

                <div className="food-card-content">
                  <div className="food-card-category">
                    <span
                      className={
                        dish.isVeg
                          ? "food-dot veg"
                          : "food-dot nonveg"
                      }
                    />
                    {dish.category}
                  </div>

                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>

                  <div className="food-card-bottom">
                    <strong>
                      ₹{Number(dish.price).toFixed(2)}
                    </strong>

                    {cart[dish.id] ? (
                      <div className="food-quantity">
                        <button
                          onClick={() => updateQuantity(dish.id, -1)}
                          aria-label={`Remove one ${dish.name}`}
                        >
                          <Minus size={15} />
                        </button>

                        <span>{cart[dish.id]}</span>

                        <button
                          onClick={() => updateQuantity(dish.id, 1)}
                          aria-label={`Add one ${dish.name}`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="food-add-button"
                        onClick={() => updateQuantity(dish.id, 1)}
                      >
                        <Plus size={16} /> Add
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="food-empty">
            <UtensilsCrossed size={35} />
            <h3>No dishes found</h3>
            <p>Try a different search or category.</p>
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

      {cartOpen && (
        <div
          className="food-cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="food-cart-panel"
            onClick={(event) => event.stopPropagation()}
            aria-label="Shopping cart"
          >
            <div className="food-cart-heading">
              <div>
                <span className="food-eyebrow">
                  YOUR SELECTION
                </span>
                <h2>Your Cart ({itemCount})</h2>
              </div>

              <button
                className="food-cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="food-cart-empty">
                <ShoppingCart size={36} />
                <h3>Your cart is empty</h3>
                <p>Add a few dishes to get started.</p>
                <button onClick={() => setCartOpen(false)}>
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="food-cart-items">
                  {cartItems.map((item) => (
                    <div className="food-cart-item" key={item.id}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="food-cart-placeholder">
                          <UtensilsCrossed size={20} />
                        </div>
                      )}

                      <div className="food-cart-item-info">
                        <h3>{item.name}</h3>
                        <p>
                          ₹{Number(item.price).toFixed(2)} ×{" "}
                          {item.quantity}
                        </p>

                        <div className="food-quantity">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, -1)
                            }
                            aria-label={`Remove one ${item.name}`}
                          >
                            <Minus size={13} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, 1)
                            }
                            aria-label={`Add one ${item.name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="food-cart-item-end">
                        <strong>
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </strong>

                        <button
                          className="food-remove-item"
                          onClick={() => {
                            setCart((previous) => {
                              const updated = { ...previous };
                              delete updated[item.id];
                              return updated;
                            });
                          }}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="food-cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{subtotal.toFixed(2)}</strong>
                  </div>

                  <div>
                    <span>Delivery fee</span>
                    <strong>₹{deliveryFee.toFixed(2)}</strong>
                  </div>

                  <div className="food-cart-total">
                    <span>Total</span>
                    <strong>₹{total.toFixed(2)}</strong>
                  </div>

                  <button
                    className="food-checkout-button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading
                      ? "Placing Order..."
                      : `Place Order · ₹${total.toFixed(2)}`}
                  </button>

                  <p>Demo checkout — payment is not collected.</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <footer className="food-footer">
        Saffron & Sage · Every meal tells a story.
      </footer>
    </main>
  );
}

export default FoodOrder;