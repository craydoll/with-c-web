<template>
  <v-app>
        Webカメラ画像
        <video  id="video" ref="video" width="400" height="300" autoplay playsinline></video>
        <div v-if="!isRecording">
        <v-btn color="red" dark @click="start">録画開始</v-btn>
        </div>
        <div v-else>
          <v-btn color="gray" dark @click="stop">録画停止</v-btn>
        </div>
        送信画像
        <canvas id="canvas" ref="canvas" width="400" height="300"></canvas>
  </v-app>
</template>
<script>
import firebase from '@/plugins/firebase'
export default {
  data() {
    return {
        video: {},
        canvas: {},
        capture: null,
        timerId: null,
        isRecording: false
      }
  },
  mounted () {
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      })
    }
  },
  methods : {
    start() {
      const capture = () => {
        const storageRef = firebase.storage().ref();
        console.log('in caputure')
        this.canvas = this.$refs.canvas
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, 400, 300)
        this.canvas.toBlob((blob) => {
            // Firebaseのストレージ呼び出し
            storageRef.child("image/" + "screen").put(blob);
        })

      }
      this.timerId = setInterval(capture, 1000);
      this.isRecording = true
    },
    stop() {
      clearInterval(this.timerId);
      this.isRecording = false
    }
  }
}
</script>
<style scoped>
#canvas {
  width: 200px;
}
</style>
