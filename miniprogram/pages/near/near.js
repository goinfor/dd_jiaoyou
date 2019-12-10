// miniprogram/pages/near/near.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '113.324520',
    latitude: '23.099994',
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getNearUsers()
      }
    })
  },
  getNearUsers () {
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation: true
    }).field({
      longitude: true,
      latitude: true,
      userPhoto: true
    })
    .get().then(res => {
      let data = res.data
      let result = []
      if (data.length) {
        data.forEach(item => {
          if (item.userPhoto.includes('cloud://')) {
            wx.cloud.getTempFileURL({
              fileList: [item.userPhoto],
              success: res => {
                result.push({
                  iconPath: res.fileList[0].tempFileURL,
                  id: item._id,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  width: 30,
                  height: 30,
                  borderRadius: 30
                })
                this.setData({
                  markers: result
                })
              }
            })
          } else {
            result.push({
              iconPath: item.userPhoto,
              id: item._id,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 30,
              height: 30,
              borderRadius: 30
            })
          }
      
        })
      }
      this.setData({
        markers: result
      })
    }).catch(error => {
      console.log(error)
    })
  },
  markertap(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + e.markerId,
    })
  }
})