<template>
  <v-card :class='{clicked:isRecording}'>
      <section class="record_screen">
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">集中力を記録しよう</h2>
          <div class="record_type">
            <p class="el_deco_bracket">カメラの種類を選んでね</p>
            <div class="select_wrapper">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <div
                    class="select_type"
                    v-bind="attrs"
                    v-on="on" 
                  >
                    {{camera[selected].name}}
                  </div>
                </template>
                <v-list
                  name="select_type"
                  class="select_type"
                >
                <v-list-item-group
                  v-model="selected"
                  active-class="border"
                  color="indigo"
                >
                  <v-list-item
                    v-for="(item, index) in camera"
                    :key="index"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
                </v-list>
              </v-menu>
            </div>
          </div>
          <div class="record_type ly_pdg_bottom_sm">
            <p class="el_deco_bracket">勉強する教科を選んでね</p>
            <div class="select_wrapper">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <div
                    class="select_type"
                    v-bind="attrs"
                    v-on="on" 
                  >
                    {{subList[subSel]}}
                  </div>
                </template>
                <v-list
                  name="select_type"
                  class="select_type"
                >
                <v-list-item-group
                  v-model="subSel"
                  active-class="border"
                  color="indigo"
                >
                  <v-list-item
                    v-for="(item, index) in subList"
                    :key="index"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
                </v-list>
              </v-menu>
            </div>
          </div>
          <div>
            <div class="record_icon_wrapper">
              <span class="record_icon"></span>
            </div>
            <div class="Video">
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
              <button class="el_btn el_btn__lor record_screen_btn" @click="stop">
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
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<script>
import firebase from '@/plugins/firebase'
import moment from '@/plugins/moment-ja'
import studyRecords from '~/plugins/firestore/studyRecords'
export default {
  layout: 'protected',
  data() {
    return {
      video: {},
      canvas: {},
      capture: null,
      timerId: null,
      isRecording: false,
      user: null,
      measureId: '',
      camera: [{name:''}],
      selected: 0,
      result: {},
      overlay: false,
      subject: '',
      subList: ['算数', '国語', '理科', '社会', '英語','その他','不要'],
      subSel: 0,
    }
  },
  watch: {
    selected() {
      this.changeCamera();
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
    console.log('this.camera:' + JSON.stringify(this.camera))
    this.video = this.$refs.video
    this.changeCamera();
    this.user = await this.$store.getters['auth/user']
  },
  methods: {
    start() {
      // 番号を作る（日付）
      this.measureId = moment().format('YYYYMMDDHHmmss')
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
      this.overlay = true
      const subject = this.subList[this.subSel]
      try {
        const url = "https://us-central1-with-c-web.cloudfunctions.net/calc_data"
        console.log('stop request:' + url + " param:" + this.user.id + " : " + this.measureId )
        const res = await this.$axios.$get(url, {
          params: {
            id: this.user.id,
            measure_id: this.measureId,
            subject
          }
        })
        console.log('stop respose:' + JSON.stringify(res))
        if (res.end_date) {
          res.end_date = new Date(res.end_date)
        }
        if (res.start_date) {
          res.start_date = new Date(res.start_date)
        }

        await studyRecords.save(this.user.id, this.measureId, res)
        // 結果データ取得
      } catch (err) {
        console.log('err is:' + JSON.stringify(err))
      }
      this.isRecording = false
      this.$router.push({ path: '/result', query: { measure_id: this.measureId } });
    },
    changeCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('in changeCamera:' + this.selected)
        navigator.mediaDevices.getUserMedia({ video: { optional: [{sourceId: this.selected}] }}).then(stream => {
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
</style>
