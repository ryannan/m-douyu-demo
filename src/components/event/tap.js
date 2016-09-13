// 封装click，tap事件
// 如果是移动端则使用zepto tap事件，其它使用click

const UA = window.navigator.userAgent;
let tap = 'click';

if (/ipad|iphone|android/i.test(UA)) {
	tap = 'tap';
}

export default tap;
