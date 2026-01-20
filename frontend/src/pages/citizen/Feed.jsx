import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import ScrollToTop from "../../components/ScrollToTop";
import "./Citizen.css";

const Feed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFeed = useCallback(async () => {
    try {
      const { data } = await api.get("/issues/feed");
      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching feed:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading) return <Loader />;

  return (
    <div className="page-layout">
      <div className="feed-container">
        <div className="feed-header">Local Issues</div>
        <div className="feed-list">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div 
                key={issue.id} 
                className="issue-card-wrapper"
                onClick={() => issue?.id && navigate(`/issues/${issue.id}`)}
              >
                <IssueCard
                  issue={issue}
                  showActions={false}
                  onRefresh={fetchFeed}
                />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No issues in your locality yet. Be the first to report one!</p>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Feed;
