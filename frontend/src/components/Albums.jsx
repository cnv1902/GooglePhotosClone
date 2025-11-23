import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const Albums = () => {
  useDocumentTitle("Album - Google Photos Clone");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const data = await api.getAlbums();
      setAlbums(data.data || []);
    } catch (error) {
      console.error("Error loading albums:", error);
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
                <h4>Album của tôi</h4>
                {loading ? (
                  <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {albums.map((album) => (
                      <div key={album.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <h5>{album.title}</h5>
                            <p className="text-muted">{album.description}</p>
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

export default Albums;

