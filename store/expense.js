export default{
	namespaced: true,
	state: () => ({
		
		// 确保 quickCategories 有 type 字段
		quickCategories: [
			{ id: 1, name: '餐饮', icon: 'shop', bgColor: '#FF6B6B', type: 'food' },
			{ id: 2, name: '购物', icon: 'cart', bgColor: '#4CAF50', type: 'shopping' },
			{ id: 3, name: '交通', icon: 'bus', bgColor: '#2196F3', type: 'transport' },
			{ id: 4, name: '娱乐', icon: 'videocam', bgColor: '#FFC107', type: 'entertainment' },
			{ id: 5, name: '学习', icon: 'paperplane', bgColor: '#9C27B0', type: 'study' },
			{ id: 6, name: '其他', icon: 'more', bgColor: '#607D8B', type: 'other' }
		],
		
		recentRecords: [],
		
		filters: [
			{ label: '全部', value: 'all' },
			{ label: '餐饮', value: 'food' },
			{ label: '购物', value: 'shopping' },
			{ label: '交通', value: 'transport' },
			{ label: '娱乐', value: 'entertainment' },
			{ label: '其他', value: 'other' },
		],
		
		bills: []
	}),
	
	mutations: {
		
		createnew(state, {category, amount, remark, selectedday}) {
			// 方法1：如果 category 有 type 字段，直接使用
			// 方法2：如果没有，使用映射
			const getTypeFromName = (name) => {
				const map = {
					'餐饮': 'food',
					'购物': 'shopping',
					'交通': 'transport',
					'娱乐': 'entertainment',
					'学习': 'study',
					'其他': 'other'
				};
				return map[name] || 'other';
			};
			
			// 确定 type
			const type = category.type || getTypeFromName(category.name);
			
			// 创建记录
			const newRecord = {
				id: Date.now(),
				category: category.name,
				amount: amount,
				remark: remark || '',
				icon: category.icon,
				color: category.bgColor,
				bgColor: category.bgColor + '20',
				time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			};
			
			// 添加到最近记录
			state.recentRecords.unshift(newRecord);
			
			// 创建账单
			// const date = new Date().toISOString().split('T')[0];
			
			const date =selectedday|| new Date().toISOString().split('T')[0];
			
			
			const newbill = {
				...newRecord,
				date: date,
				type: type  // 关键：设置正确的 type
			};
			
			// 添加到账单列表
			state.bills.unshift(newbill);
			
			console.log('Type 设置:', type);
			console.log('新增账单:', newbill);
			this.commit('m_expense/SAVE_TO_STORAGE',null,{root:true})
		},
		//初始化存储
		INIT_STORAGE(state){
			try{
				//从本地存储加载数据
				const savedRecentRecords=uni.getStorageSync('expense_recentRecords')
				const savedBills=uni.getStorageSync('expense_bills')
				if(savedRecentRecords){
					state.recentRecords=savedRecentRecords
				}
				if(savedBills){
					state.bills=savedBills
				}
				console.log('本地储存加载成功')
			}catch(error){
				console.error('加载本地存储失败',error)
			}
		},
		//保存到本地储存
		SAVE_TO_STORAGE(state){
			try{
				uni.setStorageSync('expense_recentRecords',state.recentRecords)
				uni.setStorageSync('expense_bills',state.bills)
				console.log('数据已保存到本地存储')
			}catch(error){
				console.error('保存到本地存储失败',error)
			}
		},
		//删除账单
		DELETE_BILL(state,billId){
			// 从 bills 中删除
						const billIndex = state.bills.findIndex(bill => bill.id === billId);
						if (billIndex !== -1) {
							state.bills.splice(billIndex, 1);
						}
						
						// 从 recentRecords 中删除
						const recordIndex = state.recentRecords.findIndex(record => record.id === billId);
						if (recordIndex !== -1) {
							state.recentRecords.splice(recordIndex, 1);
						}
						
						// 保存到本地存储
						this.commit('m_expense/SAVE_TO_STORAGE', null, {root: true});
						
						console.log(`删除账单 ID: ${billId}`);
		}
	},
	
	getters: {
		// 如果需要其他地方使用，保留这个 getter
		getCategoryType: (state) => (categoryName) => {
			const map = {
				'餐饮': 'food',
				'购物': 'shopping',
				'交通': 'transport',
				'娱乐': 'entertainment',
				'学习': 'study',
				'其他': 'other'
			};
			return map[categoryName] || 'other';
		}
	}
}