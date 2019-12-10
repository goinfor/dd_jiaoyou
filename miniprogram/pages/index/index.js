//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    imgUrls: [],
    listData: [],
    current: 'links'
  },
  onReady: function() {
    this.getListData()
    this.getBannerList()
  },
  handleLinks (e) {
    const id = e.target.dataset.id
    const index = e.target.dataset.index
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: "{links: _.inc(1)}"
      }
    }).then(res => {
      let updated = res.result.stats.updated
      if (updated) {
        let cloneListData = [...this.data.listData]
        for(let i = 0; i< cloneListData.length;i++) {
          if (cloneListData[i]._id == id) {
              cloneListData[i].links ++
          }
        }
        this.setData({
          listData: cloneListData
        })
      }
    })
  },
  handleCurrent (e) {
    let current = e.target.dataset.current;
    if (current == this.data.current) {
      return false
    } else {
      this.setData({
        current: current
      },() => {
        this.getListData()
      })
    }
  },
  getListData() {
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true
    })
      .orderBy(this.data.current, 'desc')
      .get().then(res => {
        this.setData({
          listData: res.data
        })
      })
  },
  handleDetail (e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id,
    })
  },
  getBannerList () {
    db.collection('banner').limit(4).get().then(res => {
        this.setData({
          imgUrls: res.data
        })
    })
  }
})
