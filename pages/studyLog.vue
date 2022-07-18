<template>
  <body>

    <main class="study_record">
      <div class="ly_contInner ly_contInner_bg">
        <h2 class="cmp_heading_05 el_deco_line">学習記録</h2>
          <div class="ly_contInner">
            <div class="recordBox">
              <div class="recordBox_list_wrapper">
                <h3 class="cmp_heading_04">利用者</h3>
                {{user.name}}
                {{user.nickname}}
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
                        <!-- ここはミリ秒 -->
                        <span>総学習時間：{{Math.round((item.end_date - item.start_date)/(60 * 1000))}}分</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="tac record_screen_btn_wrapper">
                <div class="my-5">
                  <NuxtLink class="el_btn el_btn__lor record_screen_btn" to="userList2">
                    戻る
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
      </div>
    </main>
  </body>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
import Users from '@/plugins/firestore/users'
export default {
  layout: 'teacher',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
      totalTimes: [],
      user: {},
    }
  },
  async mounted() {
    // クエリよりユーザー取ってくる
    const id = this.$route.query.id
    if (id) {
    this.user = await Users.getItem(id)
    if (this.user) {
      this.studyRecords = await StudyRecords.getItems(this.user.id)
      this.totalTimes = await Users.getTotalBySubject(this.user.id)
      console.log('in mounted:' + JSON.stringify(this.totalTimes))
      this.totalTimes.forEach((item) => {
        this.labels.push(item.subject)
        // 時間は秒で保存されている
        this.data.push(item.time / 60)
      })
    }

    }
  },
}
</script>

