// components/removeList/removeList.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({
        userPhoto: true,
        nickName: true
      }).get().then(res => {
          this.setData({
            userMessage: res.data
          })
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deleteMsg() {
      wx.showModal({
        title: '提示信息',
        content: '是否删除该消息？',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            this.removeMessage()
          } else if (res.cancel) {

          }
        }
      })
    },
    handleAddFriend() {
      wx.showModal({
        title: '提示信息',
        content: '申请好友',
        confirmText: '同意',
        success: (res) => {
          if (res.confirm) {
           db.collection('users').doc(app.userInfo._id).update({
             data: {
               friendList: _.unshift(this.data.messageId)
             }
           }).then(res => {
             console.log(res)
           })

           wx.cloud.callFunction({
             name: 'update',
             data: {
               collection: 'users',
               doc: this.data.messageId,
               data: `{friendList: _.unshift('${app.userInfo._id}')}`
             }
           }).then(res => {})
            this.removeMessage()
          } else if (res.cancel) {
              console.log('用户点击了取消')
          }
        }
      })
    },
    removeMessage () {
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then(res => {
        let list = res.data[0].list
        list = list.filter((item, index) => {
          return item != this.data.messageId
        })
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then(res => {
          this.triggerEvent('myevent', list)
        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
})
