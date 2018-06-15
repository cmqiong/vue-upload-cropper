<script>
  import UploadExtendCropper from './uploadExtendCropper'
  import vueCropper          from 'vue-cropper'
  import putAjax             from './putAjax'
  import postAjax            from './postAjax'

  function noop() {}

  export default {
    name: 'UploadCropper',
    props: {
      refName: {
        type: String,
        default: 'photoUpload'
      },
      action: {
        type: String,
        default: 'unused'
      },
      headers: {
        type: Object,
        default() {
          return {}
        }
      },
      data: Object,
      name: {
        type: String,
        default: 'file'
      },
      withCredentials: Boolean,
      showFileList: {
        type: Boolean,
        default: true
      },
      accept: {
        type: String,
        default: 'image/*'
      },
      type: {
        type: String,
        default: 'select'
      },
      beforeUpload: Function,
      beforeRemove: Function,
      onRemove: {
        type: Function,
        default: noop
      },
      onChange: {
        type: Function,
        default: noop
      },
      onPreview: {
        type: Function,
        default: noop
      },
      onSuccess: {
        type: Function,
        default: noop
      },
      onProgress: {
        type: Function,
        default: noop
      },
      onError: {
        type: Function,
        default: noop
      },
      fileList: {
        type: Array,
        default() {
          return []
        }
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      listType: {
        type: String,
        default: 'picture-card' // text,picture,picture-card
      },
      httpRequest: Function,
      disabled: Boolean,
      limit: Number,
      limitSize: Number,
      onExceed: {
        type: Function,
        default: noop
      },
      cropper: Object,
      // 表单提交使用的方法
      method: {
        type: String,
        default: 'post'
      }
    },
    components: {
      UploadExtendCropper,
      vueCropper
    },
    data() {
      return {
        hideUploadBtn: false, // 是否隐藏上传图片按钮
        showCropperDialog: false, // 是否显示裁剪弹窗
        fileListCopy: this.fileList,
        // 预览图片
        dialogPreview: {
          dialogImageUrl: '',
          dialogVisible: false
        },
        cropperOpts: Object.assign({}, {
          height: 300, // 默认裁剪框高度，单位 px
          img: '', // 裁剪图片的地址
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 300, // 默认生成截图框宽度
          autoCropHeight: 300, // 默认生成截图框高度
          fixed: false, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          fixedBox: false, // 固定截图框大小 不允许改变
          canMove: true, // 上传图片是否可以移动
          canMoveBox: true, // 截图框能否拖动
          original: false // 上传图片按照原始比例渲染
        }, this.cropper)
      }
    },
    computed: {
      // 已选图片是否超过图片数量限制
      isImageOverLimit() {
        return this.fileListCopy.length >= this.limit
      }
    },
    methods: {
      handleHttpRequest(options) {
        const ajax = this.method === 'put' ? putAjax : postAjax
        return this.httpRequest(options, ajax)
      },
      getUploadComponent() {
        return this.$refs[this.refName]
      },
      getCropperComponent() {
        return this.$refs[this.refName + 'Cropper']
      },
      handleRemove(file, fileList) {
        this.fileListCopy = fileList
        this.onRemove(file, fileList)
      },
      // 点击预览按钮
      handlePreview(file) {
        this.dialogPreview.dialogImageUrl = file.url
        this.updatePreviewVisible(true)
        this.onPreview(file)
      },
      updatePreviewVisible(val) {
        this.dialogPreview.dialogVisible = val
      },
      // 选择完本地图片
      handleChoose(ev) {
        this.uploadImg(ev)
      },
      handleChange(file, fileList) {
        this.fileListCopy = fileList
        this.onChange(file, fileList)
        if (this.autoUpload) {
          this.getUploadComponent().$refs['upload-inner'].upload.call(this, file)
        }
      },
      handleSuccess(res, file, fileList) {
        this.fileListCopy = fileList
        this.onSuccess(res, file, fileList)
      },
      handleError(res, file, fileList) {
        this.fileListCopy = fileList
        this.onError(res, file, fileList)
      },
      // 上传本地图片到裁剪组件
      uploadImg(ev) {
        const _this = this
        const file = ev.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ev.target.value)) {
          _this.$message.error('图片类型必须是 gif, jpeg, jpg, png 中的一种!')
          return false
        }
        if (_this.limitSize) {
          const kbSize = file.size / 1024
          if (kbSize > _this.limitSize) {
            const temp = _this.limitSize / 1024 // limitSize 单位：kb
            const tip = (temp >= 1) ? temp + 'MB' : _this.limitSize + 'KB'
            _this.$message.error(`图片大小不能超过${tip}!`)
            return false
          }
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          // 把Array Buffer转化为blob 如果是base64不需要
          const data = (typeof e.target.result) === 'object' ? window.URL.createObjectURL(new Blob([e.target.result]))
            : e.target.result
          _this.cropperOpts.img = data
          _this.showCropperDialog = true // 显示弹窗
        }
        // reader.readAsDataURL(file) // 转化为base64
        reader.readAsArrayBuffer(file) // 转化为blob
      },
      // 取消图片裁剪
      cancelCropper() {
        const cropperComponent = this.getCropperComponent()
        if (cropperComponent) {
          cropperComponent.clearCrop() // clear
          this.showCropperDialog = false
        } else {
          return
        }
      },
      // 确认图片裁剪
      confirmCropper() {
        const cropperComponent = this.getCropperComponent()
        if (cropperComponent) {
          cropperComponent && cropperComponent.startCrop() // start
          this.outputCropResult()
        } else {
          return
        }
      },
      // 输出裁剪结果
      outputCropResult() {
        const _this = this
        // 获取截图的blob数据
        this.getCropperComponent().getCropBlob((blob) => {
          // 模仿图片组件内部构建对象的方式
          blob.uid = Date.now()
          blob.name = blob.uid + '.jpg'
          const file = {
            status: 'ready',
            name: blob.name,
            size: blob.size,
            percentage: 0,
            uid: blob.uid,
            raw: blob
          }
          try {
            file.url = window.URL.createObjectURL(blob)
          } catch (err) {
            console.error(err)
            return
          }
          _this.getUploadComponent().uploadFiles.push(file)
          _this.fileListCopy.push(file)
          _this.handleChange(file, _this.fileListCopy)
          _this.showCropperDialog = false // 关闭裁剪弹窗
        })
      }
    },
    render(h) {
      // 上传组件
      const uploadData = {
        props: {
          type: this.type,
          'before-upload': this.beforeUpload,
          'with-credentials': this.withCredentials,
          action: this.action,
          headers: this.headers,
          name: this.name,
          data: this.data,
          accept: this.accept,
          'file-list': this.fileListCopy,
          'auto-upload': this.autoUpload,
          'list-type': this.listType,
          disabled: this.disabled,
          limit: this.limit,
          'on-exceed': this.onExceed,
          'on-progress': this.onProgress,
          'on-success': this.handleSuccess,
          'on-error': this.handleError,
          'on-preview': this.handlePreview,
          'on-remove': this.handleRemove,
          'on-choose': this.handleChoose,
          'http-request': this.handleHttpRequest
        },
        ref: this.refName,
        class: {
          'upload-cropper': true,
          'hide-upload-btn': this.isImageOverLimit
        }
      }
      // 预览弹窗
      const previewDialogData = {
        props: {
          visible: this.dialogPreview.dialogVisible
        },
        on: {
          'update:visible': this.updatePreviewVisible
        }
      }
      // 裁剪组件
      const cropperData = {
        props: this.cropperOpts,
        ref: this.refName + 'Cropper'
      }
      return (
        <div>
          <upload-extend-cropper { ...uploadData }>
            <i class='el-icon-plus'></i>
            { this.$slots.default }
          </upload-extend-cropper>

          <el-dialog { ...previewDialogData }>
            <img width='100%' src={ this.dialogPreview.dialogImageUrl }/>
          </el-dialog>

          <el-dialog title='图片裁剪' width='80%' center
            visible={ this.showCropperDialog } { ...{ on: { 'update:visible': val => { this.showCropperDialog = val } }}}>
            <vue-cropper { ...{ style: { height: this.cropperOpts.height + 'px' } }} { ...cropperData }></vue-cropper>
            <span slot='footer' class='dialog-footer'>
              <el-button { ...{ on: { click: this.cancelCropper }}}>取 消</el-button>
              <el-button type='primary' { ...{ on: { click: this.confirmCropper }}}>确 定</el-button>
            </span>
          </el-dialog>
        </div>
      )
    }
  }
</script>

<style>
  /* 是否显示上传图片按钮 */
  .hide-upload-btn .el-upload {
    display: none;
  }
  .upload-cropper .el-upload-list--picture-card{
    display: inline-flex;
  }
  .upload-cropper .el-upload-list--picture-card .el-upload-list__item{
    display: inline-flex;
    align-items: center;
    justify-content:center;
  }
  .upload-cropper .el-upload-list--picture-card .el-upload-list__item-thumbnail{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
