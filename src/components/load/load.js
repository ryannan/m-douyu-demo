import tmpl from '../live/live.tmpl.js';
import tap from '../event/tap.js';

// 将object转为array, 规范格式下可使用Array.from()代替
function objToArray (obj) {
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
	constructor () {
		this.$btn = $('#loadContainer');
		this.$container = $('#liveContent');
		this.currPage = 1;
		this.init();
	}

	// 绑定事件监听,使用promise处理ajax回调
	init () {
		let that = this;

		$(document).on(tap, '#loadContainer', ev => {
			that.toggleStatus(true);

			that.request().then(response => {
				that.toggleStatus(false);
				return that.render(response);
			}, () => {
				that.$btn.hide();
			});
		});
	}

	// 改变按钮状态
	toggleStatus (status) {
		if (status) {
			this.$btn.addClass('loading').attr({
				disabled: 'disabled'
			}).html('');
		} else {
			this.$btn.removeClass('loading').removeAttr('disabled').html('加载更多');
		}
	}

	// 加载更多请求
	request () {
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
	render (response) {
		let that = this;

		return new Promise((resolve, reject) => {
			let $content = tmpl(objToArray(response.result));

			that.$container.append($content);

			if (++that.currPage === response.pageCount) {
				that.$btn.hide();
			}
		});
	}

}

export default Load;
