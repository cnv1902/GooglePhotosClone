import React, { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { STORAGE_BASE_URL } from "../utils/config";

const Friends = () => {
  useDocumentTitle("Bạn bè - Google Photos Clone");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Check if there's state from navigation
    if (location.state?.tab) {
      return location.state.tab;
    }
    return "friends"; // friends, suggested, requests, search
  });
  const [friends, setFriends] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadPendingRequests();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === "friends") {
      await loadFriends();
    } else if (activeTab === "suggested") {
      await loadSuggestedUsers();
    } else if (activeTab === "requests") {
      await loadPendingRequests();
    }
  };

  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await api.getFriends("accepted");
      setFriends(data || []);
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getSuggestedUsers(20);
      setSuggestedUsers(data || []);
    } catch (error) {
      console.error("Error loading suggested users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const data = await api.getPendingRequests();
      setPendingRequests(data || []);
      setPendingCount(data?.length || 0);
    } catch (error) {
      console.error("Error loading pending requests:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchQuery.trim().length < 2) {
      alert("Vui lòng nhập ít nhất 2 ký tự để tìm kiếm");
      return;
    }
    setLoading(true);
    try {
      const data = await api.searchUsers(searchQuery.trim());
      setSearchResults(data || []);
      setActiveTab("search");
      if (data && data.length === 0) {
        // Không hiển thị alert nếu không có kết quả, chỉ hiển thị thông báo trong UI
      }
    } catch (error) {
      console.error("Error searching users:", error);
      alert(error.message || "Không thể tìm kiếm người dùng. Vui lòng thử lại.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      await api.sendFriendRequest(friendId);
      alert("Đã gửi lời mời kết bạn");
      if (activeTab === "suggested") {
        loadSuggestedUsers();
      } else if (activeTab === "search") {
        handleSearch({ preventDefault: () => {} });
      }
    } catch (error) {
      alert(error.message || "Gửi lời mời thất bại");
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await api.acceptFriendRequest(friendshipId);
      alert("Đã chấp nhận lời mời kết bạn");
      loadPendingRequests();
      loadFriends();
    } catch (error) {
      alert(error.message || "Chấp nhận thất bại");
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    try {
      await api.removeFriend(friendshipId);
      alert("Đã từ chối lời mời");
      loadPendingRequests();
    } catch (error) {
      alert(error.message || "Từ chối thất bại");
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bạn này?")) return;
    try {
      await api.removeFriend(friendshipId);
      alert("Đã xóa bạn");
      loadFriends();
    } catch (error) {
      alert(error.message || "Xóa bạn thất bại");
    }
  };

  const handleBlockFriend = async (friendId) => {
    if (!window.confirm("Bạn có chắc muốn chặn người dùng này?")) return;
    try {
      await api.blockFriend(friendId);
      alert("Đã chặn người dùng");
      loadFriends();
    } catch (error) {
      alert(error.message || "Chặn thất bại");
    }
  };

  const getAvatarUrl = (avatar) => {
    if (avatar) {
      return `${STORAGE_BASE_URL}/storage/${avatar}`;
    }
    return "/src/assets/images/user/11.png";
  };

  const renderUserCard = (userData, showActions = true, actions = null) => {
    const friendship = userData.friendship || null;
    const isPending = friendship?.status === "pending";
    const isSentByMe = friendship && friendship.user_id === user?.id;
    // Nếu không có quan hệ friendship nhưng có friendship_id (trả về từ danh sách bạn bè đã chấp nhận) thì vẫn coi là bạn
    const isAcceptedByField = !!userData.friendship_id;
    const isFriend = (friendship?.status === "accepted") || isAcceptedByField;

    return (
      <div key={userData.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
        <div className="card">
          <div className="card-body text-center">
            <div
              style={{ cursor: isFriend ? 'pointer' : 'default' }}
              onClick={() => isFriend && navigate(`/friends/${userData.id}`)}
            >
              <img
                src={getAvatarUrl(userData.avatar)}
                alt={userData.name}
                className="rounded-circle mb-2"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <h5>{userData.name}</h5>
              <p className="text-muted small">{userData.email}</p>
            </div>
            {showActions && (
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                {actions || (
                  <>
                    {!friendship && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => { e.stopPropagation(); handleSendRequest(userData.id); }}
                      >
                        Kết bạn
                      </button>
                    )}
                    {isPending && !isSentByMe && (
                      <>
                        <button
                          className="btn btn-sm btn-success mr-1"
                          onClick={(e) => { e.stopPropagation(); handleAcceptRequest(friendship.id); }}
                        >
                          Chấp nhận
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => { e.stopPropagation(); handleRejectRequest(friendship.id); }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {isPending && isSentByMe && (
                      <span className="badge badge-warning">Đã gửi lời mời</span>
                    )}
                    {friendship?.status === "accepted" && (
                      <>
                        <button
                          className="btn btn-sm btn-danger mr-1"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFriend(friendship.id); }}
                        >
                          Xóa bạn
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={(e) => { e.stopPropagation(); handleBlockFriend(userData.id); }}
                        >
                          Chặn
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Bạn bè</h4>
                <form onSubmit={handleSearch} className="d-flex">
                  <input
                    type="text"
                    className="form-control mr-2"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "300px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </form>
              </div>

              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "friends" ? "active" : ""}`}
                    onClick={() => setActiveTab("friends")}
                  >
                    Bạn bè ({friends.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
                    onClick={() => setActiveTab("requests")}
                  >
                    Lời mời kết bạn
                    {pendingCount > 0 && (
                      <span className="badge badge-danger ml-2">{pendingCount}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "suggested" ? "active" : ""}`}
                    onClick={() => setActiveTab("suggested")}
                  >
                    Gợi ý kết bạn
                  </button>
                </li>
                {searchResults.length > 0 && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "search" ? "active" : ""}`}
                      onClick={() => setActiveTab("search")}
                    >
                      Kết quả tìm kiếm ({searchResults.length})
                    </button>
                  </li>
                )}
              </ul>

              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Đang tải...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {activeTab === "friends" &&
                    (friends.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Bạn chưa có bạn bè nào</p>
                      </div>
                    ) : (
                      friends.map((friend) =>
                        renderUserCard(friend, true, (
                          <>
                            <button
                              className="btn btn-sm btn-danger mr-1"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFriend(friend.friendship_id); }}
                            >
                              Xóa bạn
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={(e) => { e.stopPropagation(); handleBlockFriend(friend.id); }}
                            >
                              Chặn
                            </button>
                          </>
                        ))
                      )
                    ))}

                  {activeTab === "requests" &&
                    (pendingRequests.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Không có lời mời kết bạn nào</p>
                      </div>
                    ) : (
                      pendingRequests.map((request) => (
                        <div key={request.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="card">
                            <div className="card-body text-center">
                              <img
                                src={getAvatarUrl(request.user.avatar)}
                                alt={request.user.name}
                                className="rounded-circle mb-2"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                              />
                              <h5>{request.user.name}</h5>
                              <p className="text-muted small">{request.user.email}</p>
                              <p className="text-muted small">
                                {new Date(request.created_at).toLocaleDateString("vi-VN")}
                              </p>
                              <div className="mt-2">
                                <button
                                  className="btn btn-sm btn-success mr-1"
                                  onClick={() => handleAcceptRequest(request.id)}
                                >
                                  Chấp nhận
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectRequest(request.id)}
                                >
                                  Từ chối
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ))}

                  {activeTab === "suggested" &&
                    (suggestedUsers.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Không có gợi ý nào</p>
                      </div>
                    ) : (
                      suggestedUsers.map((user) => renderUserCard(user))
                    ))}

                  {activeTab === "search" &&
                    (searchResults.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Không tìm thấy kết quả</p>
                      </div>
                    ) : (
                      searchResults.map((user) => renderUserCard(user))
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
