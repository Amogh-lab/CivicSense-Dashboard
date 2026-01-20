import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../api/axios";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import ScrollToTop from "../../components/ScrollToTop";
import "./Explore.css";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import RightSidebarGlobal from "../../components/RightSidebarGlobal";


const BATCH_SIZE = 5;
const ALLOWED_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED_PENDING_USER"];

const Explore = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [allIssues, setAllIssues] = useState([]);
  const [visibleIssues, setVisibleIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const observerRef = useRef(null);

  /* ---------------- FETCH ONCE ---------------- */

  const fetchExploreFeed = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/issues/explore");

      const normalized = Array.isArray(data)
        ? data.filter((i) => ALLOWED_STATUSES.includes(i.status))
        : [];

      setAllIssues(normalized);
      setVisibleIssues(normalized.slice(0, BATCH_SIZE));

      setPage(1);
    } catch {
      setAllIssues([]);
      setVisibleIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    fetchExploreFeed();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */

  useEffect(() => {
    const source = !searchQuery.trim()
      ? allIssues
      : allIssues.filter(
          (i) =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.locality?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    setVisibleIssues(source.slice(0, BATCH_SIZE));
    setPage(1);
  }, [searchQuery, allIssues]);

  /* ---------------- LOAD MORE ---------------- */

  const loadMore = useCallback(() => {
    const source = !searchQuery.trim()
      ? allIssues
      : allIssues.filter(
          (i) =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.locality?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const nextPage = page + 1;
    const nextItems = source.slice(0, nextPage * BATCH_SIZE);

    setVisibleIssues(nextItems);
    setPage(nextPage);
  }, [page, allIssues, searchQuery]);

  /* ---------------- INTERSECTION OBSERVER ---------------- */

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadMore, loading]
  );

  if (loading) return <Loader />;

  return (
    <div className="explore-page">
      <div className="page-layout">
        {!isMobile && <LeftSidebar />}

        <div className={`explore-container ${isMobile ? 'mobile-view' : ''}`}>
          <div className="explore-header">
            <h1 className="explore-title">Explore Issues</h1>
            <p className="explore-subtitle">
              City-wide civic issues reported by citizens
            </p>

            <div className="explore-toolbar">
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                className="explore-search"
                placeholder="Search by issue or locality"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="refresh-button"
              onClick={fetchExploreFeed}
              aria-label="Refresh issues"
              title="Refresh"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 2V8M21.5 8H15.5M21.5 8L17.3 4.3C16.2418 3.26158 14.8925 2.56282 13.4408 2.30048C11.9891 2.03815 10.5119 2.2242 9.18988 2.83009C7.86788 3.43597 6.7675 4.4319 6.0477 5.67151C5.3279 6.91112 5.02332 8.33282 5.175 9.74M2.5 22V16M2.5 16H8.5M2.5 16L6.7 19.7C7.75817 20.7384 9.10749 21.4372 10.5592 21.6995C12.0109 21.9619 13.4881 21.7758 14.8101 21.1699C16.1321 20.564 17.2325 19.5681 17.9523 18.3285C18.6721 17.0889 18.9767 15.6672 18.825 14.26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

            <div className="explore-count">
              {visibleIssues.length} issue
              {visibleIssues.length !== 1 && "s"} shown
            </div>
          </div>

          {visibleIssues.length === 0 ? (
            <div className="explore-empty">
              <h3>No issues found</h3>
              <p>Try changing your search terms.</p>
            </div>
          ) : (
            <div className="explore-list">
              {visibleIssues.map((issue, idx) => {
                const isLast = idx === visibleIssues.length - 1;
                return (
                  <div
                    key={issue.id}
                    ref={isLast ? lastItemRef : null}
                  >
                    <IssueCard issue={issue} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!isMobile && (
          <>
            <RightSidebar />
            <RightSidebarGlobal />
          </>
        )}

      </div>
      <ScrollToTop />
    </div>
  );
};

export default Explore;
