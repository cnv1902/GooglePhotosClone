import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { STORAGE_BASE_URL } from "../utils/config";

const Trash = () => {
  useDocumentTitle("Thùng rác - Google Photos Clone");
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

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
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn?")) return;
    try {
      await api.forceDeleteMedia(ids);
      loadTrash();
    } catch (error) {
      alert("Xóa thất bại: " + error.message);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const selectAllPage = () => setSelectedIds(trash.map((i) => i.id));
  const clearSelection = () => setSelectedIds([]);

  const bulkRestore = async () => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      await api.restoreMedia(selectedIds);
      clearSelection();
      loadTrash();
    } catch (e) {
      alert(e.message || "Lỗi");
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("Xóa vĩnh viễn các mục đã chọn?")) return;
    setBulkLoading(true);
    try {
      await api.forceDeleteMedia(selectedIds);
      clearSelection();
      loadTrash();
    } catch (e) {
      alert(e.message || "Lỗi");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Thùng rác</h4>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className={`btn btn-sm ${bulkMode ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => {
                      setBulkMode(!bulkMode);
                      if (bulkMode) clearSelection();
                    }}
                  >
                    {bulkMode ? "Thoát chọn" : "Chế độ chọn"}
                  </button>
                  {bulkMode && (
                    <>
                      <button className="btn btn-sm btn-outline-primary" onClick={selectAllPage}>
                        Chọn trang
                      </button>
                      <button className="btn btn-sm btn-outline-dark" onClick={clearSelection}>
                        Bỏ chọn
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        disabled={bulkLoading || selectedIds.length === 0}
                        onClick={bulkRestore}
                      >
                        Khôi phục ({selectedIds.length})
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={bulkLoading || selectedIds.length === 0}
                        onClick={bulkDelete}
                      >
                        Xóa ({selectedIds.length})
                      </button>
                    </>
                  )}
                </div>
              </div>
              {bulkLoading && <p className="small text-muted">Đang xử lý...</p>}
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
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            opacity: bulkMode && selectedIds.includes(item.id) ? 0.6 : 1,
                          }}
                          loading="lazy"
                        />
                        {bulkMode && (
                          <div
                            className="position-absolute"
                            style={{ top: "8px", left: "8px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(item.id);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelect(item.id)}
                            />
                          </div>
                        )}
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

