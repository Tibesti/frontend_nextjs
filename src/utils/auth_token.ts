const user = typeof window !== "undefined" ? sessionStorage.getItem("user") : false;
let userObject; 
if (typeof user === 'string') {
    userObject = JSON.parse(user);
}
export const user_data = userObject;
export const auth_token = userObject?.access_token || "";