import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../contexts/AuthContext";
import "/src/assets/css/backend-plugin.min.css";
import "/src/assets/css/backend.css";
import "/src/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "/src/assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "/src/assets/vendor/remixicon/fonts/remixicon.css";

const AuthSignUp = () => {
  useDocumentTitle("Đăng ký - Google Photos Clone");
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center height-self-center">
            <div className="col-md-5 col-sm-12 col-12 align-self-center">
              <div className="sign-user_card">
                <img
                  src="/src/assets/images/unnamed.png"
                  className="img-fluid rounded-normal light-logo logo"
                  alt="logo"
                />
                <h3 className="mb-3">Đăng ký</h3>
                <p>Tạo tài khoản của bạn.</p>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="text"
                          placeholder=" "
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                        <label>Tên</label>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="email"
                          placeholder=" "
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                        <label>Email</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          placeholder=" "
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                        />
                        <label>Mật khẩu</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          placeholder=" "
                          value={formData.password_confirmation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password_confirmation: e.target.value,
                            })
                          }
                          required
                        />
                        <label>Xác nhận mật khẩu</label>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>
                  <p className="mt-3">
                    Đã có tài khoản?{" "}
                    <a href="/sign-in" className="text-primary">
                      Đăng nhập
                    </a>
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

export default AuthSignUp;
