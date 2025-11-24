import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { STORAGE_BASE_URL } from '../utils/config';
import { useAuth } from '../contexts/AuthContext';
import chroma from 'chroma-js';

const PhotoModal = ({ photo, onClose, onPhotoDeleted }) => {
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
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [tagLoading, setTagLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('');

  useEffect(() => {
    if (photo) {
      loadShares();
      loadFriends();
      loadTags();
      loadAlbums();
    }
  }, [photo]);

  const loadAlbums = async () => {
    try {
      const data = await api.getAlbums();
      setAlbums(data.data || []);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  const loadShares = async () => {
    try {
      const data = await api.getMyShares({ shareable_type: 'media', shareable_id: photo.id });
      setShares(data.data || []);
    } catch (error) {
      console.error('Error loading shares:', error);
    }
  };

  const loadTags = async () => {
    if (!photo) return;
    try {
      // Media detail đã có tags? nếu chưa fetch bằng getMediaById
      const data = await api.getMediaById(photo.id);
      setTags(data.tags || []);
    } catch (e) {
      console.error('Error loading tags:', e);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    setTagLoading(true);
    try {
      const tagPayload = [{ name: newTagName.trim(), color: newTagColor }];
      const result = await api.addTagsToMedia(photo.id, tagPayload);
      setTags(result.media.tags || []);
      setNewTagName('');
    } catch (e) {
      alert(e.message || 'Không thêm được tag');
    } finally {
      setTagLoading(false);
    }
  };

  const handleRemoveTag = async (tagId) => {
    if (!window.confirm('Xóa tag khỏi ảnh?')) return;
    setTagLoading(true);
    try {
      const result = await api.removeTagsFromMedia(photo.id, [tagId]);
      setTags(result.media.tags || []);
    } catch (e) {
      alert(e.message || 'Không xóa được tag');
    } finally {
      setTagLoading(false);
    }
  };

  const getTagStyle = (color) => {
    try {
      const bg = chroma(color || '#3B82F6');
      return {
        backgroundColor: bg.hex(),
        color: bg.luminance() > 0.5 ? '#222' : '#fff',
        border: 'none',
      };
    } catch {
      return { backgroundColor: '#3B82F6', color: '#fff', border: 'none' };
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

  const handleDeleteToTrash = async () => {
    if (!window.confirm('Chuyển ảnh vào thùng rác?')) return;
    try {
      await api.deleteMedia([photo.id]);
      alert('Đã chuyển vào thùng rác');
      if (onPhotoDeleted) onPhotoDeleted(photo.id);
      onClose();
    } catch (error) {
      alert(error.message || 'Xóa thất bại');
    }
  };

  const handleAddToAlbum = async () => {
    if (!selectedAlbum) {
      alert('Vui lòng chọn album');
      return;
    }
    try {
      await api.addMediaToAlbum(selectedAlbum, [photo.id]);
      alert('Đã thêm vào album');
      setShowAlbumModal(false);
    } catch (error) {
      alert(error.message || 'Thêm vào album thất bại');
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
        <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
            <div className="modal-header">
              <h5 className="modal-title">{photo.original_name}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body text-center" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <img
                src={imageUrl}
                alt={photo.original_name}
                className="img-fluid"
                style={{ maxHeight: '50vh', maxWidth: '100%', objectFit: 'contain' }}
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

              {/* Tags section */}
              <div className="mt-3 text-left">
                <h6 className="mb-2">Tags</h6>
                {tags.length === 0 && (
                  <p className="text-muted small mb-2">Chưa có tag</p>
                )}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {tags.map(t => (
                    <span key={t.id} className="badge position-relative mr-2 mb-2" style={getTagStyle(t.color)}>
                      {t.name}
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-light p-0 ml-1"
                        style={{ textDecoration: 'none' }}
                        onClick={(e) => { e.stopPropagation(); handleRemoveTag(t.id); }}
                      >×</button>
                    </span>
                  ))}
                </div>
                <div className="d-flex align-items-center" style={{ gap: '8px', maxWidth: '300px' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Tên tag"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    disabled={tagLoading}
                  />
                  <input
                    type="color"
                    className="form-control form-control-sm"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    disabled={tagLoading}
                    style={{ width: '60px' }}
                  />
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleAddTag}
                    disabled={tagLoading || !newTagName.trim()}
                  >{tagLoading ? 'Đang...' : 'Thêm'}</button>
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
            <div className="modal-footer d-flex flex-wrap" style={{ gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-sm btn-primary" 
                onClick={() => setShowShareModal(true)}
              >
                Chia sẻ
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-info" 
                onClick={() => setShowAlbumModal(true)}
              >
                Thêm vào album
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-danger" 
                onClick={handleDeleteToTrash}
              >
                Xóa
              </button>
              <button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Album Modal */}
      {showAlbumModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => setShowAlbumModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm vào album</h5>
                <button type="button" className="close" onClick={() => setShowAlbumModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {albums.length === 0 ? (
                  <p className="text-muted">Bạn chưa có album nào</p>
                ) : (
                  <div className="form-group">
                    <label>Chọn album:</label>
                    <select 
                      className="form-control" 
                      value={selectedAlbum} 
                      onChange={(e) => setSelectedAlbum(e.target.value)}
                    >
                      <option value="">-- Chọn album --</option>
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToAlbum}
                  disabled={!selectedAlbum || albums.length === 0}
                >
                  Thêm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAlbumModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => setShowShareModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
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
