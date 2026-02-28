<template>
	<view class="bill-page">
		<!-- 顶部筛选 -->
		<view class="filter-section shadow-xl">
			<view class="time-filter">
				<text class="current-month">{{currentMonth}}月</text>
				<uni-icons type="arrowdown" size="16" color="var(--text-white)" />
			</view>
			<view class="total-amount">
				<text class="label">本月总支出</text>
				<text class="amount">{{totalExpense}}</text>
			</view>
			<view class="month-progress">
				<view class="progress-bar">
					<view class="progress-fill" :style="{width: monthProgress + '%'}"></view>
				</view>
				<text class="progress-text">本月已过 {{currentDay}}/{{daysInMonth}} 天</text>
			</view>
		</view>
		
		<!-- 分类筛选 -->
		<scroll-view scroll-x="true" class="category-filter" :show-scrollbar="false">
			<view class="filter-container">
				<view
					v-for="(filter,index) in filters"
					:key="index"
					class="filter-tag shadow-sm"
					:class="{active:activeFilter===filter.value}"
					@click="changeFilter(filter.value)"
				>
					<text class="filter-text">{{filter.label}}</text>
					<view v-if="activeFilter===filter.value" class="filter-indicator"></view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 删除确认弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog 
				mode="base" 
				message="成功消息" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmDelete" 
				title="删除确认"
				class="delete-dialog"
			></uni-popup-dialog>
		</uni-popup>
		
		<!-- 账单列表 -->
		<scroll-view scroll-y="true" class="bill-list" :style="{height:scrollHeight}" :show-scrollbar="false">
			<view v-if="filteredBills.length>0">
				<view class="date-group" v-for="(group,date) in groupedBills" :key="date">
					<view class="date-header shadow-xs">
						<text class="date-text">{{formatDate(date)}}</text>
						<text class="day-amount">¥{{getDayTotal(date)}}</text>
					</view>
					<view 
						class="bill-item shadow-md" 
						v-for="bill in group" 
						:key="bill.id" 
						@click="handleBillClick(bill)" 
						@longpress="showDeleteDialog(bill)"
						:class="{'bill-item-active': isBillActive(bill)}"
					>
						<view class="bill-left">
							<view class="bill-icon-wrapper">
								<view class="bill-icon" :style="{backgroundColor:bill.bgColor}">
									<uni-icons :type="bill.icon" size="18" :color="bill.color" />
								</view>
								<view class="bill-time" v-if="bill.time">{{bill.time}}</view>
							</view>
							<view class="bill-info">
								<text class="bill-category">{{bill.category}}</text>
								<text class="bill-remark">{{bill.remark||'无备注'}}</text>
							</view>
						</view>
						<view class="bill-right">
							<text class="bill-amount text-danger">-¥{{bill.amount}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view v-else class="empty-bill">
				<view class="empty-illustration">
					<image src="/static/images/empty-bill.png" mode="aspectFit" class="empty-image" />
				</view>
				<text class="empty-text">暂无账单记录</text>
				<text class="empty-tip">快去记录你的第一笔消费吧</text>
				<button  @click="navToHome">
					<text>去记账</text>
				</button>
			</view>
		</scroll-view>
		
		<!-- 浮动按钮 -->
		<view class="floating-actions" v-if="filteredBills.length>0">
			<view class="floating-action-btn shadow-xl" @click="navToHome">
				<uni-icons type="plusempty" size="24" color="#fff" />
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			const now = new Date()
			const currentMonth = now.getMonth() + 1
			const currentYear = now.getFullYear()
			const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
			const currentDay = now.getDate()
			
			return {
				currentMonth: currentMonth,
				currentYear: currentYear,
				currentDay: currentDay,
				daysInMonth: daysInMonth,
				totalExpense: '0.00',
				activeFilter: 'all',
				scrollHeight: '0px',
				selectedBill: null,
				activeBillId: null
			}
		},
		computed: {
			...mapState('m_expense',['bills','filters']),
			
			// 计算本月进度
			monthProgress() {
				return Math.round((this.currentDay / this.daysInMonth) * 100)
			},
			
			filteredBills(){
				if(this.activeFilter==='all'){
					return this.bills
				}
				return this.bills.filter(bill => bill.type === this.activeFilter)
			},
			
			groupedBills() {
				const groups = {}
				
				if (!this.filteredBills || !Array.isArray(this.filteredBills)) {
					return groups
				}
				
				// 按日期分组，并排序
				this.filteredBills.forEach(bill => {
					if (!bill || !bill.date) return
					
					const dateStr = String(bill.date).trim()
					if (!dateStr || dateStr === 'undefined' || dateStr === 'null') return
					
					if (!groups[dateStr]) {
						groups[dateStr] = []
					}
					groups[dateStr].push(bill)
				})
				
				// 按日期倒序排序
				const sortedGroups = {}
				Object.keys(groups)
					.sort((a, b) => new Date(b) - new Date(a))
					.forEach(date => {
						sortedGroups[date] = groups[date]
					})
				
				return sortedGroups
			}
		},
		onLoad(){
			this.calcTotal()
			this.calcScrollHeight()
		},
		onShow(){
			this.calcTotal()
		},
		methods: {
			...mapMutations('m_expense',['DELETE_BILL']),
			
			showDeleteDialog(bill) {
				this.selectedBill = bill
				this.$refs.popup.open()
			},
			
			close() {
				this.selectedBill = null
				this.$refs.popup.close()
			},
			
			confirmDelete() {
				if(this.selectedBill){
					this.DELETE_BILL(this.selectedBill.id)
					this.calcTotal()
					uni.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1500
					})
				}
				this.selectedBill = null
				this.$refs.popup.close()
			},
			
			handleBillClick(bill){
				// 点击效果反馈
				this.activeBillId = bill.id
				setTimeout(() => {
					this.activeBillId = null
				}, 200)
			},
			
			isBillActive(bill) {
				return this.activeBillId === bill.id
			},
			
			calcTotal(){
				// 获取当前年月
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
				
				this.totalExpense = total.toLocaleString('zh-CN', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})
			},
			
			calcScrollHeight(){
				const systemInfo = uni.getSystemInfoSync()
				this.scrollHeight = (systemInfo.windowHeight - 280) + 'px'
			},
			
			changeFilter(value){
				this.activeFilter = value
			},
			
			formatDate(dateStr){
				const date = new Date(dateStr)
				const today = new Date()
				const yesterday = new Date(today)
				yesterday.setDate(yesterday.getDate() - 1)
				
				if(date.toDateString() === today.toDateString()){
					return '今天'
				} else if(date.toDateString() === yesterday.toDateString()){
					return '昨天'
				} else {
					const month = date.getMonth() + 1
					const day = date.getDate()
					const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
					const weekDay = weekDays[date.getDay()]
					return `${month}月${day}日 ${weekDay}`
				}
			},
			
			getDayTotal(date){
				const bills = this.groupedBills[date] || []
				const total = bills.reduce((sum, bill) => {
					return sum + parseFloat(bill.amount)
				}, 0)
				return total.toFixed(2)
			},
			
			navToHome(){
				uni.switchTab({
					url: '/pages/quickrem/quickrem'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.bill-page {
	background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
	min-height: 100vh;
	position: relative;
}

// 顶部筛选
.filter-section {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	padding: 40rpx 32rpx 36rpx;
	border-radius: 0 0 40rpx 40rpx;
	color: #f3a73f;
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: -80rpx;
		width: 200rpx;
		height: 200rpx;
		background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
		border-radius: 50%;
	}
	
	.time-filter {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 28rpx;
		position: relative;
		z-index: 1;
		
		.current-month {
			font-size: 36rpx;
			font-weight: 700;
			color: #f3a73f;
			letter-spacing: 0.5rpx;
		}
	}
	
	.total-amount {
		position: relative;
		z-index: 1;
		margin-bottom: 28rpx;
		
		.label {
			font-size: 28rpx;
			color: #f3a73f;
			margin-bottom: 12rpx;
			display: block;
			font-weight: 500;
		}
		
		.amount {
			font-size: 56rpx;
			font-weight: 800;
			color: #f3a73f;
			text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
			letter-spacing: 1rpx;
			
			&::before {
				content: '¥';
				font-size: 42rpx;
				margin-right: 8rpx;
				opacity: 0.9;
			}
		}
	}
	
	.month-progress {
		position: relative;
		z-index: 1;
		
		.progress-bar {
			height: 8rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 4rpx;
			overflow: hidden;
			margin-bottom: 12rpx;
			
			.progress-fill {
				height: 100%;
				background: linear-gradient(90deg, rgba(255,255,255,0.8), #ffffff);
				border-radius: 4rpx;
				transition: width 1s ease-in-out;
			}
		}
		
		.progress-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			display: block;
			text-align: center;
		}
	}
}

// 分类筛选
.category-filter {
	padding: 24rpx 32rpx;
	background: transparent;
	
	.filter-container {
		display: inline-flex;
		gap: 20rpx;
		padding: 4rpx;
	}
	
	.filter-tag {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 32rpx;
		background: var(--bg-card);
		border-radius: 100rpx;
		font-size: 28rpx;
		color: #18bc37;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		border: 1rpx solid rgba(var(--border-light-rgb), 0.3);
		
		&.active {
			background: var(--primary-color);
			color: #ffffff;
			transform: translateY(-2rpx);
			border-color: transparent;
			box-shadow: 0 8rpx 20rpx rgba(var(--primary-color-rgb), 0.3);
			
			.filter-text {
				color: #ffffff;
			}
		}
		
		.filter-text {
			font-weight: 500;
			transition: color 0.3s ease;
		}
		
		.filter-indicator {
			position: absolute;
			bottom: -4rpx;
			width: 24rpx;
			height: 4rpx;
			background: #ffffff;
			border-radius: 2rpx;
			animation: fadeIn 0.3s ease;
		}
	}
}

// 帐单列表
.bill-list {
	padding: 0 32rpx 120rpx;
}

.date-group {
	margin-bottom: 36rpx;
	animation: fadeIn 0.5s ease backwards;
	
	.date-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 24rpx 20rpx;
		margin-bottom: 20rpx;
		background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.05) 0%, transparent 100%);
		border-radius: 20rpx;
		backdrop-filter: blur(10rpx);
		
		.date-text {
			font-size: 30rpx;
			font-weight: 600;
			color: var(--text-primary);
			position: relative;
			padding-left: 24rpx;
			
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 8rpx;
				height: 24rpx;
				background: var(--primary-color);
				border-radius: 4rpx;
			}
		}
		
		.day-amount {
			font-size: 30rpx;
			font-weight: 700;
			color: var(--danger-color);
			margin-right: 10px;
			&::before {
				content: '¥';
				font-size: 24rpx;
				margin-right: 4rpx;
			}
		}
	}
}

.bill-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: var(--bg-card);
	border-radius: 24rpx;
	margin-bottom: 20rpx;
	border: 1rpx solid rgba(var(--border-light-rgb), 0.2);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 6rpx;
		height: 100%;
		background: linear-gradient(to bottom, var(--primary-color), transparent);
		border-radius: 3rpx 0 0 3rpx;
	}
	
	&:active,
	&.bill-item-active {
		transform: translateY(-2rpx);
		background: var(--bg-tertiary);
		box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15);
		
		&::before {
			width: 8rpx;
		}
	}
	
	.bill-left {
		display: flex;
		align-items: center;
		gap: 28rpx;
		flex: 1;
	}
	
	.bill-icon-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
		
		.bill-icon {
			width: 72rpx;
			height: 72rpx;
			border-radius: 18rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			position: relative;
			overflow: hidden;
			
			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
			}
		}
		
		.bill-time {
			font-size: 22rpx;
			color: var(--text-tertiary);
			font-weight: 400;
		}
	}
	
	.bill-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		
		.bill-category {
			font-size: 32rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 8rpx;
			line-height: 1.4;
		}
		
		.bill-remark {
			font-size: 26rpx;
			color: var(--text-tertiary);
			line-height: 1.4;
			max-width: 300rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	
	.bill-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		
		.bill-amount {
			font-size: 36rpx;
			font-weight: 700;
			color: var(--danger-color);
			text-shadow: 0 2rpx 4rpx rgba(var(--danger-color-rgb), 0.1);
			margin-right: 10px;
			&::before {
				content: '¥';
				font-size: 28rpx;
				margin-right: 4rpx;
			}
		}
	}
}

.empty-bill {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
	
	.empty-illustration {
		width: 280rpx;
		height: 280rpx;
		margin-bottom: 48rpx;
		background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08) 0%, transparent 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.empty-image {
			width: 200rpx;
			height: 200rpx;
			opacity: 0.6;
			filter: drop-shadow(0 8rpx 16rpx rgba(0, 0, 0, 0.1));
		}
	}
	
	.empty-text {
		font-size: 36rpx;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 16rpx;
	}
	
	.empty-tip {
		font-size: 28rpx;
		color: var(--text-tertiary);
		margin-bottom: 48rpx;
	}
	
	.empty-btn {
		width: 240rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 8rpx 24rpx rgba(var(--primary-color-rgb), 0.3);
		}
	}
}

// 浮动按钮
.floating-actions {
	position: fixed;
	bottom: 40rpx;
	right: 32rpx;
	z-index: 100;
	
	.floating-action-btn {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
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
			background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		}
		
		&:active {
			transform: scale(0.92);
			box-shadow: 0 16rpx 32rpx rgba(var(--primary-color-rgb), 0.4);
		}
	}
}

// 删除弹窗样式
.delete-dialog {
	::v-deep .uni-popup__wrapper-box {
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.2);
	}
	
	::v-deep .uni-popup-dialog__title {
		font-size: 32rpx;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	::v-deep .uni-popup-dialog__content {
		font-size: 28rpx;
		color: var(--text-secondary);
		line-height: 1.6;
	}
}

// 动画
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

// 日期分组动画
.date-group {
	&:nth-child(1) { animation-delay: 0.1s; }
	&:nth-child(2) { animation-delay: 0.2s; }
	&:nth-child(3) { animation-delay: 0.3s; }
	&:nth-child(4) { animation-delay: 0.4s; }
}

// 账单项动画
.bill-item {
	animation: fadeIn 0.4s ease backwards;
	
	&:nth-child(1) { animation-delay: 0.1s; }
	&:nth-child(2) { animation-delay: 0.2s; }
	&:nth-child(3) { animation-delay: 0.3s; }
	&:nth-child(4) { animation-delay: 0.4s; }
	&:nth-child(5) { animation-delay: 0.5s; }
}

// 响应式调整
@media screen and (max-width: 320px) {
	.filter-section {
		padding: 32rpx 24rpx 28rpx;
		
		.total-amount .amount {
			font-size: 48rpx;
		}
	}
	
	.category-filter {
		padding: 20rpx 24rpx;
	}
	
	.bill-list {
		padding: 0 24rpx 120rpx;
	}
	
	.bill-item {
		padding: 28rpx 24rpx;
	}
	
	.floating-actions {
		bottom: 32rpx;
		right: 24rpx;
		
		.floating-action-btn {
			width: 80rpx;
			height: 80rpx;
		}
	}
}
</style>