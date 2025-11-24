import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import PhotoModal from './PhotoModal';
import { STORAGE_BASE_URL } from '../utils/config';

const PhotoGrid = ({ groupBy = null, onUpload }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadPhotos = useCallback(async (pageNum = 1, reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      let data;
      if (groupBy === 'upload_date') {
        data = await api.getMediaGroupedByUploadDate();
        setPhotos(data);
        setHasMore(false);
      } else if (groupBy === 'taken_date') {
        data = await api.getMediaGroupedByTakenDate();
        setPhotos(data);
        setHasMore(false);
      } else if (groupBy === 'location') {
        data = await api.getMediaGroupedByLocation();
        setPhotos(data);
        setHasMore(false);
      } else {
        data = await api.getMedia({
          page: pageNum,
          per_page: 30,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        
        if (reset) {
          setPhotos(data.data || []);
        } else {
          setPhotos(prev => [...prev, ...(data.data || [])]);
        }
        
        setHasMore(data.current_page < data.last_page);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }, [groupBy, sortBy, sortOrder, loading]);

  useEffect(() => {
    loadPhotos(1, true);
  }, [groupBy, sortBy, sortOrder]);

  // Listen for upload events to reload photos
  useEffect(() => {
    const handleUploadComplete = () => {
      loadPhotos(1, true);
    };
    window.addEventListener('photos-uploaded', handleUploadComplete);
    return () => {
      window.removeEventListener('photos-uploaded', handleUploadComplete);
    };
  }, [loadPhotos]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore || groupBy) return;
    
    if (window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000) {
      setPage(prev => {
        const nextPage = prev + 1;
        loadPhotos(nextPage, false);
        return nextPage;
      });
    }
  }, [loading, hasMore, groupBy, loadPhotos]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (files.length > 0 && onUpload) {
      await onUpload(files);
      loadPhotos(1, true);
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    const files = [];
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/') || items[i].type.startsWith('video/')) {
        files.push(items[i].getAsFile());
      }
    }
    
    if (files.length > 0 && onUpload) {
      await onUpload(files);
      loadPhotos(1, true);
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const renderGroupedPhotos = () => {
    if (!Array.isArray(photos)) return null;
    
    return photos.map((group, idx) => (
      <div key={idx} className="mb-5">
        <h5 className="mb-3">{group.date || group.location}</h5>
        <div className="row">
          {group.files?.map((photo) => (
            <div key={photo.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
              <div 
                className="photo-item position-relative"
                onClick={() => handlePhotoClick(photo)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`${STORAGE_BASE_URL}/storage/${photo.thumbnail_path || photo.file_path}`}
                  alt={photo.original_name}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  loading="lazy"
                />
                {photo.is_favorite && (
                  <i className="ri-heart-fill position-absolute text-danger" 
                     style={{ top: '10px', right: '10px' }}></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const renderPhotos = () => {
    if (!Array.isArray(photos)) return null;
    
    return (
      <div className="row">
        {photos.map((photo) => (
          <div key={photo.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
            <div 
              className="photo-item position-relative"
              onClick={() => handlePhotoClick(photo)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`http://localhost:8000/storage/${photo.thumbnail_path || photo.file_path}`}
                alt={photo.original_name}
                className="img-fluid rounded"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                loading="lazy"
              />
              {photo.is_favorite && (
                <i className="ri-heart-fill position-absolute text-danger" 
                   style={{ top: '10px', right: '10px' }}></i>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={(e) => e.preventDefault()}
      style={{ minHeight: '400px' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Ảnh của tôi</h4>
        <div className="d-flex gap-2">
          <select 
            className="form-control form-control-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Ngày upload</option>
            <option value="taken_at">Ngày chụp</option>
            <option value="file_size">Kích thước</option>
          </select>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {groupBy ? renderGroupedPhotos() : renderPhotos()}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default PhotoGrid;

