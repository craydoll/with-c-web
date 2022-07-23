<template>
<body class="record_result_body">
    <p class="record_result_ttl el_deco_line">測定結果</p>
    <p class="record_result_date my-2">{{startDate | format-datetime}} ~ {{endDate | format-time}}</p>
    <div class="record_score my-2">
      <dl>
        <dt>スコア</dt>
        <dd>{{score}}ポイント</dd>
      </dl>
      <dl>
        <dt>全国平均</dt>
        <dd>{{avg}}ポイント</dd>
      </dl>
    </div>
    <v-card height="250">
      <ChartContainer
        :labels="labels"
        :val="value"
      />
    </v-card>
    <div class="record_closing">
      <div>
        <p>■ポイントが貯まったら商品と交換しよう！</p>
        <NuxtLink class="link_init record_closing_prize" to="prize">
          商品交換ページはこちら
        </NuxtLink>
      </div>
      <div class="closing_btn_wrapper">      
        <NuxtLink class="closing_btn closing_btn_continue" to="/recSetting">勉強を続ける</NuxtLink>
        <NuxtLink class="closing_btn closingbtn_end" to="/">終了する</NuxtLink>
      </div>
    </div>
</body>
</template>
<script>
import ChartContainer from '@/components/resultChart'
import StudyRecords from '~/plugins/firestore/studyRecords'
import moment from '@/plugins/moment-ja'
export default {
  components: {
    ChartContainer
  },
  layout: 'protected',
  data() {
    return {
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      labels: [],
      value: [],
      gradientDirection: 'top',
      fill: false,
      type: 'trend',
      autoLineWidth: false,     
      score: 0,
      avg: 0,
      startDate: null,
      endDate: null,
      result: null,
    }
  },
  async mounted() {
    this.user = await this.$store.getters['auth/user']
    const measureId = this.$route.query.measure_id
    console.log('parm userid:' + this.user.id + " measureId:" + measureId)
    try {
      this.result = await StudyRecords.getItem(this.user.id, measureId)
    } catch (err) {
      console.log('err is:' + JSON.stringify(err))
    }
    console.log('record:' + JSON.stringify(this.result))
    this.score = this.result.point
    this.startDate = this.result.start_date
    this.endDate = this.result.end_date
    this.value = this.result.concentration
    this.labels = this.value.map((curr, idx) => {
      const time = moment(this.startDate).add(idx * 1,'minutes')
      return moment(time).format('HH:mm')
    })
    this.avg = await StudyRecords.getAverage()
  },
}
</script>
