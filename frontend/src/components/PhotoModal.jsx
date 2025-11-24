import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { STORAGE_BASE_URL } from '../utils/config';
import { useAuth } from '../contexts/AuthContext';

const PhotoModal = ({ photo, onClose }) => {
  const { user } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState('public'); // 'public' or 'friends'
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [publicLink, setPublicLink] = useState('');
  const [expiresIn, setExpiresIn] = useState(7); // days
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState([]);

  useEffect(() => {
    if (photo) {
      loadShares();
      loadFriends();
    }
  }, [photo]);

  const loadShares = async () => {
    try {
      const data = await api.getMyShares({ shareable_type: 'media', shareable_id: photo.id });
      setShares(data.data || []);
    } catch (error) {
      console.error('Error loading shares:', error);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await api.getFriends('accepted');
      setFriends(data || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const handleCreatePublicLink = async () => {
    setLoading(true);
    try {
      const options = {
        expires_in_days: expiresIn,
      };
      if (password) {
        options.password = password;
      }
      const result = await api.createPublicLink('media', photo.id, options);
      setPublicLink(`${window.location.origin}/shared/${result.token}`);
      alert('Đã tạo link chia sẻ công khai!');
      loadShares();
    } catch (error) {
      alert(error.message || 'Tạo link thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithFriends = async () => {
    if (selectedFriends.length === 0) {
      alert('Vui lòng chọn ít nhất một người bạn');
      return;
    }
    setLoading(true);
    try {
      await api.shareWithFriends('media', photo.id, selectedFriends);
      alert('Đã chia sẻ với bạn bè!');
      setShowShareModal(false);
      loadShares();
    } catch (error) {
      alert(error.message || 'Chia sẻ thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    alert('Đã sao chép link!');
  };

  const handleDeleteShare = async (shareId) => {
    if (!window.confirm('Bạn có chắc muốn xóa chia sẻ này?')) return;
    try {
      await api.deleteShare(shareId);
      alert('Đã xóa chia sẻ');
      loadShares();
    } catch (error) {
      alert(error.message || 'Xóa thất bại');
    }
  };

  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  if (!photo) return null;

  const imageUrl = `${STORAGE_BASE_URL}/storage/${photo.file_path}`;
  const thumbnailUrl = `${STORAGE_BASE_URL}/storage/${photo.thumbnail_path || photo.file_path}`;

  return (
    <>
      <div 
        className="modal fade show" 
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">{photo.original_name}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <img
                src={imageUrl}
                alt={photo.original_name}
                className="img-fluid"
                style={{ maxHeight: '70vh' }}
              />
              {photo.description && (
                <p className="mt-3">{photo.description}</p>
              )}
              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Kích thước:</strong> {(photo.file_size / 1024 / 1024).toFixed(2)} MB</p>
                  {photo.width && photo.height && (
                    <p><strong>Độ phân giải:</strong> {photo.width} x {photo.height}</p>
                  )}
                  {photo.taken_at && (
                    <p><strong>Ngày chụp:</strong> {new Date(photo.taken_at).toLocaleString('vi-VN')}</p>
                  )}
                </div>
                <div className="col-md-6">
                  {photo.camera_make && (
                    <p><strong>Máy ảnh:</strong> {photo.camera_make} {photo.camera_model}</p>
                  )}
                  {photo.location_name && (
                    <p><strong>Địa điểm:</strong> {photo.location_name}</p>
                  )}
                  {photo.exposure_time && (
                    <p><strong>Thông số:</strong> {photo.exposure_time}, {photo.aperture}, ISO {photo.iso}</p>
                  )}
                </div>
              </div>

              {/* Shares section */}
              {shares.length > 0 && (
                <div className="mt-4">
                  <h6>Chia sẻ hiện tại:</h6>
                  <div className="list-group">
                    {shares.map((share) => (
                      <div key={share.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {share.type === 'public' ? (
                            <span className="badge badge-primary">Công khai</span>
                          ) : (
                            <span className="badge badge-info">Bạn bè</span>
                          )}
                          {share.token && (
                            <span className="ml-2 small text-muted">
                              {window.location.origin}/shared/{share.token}
                            </span>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteShare(share.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setShowShareModal(true)}
              >
                Chia sẻ
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowShareModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chia sẻ ảnh</h5>
                <button type="button" className="close" onClick={() => setShowShareModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${shareType === 'public' ? 'active' : ''}`}
                      onClick={() => setShareType('public')}
                    >
                      Link công khai
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${shareType === 'friends' ? 'active' : ''}`}
                      onClick={() => setShareType('friends')}
                    >
                      Chia sẻ với bạn bè
                    </button>
                  </li>
                </ul>

                {shareType === 'public' ? (
                  <div>
                    {publicLink ? (
                      <div>
                        <div className="form-group">
                          <label>Link chia sẻ:</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={publicLink}
                              readOnly
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={handleCopyLink}
                              >
                                Sao chép
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Hết hạn sau (ngày):</label>
                          <input
                            type="number"
                            className="form-control"
                            value={expiresIn}
                            onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                            min="1"
                            max="365"
                          />
                        </div>
                        <div className="form-group">
                          <label>Mật khẩu (tùy chọn):</label>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Để trống nếu không cần mật khẩu"
                          />
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={handleCreatePublicLink}
                          disabled={loading}
                        >
                          {loading ? 'Đang tạo...' : 'Tạo link'}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    {friends.length === 0 ? (
                      <p className="text-muted">Bạn chưa có bạn bè nào</p>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Chọn bạn bè:</label>
                          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {friends.map((friend) => (
                              <div key={friend.id} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedFriends.includes(friend.id)}
                                  onChange={() => toggleFriendSelection(friend.id)}
                                />
                                <label className="form-check-label">
                                  {friend.name} ({friend.email})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={handleShareWithFriends}
                          disabled={loading || selectedFriends.length === 0}
                        >
                          {loading ? 'Đang chia sẻ...' : 'Chia sẻ'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoModal;
