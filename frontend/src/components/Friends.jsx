import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const Friends = () => {
  useDocumentTitle("Bạn bè - Google Photos Clone");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await api.getFriends();
      setFriends(data || []);
    } catch (error) {
      console.error("Error loading friends:", error);
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
                <h4>Bạn bè</h4>
                {loading ? (
                  <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {friends.map((friend) => (
                      <div key={friend.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="card">
                          <div className="card-body text-center">
                            <img
                              src={friend.avatar || "/src/assets/images/user/1.jpg"}
                              alt={friend.name}
                              className="rounded-circle mb-2"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                            <h5>{friend.name}</h5>
                            <p className="text-muted">{friend.email}</p>
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

export default Friends;

