/**
 * @desc Wrapper for cookie-based operations.
 * @author RJS3c
 */

// One day before collection by the
// browser.
const COOKIE_AGE = 86400;

class Cookie {

    constructor(key, value) {
        /**
         * 
         */

        this.key = key;
        this.value = value;

        this.setCookie(value);
    }

    getCookie() {
        /**
         * 
         */

        return [this.key, this.value]
    }

    setCookie(value, expires = COOKIE_AGE) {
        /**
         * 
         */

        document.cookie = 
        
            `${encodeURIComponent(this.key)}=${encodeURIComponent(value) || ''};`
                + `Max\-Age=${expires}`;

        this.value = value;
    }

    voidCookie(key) {
        /**
         * 
         */

        this.setCookie(this.key, "", 0);
    }
}

export default class CookieJar {

    constructor(cookies) {
        /**
         * @param {object} cookies 
         */

        // Create singleton behaviour.
        if (CookieJar.instance) { return CookieJar.instance };

        CookieJar.instance = this;

        this.cookies = [];
        
        // Get existing cookies.
        this.parseCookies(cookies);
    }

    parseCookies(cookies) {
        /**
         * 
         */

        // Semicolon-delimeted values, which once
        // split will be iterated over and mapped
        // to appropriate representation.
        cookies.split("; ").forEach(element => {
            
            let [key, value] = element.split("=");

            this.cookies.push(new Cookie(key, value));
        });
    }

    getCookie(key) {
        /**
         * 
         */

        let cookie_result = null;

        this.cookies.forEach(cookie => {

            if (cookie.key === key) {

                cookie_result = cookie;

                return;
            }
        });

        return cookie_result;
    }

    cookieExists(key) {
        /**
         * 
         */

        return this.getCookie(key) !== null;
    }

    setCookie(key, value) {
        /**
         * 
         */

        this.cookies.push(new Cookie(key, value));
    }

    updateCookieValue(key, value, expires = COOKIE_AGE) { 
        /**
         * 
         */

        if (this.cookieExists(key))

            this.getCookie(key).setCookie(key, value, expires);
    }

    voidCookie(key) {
        /**
         * 
         */

        if (this.cookieExists(key)) {

            let cookie = this.getCookie(key);

            cookie.voidCookie(key);

            // Pop from list of cookies.
            this.cookies.splice(
                this.cookies.indexOf(cookie),
                1
            );
        }
    }
}