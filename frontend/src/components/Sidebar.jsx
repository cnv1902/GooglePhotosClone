import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
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
        <div className="new-create select-dropdown input-prepend input-append">
          <div className="btn-group">
            <div data-toggle="dropdown">
              <div className="search-query selet-caption">
                <i className="las la-plus pr-2"></i>Tạo mới
              </div>
              <span className="search-replace"></span>
              <span className="caret"></span>
            </div>
            <ul className="dropdown-menu">
              <li>
                <div className="item">
                  <i className="ri-folder-add-line pr-3"></i>Thư mục mới
                </div>
              </li>
              <li>
                <div className="item">
                  <i className="ri-file-upload-line pr-3"></i>Tải lên tệp
                </div>
              </li>
              <li>
                <div className="item">
                  <i className="ri-folder-upload-line pr-3"></i>Tải lên thư mục
                </div>
              </li>
            </ul>
          </div>
        </div>
        <nav className="iq-sidebar-menu">
          <ul id="iq-sidebar-toggle" className="iq-menu">
            <li className="active">
                <Link to="/">
                    <i className="las la-home iq-arrow-left"></i>
                    <span>Bảng điều khiển</span>
                </Link>
                <ul id="dashboard" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
                <Link to="/user-list">
                    <i className="las la-list-alt iq-arrow-left"></i>
                    <span>Danh sách người dùng</span>
                </Link>
                <ul id="user-list" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
              <a href="#mydrive" className="collapsed" data-toggle="collapse" aria-expanded="false">
                <i className="las la-hdd"></i>
                <span>Ổ đĩa của tôi</span>
                <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
              </a>
              <ul id="mydrive" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                <li className="">
                  <a href="../backend/page-alexa.html">
                    <i className="lab la-blogger-b"></i>
                    <span>Alexa Workshop</span>
                  </a>
                </li>
                <li className="">
                  <a href="../backend/page-android.html">
                    <i className="las la-share-alt"></i>
                    <span>Android</span>
                  </a>
                </li>
                <li className="">
                  <a href="../backend/page-brightspot.html">
                    <i className="las la-icons"></i>
                    <span>Brightspot</span>
                  </a>
                </li>
                <li className="">
                  <a href="../backend/page-ionic.html">
                    <i className="las la-icons"></i>
                    <span>Ionic Chat App</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className="">
              <a href="../backend/page-files.html" className="">
                <i className="lar la-file-alt iq-arrow-left"></i>
                <span>Tệp tin</span>
              </a>
              <ul id="page-files" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
              <a href="../backend/page-folders.html" className="">
                <i className="las la-stopwatch iq-arrow-left"></i>
                <span>Gần đây</span>
              </a>
              <ul id="page-folders" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
              <a href="../backend/page-favourite.html" className="">
                <i className="lar la-star"></i>
                <span>Yêu thích</span>
              </a>
              <ul id="page-fevourite" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
              <a href="../backend/page-delete.html" className="">
                <i className="las la-trash-alt iq-arrow-left"></i>
                <span>Thùng rác</span>
              </a>
              <ul id="page-delete" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle"></ul>
            </li>
            <li className="">
              <a href="#otherpage" className="collapsed" data-toggle="collapse" aria-expanded="false">
                <i className="lab la-wpforms iq-arrow-left"></i>
                <span>Trang khác</span>
                <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
              </a>
              <ul id="otherpage" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                <li className="">
                  <a href="#user" className="collapsed" data-toggle="collapse" aria-expanded="false">
                    <i className="las la-user-cog"></i>
                    <span>Thông tin người dùng</span>
                    <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                    <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
                  </a>
                  <ul id="user" className="iq-submenu collapse" data-parent="#otherpage">
                    <li className="">
                      <a href="../app/user-profile.html">
                        <i className="las la-id-card"></i>
                        <span>Hồ sơ người dùng</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../app/user-add.html">
                        <i className="las la-user-plus"></i>
                        <span>Thêm người dùng</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../app/user-list.html">
                        <i className="las la-list-alt"></i>
                        <span>Danh sách người dùng</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="">
                  <a href="#auth" className="collapsed" data-toggle="collapse" aria-expanded="false">
                    <i className="las la-torah iq-arrow-left"></i>
                    <span>Xác thực</span>
                    <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                    <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
                  </a>
                  <ul id="auth" className="iq-submenu collapse" data-parent="#otherpage">
                    <li className="">
                      <a href="../backend/auth-sign-in.html">
                        <i className="las la-sign-in-alt"></i>
                        <span>Đăng nhập</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../backend/auth-sign-up.html">
                        <i className="las la-registered"></i>
                        <span>Đăng ký</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../backend/auth-recoverpw.html">
                        <i className="las la-unlock-alt"></i>
                        <span>Khôi phục mật khẩu</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../backend/auth-confirm-mail.html">
                        <i className="las la-envelope-square"></i>
                        <span>Xác nhận Email</span>
                      </a>
                    </li>
                    <li className="">
                      <a href="../backend/auth-lock-screen.html">
                        <i className="las la-lock"></i>
                        <span>Khóa màn hình</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <h4 className="mb-3">
            <i className="las la-cloud mr-2"></i>Bộ nhớ
          </h4>
          <p>17.1 / 20 GB đã sử dụng</p>
          <div className="iq-progress-bar mb-3">
            <span className="bg-primary iq-progress progress-1" data-percent="67"></span>
          </div>
          <p>75% - còn trống 3.9 GB</p>
          <a href="#" className="btn btn-outline-primary view-more mt-4">
            Mua thêm dung lượng
          </a>
        </div>
        <div className="p-3"></div>
      </div>
    </div>
  );
};

export default Sidebar;
