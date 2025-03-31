import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Profile.css";
import userService from "../../../services/userService";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: "",
    mssv: "",
    email: "",
    class: "",
    faculty: "",
    phoneNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserProfile();
      setProfile({
        name: userData.name || "",
        mssv: userData.studentId || "",
        email: userData.email || "",
        class: userData.class || "",
        faculty: userData.faculty || "",
        phoneNumber: userData.phoneNumber || "",
      });
      setLoading(false);
    } catch (error) {
      setErrorMessage("Không thể tải thông tin hồ sơ");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userService.updateUserProfile({
        name: profile.name,
        phoneNumber: profile.phoneNumber,
      });
      setSuccessMessage("Cập nhật thông tin thành công");
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi cập nhật thông tin");
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Mật khẩu mới không khớp");
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccessMessage("Đổi mật khẩu thành công");
      setShowChangePassword(false);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi đổi mật khẩu");
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Thông tin cá nhân</h2>
        {!isEditing && !showChangePassword && (
          <div className="profile-actions">
            <button className="edit-button" onClick={toggleEdit}>
              <i className="fas fa-edit"></i> Chỉnh sửa
            </button>
            <button
              className="change-password-button"
              onClick={toggleChangePassword}
            >
              <i className="fas fa-key"></i> Đổi mật khẩu
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Đang tải thông tin...</div>
      ) : (
        <div className="profile-content">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {!showChangePassword ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã số sinh viên:</label>
                <input type="text" name="mssv" value={profile.mssv} disabled />
              </div>

              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Lớp:</label>
                <input
                  type="text"
                  name="class"
                  value={profile.class}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Khoa:</label>
                <input
                  type="text"
                  name="faculty"
                  value={profile.faculty}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    <i className="fas fa-save"></i> Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={toggleEdit}
                  >
                    <i className="fas fa-times"></i> Hủy
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  <i className="fas fa-save"></i> Đổi mật khẩu
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={toggleChangePassword}
                >
                  <i className="fas fa-times"></i> Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    mssv: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default Profile;
