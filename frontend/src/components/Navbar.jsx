import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { STORAGE_BASE_URL } from "../utils/config";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `${STORAGE_BASE_URL}/storage/${user.avatar}`;
    }
    return '/src/assets/images/user/1.jpg';
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  };
  
  return (
    <div className="iq-top-navbar">
      <div className="iq-navbar-custom">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
            <i className="ri-menu-line wrapper-menu"></i>
            <Link to="/" className="header-logo">
              <img src="/src/assets/images/logo.png" className="img-fluid rounded-normal light-logo" alt="logo" />
              <img src="/src/assets/images/logo-white.png" className="img-fluid rounded-normal darkmode-logo" alt="logo" />
            </Link>
          </div>
          <div className="iq-search-bar device-search">
            <form>
              <div className="input-prepend input-append">
                <div className="btn-group">
                  <label className="dropdown-toggle searchbox" data-toggle="dropdown">
                    <input
                      className="dropdown-toggle search-query text search-input"
                      type="text"
                      placeholder="Nhập để tìm kiếm..."
                    />
                    <span className="search-replace"></span>
                    <a className="search-link" href="#">
                      <i className="ri-search-line"></i>
                    </a>
                    <span className="caret"></span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-label="Toggle navigation"
            >
              <i className="ri-menu-3-line"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto navbar-list align-items-center">
                <li className="nav-item nav-icon">
                  <button
                    className="btn btn-link"
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "Bật chế độ sáng" : "Bật chế độ tối"}
                  >
                    <i className={isDarkMode ? "ri-sun-line" : "ri-moon-line"}></i>
                  </button>
                </li>
                <li className="nav-item nav-icon search-content">
                  <a
                    href="#"
                    className="search-toggle rounded"
                    id="dropdownSearch"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="ri-search-line"></i>
                  </a>
                  <div className="iq-search-bar iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownSearch">
                    <form action="#" className="searchbox p-2">
                      <div className="form-group mb-0 position-relative">
                        <input type="text" className="text search-input font-size-12" placeholder="nhập để tìm kiếm..." />
                        <a href="#" className="search-link">
                          <i className="las la-search"></i>
                        </a>
                      </div>
                    </form>
                  </div>
                </li>
                <li className="nav-item nav-icon dropdown caption-content">
                  <a
                    href="#"
                    className="search-toggle dropdown-toggle"
                    id="dropdownMenuButton03"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    {user?.avatar ? (
                      <img 
                        src={getAvatarUrl()} 
                        alt="avatar" 
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="caption bg-primary line-height">{getInitials()}</div>
                    )}
                  </a>
                  <div 
                    className={`iq-sub-dropdown dropdown-menu ${isProfileOpen ? 'show' : ''}`}
                    aria-labelledby="dropdownMenuButton03"
                    style={{ right: 0, left: 'auto' }}
                  >
                    <div className="card mb-0">
                      <div className="card-header d-flex justify-content-between align-items-center mb-0">
                        <div className="header-title">
                          <h4 className="card-title mb-0">Hồ sơ</h4>
                        </div>
                        <div className="close-data text-right badge badge-primary cursor-pointer">
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="profile-header">
                          <div className="cover-container text-center mb-3">
                            <div className="profile-img-edit position-relative">
                              {user?.avatar ? (
                                <img 
                                  src={getAvatarUrl()} 
                                  alt="profile-bg" 
                                  className="rounded-circle avatar-80"
                                />
                              ) : (
                                <div className="rounded-circle avatar-80 bg-primary d-flex align-items-center justify-content-center text-white" style={{ fontSize: '2rem' }}>
                                  {getInitials()}
                                </div>
                              )}
                            </div>
                            <div className="profile-detail mt-3">
                              <h5 className="mb-1">{user?.name || 'Người dùng'}</h5>
                              <p className="mb-0">{user?.email || ''}</p>
                            </div>
                          </div>
                          <div className="profile-details border-top pt-3">
                            <Link 
                              to="/profile-edit" 
                              className="iq-sub-card iq-bg-primary-hover mb-2"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle iq-card-icon-small mr-3">
                                  <i className="ri-file-user-line"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Hồ sơ cá nhân</h6>
                                  <p className="mb-0 font-size-12">Xem và chỉnh sửa hồ sơ</p>
                                </div>
                              </div>
                            </Link>
                            <a 
                              href="#" 
                              className="iq-sub-card iq-bg-danger-hover"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle iq-card-icon-small mr-3">
                                  <i className="ri-logout-box-line"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Đăng xuất</h6>
                                  <p className="mb-0 font-size-12">Thoát khỏi tài khoản</p>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
