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

const AuthConfirmMail = () => {
  useDocumentTitle("Xác nhận Email - Google Photos Clone");
  
  return (
    <div className="wrapper">
      <section className="login-content">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center height-self-center">
          <div className="col-md-5 col-sm-12 col-12 align-self-center">
            <div className="sign-user_card">
              <img src="/src/assets/images/logo.png" className="img-fluid rounded-normal light-logo logo" alt="logo" />
              <img src="/src/assets/images/logo-white.png" className="img-fluid rounded-normal darkmode-logo logo" alt="logo" />
              <h2 className="mt-3 mb-3">Thành công!</h2>
              <p className="cnf-mail m-auto mb-1">
                Một email đã được gửi đến youremail@domain.com. 
                Vui lòng kiểm tra email của bạn và nhấp vào liên kết kèm theo để đặt lại mật khẩu.
              </p>
              <div className="d-inline-block w-100">
                <a href="/" type="submit" className="btn btn-primary mt-3">
                  Quay về trang chủ
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  </section>
  </div>
  );
};

export default AuthConfirmMail;