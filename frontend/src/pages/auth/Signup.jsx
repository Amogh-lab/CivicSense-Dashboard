import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [geo, setGeo] = useState({ cities: [], zones: [], localities: [] });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    cityId: "",
    zoneId: "",
    localityId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/geo/cities").then((res) =>
      setGeo((g) => ({ ...g, cities: res.data }))
    );
  }, []);

  const handleCity = async (id) => {
    setForm({ ...form, cityId: id, zoneId: "", localityId: "" });
    const { data } = await api.get(`/geo/zones?cityId=${id}`);
    setGeo((g) => ({ ...g, zones: data, localities: [] }));
  };

  const handleZone = async (id) => {
    setForm({ ...form, zoneId: id, localityId: "" });
    const { data } = await api.get(`/geo/localities?zoneId=${id}`);
    setGeo((g) => ({ ...g, localities: data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch {
      setError("Signup failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Join your city’s civic monitoring platform
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Full name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div className="auth-field">
            <label>City</label>
            <select required value={form.cityId} onChange={(e) => handleCity(e.target.value)}>
              <option value="">Select city</option>
              {geo.cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label>Zone</label>
            <select required value={form.zoneId} onChange={(e) => handleZone(e.target.value)}>
              <option value="">Select zone</option>
              {geo.zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label>Locality</label>
            <select
              required
              value={form.localityId}
              onChange={(e) =>
                setForm({ ...form, localityId: e.target.value })
              }
            >
              <option value="">Select locality</option>
              {geo.localities.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <button className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
