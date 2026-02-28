import Vue from 'vue'
import Vuex from 'vuex'
//导入expense
import moduleexpense from './expense.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	//挂载store模块
	modules:{
		m_expense:moduleexpense
	}
})

//向外共享Store实例对象
export default store