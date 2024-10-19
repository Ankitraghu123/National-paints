const getTokenFromLocalStorage = () => {
  const adminToken = localStorage.getItem("adminToken");
  const accountantToken = localStorage.getItem("accountantToken");
  const hrToken = localStorage.getItem("hrToken");
  const receptionistToken = localStorage.getItem("receptionistToken");

  // Return the admin token if it exists; otherwise, return the associate token
  return adminToken || accountantToken || hrToken || receptionistToken || "";
};

// Clean the token by removing any extra quotes and escape characters
const cleanToken = getTokenFromLocalStorage() ? getTokenFromLocalStorage().replace(/^"|"$/g, '').replace(/\\/g, '') : "";


// Set up config headers with the cleaned token
export const config = {
  headers: {
    Authorization: `Bearer ${cleanToken}`,
    Accept: "application/json",
  },
};
  

export const isAdmin = () => {
  const adminToken = localStorage.getItem("adminToken");
  if(adminToken) return true

  return false
}

export const isHR = () => {
  const hrToken = localStorage.getItem("hrToken");
  if(hrToken) return true

  return false
}

export const isAccountant = () => {
  const accountantToken = localStorage.getItem("accountantToken");
  if(accountantToken) return true

  return false
}

export const isReceptionist = () => {
  const receptionistToken = localStorage.getItem("receptionistToken");
  if(receptionistToken) return true

  return false
}