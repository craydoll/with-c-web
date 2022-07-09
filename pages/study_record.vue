<template>
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
                    <img src="assets/img/fig/fig_graf.png" alt="学習総量の棒グラフ">
                  </div>
                </div>
                <div class="col2_item recordBox_howto">
                  <h3 class="cmp_heading_04">おすすめ勉強法</h3>
                  <p class="cmp_heading_03">下の項目をクリックすると各教科のおすすめ勉強法が見れるよ！</p>
                  <ul class="recordBox_howto_list">
                    <li>
                      <NuxtLink to="/movie_archive">
                        <span>
                          算数のオススメ勉強方法を見る
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
                      <p class="recordBox_item_subject english">{{item.subject}}</p>
                      <p class="recordBox_item_time">
                        <span>開始時間：{{item.start_date | format-time}}</span>
                        <span>終了時間：{{item.end_date | format-time}}</span>
                        <span>総学習時間：{{(item.end_date - item.start_date) | format-time}}</span>
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
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
export default {
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
    this.totalTimes = await StudyRecords.getTotalBySubject(this.user.id)
    console.log('in mounted:' + JSON.stringify(this.studyRecords))
    }
  },
}
</script>

