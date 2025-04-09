import { useState, useEffect } from "react";
import "./Login/Login.css";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in and redirect if so
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(username, password, role);
      if (result.success) {
        // Retrieve user role from localStorage after login
        const userRole = localStorage.getItem("userRole");
        // Redirect user based on the role and refresh the page
        if (userRole === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (userRole === "teacher") {
          window.location.href = "/teacher/dashboard";
        } else {
          window.location.href = "/student/dashboard";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      {/* Left: Image */}
      <Grid item xs={12} md={6}>
        <img
          src="https://navigates.vn/wp-content/uploads/2023/06/co-so-vat-chat-dai-hoc-cong-nghe-sai-gon-1.jpg"
          alt="Campus"
          style={{ width: "140vh", height: "99.2vh", objectFit: "fill" }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box className="loginPageContainer" sx={{ p: 2, ml: 18 }}>
          <Paper
            elevation={4}
            className="loginPaper"
            sx={{
              width: "100%",
              maxWidth: 500,
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              className="login-title"
            >
              Đăng nhập
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {error && (
              <Alert severity="error" className="loginAlert">
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleLogin}
              className="loginFormBox"
            >
              <FormControl fullWidth margin="normal">
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Vai trò"
                  sx={{
                    "& .MuiSelect-select": {
                      color:
                        role === "admin"
                          ? "#d32f2f"
                          : role === "student"
                          ? "#2e7d32"
                          : "#ed6c02",
                    },
                  }}
                >
                  <MenuItem
                    value="student"
                    sx={{
                      color: "#2e7d32 !important",
                      "&:hover": { backgroundColor: "rgba(46, 125, 50, 0.08)" },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(46, 125, 50, 0.12)",
                      },
                    }}
                  >
                    Sinh viên
                  </MenuItem>

                  <MenuItem
                    value="teacher"
                    sx={{
                      color: "#ed6c02 !important",
                      "&:hover": { backgroundColor: "rgba(237, 108, 2, 0.08)" },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(237, 108, 2, 0.12)",
                      },
                    }}
                  >
                    Giáo viên
                  </MenuItem>

                  <MenuItem
                    value="admin"
                    sx={{
                      color: "#d32f2f !important",
                      "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(211, 47, 47, 0.12)",
                      },
                    }}
                  >
                    Quản trị viên
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="loginButtonMui"
                size="large"
                disabled={loading}
                sx={{ mt: 5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
