<style lang="scss" scoped>
  .image-placeholder {
    position: relative;
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
  .uploading-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<template>
  <div>
    <div @drop.prevent="uploadDragFile($event)" @dragover.prevent style="margin-right: 1em;">
      <div :class="`image-placeholder is-sample-${isSample}`" :style="`background-image: url(${this.viewUrl})`" @click="openFiles">
        <div v-if="uploading" class="uploading-overlay"><v-progress-circular
          :value="uploadPercent"
        ></v-progress-circular></div>
      </div>
      <v-file-input
        ref="fileInput"
        v-model="file"
        @change="uploadFile($event)"
        :label="label"
        :disabled="uploading">
        <template v-slot:label>
          {{ label }} <span v-if="required !== undefined" style="color: red">*</span>
        </template>
      </v-file-input>
      <v-text-field label="Kommentar" v-model="comment" @blur="emitInput" />
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
    'filetype',
    'required',
    'samplefile'
  ],

  data(){
    return {
      file: undefined,
      file_id: undefined,
      last_file_id: 0,
      viewUrl: '',
      isSample: false,
      comment: '',
      uploading: false,
      uploadPercent: 0
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
          this.refresh()
        }
      }
    },
    filekey: {
      immediate: true,
      handler() {
        if (!this.filekey || !this.value) {
          this.comment = ''
        } else {
          this.comment = this.value[`tab_comment_${this.filekey}`]
          this.file_id = this.value[`tab_img_${this.filekey}`]
          this.refresh()
        }
      }
    }
  },

  methods: {
    validate () {
      if (this.required === undefined){
        return true
      }
      if (this.file_id > 0) {
        return true
      }
      return false
    },
    refresh () {
      if (!(this.last_file_id > 0) && this.last_file_id !== this.file_id) {
        let samplepath = `${this.path}/${this.filekey}.${this.filetype}`
        if (this.samplefile) {
          samplepath = `${this.path}/${this.samplefile}`
        }
        this.$axios.post(`/quote_calculator/${this.id}/view_upload_file`,{
          file_id: this.file_id,
          path: `${this.path}/${this.filekey}.${this.filetype}`,
          samplepath: samplepath
        }).then(response => {
          this.last_file_id = this.file_id
          this.viewUrl = response.data.data.public_url
          this.isSample = response.data.data.is_sample
        })
      }
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
      this.uploading = true
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
            this.uploadPercent = percentCompleted
            return percentCompleted;
          }
        }
      ).then(response => {
        this.file_id = response.data.data.file_id
        this.emitInput()
        this.refresh()
      })
      .finally(() => {
        this.uploading = false
      });
    },
    emitInput () {
      this.value[`tab_img_${this.filekey}`] = this.file_id
      this.value[`tab_comment_${this.filekey}`] = this.comment
      this.$emit('input', this.value)
    }
  }

}
</script>