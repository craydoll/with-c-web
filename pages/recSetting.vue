<template>
  <body>
  <main class="record">
    <section class="record_screen">
      <div class="ly_contInner ly_contInner_bg">
        <h2 class="cmp_heading_05">集中力を記録しよう</h2>
        <div class="record_type">
          <p class="el_deco_bracket">勉強する教科を選んでね</p>
          <div class="select_wrapper">
            <select
              v-model="subject"
              class="select_type"
              name="select_type"
              required
            >
              <option v-for="item in subjects" :key="item.id" :value="item.id">{{item.name}}</option>
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
<!--              <option value="face">
                顔で計測する（※ポイントは付きません）
              </option> -->
            </select>
          </div>
        </div>
        <div class="record_type">
          <p class="el_deco_bracket">カメラの種類を選んでね</p>
          <div class="select_wrapper">
            <select v-model="camera" class="select_type" name="select_type">
              <option v-for="item in cameras" :key="item.id" :value="item">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="record_type">
          <p>【テスト映像】</p>
          <div class="Video">
            <video
              id="video"
              ref="video"
              width="400"
              height="300"
              autoplay
              playsinline
              >
            </video>
            <v-img v-if="showGuide" class="PauseImg" width="100%" height="100%" src="/assets/img/bg/hand_measurement.png"></v-img>
          </div>
        </div>
        <div  class="record_type">
          <div v-if="showGuide" class="red--text">
              ノートの四隅をカメラに入れてね！（ノートを認識すると次の画面へ進めます）
        </div>
        <div v-else>
          <h3>
            ノートを検出しました！
          </h3>
          <div class="setting_btn el_btn_location">
          <button class="el_btn el_btn__lor record_screen_btn" :disabled="showGuide" @click="toRecordPage">
            録画測定の画面へ
          </button>
        </div>
        <div class="record_type">
          <p class="el_deco_bracket">【テスト中】画像認識エンジン切替え</p>
          <div class="select_wrapper">
            <select
              v-model="engine"
              class="select_type"
              name="select_type"
              required
            >
            <option value="google">グーグル</option>
            <option value="original">オリジナル</option>
          </select>
          </div>
        </div>
        </div>
      </div>
      </div>
    </section>
      <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
      >
        {{ message }}

        <template #action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            閉じる
          </v-btn>
        </template>
      </v-snackbar>
  </main>
  </body>
</template>
<script>
// import studyRecords from '~/plugins/firestore/studyRecords'
import Subjects from '~/plugins/firestore/subjects'
import firebase from '@/plugins/firebase'
import moment from '@/plugins/moment-ja'
export default {
  layout: 'protected',
  data() {
    return {
      video: {},
      cameras: [{ name: '' }],
      camera: {},
      subject: 'japanese',
      method: 'onhand',
      engine: 'original',
      subjects: [],
      snackbar: false,
      message: '',
      timeout: 5000,
      showGuide: true,
      timerId:0,
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
    this.video = this.$refs.video
    this.camera = cameras[0]
    console.log('this.camera:' + JSON.stringify(this.camera))
    if (this.camera) {
      this.changeCamera()
    }
    this.subjects = await Subjects.getAllItems()

    this.measureId = moment().format('YYYYMMDDHHmmss')
    const captFunc = () => this.capture(this.measureId)
    this.timerId = setInterval(captFunc, 3000);
  },
  methods: {
    async changeCamera() {
      console.log('in change camera:' + this.camera.name)
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && this.camera) {
          await navigator.mediaDevices
            .getUserMedia({ video: { optional: [{ sourceId: this.camera.id }] } })
            .then((stream) => {
              this.video.srcObject = stream
              this.video.play()
            })
        }
      } catch (e) {
        console.log('error:' + JSON.stringify(e))
        this.message = e.message
        this.snackbar = true
      }
    },
    toRecordPage() {
      if (this.camera && this.subject && this.method) {
        clearInterval(this.timerId);
        this.$router.push({
          path: '/record',
          query: {
            camera: this.camera.id,
            cameraNm: this.camera.name,
            subject: this.subject,
            method: this.method,
            engine: this.engine,
          },
        })      
      }
    },
    async capture(measureId) {
      console.log('in capture')

      const user = await this.$store.getters['auth/user']
      const id = user.id
      const storageRef = firebase.storage().ref();
      this.counter++
      // 5秒ごとに2160回 ＝３時間
      if (this.counter > 3*60*60/3) {
        this.message = '3時間を超えたので測定を終了しました'
        this.snackbar = true
        this.stop()

      }
      this.canvas = document.createElement("canvas");
      this.canvas.width = 400;
      this.canvas.height = 300;
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      this.canvas.toBlob(async (blob) => {
        try {
          await storageRef.child("image/" + id + "_" + measureId).put(blob);
          const url = "https://us-central1-with-c-web.cloudfunctions.net/NotebookDetector"
          const res = await this.$axios.$get(url, {
            params: {
              id,
              measure_id: measureId,
            }
          })
          console.log('respose:' + res.notebook)
          if (res.notebook === 1) {
            this.showGuide = false
          } else {
            this.showGuide = true
          }
        } catch (err) {
          console.log('err is:' + JSON.stringify(err))
          this.message = err.message
          this.snackbar = true
        }
      })
    },
  },
}
</script>
<style scoped>
.Video{
  position: relative;
  text-align: center;
  width: 400px;
  margin: 0 auto;  
}
.PauseImg {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
