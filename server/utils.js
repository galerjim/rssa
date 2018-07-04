///////////////////////////////////////////////
//
// utils.js - Utility functions for the server
//
///////////////////////////////////////////////

const logger = require('../logger.js')(module);
const Hashids = require('hashids');
const hashLength = 6;
const hashids = new Hashids('', hashLength);

/**
 * Pad a string with zero's on the left to required length.
 */
const pad = function(str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
};

/**
 * Check if numeric
 */
const isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * Get Client IP from Request
 */
const getClientIP = function(req) {
	let ipAddr = req.headers["x-forwarded-for"];
	if (ipAddr) {
		let list = ipAddr.split(",");
		ipAddr = list[list.length - 1];
	} else {
		ipAddr = req.connection.remoteAddress;
	}
	return ipAddr;
}

/**
 * Send an error response.
 */
const sendErr = function(res, msg) {
	res.status(500).json({
		'success': false,
		'result': msg
	});
};


////////////////////
// Encryption Utils
////////////////////

function getCryptoObj(req) {
	return {
		lib: require('crypto'),
		algorithm: 'aes-256-ctr',
		password: req.settings.encryptionPassword
	}
}

/**
 * Encrypt string
 */
const encrypt = function(req, text) {
	let crypto = getCryptoObj(req);
	let cipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	let crypted = cipher.update(text, 'utf8', 'hex')
	crypted += cipher.final('hex');
	return crypted;
};

/**
 * Decrypt string
 */
const decrypt = function(req, text) {
	let crypto = getCryptoObj(req);
	let decipher = crypto.lib.createCipher(crypto.algorithm, crypto.password)
	let dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
};

/**
 * Generate a hash of the ID
 */
const hash = function(req, id) {
	let salt = req.settings.hashSalt;
	if (!isNumeric(id) || !isNumeric(salt)) {
		throw "id or salt is not a number";
	}
	id = parseInt(id);
	salt = parseInt(salt);
	return hashids.encode(id * salt);
}


////////////////////
// Cookie Utils
////////////////////

const durationOfStudy = 604800; //7 days

/**
 * Get Cookie
 */
const getCookie = function(req, key) {
	try {
		let encryptedKey = encrypt(req, key);
		if (Object.keys(req.cookies).length > 0 && req.cookies.hasOwnProperty(encryptedKey)) {
			return decrypt(req, req.cookies[encryptedKey]);
		}
	} catch (e) {
		logger.log(e.stack);
		logger.error("Exception in getCookieValue :: key = " + key + " : error = " + e);
	}
	return null;
}

/**
 * Set Cookie
 */
const setCookie = function(req, res, key, value) {
	res.cookie(encrypt(req, key), encrypt(req, value), {
		maxAge: durationOfStudy,
		httpOnly: true
	});
	return res;
}

/**
 * Delete Cookie
 */
const deleteCookie = function(req, res, key) {
	res.clearCookie(encrypt(req, key));
	return res
}

module.exports = {
	pad: pad,
	isNumeric: isNumeric,
	getClientIP: getClientIP,
	sendErr: sendErr,
	encrypt: encrypt,
	decrypt: decrypt,
	hash: hash,
	getCookie: getCookie,
	setCookie: setCookie,
	deleteCookie: deleteCookie
};