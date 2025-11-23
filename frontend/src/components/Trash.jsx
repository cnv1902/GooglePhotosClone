import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";

const Trash = () => {
  useDocumentTitle("Thùng rác - Google Photos Clone");
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await api.getTrash();
      setTrash(data.data || []);
    } catch (error) {
      console.error("Error loading trash:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (ids) => {
    try {
      await api.restoreMedia(ids);
      loadTrash();
    } catch (error) {
      alert("Khôi phục thất bại: " + error.message);
    }
  };

  const handleDelete = async (ids) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn?")) {
      try {
        await api.forceDeleteMedia(ids);
        loadTrash();
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      }
    }
  };

  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <h4>Thùng rác</h4>
                {loading ? (
                  <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {trash.map((item) => (
                      <div key={item.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                        <div className="position-relative">
                          <img
                            src={`${STORAGE_BASE_URL}/storage/${item.thumbnail_path || item.file_path}`}
                            alt={item.original_name}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          />
                          <div className="position-absolute top-0 end-0 p-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleRestore([item.id])}
                            >
                              Khôi phục
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete([item.id])}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Trash;

