import UploadCropper from './src'

/* istanbul ignore next */
UploadCropper.install = (Vue) => {
  Vue.component(UploadCropper.name, UploadCropper)
}

export default UploadCropper
