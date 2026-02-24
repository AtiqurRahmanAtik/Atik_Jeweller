import Swal from "sweetalert2";
import toast from "react-hot-toast";

export const handleLogOut = async (logoutUser, navigate) => {
  try {
    // Call the logout function
    await logoutUser();
    toast.success("User logged out successfully");

    // Clear local storage (if needed)
    localStorage.removeItem("authUser");
    localStorage.removeItem("authBranch");

    // Redirect to the login or home page
    navigate("/");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: "Logout failed. Please try again later.",
    });
    console.error(error);
  }
};
