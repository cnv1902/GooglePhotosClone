import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const Shared = () => {
  useDocumentTitle("Đã chia sẻ - Google Photos Clone");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShares();
  }, []);

  const loadShares = async () => {
    setLoading(true);
    try {
      const data = await api.getMyShares();
      setShares(data.data || []);
    } catch (error) {
      console.error("Error loading shares:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <h4>Đã chia sẻ</h4>
                {loading ? (
                  <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {shares.map((share) => (
                      <div key={share.id} className="col-lg-12 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <h5>Chia sẻ {share.shareable_type}</h5>
                            <p className="text-muted">Loại: {share.share_type}</p>
                            {share.token && (
                              <p>
                                <strong>Link:</strong> {window.location.origin}/shared/{share.token}
                              </p>
                            )}
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

export default Shared;

