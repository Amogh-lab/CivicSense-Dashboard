import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiMenu, FiX } from "react-icons/fi";
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`admin-layout ${isMobile ? 'mobile-view' : ''}`}>
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* LEFT SIDEBAR */}
      <div className={`sidebar-container ${showSidebar ? 'show' : ''}`}>
        <AdminSidebar
          issues={issues}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />
      </div>

      {/* CENTER */}
      <div className="admin-feed">
        <div className="admin-feed-header">
          <h1>Assigned Issues</h1>
          
          <div className="search-refresh-container">
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                className="admin-search"
                placeholder="Search by title or locality"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              className="refresh-button"
              onClick={fetchAssigned}
              title="Refresh issues"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27541C7.1518 4.26543 8.52547 3.55976 10.0083 3.22425C11.4911 2.88874 13.0348 2.93432 14.4952 3.35676C15.9556 3.77921 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1113 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
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
