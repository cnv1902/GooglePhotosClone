import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';
import { STORAGE_BASE_URL } from '../utils/config';
import PhotoModal from './PhotoModal';

const FriendProfile = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useDocumentTitle(friend ? `${friend.name} - Google Photos Clone` : 'Trang bạn bè');

  useEffect(() => {
    loadFriendProfile();
  }, [friendId]);

  const loadFriendProfile = async () => {
    setLoading(true);
    try {
      // Get friend info from friend list
      const friendsData = await api.getFriends('accepted');
      const foundFriend = friendsData.find(f => f.id === parseInt(friendId));
      
      if (!foundFriend) {
        alert('Không tìm thấy bạn bè');
        navigate('/friends');
        return;
      }
      
      setFriend(foundFriend);

      // Get shared photos from this friend
      const sharesData = await api.getSharedWithMe();
      const allShares = sharesData.data || [];
      // Lọc các chia sẻ từ bạn bè này (media)
      const friendShares = allShares.filter(share => {
        const sharedById = share.shared_by || share.sharedBy?.id;
        return sharedById === parseInt(friendId) && share.shareable_type === 'media';
      });

      // Extract media from shares
      const photos = friendShares.map(share => share.shareable).filter(Boolean);
      setSharedPhotos(photos);
    } catch (error) {
      console.error('Error loading friend profile:', error);
      alert(error.message || 'Không thể tải thông tin bạn bè');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">Không tìm thấy thông tin bạn bè</div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {/* Friend Header */}
              <div className="d-flex align-items-center mb-4">
                <div className="mr-3">
                  {friend.avatar ? (
                    <img
                      src={`${STORAGE_BASE_URL}/storage/${friend.avatar}`}
                      alt={friend.name}
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px', fontSize: '32px' }}
                    >
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="mb-1">{friend.name}</h3>
                  <p className="text-muted mb-0">{friend.email}</p>
                </div>
              </div>

              {/* Shared Photos Section */}
              <div className="mt-4">
                <h5 className="mb-3">Ảnh {friend.name} đã chia sẻ cho bạn</h5>
                {sharedPhotos.length === 0 ? (
                  <p className="text-muted">Chưa có ảnh nào được chia sẻ</p>
                ) : (
                  <div className="row">
                    {sharedPhotos.map((photo) => (
                      <div key={photo.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                        <div
                          className="position-relative"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={`${STORAGE_BASE_URL}/storage/${photo.thumbnail_path || photo.file_path}`}
                            alt={photo.original_name}
                            className="img-fluid rounded"
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                          {photo.mime_type?.startsWith('video/') && (
                            <div
                              className="position-absolute"
                              style={{
                                top: '8px',
                                right: '8px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                              }}
                            >
                              <i className="fa fa-play-circle"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Back Button */}
              <div className="mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/friends')}
                >
                  Quay lại danh sách bạn bè
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default FriendProfile;
