import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5001/api/users", form);

      console.log(res);

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.log("ERROR:", err.response.data);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex justify-center items-center px-4 py-12">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md card p-8 md:p-10 shadow-card-hover"
      >
        <div className="mb-8 text-center">
          <p className="section-eyebrow mb-2">Get Started</p>
          <h2 className="section-title text-3xl">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Join Ecomet for a better shopping experience
          </p>
        </div>

        {error && <div className="alert-error mb-6">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="input-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@email.com"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-8"
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-500 font-semibold hover:text-brand-400 transition-colors"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
