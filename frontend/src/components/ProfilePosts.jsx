import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import IssueCard from "./IssueCard";

const ProfilePosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, [userId]);

  const fetchMyPosts = async () => {
    try {
      const { data } = await api.get("/issues/explore");

      const mine = Array.isArray(data)
        ? data.filter(
             issue => issue.postedBy?.id === userId
          )
        : [];

      setPosts(mine);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-section">
        <h3>My posts</h3>
        <p className="profile-muted">Loading your posts…</p>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h3>My Posts</h3>

      {posts.length === 0 ? (
        <div className="no-posts-message">
          <p className="profile-muted">
            You haven’t posted any issues yet.
          </p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => navigate('/report-issue')}
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="profile-posts">
          {posts.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onRefresh={fetchMyPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
