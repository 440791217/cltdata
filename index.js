/**
 * Created by mark on 2017/1/20.
 */
module.exports=new cltData();

function cltData() {
    var b64ec = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var bhex = "0123456789ABCDEF";

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str[i++] & 0xff;
            if (i == len) {
                out += b64ec.charAt(c1 >> 2);
                out += b64ec.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str[i++];
            if (i == len) {
                out += b64ec.charAt(c1 >> 2);
                out += b64ec.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += b64ec.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str[i++];
            out += b64ec.charAt(c1 >> 2);
            out += b64ec.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += b64ec.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += b64ec.charAt(c3 & 0x3F);
        }
        return out;
    }

    function cryptData(str, key) {
        var data = utf16ToUtf8(str);
        var salt_ptr = 0;
        var salt = [];
        for (var i = 0; i < key.length; i++) salt.push(key.charCodeAt(i) - 3);
        var salt_len = key.length;

        var len = data.length;
        for (var i = 0; len > 0; len--, i++) {
            data[i] ^= salt[salt_ptr] ^ ((salt[0] & 0xff) * salt_ptr);
            while (data[i] < 0) data[i] += 256;
            data[i] %= 256;
            salt[salt_ptr] += (salt_ptr < (salt_len - 1)) ? salt[salt_ptr + 1] : salt[0];
            while (salt[salt_ptr] < 0) salt[salt_ptr] += 256;
            salt[salt_ptr] %= 256;
            if (salt[salt_ptr] == 0) salt[salt_ptr]++;
            if (++salt_ptr >= salt_len) salt_ptr = 0;
        }
        return base64encode(data);
    }

    function utf16ToUtf8(s) {
        var i, code, ret = [], len = s.length;
        for (i = 0; i < len; i++) {
            code = s.charCodeAt(i);
            if (code > 0x0 && code <= 0x7f) {
                ret.push(s.charCodeAt(i));
            } else if (code >= 0x80 && code <= 0x7ff) {
                ret.push(0xc0 | ((code >> 6) & 0x1f), 0x80 | (code & 0x3f));
            } else if (code >= 0x800 && code <= 0xffff) {
                ret.push(0xe0 | ((code >> 12) & 0xf), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            }
        }
        return ret;
    }

    function cryptPwd(pwd) {
        var data = utf16ToUtf8(pwd);
        var salt_ptr = 0;
        var salt = [];
        var key = "Oo0Q";
        for (var i = 0; i < key.length; i++) salt.push(key.charCodeAt(i));
        var salt_len = key.length;

        var len = data.length;
        var rc = "";
        for (var i = 0; len > 0; len--, i++) {
            data[i] ^= salt[salt_ptr] ^ ((salt[0] & 0xff) * salt_ptr);
            while (data[i] < 0) data[i] += 256;
            data[i] %= 256;
            salt[salt_ptr] += (salt_ptr < (salt_len - 1)) ? salt[salt_ptr + 1] : salt[0];
            while (salt[salt_ptr] < 0) salt[salt_ptr] += 256;
            salt[salt_ptr] %= 256;
            if (salt[salt_ptr] == 0) salt[salt_ptr]++;
            if (++salt_ptr >= salt_len) salt_ptr = 0;

            rc += bhex.charAt((data[i] & 0xf0) >> 4) + bhex.charAt(data[i] & 0xf);
        }
        return rc;
    }

    function install(Vue) {
        Vue.CltData = new f();
    }

    function f() {

        return {
            install: install,
            cryptData: cryptData,
            cryptPwd: cryptPwd
        }
    }

    return f();
}
