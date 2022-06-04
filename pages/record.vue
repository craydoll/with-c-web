<template>
  <v-card v-bind:class='{clicked:isRecording}'>
      <section class="record_screen">
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">集中力を記録しよう</h2>
          <div>
            <div class="record_icon_wrapper">
              <span class="record_icon"></span>
              <!-- <p class="record_icon_txt">
                ※測定時には上のランプが赤く点灯します
              </p> -->
            </div>
            <div class="d-flex justify-center">
              <video  id="video" ref="video" width="400" height="300" autoplay playsinline></video>
            </div>
          </div>
          <div class="tac record_screen_btn_wrapper">
            <p class="el_deco_bracket">集中力を測るにはここをクリック</p>
            <div v-if="!isRecording">
              <button class="el_btn el_btn__lor record_screen_btn" @click="start">
                測定開始
              </button>
            </div>
            <div v-else>
              <button class="el_btn el_btn__lor record_screen_btn" gray @click="stop">
                録画停止
              </button>
            </div>
            <div class="record_notice">
              <p>【注意点】</p>
              <p>
                他の動画・通話アプリやツール等をすでに起動している場合、本アプリの測定画面が表示されずエラーになることがあります。<br />
                その場合は一度、他のアプリを閉じてから再度本アプリを開いいただくようにお願いします。
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="record_stop_wrapper tac">
          <a class="record_stop_btn" href="">測定を終了する</a>
        </div> -->
      </section>
    <ResultModal :modal-show="finished" @close="modalClosed" />
  </v-card>
</template>
<script>
import firebase from '@/plugins/firebase'
import ResultModal from '@/components/resultModal'
export default {
  components: {
    ResultModal
  },
  layout: 'protected',
  data() {
    return {
        video: {},
        canvas: {},
        capture: null,
        timerId: null,
        isRecording: false,
        user: null,
        finished: false,
      }
  },
  async mounted () {
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      })
    }
    this.user = await this.$store.getters['auth/user']
  },
  methods : {
    start() {
      const capture = () => {
        console.log('in caputure:' + JSON.stringify(this.user))
        const id = this.user.id
        const storageRef = firebase.storage().ref();

        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 300;
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
        this.canvas.toBlob(async (blob) => {
          try {
            await storageRef.child("image/" + id).put(blob);
            const url = "https://us-central1-with-c-web.cloudfunctions.net/Detector"
            console.log('request:' + url + " param:" + id)
            const res = await this.$axios.$get(url, {
              params: {
                id
              }
            })
            console.log('respose:' + JSON.stringify(res))
          } catch (err) {
            console.log('err is:' + JSON.stringify(err))
          }
        })
      }
      this.timerId = setInterval(capture, 5000);
      this.isRecording = true
    },
    stop() {
      clearInterval(this.timerId);
      this.isRecording = false
      this.finished = true
    },
    modalClosed() {
      this.finished = false
    }
  }
}
</script>
<style scoped>
#canvas {
  width: 200px;
}
</style>
