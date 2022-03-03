<template>
 <v-dialog
    id="profile-modal"
    v-model="show"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">プロフィール</span>
      </v-card-title>
      <v-card-text>
        <v-row>
        <v-col
          cols="6"
        >
          <v-card
            width="250"
            class="mx-auto"
          >
            <v-carousel
            v-model="avatar"
            height="200"
            hide-delimiters
            >
              <v-carousel-item
                v-for="(item) in items"
                :key="item.value"
                :value="item.value"
                :src="`assets/img/chr/${item.src}`"
                width="150"
                reverse-transition="fade-transition"
                transition="fade-transition"
                class="flex justify-center"
              ></v-carousel-item>
            </v-carousel>
          </v-card>
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
          <v-text-field
            v-model="schoolyear"
            label="学年"
          ></v-text-field>
          <v-text-field
            v-model="area"
            label="住んでいる地域"
          ></v-text-field>
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
      message: '',
      title: '',
      level: 'Info',
      user: null,
      id: '',
      avatar: '',
      name: '',
      nickname: '',
      schoolyear: '',
      area: '',
      mail: '',
      show: false,
      items: [
        {
          src: 'fig_chr_kizoku.png',
        },
        {
          src: 'fig_chr_musume.png',
        },
        {
          src: 'fig_chr_ninja.png',
        },
        {
          src: 'fig_chr_queen.png',
        },
        {
          src: 'fig_chr_samurai.png',
        },
      ],
    }
  },
  computed: {
  },
  watch: {
    modalShow() {
      this.show = this.modalShow
      this.message = ''
      console.log('modalshow changed:' + this.show)
    },
  },
  mounted() {
    setTimeout(async () => {
      // 会員情報
      const id = await this.$store.getters['auth/id']
      const tmpUser = await this.$store.getters['auth/user'] 
      console.log('id is:' + id)
      if (id) {
        this.user = await Users.getItem(id)
        if (this.user) {
          this.avatar = this.user.avatar
          this.nickname = this.user.nickname
          this.name = this.user.name
          this.schoolyear = this.user.schoolyear
          this.area = this.user.area
        }
        this.id = id
        this.mail = tmpUser.mail
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
      try {
        this.user = {
          name: this.name,
          avatar: this.items[this.avatar].src,
          nickname: this.nickname,
          schoolyear: this.schoolyear,
          area: this.area,
          id: this.id,
          mail: this.mail,
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
      this.$emit('close', this.items[this.avatar].src)
      this.show = false
    },
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$emit('close', this.items[this.avatar].src)
      this.show = false
    }
  },
}
</script>
