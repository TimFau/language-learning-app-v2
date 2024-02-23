export function cookieExists(name: string) {
	const value = "; " + document.cookie;
	let parts 
    parts = value.split("; " + name + "=");
	if (parts.length === 2) {
        // return parts.pop().split(";").shift();
        return true
    } else {
        return false;
    }
};

export function CheckIsEmail(email: string) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.match(regex)) {
        return true
    } else {
        return false
    }
}