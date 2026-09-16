// import { create } from "zustand";
// import api from "../api/axios";

// const useAuthStore = create((set) => ({
//   user: null,
//   accessToken: null,
//   isAuthenticated: false,
//   isLoading: false,

//   setAuth: (user, accessToken) => {
//     localStorage.setItem("accessToken", accessToken);

//     set({
//       user,
//       accessToken,
//       isAuthenticated: true,
//       isLoading: false,
//     });
//   },

//   getCurrentUser: async () => {
//     try {
//       set({ isLoading: true });

//       const storedToken = localStorage.getItem("accessToken");

//       if (!storedToken) {
//         set({
//           user: null,
//           accessToken: null,
//           isAuthenticated: false,
//           isLoading: false,
//         });

//         return;
//       }

//       const response = await api.get("/auth/me", {
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//         },
//       });

//       if (response.data.success) {
//         set({
//           user: response.data.user,
//           accessToken: storedToken,
//           isAuthenticated: true,
//           isLoading: false,
//         });
//       } else {
//         localStorage.removeItem("accessToken");

//         set({
//           user: null,
//           accessToken: null,
//           isAuthenticated: false,
//           isLoading: false,
//         });
//       }
//     } catch (error) {
//       console.error("Get Current User Error:", error);

//       localStorage.removeItem("accessToken");

//       set({
//         user: null,
//         accessToken: null,
//         isAuthenticated: false,
//         isLoading: false,
//       });
//     }
//   },

//   login: async (email, password) => {
//     try {
//       set({ isLoading: true });

//       const response = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       if (response.data.success) {
//         const { user, accessToken } = response.data;

//         localStorage.setItem("accessToken", accessToken);

//         set({
//           user,
//           accessToken,
//           isAuthenticated: true,
//           isLoading: false,
//         });

//         return {
//           success: true,
//           user,
//         };
//       }

//       set({ isLoading: false });

//       return {
//         success: false,
//         message: response.data.message || "Login failed",
//       };
//     } catch (error) {
//       set({ isLoading: false });

//       console.error("Login Error:", error);

//       return {
//         success: false,
//         message:
//           error.response?.data?.message ||
//           "Login failed",
//       };
//     }
//   },

//   logout: async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.removeItem("accessToken");

//       set({
//         user: null,
//         accessToken: null,
//         isAuthenticated: false,
//         isLoading: false,
//       });
//     }
//   },
// }));

// export default useAuthStore;



import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,

  // =========================
  // SET AUTH
  // =========================
  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // =========================
  // UPDATE USER
  // =========================
  updateUser: (updatedUser) => {
    set({
      user: updatedUser,
    });
  },

  // =========================
  // GET CURRENT USER
  // =========================
  getCurrentUser: async () => {
    const storedToken = localStorage.getItem("accessToken");

    if (!storedToken) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return {
        success: false,
      };
    }

    set({
      isLoading: true,
    });

    try {
      const response = await api.get("/auth/me");

      if (response.data?.success && response.data?.user) {
        const currentUser = response.data.user;

        set({
          user: currentUser,
          accessToken: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return {
          success: true,
          user: currentUser,
        };
      }

      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return {
        success: false,
      };
    } catch (error) {
      console.error("Get Current User Error:", error);

      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return {
        success: false,
      };
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // =========================
  // LOGIN
  // =========================
  login: async (email, password) => {
    try {
      set({
        isLoading: true,
      });

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.success) {
        const { user, accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return {
          success: true,
          user,
        };
      }

      set({
        isLoading: false,
      });

      return {
        success: false,
        message:
          response.data?.message || "Login failed",
      };
    } catch (error) {
      console.error("Login Error:", error);

      set({
        isLoading: false,
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;