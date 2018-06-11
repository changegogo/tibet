const Q = require('q');
const request = require('request');
const crypto = require('crypto');
const ejs = require('ejs');
const fs = require('fs');
//const key = ''; // 此处为申请微信支付的API密码
const messageTpl = fs.readFileSync(__dirname + '/message.ejs', 'utf-8');

const WxPay = {
    getXMLNodeValue: function(node_name, xml) {
        let tmp = xml.split('<' + node_name + '>');
        let _tmp = tmp[1].split('</' + node_name + '>');
        return _tmp[0];
    },
    raw: function(args) {
        let keys = Object.keys(args);
        keys = keys.sort();
        let newArgs = {};
        keys.forEach((key)=>{
            newArgs[key] = args[key];
        });
        let string = '';
        for(let k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    },
    paysignjs: function(appid, key, nonceStr, package, signType, timeStamp) {
        let ret = {
            appId: appid,
            nonceStr: nonceStr,
            package: package,
            signType: signType,
            timeStamp: timeStamp
        };
        let string = this.raw(ret);
        string = string + '&key=' + key;
        let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },
    paysignjsapi: function(appid, key, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
        let ret = {
            appid: appid,
            attach: attach,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: notify_url,
            openid: openid,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        };
        let string = this.raw(ret);
        string = string + '&key=' + key;
        let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },
    order: function(attach, body, mch_id, openid, app_id, key, bookingNo, spbill_create_ip, total_fee, notify_url) {
        let deferred = Q.defer();
        let appid = app_id;
        let nonce_str = this.createNonceStr();
        let timeStamp = this.createTimeStamp();
        let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        let formData = '<xml>';
        formData += '<appid>' + appid + '</appid>';
        formData += '<attach>' + attach + '</attach>';
        formData += '<body>' + body + '</body>';
        formData += '<mch_id>' + mch_id + '</mch_id>'; // 商户号
        formData += '<nonce_str>' + nonce_str + '</nonce_str>';
        formData += '<notify_url>' + notify_url + '</notify_url>';
        formData += '<openid>' + openid + '</openid>';
        formData += '<out_trade_no>' + bookingNo + '</out_trade_no>';
        formData += '<spbill_create_ip>' + spbill_create_ip +'</spbill_create_ip>'; 
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>JSAPI</trade_type>";
        formData += "<sign>" + this.paysignjsapi(appid, key, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, spbill_create_ip, total_fee, 'JSAPI') + "</sign>"; 
        formData += "</xml>";
        let self = this;
        request({
            url: url,
            method: 'POST',
            body: formData
        }, function(err, response, body){
            if(!err && response.statusCode == 200){
                console.log(body);
                let prepay_id = self.getXMLNodeValue('prepay_id', body.toString('utf-8'));
                let tmp = prepay_id.split('[');
                let tmp1 = tmp[2].split(']');
                let _paySignjs = self.paysignjs(appid, key, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp);
                let args = {
                    appId: appid,
                    timeStamp: timeStamp,
                    nonceStr: nonce_str,
                    signType: 'MD5',
                    package: tmp1[0],
                    paySign: _paySignjs
                };
                deferred.resolve(args);
            }else {
                console.log(body);
            }
        });
        return deferred.promise;
    },
    notify: function(obj){
        let output = '';
        let reply = null;
        if(obj.return_code == 'SUCCESS') {
            reply = {
                return_code: 'SUCCESS',
                return_msg: 'OK'
            };
        }else {
            reply = {
                return_code: 'FAIL',
                return_msg: 'FAIL'
            };
        }
        output = ejs.render(messageTpl, reply);
        return output;
    }
};

module.exports = WxPay;
