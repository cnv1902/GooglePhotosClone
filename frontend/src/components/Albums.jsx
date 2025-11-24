import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const Albums = () => {
  useDocumentTitle("Album - Google Photos Clone");
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoCreateModal, setShowAutoCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_ids: [],
  });
  const [autoCreateData, setAutoCreateData] = useState({
    criteria_type: "date", // 'date' or 'location'
    criteria_value: "",
    title: "",
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    loadAlbums();
    loadMetadata();
  }, []);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const data = await api.getAlbums();
      setAlbums(data.data || []);
    } catch (error) {
      console.error("Error loading albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      // Load locations
      const locationData = await api.getMediaGroupedByLocation();
      if (locationData && Array.isArray(locationData)) {
        const locations = locationData
          .map((item) => item.location_name)
          .filter((loc) => loc);
        setAvailableLocations([...new Set(locations)]);
      }

      // Load dates
      const dateData = await api.getMediaGroupedByTakenDate();
      if (dateData && Array.isArray(dateData)) {
        const dates = dateData.map((item) => item.date).filter((date) => date);
        setAvailableDates([...new Set(dates)]);
      }
    } catch (error) {
      console.error("Error loading metadata:", error);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chỉ gửi media_ids nếu có ít nhất 1 phần tử
      const albumData = {
        title: formData.title,
        description: formData.description || null,
      };
      
      // Chỉ thêm media_ids nếu có
      if (formData.media_ids && formData.media_ids.length > 0) {
        albumData.media_ids = formData.media_ids;
      }
      
      await api.createAlbum(albumData);
      alert("Đã tạo album thành công!");
      setShowCreateModal(false);
      setFormData({ title: "", description: "", media_ids: [] });
      loadAlbums();
    } catch (error) {
      console.error("Error creating album:", error);
      alert(error.message || "Tạo album thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCreateAlbum = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const criteria = {
        type: autoCreateData.criteria_type,
        value: autoCreateData.criteria_value,
      };
      await api.createAutoAlbum(criteria, autoCreateData.title);
      alert("Đã tạo album tự động thành công!");
      setShowAutoCreateModal(false);
      setAutoCreateData({ criteria_type: "date", criteria_value: "", title: "" });
      loadAlbums();
    } catch (error) {
      alert(error.message || "Tạo album tự động thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa album này?")) return;
    try {
      await api.deleteAlbum(id);
      alert("Đã xóa album");
      loadAlbums();
    } catch (error) {
      alert(error.message || "Xóa album thất bại");
    }
  };

  const getCoverImageUrl = (album) => {
    if (album.cover_media?.thumbnail_path) {
      return `${STORAGE_BASE_URL}/storage/${album.cover_media.thumbnail_path}`;
    }
    if (album.cover_media?.file_path) {
      return `${STORAGE_BASE_URL}/storage/${album.cover_media.file_path}`;
    }
    if (album.media_files && album.media_files.length > 0) {
      const firstMedia = album.media_files[0];
      if (firstMedia.thumbnail_path) {
        return `${STORAGE_BASE_URL}/storage/${firstMedia.thumbnail_path}`;
      }
      if (firstMedia.file_path) {
        return `${STORAGE_BASE_URL}/storage/${firstMedia.file_path}`;
      }
    }
    return "/src/assets/images/user/11.png";
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Album của tôi</h4>
                <div>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Tạo album mới
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAutoCreateModal(true)}
                  >
                    Tạo album tự động
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Đang tải...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {albums.length === 0 ? (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">Bạn chưa có album nào</p>
                    </div>
                  ) : (
                    albums.map((album) => (
                      <div key={album.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="card">
                          <div
                            style={{
                              height: "200px",
                              backgroundImage: `url(${getCoverImageUrl(album)})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/albums/${album.id}`)}
                          />
                          <div className="card-body">
                            <h5
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate(`/albums/${album.id}`)}
                            >
                              {album.title}
                            </h5>
                            {album.is_auto_created && (
                              <span className="badge badge-info mb-2">Tự động</span>
                            )}
                            <p className="text-muted small">
                              {album.media_files?.length || 0} ảnh
                            </p>
                            {album.description && (
                              <p className="text-muted small">{album.description}</p>
                            )}
                            <div className="mt-2">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteAlbum(album.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo album mới</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowCreateModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleCreateAlbum}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên album:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows="3"
                    />
                  </div>
                  <p className="text-muted small">
                    Bạn có thể thêm ảnh vào album sau khi tạo.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo album"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Auto Create Album Modal */}
      {showAutoCreateModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAutoCreateModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo album tự động</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAutoCreateModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleAutoCreateAlbum}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tiêu chí:</label>
                    <select
                      className="form-control"
                      value={autoCreateData.criteria_type}
                      onChange={(e) =>
                        setAutoCreateData({
                          ...autoCreateData,
                          criteria_type: e.target.value,
                          criteria_value: "",
                        })
                      }
                    >
                      <option value="date">Theo ngày chụp</option>
                      <option value="location">Theo địa điểm</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      {autoCreateData.criteria_type === "date"
                        ? "Chọn ngày:"
                        : "Chọn địa điểm:"}
                    </label>
                    {autoCreateData.criteria_type === "date" ? (
                      <input
                        type="date"
                        className="form-control"
                        value={autoCreateData.criteria_value}
                        onChange={(e) =>
                          setAutoCreateData({
                            ...autoCreateData,
                            criteria_value: e.target.value,
                          })
                        }
                        required
                      />
                    ) : (
                      <select
                        className="form-control"
                        value={autoCreateData.criteria_value}
                        onChange={(e) =>
                          setAutoCreateData({
                            ...autoCreateData,
                            criteria_value: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">-- Chọn địa điểm --</option>
                        {availableLocations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Tên album:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={autoCreateData.title}
                      onChange={(e) =>
                        setAutoCreateData({ ...autoCreateData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAutoCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo album"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;
