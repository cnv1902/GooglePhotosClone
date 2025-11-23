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

const AuthRecoverPassword = () => {
  useDocumentTitle("Khôi phục mật khẩu - Google Photos Clone");
  
  return (
    <div className="wrapper">
      <section className="login-content">
      <div className="container h-100">
        <div className="row justify-content-center align-items-center height-self-center">
          <div className="col-md-5 col-sm-12 col-12 align-self-center">
            <div className="sign-user_card">
              <img src="/src/assets/images/unnamed.png" className="img-fluid rounded-normal light-logo logo" alt="logo" />
              <h2 className="mb-3">Đặt lại mật khẩu</h2>
              <p>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn email có hướng dẫn đặt lại mật khẩu.</p>
              <form action="/confirm-mail">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="floating-label form-group">
                      <input className="floating-input form-control" type="email" placeholder=" " />
                      <label>Email</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Đặt lại</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default AuthRecoverPassword;
