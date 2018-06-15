<script>
  import { Upload as ELUpload } from 'element-ui'
  // import ELUpload from 'element-ui/packages/upload' // 查看源码 DEBUG

  const mixin = {
    props: {
      onChoose: {
        type: Function,
        default: () => {}
      }
    },
    created() {
      const _self = this
      // 扩展 ELUpload 的 handleChange 方法
      const UploadHandleChange = ELUpload.components.Upload.methods.handleChange
      ELUpload.components.Upload.methods.handleChange = ev => {
        if (typeof this.onChoose === 'function') {
          _self.onChoose(ev)
        } else {
          UploadHandleChange.call(this, ev)
        }
      }
    }
  }

  export default {
    name: 'UploadExtendCropper',
    mixins: [ELUpload, mixin] // 组件继承
  }
</script>
