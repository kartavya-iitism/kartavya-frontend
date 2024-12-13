const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
        return err;
    }
};

export function AuthVerify() {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
        const decodedJwt = parseJwt(accessToken);
        if (decodedJwt.exp * 1000 < Date.now()) {
            localStorage.clear();
            return false;
        }
    }
    if (!accessToken) return false;
    return true;
};

export default AuthVerify;