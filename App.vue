<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "/static/iconfont/iconfont.css";
	// /*每个页面公共css */
	// @import '@/uni_modules/uni-scss/index.scss';
	// /* #ifndef APP-NVUE */
	// @import '@/static/customicons.css';
	// // 设置整个项目的背景色
	// page {
	// 	background-color: #f5f5f5;
	// }

	// /* #endif */
	// .example-info {
	// 	font-size: 14px;
	// 	color: #333;
	// 	padding: 10px;
	// }
	//定义全局变量
	:root{
			/* 颜色变量 */
			  --primary-color: #07C160;      /* 主色调 - 微信绿 */
			  --primary-light: #E8F5E9;      /* 主色调浅色 */
			  --primary-dark: #06AD56;       /* 主色调深色 */
			  --secondary-color: #2A82E4;    /* 次要色 - 科技蓝 */
			  --danger-color: #FF6B6B;       /* 危险/支出色 */
			  --success-color: #4CAF50;      /* 成功/收入色 */
			  --warning-color: #FFC107;      /* 警告色 */
			  --info-color: #2196F3;         /* 信息色 */
			  
			  /* 文字颜色 */
			  --text-primary: #333333;       /* 主要文字 */
			  --text-secondary: #666666;     /* 次要文字 */
			  --text-tertiary: #999999;      /* 辅助文字 */
			  --text-disabled: #CCCCCC;      /* 禁用文字 */
			  --text-white: #FFFFFF;         /* 白色文字 */
			  
			  /* 背景颜色 */
			  --bg-primary: #F8F9FA;         /* 主要背景 */
			  --bg-secondary: #FFFFFF;       /* 次要背景 */
			  --bg-tertiary: #F5F5F5;        /* 三级背景 */
			  --bg-card: #FFFFFF;            /* 卡片背景 */
			  --bg-mask: rgba(0, 0, 0, 0.5); /* 遮罩层 */
			  
			  /* 边框颜色 */
			  --border-light: #E0E0E0;       /* 浅色边框 */
			  --border-medium: #CCCCCC;      /* 中等边框 */
			  --border-dark: #999999;        /* 深色边框 */
			  
			  /* 阴影 */
			  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
			  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
			  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
			  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);
			  
			  /* 圆角 */
			  --radius-sm: 4px;
			  --radius-md: 8px;
			  --radius-lg: 12px;
			  --radius-xl: 16px;
			  --radius-2xl: 24px;
			  --radius-full: 9999px;
			  
			  /* 间距 */
			  --space-xs: 4px;
			  --space-sm: 8px;
			  --space-md: 12px;
			  --space-lg: 16px;
			  --space-xl: 20px;
			  --space-2xl: 24px;
			  --space-3xl: 32px;
			  
			  /* 字体大小 */
			  --text-xs: 12px;
			  --text-sm: 13px;
			  --text-base: 14px;
			  --text-lg: 16px;
			  --text-xl: 18px;
			  --text-2xl: 20px;
			  --text-3xl: 24px;
			  --text-4xl: 32px;
			  
			  /* 字体粗细 */
			  --font-normal: 400;
			  --font-medium: 500;
			  --font-semibold: 600;
			  --font-bold: 700;
			  
			  /* 过渡动画 */
			  --transition-fast: 0.15s ease;
			  --transition-normal: 0.3s ease;
			  --transition-slow: 0.5s ease;
		}
		
		//全局重置
		page,.page{
			font-family: -apple-system, BlinkMacSystemFont, 
			               'Helvetica Neue', 'PingFang SC', 
			               'Hiragino Sans GB', 'Microsoft YaHei', 
			               sans-serif;
			  background-color: var(--bg-primary);
			  color: var(--text-primary);
			  line-height: 1.6;
			  font-size: var(--text-base);
			  -webkit-font-smoothing: antialiased;
			  -moz-osx-font-smoothing: grayscale;
		}
		
		//通用工具类
		//布局
		.flex{display:flex}
		.flex-col{flex-direction:column}//flex垂直排列
		.flex-row{flex-direction:row}//flex水平排列
		.flex-wrap{flex-wrap:wrap}//允许flex换行
		.flex-nowrap{flex-wrap:nowrap}//不允许flex换行
		.flex-1{flex:1}//flex占据剩余空间
		.flex-auto{flex:1 1 auto}//flex根据内容自动调整大小
		.flex-none{flex:none}//flex保持原始大小
		
		//对齐方式
		.item-start{align-items:flex-start}//flex项目在交叉轴起点对齐、
		.item-center{align-items:center}//flex在交叉轴居中对齐
		.item-end{align-items:end}//flex在交叉轴终点对齐
		.items-stretch{align-items:stretch}//项目拉伸填满交叉轴
		.justify-start{justify-content:flex-start}
		.justify-center{justify-content:center }
		.justify-end{justify-content:flex-end}
		.justify-between{justify-content: space-between}
		.justify-around{justify-content:space-around}
		.justify-evenly{justify-content:space-evenly}//最均匀的分布
		
		//文本对齐
		.text-left{text-align:left}
		.text-center{text-align:center}
		.text-right{text-align:right}
		
		//字体粗细
		.font-normal{font-weight:var(--font-normal)}
		.font-medium{font-weight:var(--font-medium)}
		.font-semibold{font-weight:var(--font-semibold)}
		.font-bold{font-weight:var(--font-bold)}
		
		//字体大小
		.text-xs{font-size:var(--text-xs)}
		.text-sm{font-size:var(--text-sm)}
		.text-base{font-size:var(--text-base)}
		.text-lg{font-size:var(--text-lg)}
		.text-xl{font-size:var(--text-xl)}
		.text-2xl{font-size:var(--text-2xl)}
		.text-3xl{font-size:var(--text-3xl)}
		
		//文字颜色
		.text-primary{color:var(--text-primary)}
		.text-secondary{color:var(--text-secondary)}
		.text-tertiary{color:var(--text-tertiary)}
		.text-disabled{color:var(--text-disabled)}
		.text-white{color:var(--text-white)}
		.text-danger{color:var(--danger-color)}
		.text-success{color:var(--success-color)}
		.text-warning{color:var(--warning-color)}
		.text-info{color:var(--info-color)}
		.text-primary-color{color:var(--primary-color)}
		
		//背景颜色
		.bg-primary{background-color:var(--bg-primary)}
		.bg-secondary{background-color:var(--bg-secondary)}
		.bg-tertiary{background-color:var(--bg-tertiary)}
		.bg-card{background-color:var(--bg-card)}
		.bg-danger { background-color: var(--danger-color)}
		.bg-success { background-color: var(--success-color)}
		.bg-warning { background-color: var(--warning-color)}
		.bg-info { background-color: var(--info-color)}
		.bg-primary-color { background-color: var(--primary-color)}
		.bg-primary-light { background-color: var(--primary-light)}
		
		//边距
		.m-0{margin:0;}
		.m-1 { margin: var(--space-xs); }
		.m-2 { margin: var(--space-sm); }
		.m-3 { margin: var(--space-md); }
		.m-4 { margin: var(--space-lg); }
		.m-5 { margin: var(--space-xl); }
		
		.mt-0 { margin-top: 0; }
		.mt-1 { margin-top: var(--space-xs); }
		.mt-2 { margin-top: var(--space-sm); }
		.mt-3 { margin-top: var(--space-md); }
		.mt-4 { margin-top: var(--space-lg); }
		.mt-5 { margin-top: var(--space-xl); }
		
		.mb-0 { margin-bottom: 0; }
		.mb-1 { margin-bottom: var(--space-xs); }
		.mb-2 { margin-bottom: var(--space-sm); }
		.mb-3 { margin-bottom: var(--space-md); }
		.mb-4 { margin-bottom: var(--space-lg); }
		.mb-5 { margin-bottom: var(--space-xl); }
		
		.ml-0 { margin-left: 0; }
		.ml-1 { margin-left: var(--space-xs); }
		.ml-2 { margin-left: var(--space-sm); }
		.ml-3 { margin-left: var(--space-md); }
		.ml-4 { margin-left: var(--space-lg); }
		.ml-5 { margin-left: var(--space-xl); }
		
		.mr-0 { margin-right: 0; }
		.mr-1 { margin-right: var(--space-xs); }
		.mr-2 { margin-right: var(--space-sm); }
		.mr-3 { margin-right: var(--space-md); }
		.mr-4 { margin-right: var(--space-lg); }
		.mr-5 { margin-right: var(--space-xl); }
		
		.mx-0 { margin-left: 0; margin-right: 0; }
		.mx-1 { margin-left: var(--space-xs); margin-right: var(--space-xs); }
		.mx-2 { margin-left: var(--space-sm); margin-right: var(--space-sm); }
		.mx-3 { margin-left: var(--space-md); margin-right: var(--space-md); }
		.mx-4 { margin-left: var(--space-lg); margin-right: var(--space-lg); }
		.mx-5 { margin-left: var(--space-xl); margin-right: var(--space-xl); }
		
		.my-0 { margin-top: 0; margin-bottom: 0; }
		.my-1 { margin-top: var(--space-xs); margin-bottom: var(--space-xs); }
		.my-2 { margin-top: var(--space-sm); margin-bottom: var(--space-sm); }
		.my-3 { margin-top: var(--space-md); margin-bottom: var(--space-md); }
		.my-4 { margin-top: var(--space-lg); margin-bottom: var(--space-lg); }
		.my-5 { margin-top: var(--space-xl); margin-bottom: var(--space-xl); }
		
		//内边距
		.p-0 { padding: 0; }
		.p-1 { padding: var(--space-xs); }
		.p-2 { padding: var(--space-sm); }
		.p-3 { padding: var(--space-md); }
		.p-4 { padding: var(--space-lg); }
		.p-5 { padding: var(--space-xl); }
		
		.pt-0 { padding-top: 0; }
		.pt-1 { padding-top: var(--space-xs); }
		.pt-2 { padding-top: var(--space-sm); }
		.pt-3 { padding-top: var(--space-md); }
		.pt-4 { padding-top: var(--space-lg); }
		.pt-5 { padding-top: var(--space-xl); }
		
		.pb-0 { padding-bottom: 0; }
		.pb-1 { padding-bottom: var(--space-xs); }
		.pb-2 { padding-bottom: var(--space-sm); }
		.pb-3 { padding-bottom: var(--space-md); }
		.pb-4 { padding-bottom: var(--space-lg); }
		.pb-5 { padding-bottom: var(--space-xl); }
		
		.pl-0 { padding-left: 0; }
		.pl-1 { padding-left: var(--space-xs); }
		.pl-2 { padding-left: var(--space-sm); }
		.pl-3 { padding-left: var(--space-md); }
		.pl-4 { padding-left: var(--space-lg); }
		.pl-5 { padding-left: var(--space-xl); }
		
		.pr-0 { padding-right: 0; }
		.pr-1 { padding-right: var(--space-xs); }
		.pr-2 { padding-right: var(--space-sm); }
		.pr-3 { padding-right: var(--space-md); }
		.pr-4 { padding-right: var(--space-lg); }
		.pr-5 { padding-right: var(--space-xl); }
		
		.px-0 { padding-left: 0; padding-right: 0; }
		.px-1 { padding-left: var(--space-xs); padding-right: var(--space-xs); }
		.px-2 { padding-left: var(--space-sm); padding-right: var(--space-sm); }
		.px-3 { padding-left: var(--space-md); padding-right: var(--space-md); }
		.px-4 { padding-left: var(--space-lg); padding-right: var(--space-lg); }
		.px-5 { padding-left: var(--space-xl); padding-right: var(--space-xl); }
		
		.py-0 { padding-top: 0; padding-bottom: 0; }
		.py-1 { padding-top: var(--space-xs); padding-bottom: var(--space-xs); }
		.py-2 { padding-top: var(--space-sm); padding-bottom: var(--space-sm); }
		.py-3 { padding-top: var(--space-md); padding-bottom: var(--space-md); }
		.py-4 { padding-top: var(--space-lg); padding-bottom: var(--space-lg); }
		.py-5 { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
		
		//圆角
		.rounded-none { border-radius: 0; }
		.rounded-sm { border-radius: var(--radius-sm); }
		.rounded-md { border-radius: var(--radius-md); }
		.rounded-lg { border-radius: var(--radius-lg); }
		.rounded-xl { border-radius: var(--radius-xl); }
		.rounded-2xl { border-radius: var(--radius-2xl); }
		.rounded-full { border-radius: var(--radius-full); }
		
		//边框
		.border-0 { border: none; }
		.border { border: 1px solid var(--border-light); }
		.border-t { border-top: 1px solid var(--border-light); }
		.border-b { border-bottom: 1px solid var(--border-light); }
		.border-l { border-left: 1px solid var(--border-light); }
		.border-r { border-right: 1px solid var(--border-light); }
		
		.border-primary { border-color: var(--primary-color); }
		.border-danger { border-color: var(--danger-color); }
		.border-success { border-color: var(--success-color); }
		.border-warning { border-color: var(--warning-color); }
		
		//阴影
		.shadow-none { box-shadow: none; }
		.shadow-sm { box-shadow: var(--shadow-sm); }
		.shadow-md { box-shadow: var(--shadow-md); }
		.shadow-lg { box-shadow: var(--shadow-lg); }
		.shadow-xl { box-shadow: var(--shadow-xl); }
		
		//溢出
		.overflow-hidden { overflow: hidden; }
		.overflow-visible { overflow: visible; }
		.overflow-scroll { overflow: scroll; }
		.overflow-auto { overflow: auto; }
		
		//定位
		.relative{position:relative}
		.absolute{position:absolute}
		.fixed{position:fixed}
		.sticky{position:sticky}
		
		.top-0 { top: 0; }
		.right-0 { right: 0; }
		.bottom-0 { bottom: 0; }
		.left-0 { left: 0; }
		
		.z-0 { z-index: 0; }
		.z-10 { z-index: 10; }
		.z-20 { z-index: 20; }
		.z-30 { z-index: 30; }
		.z-40 { z-index: 40; }
		.z-50 { z-index: 50; }
		
		//显示隐藏
		.hidden{display:none}
		.block{display: block}
		.inline-block { display: inline-block; }
		.inline { display: inline; }
	
		//宽度高度
		.w-full { width: 100%; }
		.w-screen { width: 100vw; }
		.h-full { height: 100%; }
		.h-screen { height: 100vh; }
		.min-h-screen { min-height: 100vh; }
		
		//光标
		.cursor-pointer { cursor: pointer; }
		.cursor-default { cursor: default; }
		.cursor-not-allowed { cursor: not-allowed; }
		
		//过渡动画
		.transition-all { transition: all var(--transition-normal); }
		.transition-colors { transition: color var(--transition-normal), 
		                              background-color var(--transition-normal); }
		.transition-transform { transition: transform var(--transition-normal); }
		.transition-opacity { transition: opacity var(--transition-normal); }
	
		//卡片
		.card {
		  background-color: var(--bg-card);
		  border-radius: var(--radius-lg);
		  box-shadow: var(--shadow-md);
		  overflow: hidden;
		  transition: box-shadow var(--transition-normal);
		}
		
		.card:hover {
		  box-shadow: var(--shadow-lg);
		}
		
		.card-header {
		  padding: var(--space-lg);
		  border-bottom: 1px solid var(--border-light);
		  font-size: var(--text-lg);
		  font-weight: var(--font-semibold);
		  color: var(--text-primary);
		}
		
		.card-body {
		  padding: var(--space-lg);
		}
		
		.card-footer {
		  padding: var(--space-lg);
		  border-top: 1px solid var(--border-light);
		  font-size: var(--text-sm);
		  color: var(--text-tertiary);
		}
		
		//按钮
		.btn{
			display:inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0 var(--space-xh);
			height: 44px;
			border-radius: var(--radius-md);
			font-size: var(--text-base);
			font-weight: var(--font-medium);
			text-align: center;
			border: none;
			outline: none;
			transition: all var(--transition-fast);
			cursor: pointer;
			user-select: none;
		}
		
		.btn:active{
		transform: translateY(1px);
		}
		
		.btn:disabled{
			opacity: 0.5;//50%透明
			cursor: not-allowed;
			transform: none !important;
			
		}
		
		/* 按钮变体 */
		.btn-primary {
		  background-color: var(--primary-color);
		  color: var(--text-white);
		}
		
		.btn-primary:active {
		  background-color: var(--primary-dark);
		}
		
		.btn-secondary {
		  background-color: var(--secondary-color);
		  color: var(--text-white);
		}
		
		.btn-danger {
		  background-color: var(--danger-color);
		  color: var(--text-white);
		}
		
		.btn-success {
		  background-color: var(--success-color);
		  color: var(--text-white);
		}
		
		.btn-outline {
		  background-color: transparent;
		  border: 1px solid var(--border-light);
		  color: var(--text-primary);
		}
		
		.btn-outline:active {
		  background-color: var(--bg-tertiary);
		}
		
		.btn-text {
		  background-color: transparent;
		  color: var(--primary-color);
		  padding: var(--space-sm) var(--space-md);
		}
		
		/* 按钮尺寸 */
		.btn-sm {
		  height: 32px;
		  padding: 0 var(--space-md);
		  font-size: var(--text-sm);
		}
		
		.btn-lg {
		  height: 48px;
		  padding: 0 var(--space-2xl);
		  font-size: var(--text-lg);
		}
		
		/* 按钮圆角 */
		.btn-rounded {
		  border-radius: var(--radius-full);
		}
		
		/* 输入框 */
		.input {
		  width: 100%;
		  height: 44px;
		  padding: 0 var(--space-lg);
		  border: 1px solid var(--border-light);
		  border-radius: var(--radius-md);
		  font-size: var(--text-base);
		  color: var(--text-primary);
		  background-color: var(--bg-secondary);
		  outline: none;
		  transition: all var(--transition-fast);
		}
		
		.input:focus {
		  border-color: var(--primary-color);
		  box-shadow: 0 0 0 3px rgba(7, 193, 96, 0.1);
		}
		
		.input::placeholder {
		  color: var(--text-tertiary);
		  font-size: var(--text-base);
		}
		
		.input:disabled {
		  background-color: var(--bg-tertiary);
		  color: var(--text-disabled);
		  cursor: not-allowed;
		}
		
		/* 输入框尺寸 */
		.input-sm {
		  height: 36px;
		  padding: 0 var(--space-md);
		  font-size: var(--text-sm);
		}
		
		.input-lg {
		  height: 52px;
		  padding: 0 var(--space-xl);
		  font-size: var(--text-lg);
		}
		
		/* 标签 */
		.badge {
		  display: inline-flex;
		  align-items: center;
		  justify-content: center;
		  padding: var(--space-xs) var(--space-md);
		  border-radius: var(--radius-sm);
		  font-size: var(--text-xs);
		  font-weight: var(--font-medium);
		  line-height: 1;
		  white-space: nowrap;
		}
		
		.badge-primary {
		  background-color: var(--primary-light);
		  color: var(--primary-color);
		}
		
		.badge-danger {
		  background-color: rgba(255, 107, 107, 0.1);
		  color: var(--danger-color);
		}
		
		.badge-success {
		  background-color: rgba(76, 175, 80, 0.1);
		  color: var(--success-color);
		}
		
		.badge-warning {
		  background-color: rgba(255, 193, 7, 0.1);
		  color: var(--warning-color);
		}
		
		/* 分隔线 */
		.divider {
		  height: 1px;
		  background-color: var(--border-light);
		  margin: var(--space-lg) 0;
		}
		
		/* 加载动画 */
		.loading {
		  display: inline-block;
		  width: 20px;
		  height: 20px;
		  border: 2px solid var(--border-light);
		  border-top-color: var(--primary-color);
		  border-radius: 50%;
		  animation: spin 1s linear infinite;
		}
		
		@keyframes spin {
		  to {
		    transform: rotate(360deg);
		  }
		}
		
		/* 空状态 */
		.empty-state {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  padding: var(--space-3xl) var(--space-lg);
		  text-align: center;
		}
		
		.empty-icon {
		  width: 80px;
		  height: 80px;
		  margin-bottom: var(--space-lg);
		  color: var(--text-tertiary);
		  font-size: 48px;
		}
		
		.empty-text {
		  font-size: var(--text-base);
		  color: var(--text-secondary);
		  margin-bottom: var(--space-sm);
		}
		
		.empty-subtext {
		  font-size: var(--text-sm);
		  color: var(--text-tertiary);
		}
</style>
