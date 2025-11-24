import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";

const UserProfileEditContent = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Format date_of_birth để hiển thị đúng trong input type="date" (YYYY-MM-DD)
      let formattedDate = "";
      if (user.date_of_birth) {
        const date = new Date(user.date_of_birth);
        if (!isNaN(date.getTime())) {
          // Format thành YYYY-MM-DD
          formattedDate = date.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        name: user.name || "",
        email: user.email || "",
        date_of_birth: formattedDate,
        gender: user.gender || "",
        bio: user.bio || "",
      });
      if (user.avatar) {
        setAvatarPreview(`${STORAGE_BASE_URL}/storage/${user.avatar}`);
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const profileData = {
        name: formData.name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        bio: formData.bio || null,
      };
      
      if (avatar) {
        profileData.avatar = avatar;
      }

      const updatedUser = await api.updateProfile(profileData);
      updateUser(updatedUser);
      setSuccess("Cập nhật hồ sơ thành công!");
    } catch (err) {
      setError(err.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) {
      return `${STORAGE_BASE_URL}/storage/${user.avatar}`;
    }
    return "/src/assets/images/user/11.png";
  };

  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="iq-edit-list usr-edit">
                  <ul className="iq-edit-profile d-flex nav nav-pills">
                    <li className="col-md-12 p-0">
                      <a className="nav-link active" data-toggle="pill" href="#personal-information">
                        Thông tin cá nhân
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="iq-edit-list-data">
              <div className="tab-content">
                <div className="tab-pane fade active show" id="personal-information" role="tabpanel">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Thông tin cá nhân</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="alert alert-success" role="alert">
                          {success}
                        </div>
                      )}
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row align-items-center">
                          <div className="col-md-12">
                            <div className="profile-img-edit">
                              <div className="crm-profile-img-edit">
                                <img
                                  className="crm-profile-pic rounded-circle avatar-100"
                                  src={getAvatarUrl()}
                                  alt="profile-pic"
                                />
                                <div className="crm-p-image bg-primary">
                                  <i className="las la-pen upload-button"></i>
                                  <input
                                    ref={fileInputRef}
                                    className="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: "none" }}
                                  />
                                  <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ cursor: "pointer" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="form-group col-sm-6">
                            <label htmlFor="name">Tên:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="email">Email:</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={formData.email}
                              disabled
                            />
                          </div>
                          <div className="form-group col-sm-6">
                            <label className="d-block">Giới tính:</label>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="gender_male"
                                name="gender"
                                className="custom-control-input"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              />
                              <label className="custom-control-label" htmlFor="gender_male">
                                Nam
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="gender_female"
                                name="gender"
                                className="custom-control-input"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              />
                              <label className="custom-control-label" htmlFor="gender_female">
                                Nữ
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="gender_other"
                                name="gender"
                                className="custom-control-input"
                                value="other"
                                checked={formData.gender === "other"}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              />
                              <label className="custom-control-label" htmlFor="gender_other">
                                Khác
                              </label>
                            </div>
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input
                              type="date"
                              className="form-control"
                              id="dob"
                              value={formData.date_of_birth}
                              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            />
                          </div>
                          <div className="form-group col-sm-12">
                            <label htmlFor="bio">Tiểu sử:</label>
                            <textarea
                              className="form-control"
                              id="bio"
                              rows="4"
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              placeholder="Nhập tiểu sử của bạn..."
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
                          {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                          type="reset"
                          className="btn iq-bg-danger"
                          onClick={() => {
                            if (user) {
                              setFormData({
                                name: user.name || "",
                                email: user.email || "",
                                date_of_birth: user.date_of_birth || "",
                                gender: user.gender || "",
                                bio: user.bio || "",
                              });
                            }
                            setAvatar(null);
                            setAvatarPreview(null);
                          }}
                        >
                          Hủy
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfileEditContent;
