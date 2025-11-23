import React from "react";

const UserProfileEditContent = () => {
  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="iq-edit-list usr-edit">
                  <ul className="iq-edit-profile d-flex nav nav-pills">
                    <li className="col-md-3 p-0">
                      <a className="nav-link active" data-toggle="pill" href="#personal-information">
                        Thông tin cá nhân
                      </a>
                    </li>
                    <li className="col-md-3 p-0">
                      <a className="nav-link" data-toggle="pill" href="#chang-pwd">
                        Đổi mật khẩu
                      </a>
                    </li>
                    <li className="col-md-3 p-0">
                      <a className="nav-link" data-toggle="pill" href="#emailandsms">
                        Email và SMS
                      </a>
                    </li>
                    <li className="col-md-3 p-0">
                      <a className="nav-link" data-toggle="pill" href="#manage-contact">
                        Quản lý liên hệ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="iq-edit-list-data">
              <div className="tab-content">
                <div className="tab-pane fade active show" id="personal-information" role="tabpanel">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Thông tin cá nhân</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="form-group row align-items-center">
                          <div className="col-md-12">
                            <div className="profile-img-edit">
                              <div className="crm-profile-img-edit">
                                <img
                                  className="crm-profile-pic rounded-circle avatar-100"
                                  src="/src/assets/images/user/11.png"
                                  alt="profile-pic"
                                />
                                <div className="crm-p-image bg-primary">
                                  <i className="las la-pen upload-button"></i>
                                  <input className="file-upload" type="file" accept="image/*" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="form-group col-sm-6">
                            <label htmlFor="fname">Họ:</label>
                            <input type="text" className="form-control" id="fname" defaultValue="Barry" />
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="lname">Tên:</label>
                            <input type="text" className="form-control" id="lname" defaultValue="Tech" />
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="uname">Tên người dùng:</label>
                            <input type="text" className="form-control" id="uname" defaultValue="Barry@01" />
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="cname">Thành phố:</label>
                            <input type="text" className="form-control" id="cname" defaultValue="Atlanta" />
                          </div>
                          <div className="form-group col-sm-6">
                            <label className="d-block">Giới tính:</label>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="customRadio6"
                                name="customRadio1"
                                className="custom-control-input"
                                defaultChecked
                              />
                              <label className="custom-control-label" htmlFor="customRadio6">
                                Nam
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input type="radio" id="customRadio7" name="customRadio1" className="custom-control-input" />
                              <label className="custom-control-label" htmlFor="customRadio7">
                                Nữ
                              </label>
                            </div>
                          </div>
                          <div className="form-group col-sm-6">
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input className="form-control" id="dob" defaultValue="1984-01-24" />
                          </div>
                          <div className="form-group col-sm-6">
                            <label>Tình trạng hôn nhân:</label>
                            <select className="form-control" id="exampleFormControlSelect1">
                              <option>Độc thân</option>
                              <option>Đã kết hôn</option>
                              <option>Góa</option>
                              <option>Đã ly hôn</option>
                              <option>Ly thân</option>
                            </select>
                          </div>
                          <div className="form-group col-sm-6">
                            <label>Độ tuổi:</label>
                            <select className="form-control" id="exampleFormControlSelect2">
                              <option>12-18</option>
                              <option>19-32</option>
                              <option>33-45</option>
                              <option>46-62</option>
                              <option>63 &gt; </option>
                            </select>
                          </div>
                          <div className="form-group col-sm-6">
                            <label>Quốc gia:</label>
                            <select className="form-control" id="exampleFormControlSelect3">
                              <option>Canada</option>
                              <option>Noida</option>
                              <option>USA</option>
                              <option>India</option>
                              <option>Africa</option>
                            </select>
                          </div>
                          <div className="form-group col-sm-6">
                            <label>Tỉnh/Bang:</label>
                            <select className="form-control" id="exampleFormControlSelect4">
                              <option>California</option>
                              <option>Florida</option>
                              <option>Georgia</option>
                              <option>Connecticut</option>
                              <option>Louisiana</option>
                            </select>
                          </div>
                          <div className="form-group col-sm-12">
                            <label>Địa chỉ:</label>
                            <textarea className="form-control" name="address" rows="5" style={{ lineHeight: "22px" }} defaultValue={`37 Cardinal Lane
Petersburg, VA 23803
United States of America
Zip Code: 85001`}>
                            </textarea>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mr-2">
                          Lưu
                        </button>
                        <button type="reset" className="btn iq-bg-danger">
                          Hủy
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="chang-pwd" role="tabpanel">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Đổi mật khẩu</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="form-group">
                          <label htmlFor="cpass">Mật khẩu hiện tại:</label>
                          <a href="#" className="float-right">
                            Quên mật khẩu
                          </a>
                          <input type="Password" className="form-control" id="cpass" defaultValue="" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="npass">Mật khẩu mới:</label>
                          <input type="Password" className="form-control" id="npass" defaultValue="" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="vpass">Xác nhận mật khẩu:</label>
                          <input type="Password" className="form-control" id="vpass" defaultValue="" />
                        </div>
                        <button type="submit" className="btn btn-primary mr-2">
                          Lưu
                        </button>
                        <button type="reset" className="btn iq-bg-danger">
                          Hủy
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="emailandsms" role="tabpanel">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Email và SMS</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="form-group row align-items-center">
                          <label className="col-md-3" htmlFor="emailnotification">
                            Thông báo Email:
                          </label>
                          <div className="col-md-9 custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="emailnotification" defaultChecked />
                            <label className="custom-control-label" htmlFor="emailnotification"></label>
                          </div>
                        </div>
                        <div className="form-group row align-items-center">
                          <label className="col-md-3" htmlFor="smsnotification">
                            Thông báo SMS:
                          </label>
                          <div className="col-md-9 custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="smsnotification" defaultChecked />
                            <label className="custom-control-label" htmlFor="smsnotification"></label>
                          </div>
                        </div>
                        <div className="form-group row align-items-center">
                          <label className="col-md-3" htmlFor="npass">
                            Khi nào gửi Email
                          </label>
                          <div className="col-md-9">
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email01" />
                              <label className="custom-control-label" htmlFor="email01">
                                Bạn có thông báo mới.
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email02" />
                              <label className="custom-control-label" htmlFor="email02">
                                Bạn nhận được tin nhắn trực tiếp
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email03" defaultChecked />
                              <label className="custom-control-label" htmlFor="email03">
                                Ai đó thêm bạn làm kết nối
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row align-items-center">
                          <label className="col-md-3" htmlFor="npass">
                            Khi nào gửi Email quan trọng
                          </label>
                          <div className="col-md-9">
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email04" />
                              <label className="custom-control-label" htmlFor="email04">
                                Khi có đơn hàng mới.
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email05" />
                              <label className="custom-control-label" htmlFor="email05">
                                Phê duyệt thành viên mới
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id="email06" defaultChecked />
                              <label className="custom-control-label" htmlFor="email06">
                                Đăng ký thành viên
                              </label>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mr-2">
                          Lưu
                        </button>
                        <button type="reset" className="btn iq-bg-danger">
                          Hủy
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="manage-contact" role="tabpanel">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h4 className="card-title">Quản lý liên hệ</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="form-group">
                          <label htmlFor="cno">Số điện thoại:</label>
                          <input type="text" className="form-control" id="cno" defaultValue="001 2536 123 458" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email:</label>
                          <input type="text" className="form-control" id="email" defaultValue="Barryjone@demo.com" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="url">Website:</label>
                          <input type="text" className="form-control" id="url" defaultValue="https://getbootstrap.com" />
                        </div>
                        <button type="submit" className="btn btn-primary mr-2">
                          Lưu
                        </button>
                        <button type="reset" className="btn iq-bg-danger">
                          Hủy
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditContent;
