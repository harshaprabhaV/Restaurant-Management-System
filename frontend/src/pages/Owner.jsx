
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Plus,
  Trash2,
  ShoppingBag,
  LogOut,
  LockKeyhole,
  UtensilsCrossed,
  ImagePlus,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { API_BASE_URL } from "../services/api";
import "./Owner.css";

const OWNER_PASSWORD = "Owner@123";

function Owner() {
  const navigate = useNavigate();

  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishCategory, setDishCategory] = useState("Main Course");
  const [dishImage, setDishImage] = useState("");
  const [dishDescription, setDishDescription] = useState("");

  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingDish, setSavingDish] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const endpoints = [
        `${API_BASE_URL}/food/`,
        `${API_BASE_URL}/owner/orders`,
        `${API_BASE_URL}/owner/bookings`,
        `${API_BASE_URL}/owner/dashboard`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url))
      );

      const results = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            throw new Error("Unable to load owner dashboard data.");
          }
          return response.json();
        })
      );

      setDishes(Array.isArray(results[0]) ? results[0] : []);
      setOrders(Array.isArray(results[1]) ? results[1] : []);
      setBookings(Array.isArray(results[2]) ? results[2] : []);
      setDashboard(results[3] || {});
    } catch (err) {
      setLoadError(
        "Could not load dashboard data. Check that Flask is running and the owner API routes are working."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unlocked) {
      loadDashboard();
    }
  }, [unlocked]);

  const handleUnlock = (event) => {
    event.preventDefault();
    if (locked) return;

    if (password === OWNER_PASSWORD) {
      setUnlocked(true);
      setError("");
      setPassword("");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setPassword("");

    if (nextAttempts >= 3) {
      setLocked(true);
      setError("Access locked after 3 incorrect attempts.");
    } else {
      setError(
        `Incorrect password. ${3 - nextAttempts} attempt(s) remaining.`
      );
    }
  };

  const handleAddDish = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!dishName.trim() || !dishPrice || Number(dishPrice) <= 0) {
      setNotice("Enter a valid dish name and price.");
      return;
    }

    setSavingDish(true);

    try {
      const response = await fetch(`${API_BASE_URL}/food/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dishName.trim(),
          price: Number(dishPrice),
          category: dishCategory,
          image_url: dishImage.trim(),
          description: dishDescription.trim(),
          is_available: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not add dish.");
      }

      setNotice("Dish added successfully!");
      setDishName("");
      setDishPrice("");
      setDishImage("");
      setDishDescription("");
      setDishCategory("Main Course");

      await loadDashboard();
    } catch (err) {
      setNotice(err.message || "Could not connect to the backend.");
    } finally {
      setSavingDish(false);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) {
      return;
    }

    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/food/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not delete dish.");
      }

      setNotice("Dish deleted successfully!");
      await loadDashboard();
    } catch (err) {
      setNotice(err.message || "Could not connect to the backend.");
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update order.");
      }

      setNotice("Order status updated!");
      await loadDashboard();
    } catch (err) {
      setNotice(err.message || "Could not update order status.");
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    setNotice(
      "Your current booking API supports cancellation only. To confirm bookings, we need to add a booking-status update route in the backend."
    );
  };

  const handleLogout = () => {
    setUnlocked(false);
    setPassword("");
    setNotice("");
    navigate("/");
  };

  const formatDate = (value) => {
    if (!value) return "Not available";
    return String(value);
  };

  const formatItems = (items) => {
    if (!Array.isArray(items)) return "Food order";
    return items
      .map((item) => `${item.name || "Item"} × ${item.quantity || 1}`)
      .join(", ");
  };

  if (!unlocked) {
    return (
      <main className="owner-lock-page">
        <Link to="/" className="owner-lock-brand">
          <UtensilsCrossed size={25} />
          Saffron & Sage
        </Link>

        <form className="owner-lock-card" onSubmit={handleUnlock}>
          <div className="owner-lock-icon">
            <LockKeyhole size={30} />
          </div>

          <span className="owner-eyebrow">RESTAURANT MANAGEMENT</span>
          <h1>Owner Access</h1>
          <p>Enter the owner password to manage your restaurant.</p>

          <label htmlFor="owner-password">Owner password</label>
          <input
            id="owner-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            disabled={locked}
            required
          />

          {error && <p className="owner-error">{error}</p>}

          <button className="owner-primary-button" disabled={locked}>
            {locked ? "Access Locked" : "Unlock Dashboard"}
          </button>

          {!locked && (
            <small>{3 - attempts} password attempt(s) remaining</small>
          )}

          <Link to="/" className="owner-back-link">
            Back to home
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="owner-dashboard">
      <header className="owner-topbar">
        <Link to="/" className="owner-brand">
          <UtensilsCrossed size={24} />
          Saffron & Sage
        </Link>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="owner-logout"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button className="owner-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Lock & Exit
          </button>
        </div>
      </header>

      <section className="owner-welcome">
        <span className="owner-eyebrow">OWNER CONTROL PANEL</span>
        <h1>Restaurant Dashboard</h1>
        <p>Manage your menu, customer orders and table reservations.</p>
      </section>

      {loadError && (
        <p className="owner-error" role="alert">
          {loadError}
        </p>
      )}

      {notice && (
        <p className="owner-message" role="status">
          {notice}
        </p>
      )}

      <section className="owner-stats">
        <article className="owner-stat-card">
          <ChefHat size={23} />
          <div>
            <span>Total Dishes</span>
            <strong>{dashboard.total_foods ?? dishes.length}</strong>
          </div>
        </article>

        <article className="owner-stat-card">
          <ShoppingBag size={23} />
          <div>
            <span>Customer Orders</span>
            <strong>{dashboard.total_orders ?? orders.length}</strong>
          </div>
        </article>

        <article className="owner-stat-card">
          <CalendarDays size={23} />
          <div>
            <span>Table Bookings</span>
            <strong>{dashboard.total_bookings ?? bookings.length}</strong>
          </div>
        </article>

        <article className="owner-stat-card">
          <ShoppingBag size={23} />
          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{Number(dashboard.total_revenue ?? 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </article>
      </section>

      <section className="owner-section">
        <div className="owner-section-heading">
          <div>
            <span className="owner-eyebrow">MENU MANAGEMENT</span>
            <h2>Add a new dish</h2>
          </div>
        </div>

        <form className="owner-dish-form" onSubmit={handleAddDish}>
          <div className="owner-form-grid">
            <div className="owner-field">
              <label htmlFor="dish-name">Dish name *</label>
              <input
                id="dish-name"
                value={dishName}
                onChange={(event) => setDishName(event.target.value)}
                placeholder="e.g. Chicken Biryani"
                required
              />
            </div>

            <div className="owner-field">
              <label htmlFor="dish-price">Price (₹) *</label>
              <input
                id="dish-price"
                type="number"
                min="1"
                step="0.01"
                value={dishPrice}
                onChange={(event) => setDishPrice(event.target.value)}
                placeholder="e.g. 250"
                required
              />
            </div>

            <div className="owner-field">
              <label htmlFor="dish-category">Category</label>
              <select
                id="dish-category"
                value={dishCategory}
                onChange={(event) => setDishCategory(event.target.value)}
              >
                <option>Main Course</option>
                <option>Starters</option>
                <option>Snacks</option>
                <option>Desserts</option>
                <option>Beverages</option>
                <option>Vegetarian</option>
              </select>
            </div>

            <div className="owner-field">
              <label htmlFor="dish-image">Image URL</label>
              <input
                id="dish-image"
                type="url"
                value={dishImage}
                onChange={(event) => setDishImage(event.target.value)}
                placeholder="Paste an image URL"
              />
            </div>

            <div className="owner-field owner-full-field">
              <label htmlFor="dish-description">Description</label>
              <textarea
                id="dish-description"
                value={dishDescription}
                onChange={(event) => setDishDescription(event.target.value)}
                placeholder="Describe the dish..."
                rows={3}
              />
            </div>
          </div>

          <button
            className="owner-primary-button"
            type="submit"
            disabled={savingDish}
          >
            <Plus size={18} />
            {savingDish ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </section>

      <section className="owner-section">
        <div className="owner-section-heading">
          <div>
            <span className="owner-eyebrow">YOUR RESTAURANT</span>
            <h2>Menu items ({dishes.length})</h2>
          </div>
        </div>

        {dishes.length === 0 ? (
          <div className="owner-empty-state">
            <ImagePlus size={30} />
            <h3>No dishes added yet</h3>
            <p>Add your first dish using the form above.</p>
          </div>
        ) : (
          <div className="owner-dish-grid">
            {dishes.map((dish) => {
              const image = dish.image_url || dish.image;

              return (
                <article className="owner-dish-card" key={dish.id}>
                  {image ? (
                    <img src={image} alt={dish.name} />
                  ) : (
                    <div className="owner-dish-placeholder">
                      <ChefHat size={32} />
                    </div>
                  )}

                  <div className="owner-dish-info">
                    <span className="owner-dish-category">
                      {dish.category}
                    </span>
                    <h3>{dish.name}</h3>
                    <p>{dish.description || "No description added."}</p>

                    <div className="owner-dish-bottom">
                      <strong>
                        ₹{Number(dish.price).toFixed(2)}
                      </strong>
                      <button
                        className="owner-delete-button"
                        onClick={() => handleDeleteDish(dish.id)}
                        aria-label={`Delete ${dish.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="owner-section owner-orders-section">
        <div className="owner-section-heading">
          <div>
            <span className="owner-eyebrow">CUSTOMER ACTIVITY</span>
            <h2>Customer orders ({orders.length})</h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="owner-empty-state">
            <ShoppingBag size={30} />
            <h3>No customer orders yet</h3>
            <p>New orders will appear here after customers order food.</p>
          </div>
        ) : (
          <div className="owner-orders-list">
            {orders.map((order, index) => (
              <article
                className="owner-order-card"
                key={order.id || index}
              >
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>{order.customer_email || "Customer"}</p>
                  <p>{formatItems(order.items)}</p>
                  <p>Status: {order.status || "pending"}</p>
                </div>

                <div>
                  <strong>
                    ₹{Number(order.total_amount || 0).toFixed(2)}
                  </strong>
                  <div style={{ marginTop: "10px" }}>
                    <label htmlFor={`order-status-${order.id}`}>
                      Update status
                    </label>
                    <select
                      id={`order-status-${order.id}`}
                      value={order.status || "pending"}
                      onChange={(event) =>
                        handleOrderStatus(order.id, event.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="owner-section">
        <div className="owner-section-heading">
          <div>
            <span className="owner-eyebrow">TABLE RESERVATIONS</span>
            <h2>Bookings ({bookings.length})</h2>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="owner-empty-state">
            <CalendarDays size={30} />
            <h3>No table bookings yet</h3>
            <p>Customer reservations will appear here.</p>
          </div>
        ) : (
          <div className="owner-orders-list">
            {bookings.map((booking) => (
              <article className="owner-order-card" key={booking.id}>
                <div>
                  <h3>{booking.customer_name}</h3>
                  <p>{booking.email}</p>
                  <p>
                    Date: {formatDate(booking.booking_date)} · Time:{" "}
                    {booking.booking_time}
                  </p>
                  <p>Guests: {booking.guests}</p>
                </div>
                <div>
                  <strong>
                    {(booking.status || "pending").toUpperCase()}
                  </strong>
                  <p>Booking #{booking.id}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="owner-footer">
        Saffron & Sage · Restaurant management
      </footer>
    </main>
  );
}

export default Owner;
