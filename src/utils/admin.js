/** Admin access — supports common backend user shapes */
export const isAdmin = (userInfo) => {
  if (!userInfo) return false;
  const user = userInfo.user || userInfo;
  return (
    user.isAdmin === true ||
    user.role === "admin" ||
    user.isAdmin === "true" ||
    userInfo.isAdmin === true ||
    userInfo.role === "admin"
  );
};

export const getAuthToken = (userInfo) =>
  userInfo?.token || userInfo?.user?.token || localStorage.getItem("token");
