<template>
  <v-card :class='{clicked:isRecording}'>
      <section class="record_screen">
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">集中力を記録しよう</h2>
          <v-row align="center">
            <v-col class="justify-center record_icon_wrapper">
              <span class="record_icon"></span>
              <!-- <p class="record_icon_txt">
                ※測定時には上のランプが赤く点灯します
              </p> -->
            </v-col>
          </v-row>
          <v-row justify="center" class="py-0 my-0">
            <v-col cols="4" class="py-0 my-0">
              <v-select
                v-model="selected"
                :items="camera"
                item-text="name"
                item-value="id"
                return-object
                single-line
              ></v-select>
            </v-col>
          </v-row>
          <v-row justify="center" class="py-0 my-0">
            <v-col class="d-flex justify-center">
              <video  id="video" ref="video" width="400" height="300" autoplay playsinline></video>
            </v-col>
          </v-row>
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
import moment from '@/plugins/moment-ja'
export default {
  components: {
    ResultModal
  },
  layout: 'protected',
  watch: {
    selected() {
      this.changeCamera();
    }
  },
  data() {
    return {
        video: {},
        canvas: {},
        capture: null,
        timerId: null,
        isRecording: false,
        user: null,
        finished: false,
        measureId: '',
        camera: [],
        selected: '',
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
      console.log('camera1:' + JSON.stringify(camera))
    })
    console.log('camera:' + JSON.stringify(camera))
    this.camera = camera
    this.selected = camera[0].id
    console.log('this.camera:' + JSON.stringify(this.camera))
    this.video = this.$refs.video
    this.changeCamera();
    this.user = await this.$store.getters['auth/user']
  },
  methods: {
    start() {
      const capture = () => {
        const id = this.user.id
        const storageRef = firebase.storage().ref();

        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 300;
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
        this.canvas.toBlob(async (blob) => {
          try {
            await storageRef.child("image/" + id).put(blob);
            // 番号を作る（日付）
            this.measureId = moment().format('YYYYMMDDHHmmss')
            const url = "https://us-central1-with-c-web.cloudfunctions.net/Detector"
            console.log('request:' + url + " param:" + id + " : " + this.measureId)
            const res = await this.$axios.$get(url, {
              params: {
                id,
                measure_id: this.measureId
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
    async stop() {
      clearInterval(this.timerId);
      try {
        const url = "https://us-central1-with-c-web.cloudfunctions.net/calc_data"
        console.log('stop request:' + url + " param:" + this.user.id + " : " + this.measureId )
        const res = await this.$axios.$get(url, {
          params: {
            id: this.user.id,
            measure_id: this.measureId
          }
        })
        console.log('respose:' + JSON.stringify(res))
      } catch (err) {
        console.log('err is:' + JSON.stringify(err))
      }
      this.isRecording = false
      this.finished = true
    },
    changeCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('in changeCamera:' + this.selected.id)
        navigator.mediaDevices.getUserMedia({ video: { optional: [{sourceId: this.selected.id}] }}).then(stream => {
          this.video.srcObject = stream
          this.video.play()
        })
      }
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
