<template>
	<view class="simple-dev-page">
		<!-- 简洁头部 -->
		<view class="header">
			<view class="icon-wrapper">
				<uni-icons type="gear" size="48" color="#4CAF50" />
			</view>
			<text class="title">功能开发中</text>
			<text class="subtitle">请耐心等待...</text>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<view class="info-card">
				<view class="card-title">
					<uni-icons type="info" size="24" color="#666" />
					<text>当前状态</text>
				</view>
				<text class="status-text">此功能正在紧张开发中，小的正在努力...</text>
				
				<view class="progress-area">QAQ
					<view class="progress-info">
						<text>开发进度</text>
						<text class="percent">65%</text>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" style="width: 65%"></view>
					</view>
				</view>
			</view>

			<!-- 预计时间 -->
			<view class="estimate-card">
				<view class="estimate-item">
					<uni-icons type="calendar" size="24" color="#2196F3" />
					<view class="estimate-text">
						<text class="label">预计上线</text>
						<text class="value">2026年</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button class="btn back-btn" @click="goBack">返回</button>
				<button class="btn notify-btn" @click="subscribe">更新提醒</button>
			</view>
		</view>

		<!-- 底部信息 -->
		<view class="footer">
			<text class="version">版本 1.0.0 · 开发版</text>
			<text class="copyright">微记账</text>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			goBack() {
				uni.navigateBack()
			},
			subscribe() {
				uni.showToast({
					title: '已设置更新提醒',
					icon: 'success'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.simple-dev-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
}

.header {
	text-align: center;
	margin-bottom: 80rpx;
	
	.icon-wrapper {
		width: 120rpx;
		height: 120rpx;
		background: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		
		:deep(.uni-icons) {
			animation: rotate 20s linear infinite;
		}
	}
	
	.title {
		font-size: 44rpx;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 16rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
}

.content {
	flex: 1;
}

.info-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
	
	.card-title {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 32rpx;
		
		text {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
		}
	}
	
	.status-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 40rpx;
		display: block;
	}
}

.progress-area {
	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		text {
			font-size: 28rpx;
			color: #666;
		}
		
		.percent {
			font-size: 32rpx;
			font-weight: 600;
			color: #4CAF50;
		}
	}
	
	.progress-bar {
		height: 12rpx;
		background: #e9ecef;
		border-radius: 6rpx;
		overflow: hidden;
		
		.progress-fill {
			height: 100%;
			background: linear-gradient(90deg, #4CAF50, #8BC34A);
			border-radius: 6rpx;
			transition: width 0.3s ease;
		}
	}
}

.estimate-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 32rpx;
	margin-bottom: 48rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
	
	.estimate-item {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}
	
	.estimate-text {
		flex: 1;
		
		.label {
			font-size: 26rpx;
			color: #666;
			display: block;
			margin-bottom: 8rpx;
		}
		
		.value {
			font-size: 32rpx;
			font-weight: 500;
			color: #2196F3;
			display: block;
		}
	}
}

.action-buttons {
	display: flex;
	gap: 24rpx;
	
	.btn {
		flex: 1;
		height: 88rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
		}
		
		&.back-btn {
			background: #fff;
			color: #666;
			border: 2rpx solid #e0e0e0;
		}
		
		&.notify-btn {
			background: linear-gradient(135deg, #4CAF50, #8BC34A);
			color: #fff;
		}
	}
}

.footer {
	text-align: center;
	padding-top: 60rpx;
	margin-top: auto;
	
	.version {
		font-size: 26rpx;
		color: #999;
		display: block;
		margin-bottom: 12rpx;
	}
	
	.copyright {
		font-size: 24rpx;
		color: #ccc;
	}
}

/* 旋转动画 */
@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

/* 响应式调整 */
@media (max-width: 375px) {
	.simple-dev-page {
		padding: 40rpx 32rpx;
	}
	
	.header {
		margin-bottom: 60rpx;
		
		.icon-wrapper {
			width: 100rpx;
			height: 100rpx;
		}
	}
	
	.info-card,
	.estimate-card {
		padding: 32rpx;
	}
	
	.action-buttons {
		flex-direction: column;
		gap: 20rpx;
		
		.btn {
			height: 80rpx;
		}
	}
}
</style>