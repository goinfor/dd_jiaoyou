// components/search/search.js
const app = getApp() 
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList: [],
    searchText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      wx.getStorage({
        key: "searchHistory",
        success: res => {
          this.setData({
            historyList: res.data
          })
        }
      })

      this.setData({
        isFocus: true
      })
    },
    handleCancel() {
      this.setData({
        isFocus: false,
        searchText: '',
        searchList: []
      })
    },
    handleConfirm(e) {
      let value = e.detail.value
      let cloneHistoryList = [...this.data.historyList]
      cloneHistoryList.unshift(value)
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(cloneHistoryList)]
      })
      this.setData({
        searchText: value
      })
      this.changedSearchList(value)
    },
    handleDelete () {
      wx.removeStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            historyList: []
          })
        }
      })
    },
    changedSearchList(value) {
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then(res => {
        console.log(res)
        this.setData({
          searchList: res.data
        })
      })
    },
    handleHistoryItemDel(e) {
      let value = e.target.dataset.text
      this.setData({
        searchText: value
      })
      this.changedSearchList(value)
    }
  }
})
