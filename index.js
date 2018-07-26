const rp = require('request-promise'),
      crypto = require('crypto'),
      iso8601 = require('iso8601');

module.exports = class API {
    constructor(user,pass) {
        this.user = user;
        this.pass = pass;
        this.url = 'https://api.emarsys.net/api/v2';
    }

    base64Sha1 (str) {
        let hexDigest = crypto.createHash('sha1')
        .update(str)
        .digest('hex');

        return new Buffer(hexDigest).toString('base64');
    }

     getWsseHeader (user, pass) {
        let nonce = crypto.randomBytes(16).toString('hex');
        let timestamp = iso8601.fromDate(new Date());

        let digest = this.base64Sha1(nonce + timestamp + pass);

        return 'UsernameToken Username="'+ user +'", PasswordDigest="'+ digest +'", Nonce="'+ nonce +'", Created="'+ timestamp +'"';
    }

    parse (body,response) {
        body = JSON.parse(body);
        if(body.replyCode != 0) {
            throw new Error(body.replyText);
        }
        return body;
    }

    setOptions (uri, optObj = {}) {
        uri = uri.substring(0,1) === '/' ? uri : '/' + uri;
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

    get (uri, data) {
        return rp.get( this.setOptions(uri, {qs: data}) );
    }

    put (uri, data) {
        return rp.put( this.setOptions(uri, {body: JSON.stringify(data)}) );
    }

    post (uri, data) {
        return rp.post( this.setOptions(uri, {body: JSON.stringify(data)}) );
    }
    
    delete (uri, data) {
        return rp.delete( this.setOptions(uri, {qs: data}) );
    }
};
