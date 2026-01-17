import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProfilePosts from "../../components/ProfilePosts";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!user) return null;

return (
  <div className="profile-page">
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profilePhotoUrl ? (
              <img src={user.profilePhotoUrl} alt="Profile" />
            ) : (
              <span>{user.fullName?.[0]?.toUpperCase()}</span>
            )}
          </div>

          <div className="profile-main">
            <h1>{user.fullName}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-location">
              {user.locality?.name}, {user.zone?.name}, {user.city?.name}
            </p>
          </div>

          <button
            className="profile-edit-btn"
            onClick={() => navigate("/profile/edit")}
          >
            Edit profile
          </button>
        </div>

        {/* Bio */}
        <div className="profile-section">
          <h3>About</h3>
          <p className={user.bio ? "" : "profile-muted"}>
            {user.bio || "No bio added yet"}
          </p>
        </div>

        {/* Details */}
        <div className="profile-section">
          <h3>Contact information</h3>

          <div className="profile-field">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="profile-field">
            <span>Phone</span>
            <span className={!user.phoneNumber ? "profile-muted" : ""}>
              {user.phoneNumber || "Not provided"}
            </span>
          </div>

          <div className="profile-field">
            <span>Account status</span>
            <span>
              {user.isVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </div>
      </div>
        <div className="profile-card">
            <ProfilePosts userId={user.id} />
        </div>
    </div>
  </div>
);
};

export default Profile;
