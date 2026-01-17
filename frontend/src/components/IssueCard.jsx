import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentsSection from "./CommentsSection";
import { FaArrowUp, FaRegComment } from "react-icons/fa";
import "./IssueCard.css";

const IssueCard = ({ issue }) => {
  const [upvoteCount, setUpvoteCount] = useState(issue.upvoteCount ?? 0);
  const [hasUpvoted, setHasUpvoted] = useState(issue.hasUpvoted ?? false);
  const [loading, setLoading] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  useEffect(() => {
    setUpvoteCount(issue.upvoteCount ?? 0);
    setHasUpvoted(issue.hasUpvoted ?? false);
  }, [issue.upvoteCount, issue.hasUpvoted]);

  const prefetchComments = async () => {
    if (commentsLoaded) return;

    try {
      const { data } = await api.get(
        `/issues/${issue.id}/comments`,
        { withCredentials: true }
      );
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoaded(true);
    }
  };

  const handleUpvote = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await api.post(
        `/issues/${issue.id}/upvote`,
        {},
        { withCredentials: true }
      );

      setHasUpvoted((p) => !p);
      setUpvoteCount((p) =>
        hasUpvoted ? Math.max(p - 1, 0) : p + 1
      );
    } catch (err) {
      console.error("Upvote failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-card">

      {/* HEADER */}
      <div className="issue-header">
        <div className="issue-avatar">
          {issue.postedBy?.name?.[0]?.toUpperCase()}
        </div>

        <div className="issue-meta">
          <div className="issue-author">
            {issue.postedBy?.name}
          </div>
          <div className="issue-submeta">
            {issue.locality} •{" "}
            {new Date(issue.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className={`issue-status status-${issue.status.toLowerCase()}`}>
          {issue.status}
        </div>
      </div>

      {/* CONTENT */}
      <div className="issue-content">
        <p className="issue-title">{issue.title}</p>
      </div>

      {/* MEDIA */}
      {issue.media?.length > 0 && (
        <div className="issue-media">
          {issue.media.map((m, idx) => (
            <img key={idx} src={m.url} alt="Issue media" />
          ))}
        </div>
      )}

      {/* STATS */}
      <div className="issue-stats">
        <span>{upvoteCount} upvotes</span>
        <span>{comments.length} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="issue-actions">
        <button
          type="button"
          className={hasUpvoted ? "upvoted" : ""}
          onClick={handleUpvote}
        >
          <FaArrowUp /> {hasUpvoted ? "Upvoted" : "Upvote"}
        </button>

        <button
          type="button"
          onMouseEnter={prefetchComments}
          onClick={() => {
            prefetchComments();
            setShowComments((p) => !p);
          }}
        >
          <FaRegComment /> Comment
        </button>
      </div>

      {showComments && (
        <CommentsSection
          issueId={issue.id}
          comments={comments}
          setComments={setComments}
        />
      )}
    </div>
  );
};

export default IssueCard;
