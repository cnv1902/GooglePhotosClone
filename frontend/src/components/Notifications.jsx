import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const Notifications = () => {
  useDocumentTitle("Thông báo - Google Photos Clone");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationsAsRead([id]);
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <h4>Thông báo</h4>
                {loading ? (
                  <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`card mb-2 ${!notification.is_read ? "border-primary" : ""}`}
                      >
                        <div className="card-body">
                          <h5>{notification.title}</h5>
                          <p>{notification.message}</p>
                          <small className="text-muted">
                            {new Date(notification.created_at).toLocaleString("vi-VN")}
                          </small>
                          {!notification.is_read && (
                            <button
                              className="btn btn-sm btn-primary float-right"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
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

export default Notifications;

