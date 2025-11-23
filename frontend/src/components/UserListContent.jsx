import React from "react";

const UserListContent = () => {
  const users = [
    {
      id: 1,
      profile: "/src/assets/images/user/01.jpg",
      name: "Anna Sthesia",
      contact: "(760) 756 7568",
      email: "annasthesia@gmail.com",
      country: "USA",
      status: "Active",
      statusClass: "iq-bg-primary",
      company: "Acme Corporation",
      joinDate: "2019/12/01",
    },
    {
      id: 2,
      profile: "/src/assets/images/user/02.jpg",
      name: "Brock Lee",
      contact: "+62 5689 458 658",
      email: "brocklee@gmail.com",
      country: "Indonesia",
      status: "Active",
      statusClass: "iq-bg-primary",
      company: "Soylent Corp",
      joinDate: "2019/12/01",
    },
    {
      id: 3,
      profile: "/src/assets/images/user/03.jpg",
      name: "Dan Druff",
      contact: "+55 6523 456 856",
      email: "dandruff@gmail.com",
      country: "Brazil",
      status: "Pending",
      statusClass: "iq-bg-warning",
      company: "Umbrella Corporation",
      joinDate: "2019/12/01",
    },
    {
      id: 4,
      profile: "/src/assets/images/user/04.jpg",
      name: "Hans Olo",
      contact: "+91 2586 253 125",
      email: "hansolo@gmail.com",
      country: "India",
      status: "Inactive",
      statusClass: "iq-bg-danger",
      company: "Vehement Capital",
      joinDate: "2019/12/01",
    },
    {
      id: 5,
      profile: "/src/assets/images/user/05.jpg",
      name: "Lynn Guini",
      contact: "+27 2563 456 589",
      email: "lynnguini@gmail.com",
      country: "Africa",
      status: "Active",
      statusClass: "iq-bg-primary",
      company: "Massive Dynamic",
      joinDate: "2019/12/01",
    },
    {
      id: 6,
      profile: "/src/assets/images/user/06.jpg",
      name: "Eric Shun",
      contact: "+55 25685 256 589",
      email: "ericshun@gmail.com",
      country: "Brazil",
      status: "Pending",
      statusClass: "iq-bg-warning",
      company: "Globex Corporation",
      joinDate: "2019/12/01",
    },
    {
      id: 7,
      profile: "/src/assets/images/user/07.jpg",
      name: "aaronottix",
      contact: "(760) 765 2658",
      email: "budwiser@ymail.com",
      country: "USA",
      status: "Hold",
      statusClass: "iq-bg-info",
      company: "Acme Corporation",
      joinDate: "2019/12/01",
    },
    {
      id: 8,
      profile: "/src/assets/images/user/08.jpg",
      name: "Marge Arita",
      contact: "+27 5625 456 589",
      email: "margearita@gmail.com",
      country: "Africa",
      status: "Complite",
      statusClass: "iq-bg-success",
      company: "Vehement Capital",
      joinDate: "2019/12/01",
    },
    {
      id: 9,
      profile: "/src/assets/images/user/09.jpg",
      name: "Bill Dabear",
      contact: "+55 2563 456 589",
      email: "billdabear@gmail.com",
      country: "Brazil",
      status: "active",
      statusClass: "iq-bg-primary",
      company: "Massive Dynamic",
      joinDate: "2019/12/01",
    },
  ];

  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Danh sách người dùng</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="row justify-content-between">
                  <div className="col-sm-6 col-md-6">
                    <div id="user_list_datatable_info" className="dataTables_filter">
                      <form className="mr-3 position-relative">
                        <div className="form-group mb-0">
                          <input
                            type="search"
                            className="form-control"
                            id="exampleInputSearch"
                            placeholder="Tìm kiếm"
                            aria-controls="user-list-table"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-6">
                    <div className="user-list-files d-flex">
                      <a className="bg-primary" href="javascript:void();">
                        In
                      </a>
                      <a className="bg-primary" href="javascript:void();">
                        Excel
                      </a>
                      <a className="bg-primary" href="javascript:void();">
                        Pdf
                      </a>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table
                    id="user-list-table"
                    className="table table-striped table-bordered mt-4"
                    role="grid"
                    aria-describedby="user-list-page-info"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Ảnh đại diện</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Liên hệ</th>
                        <th scope="col">Email</th>
                        <th scope="col">Quốc gia</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Công ty</th>
                        <th scope="col">Ngày tham gia</th>
                        <th scope="col">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="text-center">
                            <img
                              className="rounded img-fluid avatar-40"
                              src={user.profile}
                              alt="profile"
                            />
                          </td>
                          <td>{user.name}</td>
                          <td>{user.contact}</td>
                          <td>{user.email}</td>
                          <td>{user.country}</td>
                          <td>
                            <span className={`badge ${user.statusClass}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.company}</td>
                          <td>{user.joinDate}</td>
                          <td>
                            <div className="flex align-items-center list-user-action">
                              <a
                                className="iq-bg-primary"
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="Thêm"
                                href="#"
                              >
                                <i className="ri-user-add-line"></i>
                              </a>
                              <a
                                className="iq-bg-primary"
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="Sửa"
                                href="#"
                              >
                                <i className="ri-pencil-line"></i>
                              </a>
                              <a
                                className="iq-bg-primary"
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="Xóa"
                                href="#"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="row justify-content-between mt-3">
                  <div id="user-list-page-info" className="col-md-6">
                    <span>Hiển thị 1 đến 9 của 9 mục</span>
                  </div>
                  <div className="col-md-6">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end mb-0">
                        <li className="page-item disabled">
                          <a
                            className="page-link"
                            href="#"
                            tabIndex="-1"
                            aria-disabled="true"
                          >
                            Trước
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            Sau
                          </a>
                        </li>
                      </ul>
                    </nav>
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

export default UserListContent;

