import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import PhotoGrid from "./PhotoGrid";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      await api.uploadMedia(Array.from(files));
      alert('Upload thành công!');
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
                  <h4 className="mb-0">Google Photos Clone</h4>
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
                {user && (
                  <p className="text-muted mt-2">
                    Dung lượng đã dùng: {(user.storage_used / 1024 / 1024 / 1024).toFixed(2)} GB / 
                    {(user.storage_limit / 1024 / 1024 / 1024).toFixed(2)} GB
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <PhotoGrid onUpload={handleUpload} />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
