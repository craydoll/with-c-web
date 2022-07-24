<template>
  <body>
    <main class="study_record">
      <div class="ly_contInner ly_contInner_bg">
        <h2 class="cmp_heading_05 el_deco_line">学習記録</h2>
        <section id="record">
          <div class="ly_contInner">
            <div class="recordBox">
              <div class="col2">
                <div class="col2_item recordBox_total">
                  <h3 class="cmp_heading_04">学習総量</h3>
                  <p class="cmp_heading_03">各教科の学習総量を棒グラフで表しているよ！</p>
                  <div class="recordBox_total_graf">
                    <StudyTimeChart
                      :labels="labels"
                      :val="data"                      
                    />
                  </div>
                </div>
                <div class="col2_item recordBox_howto">
                  <h3 class="cmp_heading_04">おすすめ勉強法</h3>
                  <p class="cmp_heading_03">下の項目をクリックすると各教科のおすすめ勉強法が見れるよ！</p>
                  <ul class="recordBox_howto_list">
                    <li>
                      <NuxtLink to="/movie_archive">
                        <span>
                          算数/数学のオススメ勉強方法を見る
                        </span>
                      </NuxtLink>
                    </li>
                    <li class="close_layer">
                      <a href="">
                        <span>
                          国語のオススメ勉強方法を見る
                        </span>
                      </a>
                    </li>
                    <li class="close_layer">
                      <a href="">
                        <span>
                          理科のオススメ勉強方法を見る
                        </span>
                      </a>
                    </li>
                    <li class="close_layer">
                      <a href="">
                        <span>
                          社会のオススメ勉強方法を見る
                        </span>
                      </a>
                    </li>
                    <li class="close_layer">
                      <a href="">
                        <span>
                          英語のオススメ勉強方法を見る
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="recordBox_list_wrapper">
                <h3 class="cmp_heading_04">これまでの学習記録</h3>
                <p class="cmp_heading_03">これまでの学習記録が時系列で見れるよ！</p>
                <ul class="recordBox_list">
                  <li class="recordBox_item">
                    <div v-if="!studyRecords.length">記録はありません</div>
                    <div
                      v-for="(item, i) in studyRecords"
                      :key="i"
                      class="recordBox_term"
                    >
                      <p class="recordBox_item_time">
                        <span>{{item.start_date | format-date}}</span>
                      </p>
                      <p class="recordBox_item_subject" :class="item.subject">{{item.subject_nm}}</p>
                      <p class="recordBox_item_time">
                        <span>開始時間：{{item.start_date | format-time}}</span>
                        <span>終了時間：{{item.end_date | format-time}}</span>
                        <!-- ここはミリ秒 -->
                        <span>総学習時間：{{Math.round((item.end_date - item.start_date)/(60 * 1000))}}分</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </body>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
import Users from '@/plugins/firestore/users'
import StudyTimeChart from '@/components/studyTimeChart'
export default {
  components: {
    StudyTimeChart
  },
  layout: 'protected',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
      totalTimes: [],
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    if (this.user) {
      this.studyRecords = await StudyRecords.getItems(this.user.id)
      this.totalTimes = await Users.getTotalBySubject(this.user.id)
      console.log('in mounted:' + JSON.stringify(this.totalTimes))
      this.totalTimes.forEach((item) => {
        this.labels.push(item.subject_nm)
        // 時間は秒で保存されている
        this.data.push(item.time / 60)
      })
    }
  },
}
</script>

