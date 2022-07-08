<template>
  <v-card :class='{clicked:isRecording}'>
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
                width="400"
                height="300"
                autoplay
                playsinline
              ></video>
            </div>
          </div>
          <div class="tac record_screen_btn_wrapper">
            <div class="ly_size_sm">
              <dl class="selected_camera">
                <dt>選択した<br class="max768_b">カメラ</dt>
                <dd>{{cameraNm}}</dd>
              </dl>
              <div v-if="isPause">
                <button class="el_btn el_btn__lor record_screen_btn" @click="resume">
                  再開する
                </button>
              </div>
              <div v-else>
                <div v-if="!isRecording" class="record_btn_wrapper">
                  <button class="el_btn el_btn__lor record_screen_btn" @click="start">
                    測定開始
                  </button>
                </div>
                <div v-else class="record_btn_wrapper">
                  <button class="el_btn el_btn__lor record_screen_btn" @click="pause">
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
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-dialog
      v-model="errDiag"
      persistent
      max-width="290"
    >
      <v-card>
        <h2 class="cmp_heading_05">エラーが発生しました</h2>
        <p>
          測定時間が短いため、集中力が測定できませんでした。
        </p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="errDiag = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
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
      canvas: {},
      timerId: null,
      isRecording: false,
      isPause: false,
      user: null,
      measureId: '',
      subject: '',
      cameraId: '',
      cameraNm: '',
      method:'',      
      result: {},
      overlay: false,
      errDiag: false
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
    console.log('camera:' + this.cameraId)
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { optional: [{sourceId: this.cameraId}] }}).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      })
    }
    this.user = await this.$store.getters['auth/user']
  },
  methods: {
    start() {
      this.$nuxt.$emit('showOverlay')
      // 番号を作る（日付）
      this.measureId = moment().format('YYYYMMDDHHmmss')
      const captFunc = () => this.capture(this.measureId)
      this.timerId = setInterval(captFunc, 5000);
      this.isRecording = true
    },
    async stop() {
      clearInterval(this.timerId);
      this.overlay = true
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
        if (res.end_date) {
          res.end_date = new Date(res.end_date)
        }
        if (res.start_date) {
          res.start_date = new Date(res.start_date)
        }

        this.isRecording = false
        this.$router.push({ path: '/result', query: { measure_id: this.measureId } });
      } catch (err) {
        console.log('err is:' + JSON.stringify(err))
        // エラーが発生したら、エラーメッセージ
        this.errDiag = true
      }
    },
    pause() {
      console.log('pause clicked')
      clearInterval(this.timerId)
      this.isRecording = false
      this.isPause = true
    },
    resume() {
      console.log('resume clicked')
      // 番号そのまま
      const captFunc = () => this.capture(this.measureId)
      this.timerId = setInterval(captFunc, 5000);
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
          await storageRef.child("image/" + id).put(blob);
          const url = "https://us-central1-with-c-web.cloudfunctions.net/Detector"
          console.log('request:' + url + " param:" + id + " : " + measureId )
          const res = await this.$axios.$get(url, {
            params: {
              id,
              measure_id: measureId,
            }
          })
          console.log('respose:' + JSON.stringify(res))
        } catch (err) {
          console.log('err is:' + JSON.stringify(err))
        }
      })
    },
    changeCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('in changeCamera:' + this.cameraId)
        navigator.mediaDevices.getUserMedia({ video: { optional: [{sourceId: this.cameraId}] }}).then(stream => {
          this.video.srcObject = stream
          this.video.play()
        })
      }
    },
  }
}
</script>
<style scoped>
#canvas {
  width: 200px;
}
.Video{
  text-align: center;
}
.center {
  text-align: center;
}
</style>
