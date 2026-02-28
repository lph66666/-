<template>
	<view class="profile-page">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="bg-circle circle-1"></view>
			<view class="bg-circle circle-2"></view>
			<view class="bg-circle circle-3"></view>
		</view>
		
		<!-- 用户信息 -->
		<view class="user-card">
			<!-- 用户头像区域 -->
			<view class="user-avatar-section">
				<view class="avatar-container">
					<image 
						class="user-avatar" 
						src="../../static/default-avatar.png" 
						mode="aspectFill"
						@click="editAvatar"
					/>
					<view class="avatar-ring"></view>
					<view class="avatar-edit-btn" @click="editAvatar">
						<uni-icons type="camera" size="16" color="#fff" />
					</view>
				</view>
				
				<view class="user-detail">
					<text class="user-name">微记账</text>
					<text class="user-email">记账{{recordDays}}天</text>
					<view class="user-badge">
						<text>记账达人</text>
					</view>
				</view>
			</view>
			
			<!-- 用户数据统计 -->
			<view class="user-stats">
				<view class="stats-card">
					<view class="stat-item">
						<view class="stat-icon">
							<uni-icons type="compose" size="20" color="#4CAF50" />
						</view>
						<text class="stat-value">{{totalRecords}}</text>
						<text class="stat-label">总记录</text>
					</view>
					
					<view class="stat-divider"></view>
					
					<view class="stat-item">
						<view class="stat-icon">
							<uni-icons type="folder" size="20" color="#2196F3" />
						</view>
						<text class="stat-value">{{categoryCount}}</text>
						<text class="stat-label">分类</text>
					</view>
					
					<view class="stat-divider"></view>
					
					<view class="stat-item">
						<view class="stat-icon">
							<uni-icons type="fire" size="20" color="#FF9800" />
						</view>
						<text class="stat-value">{{activeDays}}</text>
						<text class="stat-label">活跃天</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 功能卡片区域 -->
		<view class="content-section">
			<!-- 设置项卡片 -->
			<view class="card settings-section">
				<view class="card-header">
					<uni-icons type="settings" size="18" color="var(--text-secondary)" />
					<text class="section-title">设置</text>
				</view>
				
				<view class="settings-list">
					<view class="setting-item" @click="navToBudget">
						<view class="setting-left">
							<view class="icon-wrapper budget-icon">
								<uni-icons type="calendar" size="20" color="#fff" />
							</view>
							<view>
								<text class="setting-name">预算管理</text>
								<text class="setting-desc">每月支出计划</text>
							</view>
						</view>
						<view class="setting-right">
							<text class="budget-amount">￥{{currentBudget}}</text>
							<uni-icons type="right" size="16" color="var(--text-tertiary)" />
						</view>
					</view>
					
					<view class="setting-item" @click="navToCategories">
						<view class="setting-left">
							<view class="icon-wrapper category-icon">
								<uni-icons type="list" size="20" color="#fff" />
							</view>
							<view>
								<text class="setting-name">分类管理</text>
								<text class="setting-desc">自定义收支分类</text>
							</view>
						</view>
						<uni-icons type="right" size="16" color="var(--text-tertiary)" />
					</view>
					
					<view class="setting-item" @click="navToReminder">
						<view class="setting-left">
							<view class="icon-wrapper reminder-icon">
								<uni-icons type="bell" size="20" color="#fff" />
							</view>
							<view>
								<text class="setting-name">记账提醒</text>
								<text class="setting-desc">每日提醒记账</text>
							</view>
						</view>
						<view class="setting-right">
							<switch 
								:checked="reminderEnabled" 
								@change="toggleReminder"
								color="#4CAF50"
								class="reminder-switch"
							/>
						</view>
					</view>
					
					<view class="setting-item" @click="navToBackup">
						<view class="setting-left">
							<view class="icon-wrapper backup-icon">
								<uni-icons type="cloud-upload" size="20" color="#fff" />
							</view>
							<view>
								<text class="setting-name">数据备份</text>
								<text class="setting-desc">云端同步数据</text>
							</view>
						</view>
						<view class="setting-right">
							<text class="backup-time">{{lastBackup}}</text>
							<uni-icons type="right" size="16" color="var(--text-tertiary)" />
						</view>
					</view>
				</view>
			</view>
			
			<!-- 其他功能卡片 -->
			<view class="card other-section">
				<view class="card-header">
					<uni-icons type="more" size="18" color="var(--text-secondary)" />
					<text class="section-title">其他</text>
				</view>
				
				<view class="other-list">
					<view class="other-item" @click="navToHelp">
						<view class="item-left">
							<view class="other-icon help-icon">
								<uni-icons type="help" size="18" color="#fff" />
							</view>
							<text class="other-name">使用帮助</text>
						</view>
						<uni-icons type="right" size="14" color="var(--text-tertiary)" />
					</view>
					
					<view class="other-item" @click="rateApp">
						<view class="item-left">
							<view class="other-icon star-icon">
								<uni-icons type="star" size="18" color="#fff" />
							</view>
							<text class="other-name">给我们评分</text>
						</view>
						<uni-icons type="right" size="14" color="var(--text-tertiary)" />
					</view>
					
					<view class="other-item" @click="navToFeedback">
						<view class="item-left">
							<view class="other-icon feedback-icon">
								<uni-icons type="chat" size="18" color="#fff" />
							</view>
							<text class="other-name">反馈建议</text>
						</view>
						<uni-icons type="right" size="14" color="var(--text-tertiary)" />
					</view>
					
					<view class="other-item" @click="navToAbout">
						<view class="item-left">
							<view class="other-icon about-icon">
								<uni-icons type="info" size="18" color="#fff" />
							</view>
							<text class="other-name">关于我们</text>
						</view>
						<uni-icons type="right" size="14" color="var(--text-tertiary)" />
					</view>
				</view>
			</view>
			
			<!-- 版本信息 -->
			<view class="version-card">
				<text class="app-name">微记账</text>
				<text class="version-text">版本 {{appVersion}}</text>
				<text class="copyright">© 2024 微记账 · 让记账更简单</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recordDays: 128,
				totalRecords: 456,
				categoryCount: 8,
				activeDays: 28,
				currentBudget: '3000.00',
				reminderEnabled: true,
				lastBackup: '昨天',
				appVersion: '1.0.0'
			};
		},
		methods: {
			editAvatar() {
				uni.showToast({
					title: '头像编辑功能开发中',
					icon: 'none'
				});
			},
			toggleReminder(e) {
				this.reminderEnabled = e.detail.value;
				uni.showToast({
					title: this.reminderEnabled ? '提醒已开启' : '提醒已关闭',
					icon: 'success',
					duration: 1500
				});
			},
			navToBudget() {
				uni.navigateTo({
					//url: '/subpkg/budget/budget'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToCategories() {
				uni.navigateTo({
					//url: '/subpkg/categories/categories'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToReminder() {
				uni.navigateTo({
					//url: '/subpkg/reminder/reminder'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToBackup() {
				uni.navigateTo({
					//url: '/subpkg/backup/backup'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToHelp() {
				uni.navigateTo({
					//url: '/subpkg/help/help'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToFeedback() {
				uni.navigateTo({
					// url: '/subpkg/feedback/feedback'
					url:'/subpkg/testabout/testabout'
				});
			},
			navToAbout() {
				uni.navigateTo({
					// url: '/subpkg/about/about'
					url:'/subpkg/testabout/testabout'
				});
			},
			rateApp() {
				uni.showModal({
					title: '喜欢这个应用吗？',
					content: '如果觉得好用，请给我们一个好评吧！',
					confirmText: '去评分',
					cancelText: '下次再说',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '感谢支持！',
								icon: 'success',
								duration: 2000
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
.profile-page {
	background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
}

/* 背景装饰 */
.bg-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 300rpx;
	z-index: 1;
	overflow: hidden;
	
	.bg-circle {
		position: absolute;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));
	}
	
	.circle-1 {
		width: 300rpx;
		height: 300rpx;
		top: -150rpx;
		right: -100rpx;
	}
	
	.circle-2 {
		width: 200rpx;
		height: 200rpx;
		top: 50rpx;
		left: -80rpx;
		opacity: 0.8;
	}
	
	.circle-3 {
		width: 150rpx;
		height: 150rpx;
		bottom: 50rpx;
		right: 100rpx;
		opacity: 0.6;
	}
}

/* 用户卡片 */
.user-card {
	position: relative;
	z-index: 2;
	background: linear-gradient(135deg, #2c3e50, #4a6491);
	margin: 40rpx 32rpx;
	padding: 48rpx 32rpx;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
	color: #fff;
	transform: translateY(0);
	transition: all 0.3s ease;
	
	&:active {
		transform: translateY(-4rpx);
		box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.2);
	}
}

.user-avatar-section {
	display: flex;
	align-items: center;
	margin-bottom: 48rpx;
}

.avatar-container {
	position: relative;
	margin-right: 32rpx;
	
	.user-avatar {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.8);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.avatar-ring {
		position: absolute;
		top: -6rpx;
		left: -6rpx;
		right: -6rpx;
		bottom: -6rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		animation: pulse 2s infinite;
	}
	
	.avatar-edit-btn {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 48rpx;
		height: 48rpx;
		background: linear-gradient(135deg, #4CAF50, #8BC34A);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3rpx solid #fff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
	}
}

@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.05);
		opacity: 0.7;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.user-detail {
	flex: 1;
	
	.user-name {
		font-size: 40rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 8rpx;
		background: linear-gradient(135deg, #fff, #e0e0e0);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.user-email {
		font-size: 28rpx;
		opacity: 0.9;
		display: block;
		margin-bottom: 16rpx;
	}
	
	.user-badge {
		display: inline-block;
		background: linear-gradient(135deg, #FF9800, #FF5722);
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 600;
	}
}

/* 统计数据 */
.user-stats {
	margin-top: 32rpx;
	
	.stats-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10rpx);
		border-radius: 20rpx;
		padding: 32rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border: 1rpx solid rgba(255, 255, 255, 0.2);
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}
	
	.stat-icon {
		width: 56rpx;
		height: 56rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}
	
	.stat-value {
		font-size: 36rpx;
		font-weight: 700;
		margin-bottom: 8rpx;
	}
	
	.stat-label {
		font-size: 26rpx;
		opacity: 0.9;
	}
	
	.stat-divider {
		width: 1rpx;
		height: 60rpx;
		background: rgba(255, 255, 255, 0.3);
	}
}

/* 内容区域 */
.content-section {
	position: relative;
	z-index: 2;
	padding: 0 32rpx 60rpx;
	margin-top: -20rpx;
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	transform: translateY(0);
	transition: all 0.3s ease;
	
	&:active {
		transform: translateY(-4rpx);
		box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12);
	}
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid var(--border-light);
	
	.section-title {
		font-size: 34rpx;
		font-weight: 600;
		color: var(--text-primary);
		margin-left: 16rpx;
	}
}

/* 设置项 */
.settings-list {
	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 0;
		border-bottom: 1rpx solid var(--border-light);
		
		&:last-child {
			border-bottom: none;
		}
	}
	
	.setting-left {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 24rpx;
	}
	
	.icon-wrapper {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.budget-icon {
		background: linear-gradient(135deg, #4CAF50, #8BC34A);
	}
	
	.category-icon {
		background: linear-gradient(135deg, #2196F3, #21CBF3);
	}
	
	.reminder-icon {
		background: linear-gradient(135deg, #FFC107, #FF9800);
	}
	
	.backup-icon {
		background: linear-gradient(135deg, #9C27B0, #E91E63);
	}
	
	.setting-name {
		font-size: 32rpx;
		font-weight: 500;
		color: var(--text-primary);
		display: block;
		margin-bottom: 4rpx;
	}
	
	.setting-desc {
		font-size: 26rpx;
		color: var(--text-tertiary);
	}
	
	.setting-right {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.budget-amount {
		font-size: 30rpx;
		font-weight: 600;
		color: #4CAF50;
	}
	
	.backup-time {
		font-size: 28rpx;
		color: var(--text-secondary);
	}
	
	.reminder-switch {
		transform: scale(0.8);
	}
}

/* 其他功能 */
.other-list {
	.other-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 0;
		border-bottom: 1rpx solid var(--border-light);
		
		&:last-child {
			border-bottom: none;
		}
	}
	
	.item-left {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 24rpx;
	}
	
	.other-icon {
		width: 56rpx;
		height: 56rpx;
		border-radius: 14rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.help-icon {
		background: linear-gradient(135deg, #607D8B, #78909C);
	}
	
	.star-icon {
		background: linear-gradient(135deg, #FF9800, #FF5722);
	}
	
	.feedback-icon {
		background: linear-gradient(135deg, #00BCD4, #0097A7);
	}
	
	.about-icon {
		background: linear-gradient(135deg, #795548, #5D4037);
	}
	
	.other-name {
		font-size: 32rpx;
		color: var(--text-primary);
		font-weight: 500;
	}
}

/* 版本信息 */
.version-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
	text-align: center;
	color: #fff;
	box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
	
	.app-name {
		font-size: 40rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 16rpx;
	}
	
	.version-text {
		font-size: 28rpx;
		opacity: 0.9;
		display: block;
		margin-bottom: 12rpx;
	}
	
	.copyright {
		font-size: 24rpx;
		opacity: 0.8;
		display: block;
	}
}

/* 响应式调整 */
@media (max-width: 375px) {
	.user-card {
		margin: 32rpx 24rpx;
		padding: 40rpx 24rpx;
	}
	
	.content-section {
		padding: 0 24rpx 40rpx;
	}
	
	.card {
		padding: 24rpx;
	}
	
	.setting-name,
	.other-name {
		font-size: 30rpx;
	}
	
	.setting-desc {
		font-size: 24rpx;
	}
}
</style>