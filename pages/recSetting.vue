<template>
  <main class="record">
    <section class="record_screen">
      <div class="ly_contInner ly_contInner_bg">
        <h2 class="cmp_heading_05">集中力を記録しよう</h2>
        <div class="record_type">
          <p class="el_deco_bracket">カメラの種類を選んでね</p>
          <div class="select_wrapper">
            <select v-model="camera" class="select_type" name="select_type">
              <option v-for="item in cameras" :key="item.id" :value="item">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="Video">
            <video
              id="video"
              ref="video"
              width="100"
              height="70"
              autoplay
              playsinline
            ></video>
          </div>
        </div>
        <div class="record_type">
          <p class="el_deco_bracket">勉強する教科を選んでね</p>
          <div class="select_wrapper">
            <select
              v-model="subject"
              class="select_type"
              name="select_type"
              required
            >
              <option>国語</option>
              <option>算数</option>
              <option>理科</option>
              <option>社会</option>
              <option>英語</option>
              <option>その他</option>
              <option>不要</option>
            </select>
          </div>
        </div>
        <div class="record_type">
          <p class="el_deco_bracket">計測方法を選んでね</p>
          <div class="select_wrapper">
            <select
              v-model="method"
              class="select_type"
              name="select_type"
              required
            >
              <option value="onhand">手元で計測する</option>
              <option value="face">
                顔で計測する（※ポイントは付きません）
              </option>
            </select>
          </div>
        </div>
        <div class="tac record_screen_btn_wrapper">
          <button class="el_btn el_btn__lor record_screen_btn" @click="toRecordPage">
          測定する
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
// import studyRecords from '~/plugins/firestore/studyRecords'
export default {
  layout: 'protected',
  data() {
    return {
      video: {},
      cameras: [{ name: '' }],
      camera: {},
      subject: '国語',
      method: 'onhand',
    }
  },
  watch: {
    camera() {
      this.changeCamera()
    },
  },
  async mounted() {
    const sourcesInfo = await navigator.mediaDevices.enumerateDevices()
    const cameras = []
    // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
    const videoSroucesArray = sourcesInfo.filter(function (elem) {
      return elem.kind === 'videoinput'
    })
    videoSroucesArray.forEach(function (source, idx) {
      cameras.push({
        name: source.label,
        id: source.deviceId,
      })
    })
    this.cameras = cameras
    console.log('this.cameras:' + JSON.stringify(this.cameras))
    this.video = this.$refs.video
    this.camera = cameras[0]
    this.changeCamera()
  },
  methods: {
    changeCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('in changeCamera:' + this.camera.id)
        navigator.mediaDevices
          .getUserMedia({ video: { optional: [{ sourceId: this.camera.id }] } })
          .then((stream) => {
            this.video.srcObject = stream
            this.video.play()
          })
      }
    },
    toRecordPage() {
      this.$router.push({
        path: '/record',
        query: {
          camera: this.camera.id,
          cameraNm: this.camera.name,
          subject: this.subject,
          method: this.method,
        },
      })      
    }
  },
}
</script>
<style scoped>
.Video {
  text-align: center;
}
</style>
