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
              <dd>〇〇点</dd>
            </dl>
            <dl>
              <dt>全国平均</dt>
              <dd>〇〇点</dd>
            </dl>
          </div>
          <div height="200">
          <ChartContainer
            :labels="labels"
            :val="data"
          >
          </ChartContainer>
          </div>
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
import ChartContainer from '@/components/ChartContainer'
export default {
  components: {
    ChartContainer
  },
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
      labels: ['3/1','3/2','3/3','3/4','3/5'],
      data: [50,74,68,70,78] 
    }
  },
  watch: {
    modalShow() {
      console.log('modalshow:' + this.modalShow)
      this.show = this.modalShow
      this.labels = ['3/1','3/2','3/3','3/4','3/5']
      this.data =  [50,74,68,70,78] 
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
