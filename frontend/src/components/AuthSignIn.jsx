import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../contexts/AuthContext";
import "/src/assets/css/backend-plugin.min.css";
import "/src/assets/css/backend.css";
import "/src/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "/src/assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "/src/assets/vendor/remixicon/fonts/remixicon.css";

const AuthSignIn = () => {
  useDocumentTitle("Đăng nhập - Google Photos Clone");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
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
                <h3 className="mb-3">Đăng nhập</h3>
                <p>Đăng nhập để tiếp tục sử dụng.</p>
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
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          placeholder=" "
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          required
                        />
                        <label>Mật khẩu</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="custom-control custom-checkbox mb-3 text-left">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck1"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheck1"
                        >
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <a href="/recover-password" className="text-primary float-right">
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                  <p className="mt-3">
                    Chưa có tài khoản?{" "}
                    <a href="/sign-up" className="text-primary">
                      Đăng ký
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

export default AuthSignIn;
