import { useEffect, useState } from "react";
import api from "../../api/axios";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import "./Explore.css";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";


const Explore = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExploreFeed = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/issues/explore");

      const normalized = Array.isArray(data)
        ? data.map((issue) => ({
            ...issue,
            upvoteCount: issue?._count?.upvotes ?? 0,
            commentCount: issue?._count?.comments ?? 0,
          }))
        : [];

      setIssues(normalized);
      setFilteredIssues(normalized);
    } catch (err) {
      console.error("Explore feed failed", err);
      setIssues([]);
      setFilteredIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreFeed();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredIssues(issues);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredIssues(
      issues.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.locality?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, issues]);

  if (loading) return <Loader />;

  return (
  <div className="explore-page">
    <div className="page-layout">
      <LeftSidebar />

      <div className="explore-container">
        <div className="explore-header">
          <h1 className="explore-title">Explore Issues</h1>
          <p className="explore-subtitle">
            City-wide civic issues reported by citizens
          </p>

          <div className="explore-toolbar">
            <input
              className="explore-search"
              placeholder="Search by issue or locality"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="explore-refresh"
              onClick={fetchExploreFeed}
            >
              Refresh
            </button>
          </div>

          <div className="explore-count">
            {filteredIssues.length} issue
            {filteredIssues.length !== 1 && "s"} found
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="explore-empty">
            <h3>No issues found</h3>
            <p>Try changing your search terms.</p>
          </div>
        ) : (
          <div className="explore-list">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onRefresh={fetchExploreFeed}
              />
            ))}
          </div>
        )}
      </div>
      <RightSidebar />
    </div>
  </div>
);
};
export default Explore;
