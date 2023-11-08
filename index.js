const rp = require('request-promise'),
    crypto = require('crypto');

module.exports = class API {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
        this.url = 'https://api.emarsys.net/api/v2';
    }

    base64Sha1(str) {
        let hexDigest = crypto.createHash('sha1')
            .update(str)
            .digest('hex');

        return new Buffer(hexDigest).toString('base64');
    }

    getWsseHeader(user, pass) {
        let nonce = crypto.randomBytes(16).toString('hex');
        let timestamp = new Date().toISOString();
        let digest = this.base64Sha1(nonce + timestamp + pass);
        return 'UsernameToken Username="' + user + '", PasswordDigest="' + digest + '", Nonce="' + nonce + '", Created="' + timestamp + '"';
    }

    parse(body, response) {
        body = JSON.parse(body);
        if (body.replyCode != 0) {
            throw new Error(body.replyText);
        }
        return body;
    }

    setOptions(uri, optObj = {}) {
        uri = uri.substring(0, 1) === '/' ? uri : '/' + uri;
        return Object.assign({
            url: this.url + uri,
            headers: {
                'Content-Type': 'application/json',
                'X-WSSE': this.getWsseHeader(this.user, this.pass)
            },
            transform: this.parse,
            transform2xxOnly: true
        }, optObj);
    }

    async get(uri, data) {
        try {
            const options = this.setOptions(uri, {qs: data});
            return rp.get(options);
        } catch (error) {
            error.message = `Error making GET request to ${uri}: ${error.message}`;
            throw error;
        }
    }

    async put(uri, data) {
        try {
            const options = this.setOptions(uri, {body: JSON.stringify(data)});
            return rp.put(options);
        } catch (error) {
            error.message = `Error making PUT request to ${uri}: ${error.message}`;
            throw error;
        }
    }

    async post(uri, data) {
        try {
            const options = this.setOptions(uri, {body: JSON.stringify(data)});
            return rp.post(options);
        } catch (error) {
            error.message = `Error making POST request to ${uri}: ${error.message}`;
            throw error;
        }
    }

    async delete(uri, data) {
        try {
            const options = this.setOptions(uri, {qs: data});
            return rp.delete(options);
        } catch (error) {
            error.message = `Error making DELETE request to ${uri}: ${error.message}`;
            throw error;
        }
    }
};
