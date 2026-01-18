import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AdminFeed.css";

const CATEGORIES = [
  "Garbage",
  "Water Leakage",
  "Pothole",
  "Streetlight"
];

const AdminFeed = () => {
  const [issues, setIssues] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssigned();
    fetchTrending();
  }, []);

  const fetchAssigned = async () => {
    const { data } = await api.get("/admin/issues");
    setIssues(data || []);
  };

  const fetchTrending = async () => {
    const { data } = await api.get("/issues/explore");

    const openSorted = Array.isArray(data)
      ? data
          .filter((i) => i.status === "OPEN")
          .sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0))
          .slice(0, 5)
      : [];

    setTrending(openSorted);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.locality.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(issue.category);

    const matchesStatus =
      !activeStatus || issue.status === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="admin-layout">

      {/* LEFT */}
      <AdminSidebar
        issues={issues}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />

      {/* CENTER */}
      <div className="admin-feed">
        <div className="admin-feed-header">
          <h1>Assigned Issues</h1>

          <input
            className="admin-search"
            placeholder="Search by title or locality"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filters">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="admin-issue-list">
          {filteredIssues.length === 0 && (
            <div className="admin-empty">
              No issues match the filters
            </div>
          )}

          {filteredIssues.map((issue) => {
            const hoursLeft =
              (new Date(issue.slaDeadline) - Date.now()) / 36e5;

            return (
              <div
                key={issue.id}
                className="admin-issue-card"
                onClick={() =>
                  navigate(`/admin/issues/${issue.id}`)
                }
              >
                <div className="admin-issue-main">
                  <div className="admin-issue-title">
                    {issue.title}
                  </div>

                  <div className="admin-issue-meta">
                    {issue.category} • {issue.locality}
                  </div>
                </div>

                <div className="admin-issue-right">
                  <div
                    className={`admin-status ${issue.status.toLowerCase()}`}
                  >
                    {issue.status}
                  </div>

                  <div
                    className={`admin-sla ${
                      hoursLeft < 6
                        ? "sla-critical"
                        : hoursLeft < 24
                        ? "sla-warning"
                        : ""
                    }`}
                  >
                    SLA:{" "}
                    {new Date(issue.slaDeadline).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <aside className="admin-trending">
        <h3>High Priority (Open)</h3>

        {trending.length === 0 && (
          <div className="admin-empty">No trending issues</div>
        )}

        {trending.map((issue) => (
          <div
            key={issue.id}
            className="admin-trending-item"
            onClick={() =>
              navigate(`/admin/issues/${issue.id}`)
            }
          >
            <div className="admin-trending-title">
              {issue.title}
            </div>

            <div className="admin-trending-meta">
              ↑ {issue.upvotes} • {issue.locality}
            </div>
          </div>
        ))}
      </aside>

    </div>
  );
};

export default AdminFeed;
