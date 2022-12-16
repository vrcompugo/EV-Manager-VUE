<style lang="scss" scoped>
  .image-placeholder {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .is-sample-true {
    opacity: 0.4;
  }
  .is-sample-true:hover {
    opacity: 1;
  }
</style>

<template>
  <div>
    <div @drop.prevent="uploadDragFile($event)" @dragover.prevent style="margin-right: 1em">
      <div :class="`image-placeholder is-sample-${isSample}`" :style="`background-image: url(${this.viewUrl})`" @click="openFiles"></div>
      <v-file-input
        ref="fileInput"
        v-model="file"
        @change="uploadFile($event)"
        :label="label"></v-file-input>
      <v-text-field label="Kommentar" v-model="comment" @input="emitInput" />
    </div>
  </div>
</template>

<script>
export default {

  props: [
    'id',
    'filekey',
    'path',
    'value',
    'label',
    'filetype'
  ],

  data(){
    return {
      file: undefined,
      file_id: undefined,
      viewUrl: '',
      isSample: false,
      comment: ''
    }
  },
  mounted () {
    this.refresh()
  },

  watch: {
    value: {
      immediate: true,
      handler() {
        if (!this.filekey || !this.value) {
          this.comment = ''
        } else {
          this.comment = this.value[`tab_comment_${this.filekey}`]
          this.file_id = this.value[`tab_img_${this.filekey}`]
        }
      }
    }
  },

  methods: {
    refresh () {
      this.$axios.post(`/quote_calculator/${this.id}/view_upload_file`,{
        file_id: this.file_id,
        path: `${this.path}/${this.filekey}.${this.filetype}`
      }).then(response => {
        this.viewUrl = response.data.data.public_url
        this.isSample = response.data.data.is_sample
      })
    },
    openFiles () {
      this.$refs.fileInput.$refs.input.click()
    },
    uploadDragFile(e) {
      console.log(e)
    },
    uploadFile (e) {
      if (this.file === undefined) {
        return
      }
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("path", `${this.path}/${this.filekey}.${this.filetype}`);
      this.$axios.post(
        `/quote_calculator/${this.id}/upload_file`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.confirm_progress = percentCompleted
            return percentCompleted;
          }
        }
      ).then(response => {
        this.file_id = response.data.data.file_id
        this.emitInput()
        this.refresh()
      })
    },
    emitInput () {
      this.value[`tab_img_${this.filekey}`] = this.file_id
      this.value[`tab_comment_${this.filekey}`] = this.comment
      this.$emit('input', this.value)
    }
  }

}
</script>