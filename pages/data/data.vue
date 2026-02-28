<template>
	<view class="stats-page">
		<!-- 顶部统计卡片 -->
		<view class="stats-header shadow-lg">
			<view class="header-content">
				<text class="page-title">消费统计</text>
				<text class="page-subtitle">洞察你的消费习惯</text>
			</view>
			<view class="time-range" @click="showTimePicker">
				<text class="current-time">{{currentMonth}}月</text>
				<uni-icons type="calendar" size="18" color="var(--primary-color)" />
			</view>
		</view>
		
		<!-- 概览卡片 -->
		<view class="overview-section">
			<view class="overview-cards">
				<view class="overview-card shadow-xl">
					<view class="card-icon">
						<uni-icons type="wallet" size="28" color="var(--primary-color)" />
					</view>
					<view class="card-content">
						<text class="card-title">本月支出</text>
						<text class="card-value">￥{{totalExpense}}</text> 
						<view class="card-trend">
							<uni-icons :type="expenseChange >= 0 ? 'arrowthinup' : 'arrowthindown'" 
								size="14" 
								:color="expenseChange >= 0 ? '#FF6B6B' : '#4CAF50'" />
							<text class="trend-text" :style="{color: expenseChange >= 0 ? '#FF6B6B' : '#4CAF50'}">
								{{expenseChange}} %
							</text>
						</view>
					</view>
				</view>
				
				<view class="overview-card shadow-xl">
					<view class="card-icon">
						<uni-icons type="pulldown" size="28" color="var(--info-color)" />
					</view>
					<view class="card-content">
						<text class="card-title">日均消费</text>
						<text class="card-value">￥{{dailyAverage}}</text> 
						<view class="progress-indicator">
							<view class="progress-track">
								<view class="progress-bar" :style="{width: dailyProgress + '%'}"></view>
							</view>
							<text class="progress-label">合理范围</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 消费构成 -->
		<view class="section-card shadow-lg">
			<view class="section-header">
				<view class="section-title-wrapper">
					<uni-icons type="piegraph" size="20" color="var(--primary-color)" />
					<text class="section-title">消费构成</text>
				</view>
				<view class="time-tabs">
					<text
						v-for="tab in timeTabs"
						:key="tab"
						class="time-tab"
						:class="{active:activeTimeTab===tab}"
						@click="activeTimeTab=tab"
					>{{tab}}</text>
				</view>
			</view>
			
			<view class="chart-container">
				<view v-if="categoryData.length > 0" class="simple-chart">
					<view class="chart-summary">
						<text class="summary-text">本月共 {{categoryData.length}} 个消费分类</text>
					</view>
					<view class="category-list">
						<view class="category-item" v-for="(item, index) in categoryData" :key="item.name">
							<view class="category-header">
								<view class="category-meta">
									<view class="category-dot" :style="{backgroundColor: item.color}"></view>
									<text class="category-name">{{item.name}}</text>
									<text class="category-rank">#{{index + 1}}</text>
								</view>
								<view class="category-percent">
									<text class="percent-value">{{item.percent}}</text>
								</view>
							</view>
							<view class="category-body">
								<view class="progress-container">
									<view class="progress-track">
										<view class="progress-fill" :style="{
											width: item.percent + '%',
											background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`
										}"></view>
									</view>
								</view>
								<text class="category-amount">{{item.value}}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="empty-chart">
					<view class="empty-illustration">
						<uni-icons type="piegraph" size="60" color="var(--text-tertiary)" />
					</view>
					<text class="empty-text">暂无消费数据</text>
					<text class="empty-tip">开始记账后查看消费构成</text>
				</view>
			</view>
		</view>
		
		<!-- 消费趋势 -->
		<view class="section-card shadow-lg">
			<view class="section-header">
				<view class="section-title-wrapper">
					<uni-icons type="stats" size="20" color="var(--primary-color)" />
					<text class="section-title">消费趋势</text>
				</view>
				<text class="trend-period">最近7天</text>
			</view>
			
			<view class="trend-chart">
				<view class="simple-trend">
					<view class="trend-header">
						<text class="trend-label">消费金额</text>
						<text class="trend-max">最高:￥{{trendMax}}</text> 
					</view>
					<view class="trend-bars">
						<view class="trend-bar" v-for="(day,index) in trendData" :key="index">
							<view class="bar-wrapper">
								<view class="bar" :style="{
									height: (day.value/maxTrendValue)*100 + 'rpx',
									background: `linear-gradient(to top, var(--primary-color), var(--primary-light))`
								}">
									<view class="bar-value">{{day.value}}</view>
								</view>
							</view>
							<view class="bar-label">
								<text class="label-text">{{day.label}}</text>
								<text class="label-day">周{{day.label}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 消费建议 -->
		<view class="advice-card shadow-xl">
			<view class="advice-header">
				<view class="advice-icon">
					<uni-icons type="info" size="24" color="var(--warning-color)" />
				</view>
				<text class="advice-title">智能建议</text>
			</view>
			<view class="advice-content">
				<text class="advice-text">{{currentAdvice}}</text>
				<view class="advice-action">
					<text class="action-text">记账 {{totalRecords}} 天</text>
					<view class="action-badge">
						<text>坚持记账</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 返回顶部按钮 -->
		<view class="back-top" @click="scrollToTop" v-if="showBackTop">
			<uni-icons type="arrowup" size="20" color="#fff" />
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				currentMonth: new Date().getMonth() + 1,
				totalExpense: '0.00',
				expenseChange: '+0',
				dailyAverage: '0.00',
				dailyProgress: 60,
				activeTimeTab: '本月',
				timeTabs: ['本周', '本月', '本年'],
				showChart: false,
				categoryData: [],
				trendData: [],
				currentAdvice: '',
				showBackTop: false,
				scrollTop: 0,
				totalRecords: 0
			}
		},
		computed: {
			maxTrendValue() {
				if (!this.trendData || this.trendData.length === 0) return 1
				return Math.max(...this.trendData.map(item => item.value || 0))
			},
			trendMax() {
				return this.maxTrendValue.toFixed(0)
			},
			...mapState('m_expense', ['bills'])
		},
		onLoad() {
			this.initData()
			this.calcScrollHeight()
		},
		onShow() {
			this.initData()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			this.showBackTop = e.scrollTop > 300
		},
		methods: {
			initData() {
				this.calcTotal()
				this.calcCategoryData()
				this.generateAdvice()
				this.generateTrendData()
				this.calcDailyProgress()
				this.countRecords()
			},
			
			calcTotal() {
				const now = new Date()
				const currentYear = now.getFullYear()
				const currentMonth = now.getMonth() + 1
				
				// 筛选本月账单
				const monthBills = this.bills.filter(bill => {
					if (!bill || !bill.date) return false
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
				this.totalExpense = this.formatMoney(total)
				
				// 计算日均消费
				this.calcDailyAverage(total)
				
				// 计算支出变化
				this.calcExpenseChange(total, monthBills)
			},
			
			formatMoney(amount) {
				if (amount >= 10000) {
					return (amount / 10000).toFixed(1) + '万'
				}
				return amount.toFixed(2)
			},
			
			calcDailyAverage(totalAmount) {
				const today = new Date()
				const daysInMonth = today.getDate()
				
				if (totalAmount > 0 && daysInMonth > 0) {
					const average = totalAmount / daysInMonth
					this.dailyAverage = average.toFixed(2)
				} else {
					this.dailyAverage = '0.00'
				}
			},
			
			calcExpenseChange(currentTotal, currentMonthBills) {
				// 计算上月支出
				const lastMonth = new Date()
				lastMonth.setMonth(lastMonth.getMonth() - 1)
				
				const lastMonthBills = this.bills.filter(bill => {
					if (!bill || !bill.date) return false
					try {
						const billDate = new Date(bill.date)
						return billDate.getMonth() === lastMonth.getMonth() && 
							   billDate.getFullYear() === lastMonth.getFullYear()
					} catch {
						return false
					}
				})
				
				const lastMonthTotal = lastMonthBills.reduce((sum, bill) => {
					return sum + (parseFloat(bill.amount) || 0)
				}, 0)
				
				if (lastMonthTotal > 0) {
					const change = ((currentTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
					this.expenseChange = change >= 0 ? `+${change}` : `${change}` // 移除%符号
				} else if (currentTotal > 0) {
					this.expenseChange = '+100'
				} else {
					this.expenseChange = '+0'
				}
			},
			
			calcCategoryData() {
				const now = new Date()
				const currentYear = now.getFullYear()
				const currentMonth = now.getMonth() + 1
				
				// 筛选本月账单
				const monthBills = this.bills.filter(bill => {
					if (!bill || !bill.date) return false
					try {
						const billDate = new Date(bill.date)
						return billDate.getFullYear() === currentYear && billDate.getMonth() + 1 === currentMonth
					} catch {
						return false
					}
				})
				
				if (monthBills.length === 0) {
					this.categoryData = []
					return
				}
				
				// 定义分类颜色映射
				const categoryColors = {
					'餐饮': '#FF6B6B',
					'购物': '#4CAF50',
					'交通': '#2196F3',
					'娱乐': '#FFC107',
					'其他': '#607D8B',
					'food': '#FF6B6B',
					'shopping': '#4CAF50',
					'transport': '#2196F3',
					'entertainment': '#FFC107',
					'other': '#607D8B'
				}
				
				// 按分类汇总金额
				const categoryMap = {}
				
				monthBills.forEach(bill => {
					let categoryName = ''
					if (bill.category && typeof bill.category === 'object') {
						categoryName = bill.category.name || '其他'
					} else if (bill.category && typeof bill.category === 'string') {
						categoryName = bill.category
					} else if (bill.type) {
						categoryName = this.getCategoryName(bill.type)
					} else {
						categoryName = '其他'
					}
					
					const amount = parseFloat(bill.amount) || 0
					if (!categoryMap[categoryName]) {
						categoryMap[categoryName] = {
							name: categoryName,
							value: 0,
							amount: 0
						}
					}
					categoryMap[categoryName].value += amount
					categoryMap[categoryName].amount += amount
				})
				
				// 计算总金额
				const totalAmount = Object.values(categoryMap).reduce((sum, cat) => sum + cat.value, 0)
				
				// 格式化数据并计算百分比
				this.categoryData = Object.values(categoryMap).map(cat => {
					const percent = totalAmount > 0 ? ((cat.value / totalAmount) * 100).toFixed(1) : 0
					
					return {
						name: cat.name,
						value: this.formatMoney(cat.value), // 使用统一的金额格式化
						percent: Number(percent),
						color: categoryColors[cat.name] || categoryColors['其他'] || '#607D8B'
					}
				}).sort((a, b) => b.percent - a.percent)
			},
			
			getCategoryName(type) {
				const typeMap = {
					'food': '餐饮',
					'shopping': '购物',
					'transport': '交通',
					'entertainment': '娱乐',
					'other': '其他'
				}
				return typeMap[type] || '其他'
			},
			
			generateTrendData() {
				const now = new Date()
				const weekDays = ['一', '二', '三', '四', '五', '六', '日']
				const trendData = []
				
				// 生成最近7天的数据
				for (let i = 6; i >= 0; i--) {
					const date = new Date()
					date.setDate(now.getDate() - i)
					const dayLabel = weekDays[date.getDay() - 1] || '日'
					
					// 筛选当天的账单
					const dayBills = this.bills.filter(bill => {
						if (!bill || !bill.date) return false
						try {
							const billDate = new Date(bill.date)
							return billDate.toDateString() === date.toDateString()
						} catch {
							return false
						}
					})
					
					const dayTotal = dayBills.reduce((sum, bill) => {
						return sum + (parseFloat(bill.amount) || 0)
					}, 0)
					
					trendData.push({
						label: dayLabel,
						value: Math.round(dayTotal),
						date: date.toLocaleDateString()
					})
				}
				
				this.trendData = trendData
			},
			
			generateAdvice() {
				if (this.categoryData.length === 0) {
					this.currentAdvice = '本月暂无消费记录，开始记账了解你的消费习惯吧！'
					return
				}
				
				// 找出消费最高的分类
				const maxCategory = this.categoryData.reduce((max, cat) => {
					return cat.percent > max.percent ? cat : max
				}, this.categoryData[0])
				
				const adviceMap = {
					'餐饮': `本月${maxCategory.name}消费占${maxCategory.percent}%，建议适当控制外出就餐频率，尝试自己做饭。`,
					'购物': `本月${maxCategory.name}消费占比较高，建议理性消费，制定购物清单避免冲动消费。`,
					'交通': `本月${maxCategory.name}费用占${maxCategory.percent}%，可考虑公共交通或共享出行节省开支。`,
					'娱乐': `本月${maxCategory.name}消费占${maxCategory.percent}%，建议合理安排休闲预算，寻找免费娱乐活动。`,
					'其他': `本月${maxCategory.name}类消费较多，建议查看明细控制不必要的支出。`
				}
				
				this.currentAdvice = adviceMap[maxCategory.name] || '消费结构均衡，继续保持良好的记账习惯！'
			},
			
			calcDailyProgress() {
				// 根据日均消费和总预算计算进度
				const dailyNum = parseFloat(this.dailyAverage)
				if (dailyNum <= 50) {
					this.dailyProgress = 30
				} else if (dailyNum <= 100) {
					this.dailyProgress = 60
				} else {
					this.dailyProgress = 90
				}
			},
			
			countRecords() {
				// 统计有记录的日期数量
				const recordDates = new Set()
				this.bills.forEach(bill => {
					if (bill.date) {
						recordDates.add(bill.date)
					}
				})
				this.totalRecords = recordDates.size
			},
			
			showTimePicker() {
				// 可以在这里添加时间选择器
				uni.showToast({
					title: '时间筛选功能开发中',
					icon: 'none'
				})
			},
			
			calcScrollHeight() {
				const systemInfo = uni.getSystemInfoSync()
				this.scrollHeight = (systemInfo.windowHeight - 200) + 'px'
			},
			
			scrollToTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.stats-page {
	padding: 0 0 40rpx;
	background: linear-gradient(180deg, #f5f7fa 0%, #f0f2f5 100%);
	min-height: 100vh;
	position: relative;
}

// 顶部标题区域
.stats-header {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	padding: 60rpx 32rpx 40rpx;
	border-radius: 0 0 40rpx 40rpx;
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: -60rpx;
		width: 200rpx;
		height: 200rpx;
		background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
		border-radius: 50%;
	}
	
	.header-content {
		margin-bottom: 32rpx;
		position: relative;
		z-index: 1;
		
		.page-title {
			display: block;
			font-size: 42rpx;
			font-weight: 800;
			color: #f3a73f;
			margin-bottom: 8rpx;
			letter-spacing: 0.5rpx;
		}
		
		.page-subtitle {
			font-size: 26rpx;
			color: #f3a73f;
			font-weight: 400;
		}
	}
	
	.time-range {
		display: inline-flex;
		align-items: center;
		gap: 12rpx;
		padding: 16rpx 28rpx;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10rpx);
		border-radius: 100rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
		transition: all 0.3s ease;
		position: relative;
		z-index: 1;
		
		&:active {
			background: rgba(255, 255, 255, 0.25);
			transform: scale(0.98);
		}
		
		.current-time {
			font-size: 30rpx;
			font-weight: 600;
			color: #f3a73f;
		}
	}
}

// 概览区域
.overview-section {
	padding: 32rpx;
	margin-top: -20rpx;
}

.overview-cards {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.overview-card {
	background: var(--bg-card);
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	align-items: flex-start;
	gap: 24rpx;
	position: relative;
	overflow: hidden;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4rpx;
		background: linear-gradient(90deg, var(--primary-color), var(--info-color));
	}
	
	.card-icon {
		width: 56rpx;
		height: 56rpx;
		background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1), rgba(var(--info-color-rgb), 0.1));
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.card-content {
		flex: 1;
		
		.card-title {
			display: block;
			font-size: 26rpx;
			color: var(--text-tertiary);
			margin-bottom: 12rpx;
			font-weight: 500;
		}
		
		.card-value {
			display: block;
			font-size: 44rpx;
			font-weight: 800;
			color: var(--text-primary);
			margin-bottom: 16rpx;
			letter-spacing: 0.5rpx;
			
			// 移除伪元素添加的¥
			/* &::before {
				content: '¥';
				font-size: 32rpx;
				margin-right: 4rpx;
				opacity: 0.7;
			} */
		}
		
		.card-trend {
			display: flex;
			align-items: center;
			gap: 8rpx;
			
			.trend-text {
				font-size: 24rpx;
				font-weight: 600;
				
				// 移除伪元素添加的%
				/* &::after {
					content: '%';
					font-size: 20rpx;
					margin-left: 2rpx;
				} */
			}
		}
		
		.progress-indicator {
			display: flex;
			align-items: center;
			gap: 16rpx;
			
			.progress-track {
				flex: 1;
				height: 6rpx;
				background: var(--bg-tertiary);
				border-radius: 3rpx;
				overflow: hidden;
				
				.progress-bar {
					height: 100%;
					background: linear-gradient(90deg, var(--info-color), #2196F3);
					border-radius: 3rpx;
					transition: width 1s ease;
				}
			}
			
			.progress-label {
				font-size: 22rpx;
				color: var(--text-tertiary);
				flex-shrink: 0;
			}
		}
	}
}

// 分区卡片
.section-card {
	background: var(--bg-card);
	border-radius: 24rpx;
	padding: 32rpx;
	margin: 0 32rpx 32rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
		
		.section-title-wrapper {
			display: flex;
			align-items: center;
			gap: 12rpx;
			
			.section-title {
				font-size: 32rpx;
				font-weight: 700;
				color: var(--text-primary);
			}
		}
		
		.time-tabs {
			display: flex;
			background: var(--bg-tertiary);
			border-radius: 100rpx;
			padding: 4rpx;
			
			.time-tab {
				padding: 12rpx 20rpx;
				font-size: 24rpx;
				color: var(--text-secondary);
				border-radius: 100rpx;
				transition: all 0.3s ease;
				
				&.active {
					background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
					color: #ffffff;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(var(--primary-color-rgb), 0.2);
				}
			}
		}
		
		.trend-period {
			font-size: 26rpx;
			color: var(--text-secondary);
			font-weight: 500;
		}
	}
}

// 消费构成
.chart-container {
	.chart-summary {
		margin-bottom: 32rpx;
		padding-bottom: 24rpx;
		border-bottom: 1rpx solid rgba(var(--border-light-rgb), 0.5);
		
		.summary-text {
			font-size: 26rpx;
			color: var(--text-secondary);
		}
	}
	
	.category-list {
		.category-item {
			margin-bottom: 32rpx;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			.category-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;
				
				.category-meta {
					display: flex;
					align-items: center;
					gap: 16rpx;
					
					.category-dot {
						width: 16rpx;
						height: 16rpx;
						border-radius: 50%;
						box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
					}
					
					.category-name {
						font-size: 30rpx;
						font-weight: 600;
						color: var(--text-primary);
					}
					
					.category-rank {
						font-size: 22rpx;
						color: var(--text-tertiary);
						background: var(--bg-tertiary);
						padding: 4rpx 12rpx;
						border-radius: 12rpx;
					}
				}
				
				.category-percent {
					.percent-value {
						font-size: 32rpx;
						font-weight: 700;
						color: var(--text-primary);
						
						// 保留%符号
						&::after {
							content: '%';
							font-size: 24rpx;
							margin-left: 2rpx;
							opacity: 0.7;
						}
					}
				}
			}
			
			.category-body {
				display: flex;
				align-items: center;
				gap: 24rpx;
				
				.progress-container {
					flex: 1;
					
					.progress-track {
						height: 12rpx;
						background: var(--bg-tertiary);
						border-radius: 6rpx;
						overflow: hidden;
						
						.progress-fill {
							height: 100%;
							border-radius: 6rpx;
							transition: width 1s ease;
						}
					}
				}
				
				.category-amount {
					font-size: 28rpx;
					font-weight: 600;
					color: var(--text-primary);
					min-width: 120rpx;
					text-align: right;
					
					// 添加¥符号
					&::before {
						content: '¥';
						font-size: 22rpx;
						margin-right: 4rpx;
						opacity: 0.7;
					}
				}
			}
		}
	}
	
	.empty-chart {
		padding: 60rpx 0;
		text-align: center;
		
		.empty-illustration {
			width: 120rpx;
			height: 120rpx;
			margin: 0 auto 24rpx;
			background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08), transparent);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.empty-text {
			display: block;
			font-size: 32rpx;
			color: var(--text-primary);
			margin-bottom: 12rpx;
			font-weight: 600;
		}
		
		.empty-tip {
			font-size: 26rpx;
			color: var(--text-tertiary);
		}
	}
}

// 消费趋势
.trend-chart {
	.simple-trend {
		.trend-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 32rpx;
			
			.trend-label {
				font-size: 26rpx;
				color: var(--text-secondary);
				font-weight: 500;
				
				// 添加单位
				&::after {
					content: ' (¥)';
					font-size: 22rpx;
					color: var(--text-tertiary);
				}
			}
			
			.trend-max {
				font-size: 24rpx;
				color: var(--primary-color);
				font-weight: 600;
				
			}
		}
		
		.trend-bars {
			display: flex;
			justify-content: space-around;
			align-items: flex-end;
			height: 200rpx;
			padding: 0 20rpx;
			
			.trend-bar {
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 100%;
				
				.bar-wrapper {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-end;
					flex: 1;
					width: 100%;
				}
				
				.bar {
					width: 48rpx;
					border-radius: 8rpx 8rpx 0 0;
					position: relative;
					transition: height 1s ease;
					box-shadow: 0 4rpx 12rpx rgba(var(--primary-color-rgb), 0.2);
					
					.bar-value {
						position: absolute;
						top: -40rpx;
						left: 50%;
						transform: translateX(-50%);
						font-size: 20rpx;
						font-weight: 600;
						color: var(--text-primary);
						white-space: nowrap;
						
						// 添加¥符号
						&::before {
							content: '¥';
							font-size: 16rpx;
							margin-right: 2rpx;
						}
					}
				}
				
				.bar-label {
					margin-top: 24rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					.label-text {
						font-size: 28rpx;
						font-weight: 600;
						color: var(--text-primary);
						margin-bottom: 4rpx;
					}
					
					.label-day {
						font-size: 22rpx;
						color: var(--text-tertiary);
					}
				}
			}
		}
	}
}

// 消费建议
.advice-card {
	background: linear-gradient(135deg, #FFF8E1, #FFECB3);
	border-radius: 24rpx;
	padding: 32rpx;
	margin: 0 32rpx;
	border: 1rpx solid rgba(var(--warning-color-rgb), 0.2);
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 8rpx;
		height: 100%;
		background: linear-gradient(to bottom, var(--warning-color), #FFB300);
	}
	
	.advice-header {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 24rpx;
		
		.advice-icon {
			width: 48rpx;
			height: 48rpx;
			background: rgba(var(--warning-color-rgb), 0.1);
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.advice-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #E65100;
		}
	}
	
	.advice-content {
		.advice-text {
			display: block;
			font-size: 28rpx;
			line-height: 1.6;
			color: #5D4037;
			margin-bottom: 24rpx;
		}
		
		.advice-action {
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.action-text {
				font-size: 26rpx;
				color: #795548;
				font-weight: 500;
			}
			
			.action-badge {
				background: linear-gradient(135deg, #4CAF50, #2E7D32);
				color: #ffffff;
				padding: 8rpx 20rpx;
				border-radius: 20rpx;
				font-size: 22rpx;
				font-weight: 600;
			}
		}
	}
}

// 返回顶部按钮
.back-top {
	position: fixed;
	bottom: 60rpx;
	right: 32rpx;
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 32rpx rgba(var(--primary-color-rgb), 0.3);
	cursor: pointer;
	z-index: 100;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.92);
		box-shadow: 0 4rpx 20rpx rgba(var(--primary-color-rgb), 0.4);
	}
}

// 阴影类
.shadow-sm {
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.shadow-md {
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.shadow-lg {
	box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);
}

.shadow-xl {
	box-shadow: 0 24rpx 64rpx rgba(0, 0, 0, 0.16);
}

// 动画
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.overview-card,
.section-card,
.advice-card {
	animation: fadeInUp 0.6s ease backwards;
	
	&:nth-child(1) { animation-delay: 0.1s; }
	&:nth-child(2) { animation-delay: 0.2s; }
	&:nth-child(3) { animation-delay: 0.3s; }
	&:nth-child(4) { animation-delay: 0.4s; }
}

// 响应式调整
@media screen and (max-width: 320px) {
	.stats-header {
		padding: 40rpx 24rpx 32rpx;
	}
	
	.overview-section,
	.section-card,
	.advice-card {
		padding: 24rpx;
		margin: 0 24rpx 24rpx;
	}
	
	.overview-cards {
		gap: 16rpx;
	}
	
	.back-top {
		right: 24rpx;
		bottom: 40rpx;
		width: 64rpx;
		height: 64rpx;
	}
}
</style>