
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";
import { API_BASE_URL } from "../services/api";
import "./TableBooking.css";

const initialForm = {
  name: "",
  phone: "",
  date: "",
  time: "19:00",
  guests: "2",
  occasion: "Regular Dining",
  requests: "",
};

function TableBooking() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.date < minDate) {
      setMessage("Please select today or a future date.");
      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("saffron_user") || "null"
    );

    const email = savedUser?.email || savedUser?.user?.email;

    if (!email) {
      setMessage("Please sign in before booking your table.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          email,
          booking_date: form.date,
          booking_time: form.time,
          guests: Number(form.guests),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Unable to create booking."
        );
      }

      setMessage(
        `Booking request submitted successfully! ${
          data.booking_id || data.id
            ? `Booking ID: ${data.booking_id || data.id}`
            : ""
        }`
      );
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Please check whether Flask is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <header className="booking-header">
        <Link to="/user" className="booking-brand">
          <UtensilsCrossed size={24} />
          Saffron & Sage
        </Link>
        <Link to="/user" className="booking-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <section className="booking-hero">
        <div className="booking-hero-image" />
        <div className="booking-hero-content">
          <span className="booking-eyebrow">YOUR TABLE AWAITS</span>
          <h1>Make it a meal to remember.</h1>
          <p>
            Plan your visit, bring your favourite people, and let us take
            care of the dining experience.
          </p>
        </div>
      </section>

      <section className="booking-content">
        <div className="booking-intro">
          <span className="booking-eyebrow">RESERVATIONS</span>
          <h2>Reserve your table</h2>
          <p>Share your details and preferred dining time below.</p>

          <div className="booking-benefit">
            <CalendarDays size={21} />
            <div>
              <h3>Choose your date</h3>
              <p>Pick the day that works for you.</p>
            </div>
          </div>

          <div className="booking-benefit">
            <Clock size={21} />
            <div>
              <h3>Choose your time</h3>
              <p>Select your preferred arrival time.</p>
            </div>
          </div>

          <div className="booking-benefit">
            <Users size={21} />
            <div>
              <h3>Bring your people</h3>
              <p>Tell us how many guests are joining.</p>
            </div>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-form-heading">
            <h2>Booking details</h2>
            <p>Fields marked * are required.</p>
          </div>

          <div className="booking-fields">
            <div className="booking-field">
              <label htmlFor="booking-name">Full name *</label>
              <input
                id="booking-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="booking-phone">Phone number *</label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                title="Enter a 10-digit mobile number"
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="booking-date">Date *</label>
              <input
                id="booking-date"
                name="date"
                type="date"
                min={minDate}
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="booking-time">Preferred time *</label>
              <select
                id="booking-time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              >
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
            </div>

            <div className="booking-field">
              <label htmlFor="booking-guests">Number of guests *</label>
              <select
                id="booking-guests"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                  <option key={count} value={String(count)}>
                    {count} {count === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-field">
              <label htmlFor="booking-occasion">Occasion</label>
              <select
                id="booking-occasion"
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
              >
                <option>Regular Dining</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Family Gathering</option>
                <option>Business Meeting</option>
                <option>Other Celebration</option>
              </select>
            </div>

            <div className="booking-field booking-full-field">
              <label htmlFor="booking-requests">
                Special requests (optional)
              </label>
              <textarea
                id="booking-requests"
                name="requests"
                value={form.requests}
                onChange={handleChange}
                placeholder="Window seat, celebration arrangements..."
                rows={3}
              />
            </div>
          </div>

          {message && (
            <p
              className={
                message.includes("successfully")
                  ? "booking-message booking-success"
                  : "booking-message booking-error"
              }
              role="status"
            >
              {message.includes("successfully") && (
                <CheckCircle2 size={18} />
              )}
              {message}
            </p>
          )}

          <button
            type="submit"
            className="booking-submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request Reservation"}
            {!loading && <ArrowLeft size={17} />}
          </button>

          <p className="booking-note">
            Your booking request will be saved in the restaurant database.
            The reservation is not confirmed until availability is checked.
          </p>
        </form>
      </section>

      <footer className="booking-footer">
        Saffron & Sage · Good food, meaningful moments.
      </footer>
    </main>
  );
}

export default TableBooking;
