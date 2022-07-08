<template>
 <v-dialog
    id="profile-modal"
    v-model="show"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        <h3 class="cmp_heading_03">プロフィール</h3>
      </v-card-title>
      <v-card-text>
        <v-row>
        <v-col
          cols="6"
        >
              <v-carousel
              v-model="avatar"
              height="200"
              hide-delimiters
              >
                <v-carousel-item
                  v-for="(item) in avatarList"
                  :key="item.id"
                  :value="item.id"
                  :src="item.img"
                  width="200"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                  class="flex justify-center"
                ></v-carousel-item>
              </v-carousel>
        </v-col>
        <v-col
          cols="6"
          class="flex-column"
        >
          <v-text-field
            v-model="nickname"
            label="ニックネーム"
          ></v-text-field>
          <v-text-field
            v-model="name"
            label="氏名"
          ></v-text-field>
          <DatePicker
            label="誕生日"
            :adate="birth"
            @ok="setBirth"
          />
          <v-select
            v-model="gender"
            :items="genderList"
            label="性別"
            dense
          ></v-select>
          <v-select
            v-model="area"
            :items="prefs"
            label="住んでいる地域"
            dense
          ></v-select>
          <v-select
            v-model="schoolDiv"
            :items="schoolDivs"
            label="通っている学校（区分)"
            dense
          ></v-select>
          <v-text-field
            v-model="schoolNm"
            label="通っている学校"
          ></v-text-field>
          <v-checkbox
            v-model="cramSchool"
            label="私は塾や予備校などに通っています"
          ></v-checkbox>          
        </v-col>
      </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          @click="logout"
        >
          ログアウト
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="closed"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="pressOk"
        >
          変更
        </v-btn>
      </v-card-actions>
    </v-card>

 </v-dialog>
</template>
<script>
import appError, { ApplicationError } from '@/plugins/firestore/appError'
import Users from '@/plugins/firestore/users'
import Avatars from '@/plugins/firestore/avatars'
import DatePicker from '@/components/datePicker'

export default {
  components: {
    DatePicker
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
      message: '',
      title: '',
      level: 'Info',
      user: null,
      id: '',
      avatar: 0,
      name: '',
      nickname: '',
      birth: '',
      area: '',
      mail: '',
      gender: '',
      schoolDiv: '',
      schoolNm: '',
      cramSchool: false,
      show: false,
      prefs: [
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県'
      ],
      avatarList:[],
      genderList: [
        '男性',
        '女性',
        'その他',
      ],
      schoolDivs: [
        '国立','都道府県立','市立','私立',
      ]
    }
  },
  computed: {
  },
  watch: {
    modalShow() {
      this.show = this.modalShow
    },
  },
  mounted() {
    setTimeout(async () => {
      this.avatarList = await Avatars.getAllItems()
      // 会員情報
      const id = await this.$store.getters['auth/id']
      console.log('id is:' + id)
      if (id) {
        this.user = await Users.getItem(id)
        if (this.user) {
          this.avatar = this.user.avatar
          this.nickname = this.user.nickname
          this.name = this.user.name
          this.birth = this.user.birth
          this.gender = this.user.gender
          this.area = this.user.area
          this.schoolDiv = this.user.schoolDiv
          this.schoolNm = this.user.schoolNm
          this.cramSchool = this.user.cramSchool
        }
        this.id = id
      }
    })
  },
  methods: {
    closed() {
      this.$emit('close')
      this.show = false
    },
    async pressOk() {
      console.log('in pressOK ' + this.avatar)
      console.log('genderList:', JSON.stringify(this.genderList))
      console.log('gender:', this.gender)
      try {
        this.user = {
          name: this.name,
          avatar: this.avatar,
          nickname: this.nickname,
          birth: this.birth,
          gender: this.gender,
          area: this.area,
          id: this.id,
          schoolDiv: this.schoolDiv,
          schoolNm: this.schoolNm,
          cramSchool: this.cramSchool,
          regDate: new Date(),
        }
        await Users.save(this.id , this.user)
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          console.log('in Error')
          this.message =
            'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          appError.sendError('', err, 'changereq:planChangeReq')
        }
      }
      this.$emit('close', this.avatar)
      this.show = false
    },
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$emit('close', 'fig_chr_noimage.png')
      this.show = false
    },
    setBirth(birth) {
      this.birth = birth
    }
  },
}
</script>
