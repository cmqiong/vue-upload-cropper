import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import UploadCropper from './vue-upload-cropper'

Vue.use(ElementUI)

Vue.use(UploadCropper) // 图片上传裁剪插件

new Vue({
  el: '#app',
  render: h => h(App)
})
