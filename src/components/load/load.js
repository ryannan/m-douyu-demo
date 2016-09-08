import tmpl from '../live/live.tmpl.js';
import tap from '../event/tap.js';

// 将object转为array, 规范格式下可使用Array.from()代替
function objToArray(obj) {
	let strArr = [];

	for (let k of Object.keys(obj)) {
		strArr.push(obj[k]);
	}

	return strArr;
}

// 列表页，加载更多
// 处理绑定事件,加载状态,渲染页面
class Load {

	// @param $btn       当前点击的容器
	// @param $container 需要渲染的容器(列表)
	constructor() {
		this.$btn = $('#loadContainer');
		this.$container = $('#liveContent');
		this.currPage = 1;
		
		this.init();
	}

	// 绑定事件监听,使用promise处理ajax回调
	init() {
		let _this = this;

		$(document).on(tap, '#loadContainer', ev => {
			_this.toggleStatus(true);

			_this.request().then(response => {
				_this.toggleStatus(false);
				return _this.render(response);
			}, () => {
				_this.$btn.hide();
			});
		});
	}

	// 改变按钮状态
	toggleStatus(status) {
		if (status) {
			this.$btn.addClass('loading').attr({"disabled": "disabled"}).html('');
		} else {
			this.$btn.removeClass('loading').removeAttr("disabled").html('加载更多');
		}
	}

	// 加载更多请求
	request() {
		return new Promise((resolve, reject) => {
			$.get('/mock/list.json', response => {
				if (response.result) {
					// 请求成功,resolve()参数返回的是一个promise对象
					resolve(response);
				}

				// 请求失败,格式错误
				reject(response);
			});
		});
	}

	// 列表渲染
	render(response) {
		let _this = this;

		return new Promise((resolve, reject) => {
			let $content = tmpl(objToArray(response.result));

			_this.$container.append($content);

			if (++_this.currPage == response.pageCount) {
				return _this.$btn.hide();
			}
		});
	}

}

export default Load;