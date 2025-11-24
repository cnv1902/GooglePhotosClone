import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  useDocumentTitle("Thông báo - Google Photos Clone");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
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

  const loadUnreadCount = async () => {
    try {
      const data = await api.getUnreadNotificationCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationsAsRead([id]);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === 'friend_request') {
      navigate('/friends', { state: { tab: 'requests' } });
    } else if (notification.type === 'share') {
      navigate('/shared');
    } else if (notification.data?.media_file_id) {
      navigate('/photos');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Thông báo {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}</h4>
                {notifications.length > 0 && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleMarkAllAsRead}
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Đang tải...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Không có thông báo nào</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`card mb-2 ${!notification.is_read ? "border-primary" : ""}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h5>
                              {notification.title}
                              {!notification.is_read && (
                                <span className="badge badge-primary ml-2">Mới</span>
                              )}
                            </h5>
                            <p className="mb-1">{notification.message}</p>
                            <small className="text-muted">
                              {new Date(notification.created_at).toLocaleString("vi-VN")}
                            </small>
                          </div>
                          <div className="ml-2">
                            {!notification.is_read && (
                              <button
                                className="btn btn-sm btn-primary mr-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
                                  handleDeleteNotification(notification.id);
                                }
                              }}
                            >
                              Xóa
                            </button>
                          </div>
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

export default Notifications;
