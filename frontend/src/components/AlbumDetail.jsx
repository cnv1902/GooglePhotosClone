import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";
import { useAuth } from "../contexts/AuthContext";

const AlbumDetail = () => {
  useDocumentTitle("Chi tiết Album - Google Photos Clone");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAlbumById(id);
      setAlbum(data);
    } catch (err) {
      console.error("Error loading album:", err);
      setError(err.message || "Không thể tải album");
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (media) => {
    if (!media) return "";
    if (media.thumbnail_path) {
      return `${STORAGE_BASE_URL}/storage/${media.thumbnail_path}`;
    }
    return `${STORAGE_BASE_URL}/storage/${media.file_path}`;
  };

  const handleDeleteAlbum = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa album này?")) return;
    try {
      await api.deleteAlbum(id);
      alert("Đã xóa album");
      navigate("/albums");
    } catch (error) {
      alert(error.message || "Xóa album thất bại");
    }
  };

  const handleRemoveMedia = async (mediaId) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này khỏi album?")) return;
    try {
      await api.removeMediaFromAlbum(id, [mediaId]);
      alert("Đã xóa ảnh khỏi album");
      loadAlbum();
    } catch (error) {
      alert(error.message || "Xóa ảnh thất bại");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Lỗi</h5>
                <p className="card-text text-danger">{error}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/albums")}
                >
                  Quay lại danh sách album
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4>{album.title}</h4>
                  {album.description && (
                    <p className="text-muted">{album.description}</p>
                  )}
                  <p className="text-muted small">
                    {album.media_files?.length || 0} ảnh
                    {album.is_auto_created && (
                      <span className="badge badge-info ml-2">Tự động</span>
                    )}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-danger mr-2"
                    onClick={handleDeleteAlbum}
                  >
                    Xóa album
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/albums")}
                  >
                    Quay lại
                  </button>
                </div>
              </div>

              {album.media_files && album.media_files.length > 0 ? (
                <div className="row">
                  {album.media_files.map((media) => (
                    <div
                      key={media.id}
                      className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3"
                    >
                      <div className="card position-relative">
                        <img
                          src={getMediaUrl(media)}
                          alt={media.original_name}
                          className="card-img-top"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // You can add a modal to view full image here
                            window.open(
                              `${STORAGE_BASE_URL}/storage/${media.file_path}`,
                              "_blank"
                            );
                          }}
                        />
                        <div className="card-body p-2">
                          <small className="text-muted d-block text-truncate">
                            {media.original_name}
                          </small>
                          <button
                            className="btn btn-sm btn-danger mt-2"
                            onClick={() => handleRemoveMedia(media.id)}
                          >
                            Xóa khỏi album
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Album này chưa có ảnh nào</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/photos")}
                  >
                    Thêm ảnh vào album
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;

