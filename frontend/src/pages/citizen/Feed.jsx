import { useEffect, useState } from "react";
import api from "../../api/axios";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import "./Citizen.css";
import LeftSidebar from "../../components/LeftSidebar";

const Feed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/issues/feed");
      setIssues(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) return <Loader />;

  return (
  <div className="page-layout">
    <LeftSidebar />

    <div className="feed-container">
      <div className="feed-header">My Locality Feed</div>

      <div className="feed-list">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onRefresh={fetchFeed}
          />
        ))}
      </div>
    </div>
  </div>
);

};

export default Feed;
