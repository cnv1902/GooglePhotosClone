import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  return (
    <div className="iq-top-navbar">
      <div className="iq-navbar-custom">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
            <i className="ri-menu-line wrapper-menu"></i>
            <Link href="/index" className="header-logo">
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
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-pdf bg-info"></i>PDF
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-alt bg-primary"></i>Tài liệu
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-excel bg-success"></i>Bảng tính
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-powerpoint bg-danger"></i>Trình chiếu
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-image bg-warning"></i>Ảnh & Hình ảnh
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="item">
                          <i className="far fa-file-video bg-info"></i>Video
                        </div>
                      </a>
                    </li>
                  </ul>
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
                <li className="nav-item nav-icon dropdown">
                  <a
                    href="#"
                    className="search-toggle dropdown-toggle"
                    id="dropdownMenuButton01"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="ri-question-line"></i>
                  </a>
                  <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton01">
                    <div className="card shadow-none m-0">
                      <div className="card-body p-0">
                        <div className="p-3">
                          <a href="#" className="iq-sub-card pt-0">
                            <i className="ri-questionnaire-line"></i>Trợ giúp
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-recycle-line"></i>Hướng dẫn
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-refresh-line"></i>Cập nhật
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-service-line"></i>Điều khoản và Chính sách
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-feedback-line"></i>Gửi phản hồi
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="nav-item nav-icon dropdown">
                  <a
                    href="#"
                    className="search-toggle dropdown-toggle"
                    id="dropdownMenuButton02"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="ri-settings-3-line"></i>
                  </a>
                  <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton02">
                    <div className="card shadow-none m-0">
                      <div className="card-body p-0">
                        <div className="p-3">
                          <a href="#" className="iq-sub-card pt-0">
                            <i className="ri-settings-3-line"></i> Cài đặt
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-hard-drive-line"></i> Tải ứng dụng cho máy tính
                          </a>
                          <a href="#" className="iq-sub-card">
                            <i className="ri-keyboard-line"></i> Phím tắt
                          </a>
                        </div>
                      </div>
                    </div>
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
                    <div className="caption bg-primary line-height">P</div>
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
                              <img 
                                src="/src/assets/images/user/1.jpg" 
                                alt="profile-bg" 
                                className="rounded-circle avatar-80"
                              />
                            </div>
                            <div className="profile-detail mt-3">
                              <h5 className="mb-1">Penny Tech</h5>
                              <p className="mb-0">penny@example.com</p>
                            </div>
                          </div>
                          <div className="profile-details border-top pt-3">
                            <Link to="/profile-edit" className="iq-sub-card iq-bg-primary-hover mb-2">
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
                            <Link to="/sign-in" className="iq-sub-card iq-bg-danger-hover">
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle iq-card-icon-small mr-3">
                                  <i className="ri-logout-box-line"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">Đăng xuất</h6>
                                  <p className="mb-0 font-size-12">Thoát khỏi tài khoản</p>
                                </div>
                              </div>
                            </Link>
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
