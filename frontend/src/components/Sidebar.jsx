import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getStoragePercentage = () => {
    if (!user) return 0;
    return Math.round((user.storage_used / user.storage_limit) * 100);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="iq-sidebar sidebar-default">
      <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
        <Link to="/" className="header-logo">
          <img src="/src/assets/images/unnamed.png" className="img-fluid rounded-normal light-logo" alt="logo" />
        </Link>
        <h4>Google Photo</h4>
        <div className="iq-menu-bt-sidebar">
          <i className="las la-bars wrapper-menu"></i>
        </div>
      </div>
      <div className="data-scrollbar" data-scroll="1">
        <nav className="iq-sidebar-menu">
          <ul id="iq-sidebar-toggle" className="iq-menu">
            <li className={isActive('/')}>
              <Link to="/">
                <i className="las la-home iq-arrow-left"></i>
                <span>Bảng điều khiển</span>
              </Link>
            </li>
            <li className={isActive('/photos')}>
              <Link to="/photos">
                <i className="las la-images iq-arrow-left"></i>
                <span>Ảnh của tôi</span>
              </Link>
            </li>
            <li className={isActive('/albums')}>
              <Link to="/albums">
                <i className="las la-folder iq-arrow-left"></i>
                <span>Album</span>
              </Link>
            </li>
            <li className={isActive('/shared')}>
              <Link to="/shared">
                <i className="las la-share-alt iq-arrow-left"></i>
                <span>Đã chia sẻ</span>
              </Link>
            </li>
            <li className={isActive('/friends')}>
              <Link to="/friends">
                <i className="las la-user-friends iq-arrow-left"></i>
                <span>Bạn bè</span>
              </Link>
            </li>
            <li className={isActive('/favorites')}>
              <Link to="/favorites">
                <i className="lar la-star iq-arrow-left"></i>
                <span>Yêu thích</span>
              </Link>
            </li>
            <li className={isActive('/trash')}>
              <Link to="/trash">
                <i className="las la-trash-alt iq-arrow-left"></i>
                <span>Thùng rác</span>
              </Link>
            </li>
            <li className={isActive('/notifications')}>
              <Link to="/notifications">
                <i className="las la-bell iq-arrow-left"></i>
                <span>Thông báo</span>
              </Link>
            </li>
            <li className={isActive('/profile-edit')}>
              <Link to="/profile-edit">
                <i className="las la-user-cog iq-arrow-left"></i>
                <span>Cài đặt</span>
              </Link>
            </li>
          </ul>
        </nav>
        {user && (
          <div className="sidebar-bottom">
            <h4 className="mb-3">
              <i className="las la-cloud mr-2"></i>Bộ nhớ
            </h4>
            <p>{formatBytes(user.storage_used)} / {formatBytes(user.storage_limit)} đã sử dụng</p>
            <div className="iq-progress-bar mb-3">
              <span 
                className="bg-primary iq-progress progress-1" 
                style={{ width: `${getStoragePercentage()}%` }}
              ></span>
            </div>
            <p>{getStoragePercentage()}% - còn trống {formatBytes(user.storage_limit - user.storage_used)}</p>
          </div>
        )}
        <div className="p-3"></div>
      </div>
    </div>
  );
};

export default Sidebar;
