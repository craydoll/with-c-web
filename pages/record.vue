<template>
  <body :class='{ clicked: isRecording, stopped: isPause}'>
      <section class="record_screen">
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">集中力を記録しよう</h2>
          <div>
            <div class="record_icon_wrapper">
              <span class="record_icon"></span>
            </div>
            <div class="Video">
              <video
                id="video"
                ref="video"
                width="100%"
                height="100%"
                autoplay
                playsinline
              ></video>
              <v-img v-if="isPause" class="PauseImg" width="100%" height="100%" src="/assets/img/bg/pause.png"></v-img>
              <v-img v-if="showGuide" class="PauseImg" width="100%" height="100%" src="/assets/img/bg/hand_measurement.png"></v-img>
              <v-btn
                absolute
                right
                top
                x-small
                dark
                @click="fullScrBtn"
              >
                <v-icon>
                  mdi-fullscreen
                </v-icon>
              </v-btn>
            </div>
          </div>
          <div class="text-center"> ノートの四隅をカメラに入れてね！ </div>
          <div class="tac record_screen_btn_wrapper">
            <div class="ly_size_sm">
              <dl class="selected_camera">
                <dt>選択した<br class="max768_b"/>カメラ</dt>
                <dd>{{cameraNm}}</dd>
              </dl>
              <p>{{startTimeString}}</p>
              <div v-if="isPause">
                <button class="el_btn el_btn__lor record_screen_btn" @click="resume">
                  再開する
                </button>
              </div>
              <div v-else>
                <div v-if="!isRecording">
                  <button class="el_btn el_btn__lor record_screen_btn" @click="start">
                    測定開始
                  </button>
                </div>
                <div v-else class="record_btn_wrapper my-0">
                  <button class="el_btn el_btn__lor record_stop_btn" @click="pause">
                    一時停止する
                  </button>
                  <button class="el_btn el_btn__lor record_screen_btn" @click="stop">
                    測定終了
                  </button>
                </div>
              </div>
            </div>
            <div class="record_notice">
              <p>【注意点】</p>
              <p>
                ※集中力測定のために撮影された映像・画像等が保存されることはありません。
              </p>
              <p>
                ※他の動画・通話アプリやツール等をすでに起動している場合、本アプリの測定画面が表示されずエラーになることがあります。<br />
                その場合は一度、他のアプリを閉じてから再度本アプリを開いいただくようにお願いします。
              </p>
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
      <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div v-show="showFullscr" class="fVideo">
      <video
        id="fvideo"
        ref="fvideo"
        height="100%"
        autoplay
        playsinline
      ></video>
      <v-btn
        absolute
        right
        top
        x-small
        dark
        @click="exitFullScrBtn"
      >
        <v-icon>
          mdi-fullscreen-exit
        </v-icon>
      </v-btn>
    </div>
    <v-dialog
      v-model="errDiag"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title>
        <h2 class="cmp_heading_05">もっと頑張ろう！</h2>
        </v-card-title>
        <v-card-text class="text-h4">
          <h3>
            10分以上勉強しないと測定できないよ。
          </h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <button
            class="el_btn el_btn__lor record_screen_btn"
            @click="errDiag = false"
          >
            OK
          </button>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </body>
</template>
<script>
import firebase from '@/plugins/firebase'
import moment from '@/plugins/moment-ja'
// import studyRecords from '~/plugins/firestore/studyRecords'
export default {
  layout: 'protected',
  data() {
    return {
      video: {},
      fvideo: {},
      canvas: {},
      timerId: null,
      isRecording: false,
      isPause: false,
      user: null,
      measureId: '',
      subject: '',
      cameraId: '',
      cameraNm: '',
      method: '',
      engine: '',   
      result: {},
      overlay: false,
      errDiag: false,
      showGuide: true,
      showFullscr: false,
      startTimeString: '',
      message: '',
      timeout: 5000,
      snackbar:false,
    }
  },
  async mounted () {
    const sourcesInfo = await navigator.mediaDevices.enumerateDevices()
    const camera = [];
    // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
    const videoSroucesArray = sourcesInfo.filter(function(elem) {
        return elem.kind === 'videoinput';
    });
    videoSroucesArray.forEach(function(source, idx) {
      camera.push({
        name: source.label,
        id: source.deviceId
      })
    })
    this.camera = camera
    this.cameraId = this.$route.query.camera
    this.cameraNm = this.$route.query.cameraNm
    this.method = this.$route.query.method
    this.subject = this.$route.query.subject
    this.engine = this.$route.query.engine
    console.log('camera:' + this.cameraId)
    this.video = this.$refs.video
    this.fvideo = this.$refs.fvideo
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { optional: [{sourceId: this.cameraId}] }}).then(stream => {
        this.video.srcObject = stream
        this.video.play()
        this.fvideo.srcObject = stream
        this.fvideo.play()
      })
    }
    this.user = await this.$store.getters['auth/user']
    const turnOffGuideImg = () => { this.showGuide = false }
    this.showGuide = true
    this.timerId = setTimeout(turnOffGuideImg, 5000);
  },
  methods: {
    start() {
      this.$nuxt.$emit('showOverlay')
      // 番号を作る（日付）
      try {
        this.measureId = moment().format('YYYYMMDDHHmmss')
        this.startTimeString = '開始時間: ' + moment().format('HH:mm:ss')
        const captFunc = () => this.capture(this.measureId)
        this.timerId = setInterval(captFunc, 5000);
      } catch (e) {
        console.log('error:' + JSON.stringify(e))
        this.message = e.message
        this.snackbar = true
      }
      this.isRecording = true
    },
    async stop() {
      clearInterval(this.timerId);
      this.overlay = true
      this.startTimeString = ''
      try {
        const url = "https://us-central1-with-c-web.cloudfunctions.net/calc_data"
        console.log('stop request:' + url + " param:" + this.user.id + " : " + this.measureId + " : " + this.subject)
        const res = await this.$axios.$get(url, {
          params: {
            id: this.user.id,
            measure_id: this.measureId,
            subject: this.subject,
          }
        })
        console.log('stop respose:' + JSON.stringify(res))
        this.isRecording = false
        this.$router.push({ path: '/result', query: { measure_id: this.measureId } });
      } catch (err) {
        console.log('err is:' + JSON.stringify(err))
        // エラーが発生したら、エラーメッセージ
        this.overlay = false
        this.isRecording = false
        this.errDiag = true
        this.message = err.message
        this.snackbar = true
      }
    },
    pause() {
      console.log('pause clicked')
      clearInterval(this.timerId)
      this.video.pause()
      this.isRecording = false
      this.isPause = true
    },
    resume() {
      console.log('resume clicked')
      // 番号そのまま
      const captFunc = () => this.capture(this.measureId)
      this.timerId = setInterval(captFunc, 5000);
      this.video.play()
      this.isRecording = true
      this.isPause = false
    },
    capture(measureId) {
      const id = this.user.id
      const storageRef = firebase.storage().ref();

      this.canvas = document.createElement("canvas");
      this.canvas.width = 400;
      this.canvas.height = 300;
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
      this.canvas.toBlob(async (blob) => {
        try {
          await storageRef.child("image/" + id + "_" + measureId).put(blob);
          let url = "https://us-central1-with-c-web.cloudfunctions.net/Detector"

          // 画像認識エンジンがGoogle指定の時は呼び出し先変更
          if (this.engine === 'google') {
            url = "https://us-central1-with-c-web.cloudfunctions.net/calc_data_firebase_ML"
          }
          console.log('request:' + url + " param:" + id + " : " + measureId)
          const res = await this.$axios.$get(url, {
            params: {
              id,
              measure_id: measureId,
            }
          })
          console.log('respose:' + JSON.stringify(res))
        } catch (err) {
          console.log('err is:' + JSON.stringify(err))
          this.message = err.message
          this.snackbar = true
        }
      })
    },
    fullScrBtn() {
      this.showFullscr = true
    },
    exitFullScrBtn() {
      this.showFullscr = false
    },

  }
}
</script>
<style scoped>
.Video{
  position: relative;
  text-align: center;
  width: 400px;
  margin: 0 auto;  
}
.fVideo{
    position: fixed;
    z-index: 6;
    text-align: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
}
.PauseImg {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
