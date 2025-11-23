import React from "react";

const Dashboard = () => {
  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card-transparent card-block card-stretch card-height mb-3">
              <div className="d-flex justify-content-between">
                <div className="select-dropdown input-prepend input-append">
                  <div className="btn-group">
                    <div data-toggle="dropdown">
                      <div className="dropdown-toggle search-query">
                        Ổ đĩa của tôi<i className="las la-angle-down ml-3"></i>
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
                <div className="dashboard1-dropdown d-flex align-items-center">
                  <div className="dashboard1-info">
                    <a href="#calander" className="collapsed" data-toggle="collapse" aria-expanded="false">
                      <i className="ri-arrow-down-s-line"></i>
                    </a>
                    <ul id="calander" className="iq-dropdown collapse list-inline m-0 p-0 mt-2">
                      <li className="mb-2">
                        <a href="#" data-toggle="tooltip" data-placement="right" title="Lịch">
                          <i className="ri-calendar-line"></i>
                        </a>
                      </li>
                      <li className="mb-2">
                        <a href="#" data-toggle="tooltip" data-placement="right" title="Ghi chú">
                          <i className="ri-bookmark-line"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" data-toggle="tooltip" data-placement="right" title="Nhiệm vụ">
                          <i className="ri-task-line"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div
              className="card card-block card-stretch card-height iq-welcome"
              style={{
                background: "url(/src/assets/images/layouts/mydrive/background.png) no-repeat scroll right center",
                backgroundColor: "#ffffff",
                backgroundSize: "contain",
              }}
            >
              <div className="card-body property2-content">
                <div className="d-flex flex-wrap align-items-center">
                  <div className="col-lg-6 col-sm-6 p-0">
                    <h3 className="mb-3">Chào mừng bạn</h3>
                    <p className="mb-5">Bạn có 32 thông báo mới và 23 tin nhắn chưa đọc cần trả lời</p>
                    <a href="#">
                      Dùng thử ngay<i className="las la-arrow-right ml-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-block card-stretch card-height">
              <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Truy cập nhanh</h4>
                </div>
              </div>
              <div className="card-body">
                <ul className="list-inline p-0 mb-0 row align-items-center">
                  <li className="col-lg-6 col-sm-6 mb-3 mb-sm-0">
                    <div
                      data-load-file="file"
                      data-load-target="#resolte-contaniner"
                      data-url="/src/assets/vendor/doc-viewer/files/demo.pdf"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      data-title="Product-planning.pdf"
                      style={{ cursor: "pointer" }}
                      className="p-2 text-center border rounded"
                    >
                      <div>
                        <img src="/src/assets/images/layouts/mydrive/folder-1.png" className="img-fluid mb-1" alt="image1" />
                      </div>
                      <p className="mb-0">Kế hoạch</p>
                    </div>
                  </li>
                  <li className="col-lg-6 col-sm-6">
                    <div
                      data-load-file="file"
                      data-load-target="#resolte-contaniner"
                      data-url="/src/assets/vendor/doc-viewer/files/demo.docx"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      data-title="Wireframe.docx"
                      style={{ cursor: "pointer" }}
                      className="p-2 text-center border rounded"
                    >
                      <div>
                        <img src="/src/assets/images/layouts/mydrive/folder-2.png" className="img-fluid mb-1" alt="image2" />
                      </div>
                      <p className="mb-0">Wireframe</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-transparent">
              <div className="card-header d-flex justify-content-between pb-0">
                <div className="header-title">
                  <h4 className="card-title">Tài liệu</h4>
                </div>
                <div className="card-header-toolbar d-flex align-items-center">
                  <a href="./page-folders.html" className="view-more">
                    Xem tất cả
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="card card-block card-stretch card-height">
              <div className="card-body image-thumb">
                <a
                  href="#"
                  data-title="Terms.pdf"
                  data-load-file="file"
                  data-load-target="#resolte-contaniner"
                  data-url="/src/assets/vendor/doc-viewer/files/demo.pdf"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <div className="mb-4 text-center p-3 rounded iq-thumb">
                    <div className="iq-image-overlay"></div>
                    <img src="/src/assets/images/layouts/page-1/pdf.png" className="img-fluid" alt="image1" />
                  </div>
                  <h6>Terms.pdf</h6>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="card card-block card-stretch card-height">
              <div className="card-body image-thumb">
                <a
                  href="#"
                  data-title="New-one.docx"
                  data-load-file="file"
                  data-load-target="#resolte-contaniner"
                  data-url="/src/assets/vendor/doc-viewer/files/demo.docx"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <div className="mb-4 text-center p-3 rounded iq-thumb">
                    <div className="iq-image-overlay"></div>
                    <img src="/src/assets/images/layouts/page-1/doc.png" className="img-fluid" alt="image1" />
                  </div>
                  <h6>New-one.docx</h6>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="card card-block card-stretch card-height">
              <div className="card-body image-thumb">
                <a
                  href="#"
                  data-title="Woo-box.xlsx"
                  data-load-file="file"
                  data-load-target="#resolte-contaniner"
                  data-url="/src/assets/vendor/doc-viewer/files/demo.xlsx"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <div className="mb-4 text-center p-3 rounded iq-thumb">
                    <div className="iq-image-overlay"></div>
                    <img src="/src/assets/images/layouts/page-1/xlsx.png" className="img-fluid" alt="image1" />
                  </div>
                  <h6>Woo-box.xlsx</h6>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="card card-block card-stretch card-height">
              <div className="card-body image-thumb doc-text">
                <a
                  href="#"
                  data-title="IOS-content.pptx"
                  data-load-file="file"
                  data-load-target="#resolte-contaniner"
                  data-url="/src/assets/vendor/doc-viewer/files/demo.pptx"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <div className="mb-4 text-center p-3 rounded iq-thumb">
                    <div className="iq-image-overlay"></div>
                    <img src="/src/assets/images/layouts/page-1/ppt.png" className="img-fluid" alt="image1" />
                  </div>
                  <h6>IOS-content.pptx</h6>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-transparent">
              <div className="card-header d-flex justify-content-between pb-0">
                <div className="header-title">
                  <h4 className="card-title">Thư mục</h4>
                </div>
                <div className="card-header-toolbar d-flex align-items-center">
                  <div className="dropdown">
                    <span className="dropdown-toggle dropdown-bg btn bg-white" id="dropdownMenuButton1" data-toggle="dropdown">
                      Tên<i className="ri-arrow-down-s-line ml-1"></i>
                    </span>
                    <div className="dropdown-menu dropdown-menu-right shadow-none" aria-labelledby="dropdownMenuButton1">
                      <a className="dropdown-item" href="#">
                        Sửa đổi gần đây
                      </a>
                      <a className="dropdown-item" href="#">
                        Tôi sửa đổi gần đây
                      </a>
                      <a className="dropdown-item" href="#">
                        Tôi mở gần đây
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-3">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <a href="./page-alexa.html" className="folder">
                    <div className="icon-small bg-danger rounded mb-4">
                      <i className="ri-file-copy-line"></i>
                    </div>
                  </a>
                  <div className="card-header-toolbar">
                    <div className="dropdown">
                      <span className="dropdown-toggle" id="dropdownMenuButton2" data-toggle="dropdown">
                        <i className="ri-more-2-fill"></i>
                      </span>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton2">
                        <a className="dropdown-item" href="#">
                          <i className="ri-eye-fill mr-2"></i>Xem
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-delete-bin-6-fill mr-2"></i>Xóa
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-pencil-fill mr-2"></i>Chỉnh sửa
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-printer-fill mr-2"></i>In
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-file-download-fill mr-2"></i>Tải xuống
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="./page-alexa.html" className="folder">
                  <h5 className="mb-2">Alexa Workshop</h5>
                  <p className="mb-2">
                    <i className="lar la-clock text-danger mr-2 font-size-20"></i> 10 Th12, 2020
                  </p>
                  <p className="mb-0">
                    <i className="las la-file-alt text-danger mr-2 font-size-20"></i> 08 Tệp
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-3">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <a href="./page-android.html" className="folder">
                    <div className="icon-small bg-primary rounded mb-4">
                      <i className="ri-file-copy-line"></i>
                    </div>
                  </a>
                  <div className="card-header-toolbar">
                    <div className="dropdown">
                      <span className="dropdown-toggle" id="dropdownMenuButton3" data-toggle="dropdown">
                        <i className="ri-more-2-fill"></i>
                      </span>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton3">
                        <a className="dropdown-item" href="#">
                          <i className="ri-eye-fill mr-2"></i>View
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-delete-bin-6-fill mr-2"></i>Delete
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-pencil-fill mr-2"></i>Edit
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-printer-fill mr-2"></i>Print
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-file-download-fill mr-2"></i>Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="./page-android.html" className="folder">
                  <h5 className="mb-2">Android</h5>
                  <p className="mb-2">
                    <i className="lar la-clock text-primary mr-2 font-size-20"></i> 09 Dec, 2020
                  </p>
                  <p className="mb-0">
                    <i className="las la-file-alt text-primary mr-2 font-size-20"></i> 08 Files
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-3">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <a href="./page-brightspot.html" className="folder">
                    <div className="icon-small bg-info rounded mb-4">
                      <i className="ri-file-copy-line"></i>
                    </div>
                  </a>
                  <div className="card-header-toolbar">
                    <div className="dropdown">
                      <span className="dropdown-toggle" id="dropdownMenuButton4" data-toggle="dropdown">
                        <i className="ri-more-2-fill"></i>
                      </span>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton4">
                        <a className="dropdown-item" href="#">
                          <i className="ri-eye-fill mr-2"></i>View
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-delete-bin-6-fill mr-2"></i>Delete
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-pencil-fill mr-2"></i>Edit
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-printer-fill mr-2"></i>Print
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-file-download-fill mr-2"></i>Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="./page-brightspot.html" className="folder">
                  <h5 className="mb-2">Brightspot</h5>
                  <p className="mb-2">
                    <i className="lar la-clock text-info mr-2 font-size-20"></i> 07 Dec, 2020
                  </p>
                  <p className="mb-0">
                    <i className="las la-file-alt text-info mr-2 font-size-20"></i> 08 Files
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-3">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <a href="./page-ionic.html" className="folder">
                    <div className="icon-small bg-success rounded mb-4">
                      <i className="ri-file-copy-line"></i>
                    </div>
                  </a>
                  <div className="card-header-toolbar">
                    <div className="dropdown">
                      <span className="dropdown-toggle" id="dropdownMenuButton5" data-toggle="dropdown">
                        <i className="ri-more-2-fill"></i>
                      </span>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton5">
                        <a className="dropdown-item" href="#">
                          <i className="ri-eye-fill mr-2"></i>View
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-delete-bin-6-fill mr-2"></i>Delete
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-pencil-fill mr-2"></i>Edit
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-printer-fill mr-2"></i>Print
                        </a>
                        <a className="dropdown-item" href="#">
                          <i className="ri-file-download-fill mr-2"></i>Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="./page-ionic.html" className="folder">
                  <h5 className="mb-2">Ionic Chat App</h5>
                  <p className="mb-2">
                    <i className="lar la-clock text-success mr-2 font-size-20"></i> 06 Dec, 2020
                  </p>
                  <p className="mb-0">
                    <i className="las la-file-alt text-success mr-2 font-size-20"></i> 08 Files
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-block card-stretch card-height plan-bg">
              <div className="card-body">
                <h4 className="mb-3 text-white">Nâng cấp gói của bạn</h4>
                <p>
                  Mở rộng dung lượng, Truy cập<br /> Nhiều tính năng hơn
                </p>
                <div className="row align-items-center justify-content-between">
                  <div className="col-6 go-white">
                    <a href="#" className="btn d-inline-block mt-5">
                      Nâng cấp Premium
                    </a>
                  </div>
                  <div className="col-6">
                    <img src="/src/assets/images/layouts/mydrive/lock-bg.png" className="img-fluid" alt="image1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card card-block card-stretch card-height">
              <div className="card-header d-flex justify-content-between pb-0">
                <div className="header-title">
                  <h4 className="card-title">Bộ nhớ</h4>
                </div>
                <div className="card-header-toolbar d-flex align-items-center">
                  <div className="dropdown">
                    <span
                      className="dropdown-toggle btn dropdown-bg border border-primary text-primary rounded"
                      id="dropdownMenuButton11"
                      data-toggle="dropdown"
                    >
                      Theo tháng<i className="ri-arrow-down-s-line ml-1"></i>
                    </span>
                    <div className="dropdown-menu dropdown-menu-right shadow-none" aria-labelledby="dropdownMenuButton11">
                      <a className="dropdown-item" href="#">
                        Theo tháng
                      </a>
                      <a className="dropdown-item" href="#">
                        Theo tuần
                      </a>
                      <a className="dropdown-item" href="#">
                        Theo năm
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div id="layout-1-chart2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
