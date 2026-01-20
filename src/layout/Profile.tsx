import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
} from "react-icons/fi";
import { useDashboard } from "../DashboardPage/DashboardContext";
import "./Profile.css";

export default function Profile() {
  const { userProfile, setUserProfile } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  return (
    <section className="panel">
      <form onSubmit={handleSubmit} className="profile-form">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            <FiUser />
          </div>

          <div className="profile-header-info">
            <h2>{formData.name}</h2>
            <p className="muted">{formData.email}</p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}
        </div>

        {/* BASIC INFO */}
        <div className="profile-section">
          <h4>Basic Information</h4>

          <div className="form-row">
            <label>
              <span><FiUser /> Full Name</span>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
                required
              />
            </label>

            <label>
              <span><FiMail /> Email</span>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span><FiPhone /> Mobile</span>
              <input
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                disabled={!isEditing}
                required
              />
            </label>

            <label>
              <span><FiPhone /> Alternate</span>
              <input
                value={formData.alternateMobileNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alternateMobileNumber: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </label>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="profile-section">
          <h4>Address</h4>

          <div className="form-row">
            <label>
              <span><FiMapPin /> Address</span>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={!isEditing}
              />
            </label>

            <label>
              <span>City</span>
              <input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={!isEditing}
              />
            </label>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <FiSave /> Save
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
