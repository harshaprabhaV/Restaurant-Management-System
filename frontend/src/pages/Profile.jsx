
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Save,
  UtensilsCrossed,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const savedUser = JSON.parse(
    localStorage.getItem("saffron_user") || "null"
  );

  const [form, setForm] = useState({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "",
  });

  const [message, setMessage] = useState("");

  const bookings = JSON.parse(
    localStorage.getItem("saffron_bookings") || "[]"
  ).filter(
    (booking) =>
      booking.phone === form.phone ||
      booking.name.toLowerCase() === form.name.toLowerCase()
  );

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    const existingUser = JSON.parse(
      localStorage.getItem("saffron_user") || "null"
    );

    if (!existingUser) {
      setMessage("Please create an account or log in first.");
      return;
    }

    const updatedUser = {
      ...existingUser,
      name: form.name.trim(),
      email: existingUser.email,
      phone: form.phone.trim(),
    };

    localStorage.setItem("saffron_user", JSON.stringify(updatedUser));
    setForm({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });

    setMessage("Profile updated successfully!");
  };

  return (
    <main className="profile-page">
      <header className="profile-header">
        <Link to="/user" className="profile-brand">
          <UtensilsCrossed size={24} />
          Saffron & Sage
        </Link>

        <Link to="/user" className="profile-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <section className="profile-heading">
        <div className="profile-avatar">
          <UserRound size={34} />
        </div>

        <div>
          <span className="profile-eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal details and reservations.</p>
        </div>
      </section>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-card-heading">
            <h2>Personal information</h2>
            <p>Update your details below.</p>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label htmlFor="profile-name">Full name</label>
              <div className="profile-input-wrap">
                <UserRound size={17} />
                <input
                  id="profile-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">Email address</label>
              <div className="profile-input-wrap profile-input-disabled">
                <Mail size={17} />
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                />
              </div>
              <small>Email cannot be changed in this demo.</small>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-phone">Phone number</label>
              <div className="profile-input-wrap">
                <Phone size={17} />
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  title="Enter a 10-digit mobile number"
                />
              </div>
            </div>

            {message && (
              <p className="profile-message" role="status">
                {message}
              </p>
            )}

            <button className="profile-save-button" type="submit">
              <Save size={17} /> Save Changes
            </button>
          </form>
        </section>

        <section className="profile-card profile-bookings">
          <div className="profile-card-heading">
            <h2>My table bookings</h2>
            <p>Your saved reservation requests.</p>
          </div>

          {bookings.length > 0 ? (
            <div className="profile-booking-list">
              {bookings.map((booking) => (
                <article
                  className="profile-booking-item"
                  key={booking.id}
                >
                  <div className="profile-booking-icon">
                    <CalendarDays size={21} />
                  </div>

                  <div className="profile-booking-details">
                    <h3>{booking.occasion}</h3>
                    <p>
                      {booking.date} · {booking.time}
                    </p>
                    <p>
                      {booking.guests}{" "}
                      {booking.guests === "1" ? "guest" : "guests"}
                    </p>
                    <span className="profile-booking-status">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-empty-bookings">
              <CalendarDays size={30} />
              <h3>No bookings yet</h3>
              <p>Your reservation requests will appear here.</p>
              <Link to="/table-booking">Book a table</Link>
            </div>
          )}
        </section>
      </div>

      <footer className="profile-footer">
        Saffron & Sage · Your dining experience, your way.
      </footer>
    </main>
  );
}

export default Profile;
