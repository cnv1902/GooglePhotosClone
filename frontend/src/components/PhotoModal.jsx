import React from 'react';
import api from '../services/api';
import { STORAGE_BASE_URL } from '../utils/config';

const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;

  const imageUrl = `${STORAGE_BASE_URL}/storage/${photo.file_path}`;
  const thumbnailUrl = `${STORAGE_BASE_URL}/storage/${photo.thumbnail_path || photo.file_path}`;

  return (
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;

