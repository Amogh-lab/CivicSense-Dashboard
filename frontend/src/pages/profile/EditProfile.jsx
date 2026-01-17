import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <div className="edit-page">
      <div className="edit-container">
        <div className="edit-card">
          <h1>Edit profile</h1>
          <p className="edit-subtitle">
            Changes are not saved yet (backend pending)
          </p>

          <div className="edit-field">
            <label>Profile photo</label>
            <input type="file" disabled />
          </div>

          <div className="edit-field">
            <label>Bio</label>
            <textarea
              value={user.bio || ""}
              disabled
              placeholder="Tell people about yourself"
            />
          </div>

          <div className="edit-field">
            <label>Phone number</label>
            <input
              type="text"
              value={user.phoneNumber || ""}
              disabled
              placeholder="Add phone number"
            />
          </div>

          <div className="edit-actions">
            <button onClick={() => navigate("/profile")}>
              Cancel
            </button>
            <button className="edit-save" disabled>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
