## ImageCropper
> 结合 element-ui upload + vue-cropper 进行图片初始化渲染，图片上传裁剪的封装

## Installation
```shell
npm i vue-upload-cropper
```

## Usage
main.js
```javascript
import UploadCropper from 'vue-upload-cropper'

Vue.use(UploadCropper)
```

or

```javascript
import UploadCropper from 'vue-upload-cropper'

Vue.component('upload-cropper', UploadCropper)
```
.vue
```html
<upload-cropper
  method="put"                   // 当 autoUpload=true 时有效，不写默认 post 表单提交
  :limit="3"                     // 限制上传图片最多张数
  :limitSize="1024"              // 限制上传文件大小，单位 kb
  :fileList="yourInitListData"   // 用来初始化绑定数据
  :cropper="{                    // 一般情况下，只需设置下面几个，其它详细说明见下面文档
    height: 300,         // 裁剪组件背景区域的高度，单位 px，不写默认 300
    autoCrop: true,      // 是否默认初始化裁剪框
    autoCropWidth: 300,  // 初始化裁剪框宽度，单位 px
    autoCropHeight: 300, // 初始化裁剪框高度，单位 px
    fixed: true,         // 是否固定裁剪比例
    fixedNumber: [1, 1]  // 固定裁剪比例[width, height]
  }"></upload-cropper>
```

### Attribute
- 概述：与 ELUpload 的不同：不支持文件多选，不支持拖拽上传。增加几个新属性。其它用法与 ELUpload 同。

  - [ELUpload 其它参数信息在此](https://element.faas.ele.me/#/zh-CN/component/upload)

- 本插件新增属性：

| 参数     | 说明          | 类型         | 可选值           | 默认值     |
| -------- | ------------- | ----------- | --------------- | --------- |
| refName | 可选参数，组件 ref 名称 | String | - | photoUpload |
| method | 可选参数，当 autoUpload=true 时有效 | String | post/put | post |
| limit | 可选参数，上传图片张数限制 | Number | - | - |
| limitSize | 可选参数，上传的图片大小限制，单位：kb | Number | - | - |
| cropper | 可选参数，裁剪框设置选项 | Object | - | 详见 [vue-cropper](https://github.com/xyxiao001/vue-cropper) |
