<template>
 <v-dialog
    id="profile-modal"
    v-model="show"
    max-width="800"
    persistent
  >
        <div class="record_result_body">
          <p class="record_result_ttl el_deco_line">測定結果</p>
          <p class="record_result_date">2022/04/01 10:00~12:00</p>
          <div class="record_score">
            <dl>
              <dt>スコア</dt>
              <dd>85点</dd>
            </dl>
            <dl>
              <dt>全国平均</dt>
              <dd>75点</dd>
            </dl>
          </div>
          <v-card height="250">
            <v-sparkline
              :value="value"
              height="100"
              :gradient="gradient"
              :smooth="radius || false"
              :padding="padding"
              :line-width="width"
              :stroke-linecap="lineCap"
              :gradient-direction="gradientDirection"
              :fill="fill"
              :type="type"
              :auto-line-width="false"
              auto-draw
            >
            </v-sparkline>
          </v-card>
          <div class="record_closing">
            <div>
              <p>■ポイントが貯まったら商品と交換しよう！</p>
              <a class="link_init record_closing_prize" href="prize.html">
                商品交換ページはこちら
              </a>
            </div>
            <a class="record_closing_end" @click="pressOk">完了</a>
          </div>
        </div>
 </v-dialog>
</template>
<script>
export default {
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      show:false,
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: ['green', 'yellow', 'red'],
      value: [50, 74, 80, 70, 75, 30, 25, 35, 20, 80, 85, 50, 85, 60, 70, 75],
      gradientDirection: 'top',
      fill: false,
      type: 'trend',
      autoLineWidth: false,      
    }
  },
  watch: {
    modalShow() {
      console.log('modalshow:' + this.modalShow)
      this.show = this.modalShow
    },
  },
  methods: {
    closed() {
      this.$emit('close')
      this.show = false
    },
    pressOk() {
      this.$emit('close', this.avatar)
      this.show = false
    },
  },
}
</script>
