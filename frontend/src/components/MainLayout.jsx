import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
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

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ẩn loader sau khi component mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load scripts
    const scripts = [
      "/src/assets/js/backend-bundle.min.js",
      "/src/assets/js/customizer.js",
      "/src/assets/js/chart-custom.js",
      "/src/assets/vendor/doc-viewer/include/pdf/pdf.js",
      "/src/assets/vendor/doc-viewer/include/docx/jszip-utils.js",
      "/src/assets/vendor/doc-viewer/include/docx/mammoth.browser.min.js",
      "/src/assets/vendor/doc-viewer/include/PPTXjs/js/filereader.js",
      "/src/assets/vendor/doc-viewer/include/PPTXjs/js/d3.min.js",
      "/src/assets/vendor/doc-viewer/include/PPTXjs/js/nv.d3.min.js",
      "/src/assets/vendor/doc-viewer/include/PPTXjs/js/pptxjs.js",
      "/src/assets/vendor/doc-viewer/include/PPTXjs/js/divs2slides.js",
      "/src/assets/vendor/doc-viewer/include/SheetJS/handsontable.full.min.js",
      "/src/assets/vendor/doc-viewer/include/SheetJS/xlsx.full.min.js",
      "/src/assets/vendor/doc-viewer/include/verySimpleImageViewer/js/jquery.verySimpleImageViewer.js",
      "/src/assets/vendor/doc-viewer/include/officeToHtml/officeToHtml.js",
      "/src/assets/js/doc-viewer.js",
      "/src/assets/js/app.js"
    ];

    const loadedScripts = [];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
      loadedScripts.push(script);
    });

    return () => {
      loadedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <>
      {loading && (
        <div id="loading">
          <div id="loading-center"></div>
        </div>
      )}
      <div className="wrapper">
        <Sidebar />
        <Navbar />
        <div className="content-page">
          {children}
        </div>
      </div>
      <footer className="iq-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <a href="/src/backend/privacy-policy.html">Chính sách bảo mật</a>
                </li>
                <li className="list-inline-item">
                  <a href="/src/backend/terms-of-service.html">Điều khoản sử dụng</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 text-right">
              <span className="mr-1">
                <script>document.write(new Date().getFullYear())</script>©
              </span>{" "}
              <a href="#" className="">
                Google Photo
              </a>
              .
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
