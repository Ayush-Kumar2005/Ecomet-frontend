/** True when logged-in user has admin privileges (backend should set role or isAdmin on login). */
export const isAdminUser = (userInfo) => {
  if (!userInfo) return false;
  return (
    userInfo.isAdmin === true ||
    userInfo.role === "admin" ||
    userInfo.user?.isAdmin === true ||
    userInfo.user?.role === "admin"
  );
};
