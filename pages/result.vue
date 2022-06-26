<template>
  <v-card class="record_result_body">
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
        <a class="link_init record_closing_prize" href="prize.html">
          商品交換ページはこちら
        </a>
      </div>
      <NuxtLink class="record_closing_end" to="/record">続けて勉強する</NuxtLink>
      <NuxtLink class="record_closing_end" to="/">終了する</NuxtLink>
    </div>
  </v-card>
</template>
<script>
import ChartContainer from '@/components/ChartContainer'
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
      if (!this.result) {
        // 取れなかった時用
        const now = new Date()
        this.result = {
          concentration: [23, 45, 70, 80, 77, 78, 82, 88, 89, 20, 15, 18, 84, 90],
          end_date: new Date(),
          id: this.user.id,
          point: 12,
          start_date: moment(now).add(-1, 'hours'),
        }
      }
    } catch (err) {
      console.log('err is:' + JSON.stringify(err))
      this.result = {
        concentration: [23, 45, 70, 80, 77, 78, 82, 88, 89, 90, 82, 79, 84, 90],
        end_date: new Date(),
        id: this.user.id,
        point: 12,
        start_date: new Date(new Date() - (1000 * 60 * 60)),
      }
    }
    console.log('record:' + JSON.stringify(this.result))
    this.score = this.result.point
    this.startDate = this.result.start_date
    this.endDate = this.result.end_date
    this.value = this.result.concentration
    this.labels = this.value.map((curr, idx) => {
      const time = moment(this.startDate).add(idx * 5,'minutes')
      return moment(time).format('HH:mm')
    })
    this.avg = await StudyRecords.getAverage()
  },
}
</script>
