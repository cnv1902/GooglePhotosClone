import React from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "/src/assets/css/backend-plugin.min.css";
import "/src/assets/css/backend.css";
import "/src/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "/src/assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "/src/assets/vendor/remixicon/fonts/remixicon.css";
import "/src/assets/vendor/doc-viewer/include/pdf/pdf.viewer.css";
import "/src/assets/vendor/doc-viewer/include/PPTXjs/css/pptxjs.css";
import "/src/assets/vendor/doc-viewer/include/PPTXjs/css/nv.d3.min.css";
import "/src/assets/vendor/doc-viewer/include/SheetJS/handsontable.full.min.css";
import "/src/assets/vendor/doc-viewer/include/verySimpleImageViewer/css/jquery.verySimpleImageViewer.css";
import "/src/assets/vendor/doc-viewer/include/officeToHtml/officeToHtml.css";

const AuthSignIn = () => {
  useDocumentTitle("Đăng nhập - Google Photos Clone");
  
  return (
    <div className="wrapper">
      <section className="login-content">
      <div className="container h-100">
        <div className="row justify-content-center align-items-center height-self-center">
          <div className="col-md-5 col-sm-12 col-12 align-self-center">
            <div className="sign-user_card">
              <img src="/src/assets/images/unnamed.png" className="img-fluid rounded-normal light-logo logo" alt="logo" />
              <h3 className="mb-3">Đăng nhập</h3>
              <p>Đăng nhập để tiếp tục sử dụng.</p>
              <form>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="floating-label form-group">
                      <input className="floating-input form-control" type="email" placeholder=" " />
                      <label>Email</label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="floating-label form-group">
                      <input className="floating-input form-control" type="password" placeholder=" " />
                      <label>Mật khẩu</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="custom-control custom-checkbox mb-3 text-left">
                      <input type="checkbox" className="custom-control-input" id="customCheck1" />
                      <label className="custom-control-label" htmlFor="customCheck1">Ghi nhớ đăng nhập</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <a href="/recover-password" className="text-primary float-right">Quên mật khẩu?</a>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
                <p className="mt-3">
                  Chưa có tài khoản? <a href="/sign-up" className="text-primary">Đăng ký</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default AuthSignIn;
