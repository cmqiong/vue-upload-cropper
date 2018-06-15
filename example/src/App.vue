<template>
  <div class="app">
    <upload-cropper
      :limit="3"
      :limitSize="1024"
      :on-change="handleOnChange"
      :http-request="handleHttpRequest"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :fileList="fileList1"
      :cropper="{
        height: 300,
        autoCrop: true,
        autoCropWidth: 300,
        autoCropHeight: 200,
        fixed: true,
        fixedNumber: [3, 2]
      }"></upload-cropper>

    <!-- 确认上传 -->
    <el-button @click="" style="margin-top:10px;">取 消</el-button>
    <el-button type="primary" @click="postForm()" style="margin-top:10px;">上传</el-button>
    <el-button type="primary" @click="getUploadData()" style="margin-top:10px;">console.log(表单数据)</el-button>
  </div>
</template>

<script>
  export default {
    name: 'exampleUploadCropper',
    data() {
      return {
        // 初始化数据
        fileList1: [{
          name: '01.jpg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: '02.jpg',
          url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2439328716,3742522526&fm=27&gp=0.jpg'
        }],
        fileListMap: {} // 键值对，用来存储上传图片后的 uid:url
      }
    },
    methods: {
      handleOnChange(file, fileList) {
        console.log('onChange', file, fileList)
        console.log('onChange:fileList1', this.fileList1)
        this.fileList1 = fileList
      },
      handleRemove(file, fileList) {
        console.log('onRemove', file, fileList)
        console.log('onRemove:fileList1', this.fileList1)
        this.fileList1 = fileList
      },
      handleHttpRequest(options, ajax) {
        // --------------
        // 此处可用此方法动态修改请求 options，默认使用 ajax 发送请求，但只限于 form-data 形式表单提交
        // options.action = '1231231'
        // options.headers = {
        //   'Accept': 'application/json',
        //   'X-Requested-With': 'XMLHttpRequest'
        // }
        // ajax(options)
        // --------------

        // ---------------
        // 若要自定义发送请求，此处一定要是 Promise 类的异步函数，才会执行 onSuccess 等回调
        return new Promise((resolve, reject) => {
          // ---------
          // 进度条，未完待续....
          // let idx = null
          // this.fileList1.forEach((item, index) => {
          //   if (item.uid === options.file.uid) {
          //     item.status = 'uploading'
          //     item.percentage = 50
          //     idx = index
          //     console.log(idx)
          //     return
          //   }
          // })
          // ---------
          resolve()
        })
        // ----------------
      },
      getUploadData() {
        console.log('打印表单数据', this.fileList1)
      },
      // 处理 ELUpload 上传后的数据，用于表单提交。
      processUploadData(data) {
        // --------------
        // 结果输出[url1, url1, url3]
        // const result = []
        // data.forEach(item => {
        //   if (item.uid && item.status && item.status === 'success') {
        //     result.push(this.fileListMap[item.uid] || item.url)
        //   } else if (!item.status && item.url) {
        //     result.push(item.url)
        //   }
        // })
        // return result
        // ---------------
      },
      handleSuccess(res, file, fileList) {
        console.log('onSuccess', res, file, fileList)
        console.log('onSuccess:fileList1', this.fileList1)
        this.fileList1 = fileList // 上传成功后赋值
        // 替换 url
        // this.fileList1.forEach(item => {
        //   if (item.uid === file.uid) {
        //     item.url = this.fileListMap[file.uid] || item.url
        //   }
        // })
      },
      handleError(res, file, fileList) {
        console.log('onError', res, file, fileList)
        console.log('onError:fileList1', this.fileList1)
        this.fileList1 = fileList
      },
      postForm() {
        console.log('postFrom', this.fileList1)
      }
    }
  }
</script>

<style>
.app {
  margin-left: 20px;
  margin-top: 60px;
}
</style>
