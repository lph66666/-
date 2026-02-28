<template>
	<view class="home-page">
		<!-- 顶部月份卡片 -->
		<view class="month-card">
			<view class="month-info">
				<text class="month-name">{{currentMonth}}月</text>
				<text class="today">{{today}}</text>
			</view>
			<view class="amount-display">
				<text class="label">本月支出</text>
				<text class="amount">￥{{monthExpense}}</text>
			</view>
		</view>
		
		<!-- 快速输入区域 -->
		<view class="quick-input-section">
			<view class="input-card shadow-2xl">
				<!-- 金额输入 -->
				<view class="amount-input">
					<text class="currency">¥</text>
					<input 
						v-model="amount" 
						type="digit" 
						placeholder="请输入金额" 
						placeholder-class="placeholder"
						class="amount-field"
						@input="onAmountInput"
					/>
				</view>
				
				<!-- 日期选择 -->
				<view class="date-select-section">
					<text class="date-label">选择日期</text>
					<view class="date-picker" @click="open">
						<uni-icons type="calendar" size="20" color="var(--primary-color)" />
						<text class="date-value">{{selectedday ? formatDateDisplay(selectedday) : '今天'}}</text>
						<uni-icons type="arrowdown" size="14" color="var(--text-tertiary)" />
					</view>
				</view>
				
				<!-- 快捷分类 -->
				<scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
					<view 
						v-for="category in quickCategories"
						:key="category.id"
						class="category-tag"
						@click="selectCategory(category.id)"
						:class="{active:selectedCategory===category.id}"
					>
						<view class="category-icon shadow-sm" :style="{background:category.bgColor}">
							<uni-icons :type="category.icon" size="18" color="#fff" />
						</view>
						<text class="category-name">{{category.name}}</text>
					</view>
				</scroll-view>
				
				<!-- 备注输入 -->
				<view class="remark-section">
					<uni-icons type="chatboxes" size="20" color="var(--text-tertiary)" />
					<input 
						v-model="remark"
						placeholder="添加备注（可选）"
						class="remark-input"
					/>
				</view>
				
				<!-- 提交按钮 -->
				<button
					class="submit-btn shadow-lg"
					@click="addRecord"
					v-show="Number(amount)&&Number(amount)>0"
				>
					<uni-icons type="checkmarkempty" size="20" color="#18bc37" />
					<text class="btn-text">记一笔</text>
				</button>
			</view>
		</view>
		
		<!-- 最近记录 -->
		<view class="recent-section">
			<view class="section-header">
				<text class="section-title">最近记录</text>
				<view class="view-all" @click="navToBill">
					<text>查看全部</text>
					<uni-icons type="right" size="12" color="var(--text-tertiary)" />
				</view>
			</view>
			<view class="record-list" v-if="recentRecords.length>0">
				<view 
					class="record-item shadow-sm" 
					v-for="(record,index) in recentRecords.slice(0,5)"
					:key='index'
				>
					<view class="record-left">
						<view class="record-icon shadow-xs" :style="{backgroundColor:record.bgColor}">
							<uni-icons :type="record.icon" size="16" :color="record.color" />
						</view>
						<view class="record-info">
							<text class="record-category">{{record.category}}</text>
							<text class="record-remark">{{record.remark||'无备注'}}</text>
						</view>
					</view>
					<view class="record-right">
						<text class="record-amount text-danger">-￥{{record.amount}}</text>
						<text class="record-time">{{record.time || ''}}</text>
					</view>
				</view>
			</view>
			<view v-else class="empty-state">
				<view class="empty-image-wrapper">
					<image src="/static/images/empty-bill.png" mode="aspectFit" class="empty-image" />
				</view>
				<text class="empty-text">还没有任何记录</text>
				<text class="empty-tip">点击上方输入金额开始记账</text>
			</view>
		</view>
		
		<!-- 日期选择器 -->
		<uni-calendar 
			ref="calendar"
			:insert="false"
			:range="true"
			:start-date="minDate"
			:end-date="maxDate"
			@confirm="confirm"
			class="calendar-modal"
		/>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
		computed:{
			...mapState('m_expense',['quickCategories','recentRecords','bills']),
			...mapGetters('m_expense',['getCategoryType'])
		},
		data() {
			// 计算最小和最大日期（允许选择过去一年到今天）
			const today = new Date()
			const minDate = new Date()
			minDate.setFullYear(today.getFullYear() - 1)
			
			return {
				currentMonth: new Date().getMonth() + 1,
				today: new Date().getDate() + '日',
				monthExpense: '0.00',
				amount: '',
				remark: '',
				selectedCategory: 1,
				selectedday: '', // 可选的记录日期,默认今日
				minDate: this.formatDate(minDate),
				maxDate: this.formatDate(today)
			}
		},
		onLoad() {
			this.calexpense()
			this.$store.commit('m_expense/INIT_STORAGE')
		},
		onShow() {
			this.calexpense()
		},
		methods:{
			...mapMutations('m_expense',['createnew']),
			
			calexpense(){
				const now = new Date()
				const currentYear = now.getFullYear()
				const currentMonth = now.getMonth() + 1
				
				// 筛选本月账单
				const monthBills = this.bills.filter(bill => {
					if(!bill || !bill.date) return false
					try {
						const billDate = new Date(bill.date)
						return billDate.getFullYear() === currentYear && billDate.getMonth() + 1 === currentMonth
					} catch {
						return false
					}
				})
				
				// 计算本月总支出
				const total = monthBills.reduce((sum, bill) => {
					return sum + (parseFloat(bill.amount) || 0)
				}, 0)
				this.monthExpense = total.toFixed(2)
			},
			
			onAmountInput(e){
				this.amount = e.detail.value
			},
			
			selectCategory(id){
				this.selectedCategory = id
			},
			
			addRecord(){
				if(!this.amount) return
				
				const category = this.quickCategories.find(c => c.id === this.selectedCategory)
				this.createnew({
					category: category,
					amount: Number(this.amount).toFixed(2),
					remark: this.remark,
					selectedday: this.selectedday
				})
				
				// 计算总支出
				this.calexpense()
				
				// 重置变量
				this.amount = ''
				this.remark = ''
				this.selectedday = ''
				
				uni.showToast({
					title: '记录成功',
					icon: 'success'
				})
			},
			
			navToBill(){
				uni.switchTab({
					url: '/pages/bill/bill'
				})
			},
			
			// 日期选择
			open(){
				this.$refs.calendar.open()
			},
			
			confirm(e) {
				console.log('选择的日期:', e.fulldate)
				this.selectedday = e.fulldate
			},
			
			// 格式化日期为 YYYY-MM-DD
			formatDate(date) {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}-${month}-${day}`
			},
			
			// 格式化显示的日期
			formatDateDisplay(dateStr) {
				if (!dateStr) return '今天'
				
				const date = new Date(dateStr)
				const today = new Date()
				const yesterday = new Date(today)
				yesterday.setDate(yesterday.getDate() - 1)
				
				if (this.formatDate(date) === this.formatDate(today)) {
					return '今天'
				} else if (this.formatDate(date) === this.formatDate(yesterday)) {
					return '昨天'
				} else {
					const month = date.getMonth() + 1
					const day = date.getDate()
					const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
					const weekDay = weekDays[date.getDay()]
					return `${month}月${day}日 ${weekDay}`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.home-page {
	padding-bottom: 100rpx;
	background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
	min-height: 100vh;
}

// 阴影定义
.shadow-xs {
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.shadow-sm {
	box-shadow: 0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.05), 0 2rpx 4rpx -1rpx rgba(0, 0, 0, 0.03);
}

.shadow-md {
	box-shadow: 0 10rpx 15rpx -3rpx rgba(0, 0, 0, 0.07), 0 4rpx 6rpx -2rpx rgba(0, 0, 0, 0.04);
}

.shadow-lg {
	box-shadow: 0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.08), 0 10rpx 10rpx -5rpx rgba(0, 0, 0, 0.02);
}

.shadow-xl {
	box-shadow: 0 25rpx 50rpx -12rpx rgba(0, 0, 0, 0.12);
}

.shadow-2xl {
	box-shadow: 0 50rpx 100rpx -20rpx rgba(0, 0, 0, 0.15), 0 30rpx 60rpx -30rpx rgba(0, 0, 0, 0.1);
}

// 顶部月份卡片
.month-card {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	padding: 40rpx 32rpx 50rpx;
	border-radius: 0 0 40rpx 40rpx;
	color: #f3a73f;
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 300rpx;
		height: 300rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		transform: translate(40%, -40%);
	}
	
	.month-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		position: relative;
		z-index: 1;
		
		.month-name {
			font-size: 38rpx;
			font-weight: 700;
			letter-spacing: 0.5rpx;
		}
		
		.today {
			font-size: 30rpx;
			opacity: 0.9;
			background: rgba(255, 255, 255, 0.15);
			padding: 8rpx 20rpx;
			border-radius: 20rpx;
		}
	}
	
	.amount-display {
		position: relative;
		z-index: 1;
		
		.label {
			font-size: 28rpx;
			opacity: 0.9;
			margin-bottom: 12rpx;
			display: block;
			font-weight: 400;
		}
		
		.amount {
			font-size: 56rpx;
			font-weight: 800;
			letter-spacing: 1rpx;
		}
	}
}

// 快速输入区域
.quick-input-section {
	margin: -50rpx 32rpx 0;
	position: relative;
	z-index: 10;
}

.input-card {
	background: var(--bg-card);
	border-radius: 28rpx;
	padding: 48rpx 36rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 28rpx;
		background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
		z-index: -1;
	}
}

// 金额输入
.amount-input {
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid rgba(var(--border-light-rgb), 0.3);
	padding-bottom: 36rpx;
	margin-bottom: 36rpx;
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		bottom: -2rpx;
		left: 0;
		width: 60rpx;
		height: 4rpx;
		background: var(--primary-color);
		border-radius: 2rpx;
		transition: width 0.3s ease;
	}
	
	&:focus-within::after {
		width: 100%;
	}
	
	.currency {
		font-size: 56rpx;
		font-weight: 700;
		color: var(--primary-color);
		margin-right: 20rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}
	
	.amount-field {
		flex: 1;
		font-size: 72rpx;
		font-weight: 700;
		color: var(--text-primary);
		height: 88rpx;
		background: transparent;
		
		&::placeholder {
			color: rgba(var(--text-tertiary-rgb), 0.5);
			font-weight: 400;
		}
		
		&:focus {
			color: var(--primary-dark);
		}
	}
}

// 日期选择区域
.date-select-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 36rpx;
	margin-bottom: 36rpx;
	border-bottom: 2rpx solid rgba(var(--border-light-rgb), 0.3);
	
	.date-label {
		font-size: 32rpx;
		font-weight: 600;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 12rpx;
		
		&::before {
			content: '';
			display: block;
			width: 8rpx;
			height: 24rpx;
			background: var(--primary-color);
			border-radius: 4rpx;
		}
	}
	
	.date-picker {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 20rpx 28rpx;
		background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08) 0%, rgba(var(--primary-color-rgb), 0.04) 100%);
		border-radius: 20rpx;
		border: 1rpx solid rgba(var(--primary-color-rgb), 0.2);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		
		&:active {
			transform: scale(0.98);
			background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.12) 0%, rgba(var(--primary-color-rgb), 0.08) 100%);
		}
		
		.date-value {
			font-size: 30rpx;
			color: var(--text-primary);
			font-weight: 500;
			min-width: 180rpx;
			text-align: center;
		}
	}
}

// 快捷分类
.category-scroll {
	margin-bottom: 40rpx;
	white-space: nowrap;
	padding: 8rpx 0;
	
	.category-tag {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		margin-right: 40rpx;
		justify-content: center;
		vertical-align: top;
		transition: all 0.3s ease;
		
		&:last-child {
			margin-right: 0;
		}
		
		&.active {
			.category-icon {
				transform: scale(1.15) translateY(-4rpx);
				box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.15);
			}
			
			.category-name {
				color: var(--primary-color);
				font-weight: 600;
			}
		}
	}
	
	.category-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 50%;
			background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		}
	}
	
	.category-name {
		font-size: 26rpx;
		color: var(--text-secondary);
		transition: all 0.3s ease;
		font-weight: 500;
	}
}

// 备注输入
.remark-section {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx 28rpx;
	background: rgba(var(--bg-tertiary-rgb), 0.6);
	border-radius: 20rpx;
	margin-bottom: 48rpx;
	border: 1rpx solid rgba(var(--border-light-rgb), 0.3);
	transition: all 0.3s ease;
	
	&:focus-within {
		background: rgba(var(--bg-tertiary-rgb), 0.8);
		border-color: rgba(var(--primary-color-rgb), 0.3);
		box-shadow: 0 4rpx 12rpx rgba(var(--primary-color-rgb), 0.1);
	}
	
	.remark-input {
		flex: 1;
		height: 40rpx;
		font-size: 30rpx;
		color: var(--text-primary);
		background: transparent;
		
		&::placeholder {
			color: rgba(var(--text-tertiary-rgb), 0.7);
		}
	}
}

// 提交按钮
.submit-btn {
	height: 96rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	font-size: 34rpx;
	font-weight: 600;
	color: #ffffff;
	border: none;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	
	&:active::before {
		opacity: 1;
	}
	
	&.bg-primary-color {
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	}
	
	&.btn-disabled {
		background: var(--bg-tertiary);
		color: var(--text-tertiary);
		box-shadow: none;
	}
	
	.btn-text {
		font-size: 34rpx;
		font-weight: 600;
		letter-spacing: 1rpx;
		color: #18bc37;
	}
}

// 最近记录
.recent-section {
	padding: 32rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 36rpx;
	
	.section-title {
		font-size: 36rpx;
		font-weight: 700;
		color: var(--text-primary);
		position: relative;
		padding-left: 20rpx;
		
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 8rpx;
			height: 32rpx;
			background: var(--primary-color);
			border-radius: 4rpx;
		}
	}
	
	.view-all {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 12rpx 24rpx;
		background: rgba(var(--primary-color-rgb), 0.08);
		border-radius: 20rpx;
		transition: all 0.3s ease;
		
		&:active {
			background: rgba(var(--primary-color-rgb), 0.12);
			transform: scale(0.95);
		}
		
		text {
			font-size: 28rpx;
			color: var(--primary-color);
			font-weight: 500;
		}
	}
}

.record-list {
	.record-item {
		padding: 32rpx;
		margin-bottom: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
		border-radius: 24rpx;
		border: 1rpx solid rgba(var(--border-light-rgb), 0.2);
		transition: all 0.3s ease;
		
		&:active {
			transform: translateY(-2rpx);
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
		}
		
		.record-left {
			display: flex;
			align-items: center;
			gap: 28rpx;
			flex: 1;
		}
		
		.record-icon {
			width: 72rpx;
			height: 72rpx;
			border-radius: 18rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			position: relative;
			
			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border-radius: 18rpx;
				background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
			}
		}
		
		.record-info {
			display: flex;
			flex-direction: column;
			flex: 1;
			
			.record-category {
				font-size: 32rpx;
				font-weight: 600;
				color: var(--text-primary);
				margin-bottom: 8rpx;
			}
			
			.record-remark {
				font-size: 26rpx;
				color: var(--text-tertiary);
				line-height: 1.4;
			}
		}
		
		.record-right {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 8rpx;
			
			.record-amount {
				font-size: 34rpx;
				font-weight: 700;
				color: var(--danger-color);
			}
			
			.record-time {
				font-size: 24rpx;
				color: var(--text-secondary);
				opacity: 0.8;
			}
		}
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
	
	.empty-image-wrapper {
		width: 240rpx;
		height: 240rpx;
		margin-bottom: 40rpx;
		background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0.05) 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.empty-image {
			width: 180rpx;
			height: 180rpx;
			opacity: 0.5;
		}
	}
	
	.empty-text {
		font-size: 32rpx;
		color: var(--text-secondary);
		margin-bottom: 16rpx;
		font-weight: 500;
	}
	
	.empty-tip {
		font-size: 26rpx;
		color: var(--text-tertiary);
		opacity: 0.8;
	}
}

// 日历弹窗样式
.calendar-modal {
	::v-deep .uni-calendar__header {
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	}
	
	::v-deep .uni-calendar__mask {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10rpx);
	}
	
	::v-deep .uni-calendar__content {
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.2);
	}
}

// 添加动画
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.record-item {
	animation: fadeIn 0.4s ease backwards;
	
	&:nth-child(1) { animation-delay: 0.1s; }
	&:nth-child(2) { animation-delay: 0.2s; }
	&:nth-child(3) { animation-delay: 0.3s; }
	&:nth-child(4) { animation-delay: 0.4s; }
	&:nth-child(5) { animation-delay: 0.5s; }
}

// 响应式调整
@media screen and (max-width: 320px) {
	.quick-input-section {
		margin: -40rpx 24rpx 0;
	}
	
	.input-card {
		padding: 36rpx 28rpx;
	}
	
	.amount-field {
		font-size: 60rpx;
	}
	
	.category-scroll .category-tag {
		margin-right: 28rpx;
	}
}
</style>