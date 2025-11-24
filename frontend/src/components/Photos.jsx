import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../contexts/AuthContext";
import PhotoGrid from "./PhotoGrid";
import api from "../services/api";

const Photos = () => {
  useDocumentTitle("Ảnh của tôi - Google Photos Clone");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const addToAlbumId = location.state?.addToAlbumId || null;
  const [addingToAlbum, setAddingToAlbum] = useState(false);
  const [selectedForAlbum, setSelectedForAlbum] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      await api.uploadMedia(Array.from(files));
      alert('Upload thành công!');
      // Force reload photos by triggering a refresh
      window.dispatchEvent(new Event('photos-uploaded'));
    } catch (error) {
      alert('Upload thất bại: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleUpload(files);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Ảnh của tôi {addToAlbumId && <span className="badge badge-info ml-2">Chọn để thêm vào album</span>}</h4>
                <div className="d-flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Đang upload...' : 'Upload ảnh'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <PhotoGrid 
                onUpload={handleUpload} 
                showBulkActions={!addToAlbumId} 
                addToAlbumId={addToAlbumId}
                onAddSelectionChange={(ids)=> setSelectedForAlbum(ids)}
              />
              {addToAlbumId && (
                <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1050 }}>
                  {selectedForAlbum.length === 0 ? (
                    <button className="btn btn-secondary" disabled>Chọn ảnh để thêm</button>
                  ) : (
                    <button className="btn btn-primary" disabled={addingToAlbum} onClick={async ()=> {
                      if (selectedForAlbum.length === 0) return;
                      setAddingToAlbum(true);
                      try {
                        await api.addMediaToAlbum(addToAlbumId, selectedForAlbum);
                        alert(`Đã thêm ${selectedForAlbum.length} ảnh vào album`);
                        navigate(`/albums/${addToAlbumId}`);
                      } catch (e) {
                        alert(e.message || 'Không thể thêm vào album');
                      } finally {
                        setAddingToAlbum(false);
                      }
                    }}>
                      {addingToAlbum ? 'Đang thêm...' : `Thêm vào album (${selectedForAlbum.length})`}
                    </button>
                  )}
                  <button className="btn btn-light btn-sm mt-2" onClick={()=> navigate(`/albums/${addToAlbumId}`)}>Hủy</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photos;

