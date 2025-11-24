import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SharedPublic = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  useDocumentTitle("Ảnh được chia sẻ - Google Photos Clone");
  
  const [share, setShare] = useState(null);
  const [shareable, setShareable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadPublicShare();
  }, [token]);

  const loadPublicShare = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch public share without authentication
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/shared/${token}`
      );
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Có lỗi xảy ra');
      }

      if (!response.ok) {
        if (response.status === 404) {
          setError("Link chia sẻ không tồn tại hoặc đã hết hạn");
        } else {
          setError(data.message || "Có lỗi xảy ra");
        }
        return;
      }

      setShare(data.share);
      setShareable(data.shareable);
      
      // Check if password is required and not yet verified
      // Store password verification in sessionStorage to persist across reloads
      const passwordVerified = sessionStorage.getItem(`share_verified_${token}`);
      if (data.share.has_password && !passwordVerified) {
        setPasswordRequired(true);
      } else if (passwordVerified) {
        setPasswordRequired(false);
      }
    } catch (err) {
      console.error("Error loading share:", err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/shares/verify-password/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Có lỗi xảy ra');
      }

      if (!response.ok) {
        setError(data.message || "Mật khẩu không đúng");
        setPassword(""); // Clear password on error
        return;
      }

      // Password verified, store in sessionStorage and reload share data
      sessionStorage.setItem(`share_verified_${token}`, 'true');
      setPasswordRequired(false);
      setPassword("");
      setError(""); // Clear any previous errors
      await loadPublicShare(); // Reload share data after password verification
    } catch (err) {
      console.error("Error verifying password:", err);
      setError(err.message || "Xác thực thất bại");
    } finally {
      setVerifying(false);
    }
  };

  const getMediaUrl = (file) => {
    if (!file) return "";
    return `${STORAGE_BASE_URL}/storage/${file.file_path}`;
  };

  const getThumbnailUrl = (file) => {
    if (!file) return "";
    return file.thumbnail_path 
      ? `${STORAGE_BASE_URL}/storage/${file.thumbnail_path}`
      : getMediaUrl(file);
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
                  onClick={() => navigate("/")}
                >
                  Quay lại trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center mb-4">Nhập mật khẩu</h5>
                <p className="text-muted text-center mb-4">
                  Nội dung này được bảo vệ bằng mật khẩu
                </p>
                <form onSubmit={handleVerifyPassword}>
                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      autoFocus
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={verifying}
                  >
                    {verifying ? "Đang xác thực..." : "Xác thực"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {share && shareable && (
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title mb-3">
                  {share.shareable_type === 'media' ? 'Ảnh được chia sẻ' : 'Album được chia sẻ'}
                </h4>
                {share.shareable_type === 'media' && shareable ? (
                  <div className="text-center">
                    <img
                      src={getMediaUrl(shareable)}
                      alt={shareable.original_name}
                      className="img-fluid"
                      style={{ maxHeight: "600px", objectFit: "contain" }}
                    />
                    <div className="mt-4">
                      <h5>{shareable.original_name}</h5>
                      {shareable.description && (
                        <p className="text-muted">{shareable.description}</p>
                      )}
                      {shareable.taken_at && (
                        <p className="small text-muted">
                          Chụp: {new Date(shareable.taken_at).toLocaleString('vi-VN')}
                        </p>
                      )}
                      {share.allow_download && (
                        <a
                          href={getMediaUrl(shareable)}
                          download={shareable.original_name}
                          className="btn btn-primary mt-3"
                        >
                          Tải xuống
                        </a>
                      )}
                    </div>
                  </div>
                ) : share.shareable_type === 'album' && shareable ? (
                  <div>
                    <h5>{shareable.title}</h5>
                    {shareable.description && (
                      <p className="text-muted">{shareable.description}</p>
                    )}
                    {shareable.media_files && shareable.media_files.length > 0 ? (
                      <div className="row">
                        {shareable.media_files.map((media) => (
                          <div key={media.id} className="col-md-3 col-sm-4 col-6 mb-3">
                            <div className="card">
                              <img
                                src={getThumbnailUrl(media)}
                                alt={media.original_name}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                              />
                              <div className="card-body p-2">
                                <small className="text-muted d-block text-truncate">
                                  {media.original_name}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">Album trống</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedPublic;
