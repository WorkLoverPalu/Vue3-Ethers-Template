import CryptoJS from 'crypto-js';

export default {
	//加密
	encodeAes(plaintText,keyStr,cb) {
		// 取当前钱包地址16位作为key
		// let keyStr = store.state.maskInfo.address
		let key = CryptoJS.enc.Utf8.parse(keyStr.substring(keyStr.length - 16, keyStr.length).toUpperCase());
		
		let encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
			iv: key,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		encryptedData = encryptedData.ciphertext.toString();
		//console.log("加密后-no-hex：" + encryptedData);
		//cb(encryptedData)
		return encryptedData
	},
	//解密
	decodeAes(encryptedDataStr,keyStr) {
		// 取当前钱包地址16位作为key
		// let keyStr = store.state.maskInfo.address
		let key = CryptoJS.enc.Utf8.parse(keyStr.substring(keyStr.length - 16, keyStr.length).toUpperCase());
		
		let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedDataStr);
		let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);

		let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
			iv: key,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});

		let decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
		//console.log("解密后:" + decryptedStr);
		return decryptedStr
	}
}

export function encodeAes(plaintText,keyStr,cb) {
	// 取当前钱包地址16位作为key
	// let keyStr = store.state.maskInfo.address
	let key = CryptoJS.enc.Utf8.parse(keyStr.substring(keyStr.length - 16, keyStr.length).toUpperCase());
	
	let encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
		iv: key,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	encryptedData = encryptedData.ciphertext.toString();
	//console.log("加密后-no-hex：" + encryptedData);
	//cb(encryptedData)
	return encryptedData
}

	//解密
export function testdecodeAes(encryptedDataStr,keyStr) {
	// 取当前钱包地址16位作为key
	// let keyStr = store.state.maskInfo.address
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	
	let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedDataStr);
	let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);

	let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
		iv: key,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});

	let decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
	//console.log("解密后:" + decryptedStr);
	return decryptedStr
}
//加密
export function testencodeAes(plaintText,keyStr) {
	// 取当前钱包地址16位作为key
	// let keyStr = store.state.maskInfo.address
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	
	let encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
		iv: key,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	encryptedData = encryptedData.ciphertext.toString();
	//console.log("加密后-no-hex：" + encryptedData);
	//cb(encryptedData)
	return encryptedData
}