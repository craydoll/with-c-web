<template>
<body>
  <v-container>
    <v-data-table
      :headers="fields"
      :items="rows"
      sort-by="id"
      fixed-header
      hide-default-footer
      disable-pagination
      :height="$vuetify.breakpoint.height - 350"
    >
      <template #top>
        <v-toolbar flat color="white">
          <v-toolbar-title>ユーザ一覧</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field v-model="editedItem.area" label="エリア" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.avatar" label="アバター" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.birth" label="誕生日" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.gender" label="性別" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.name" label="氏名" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.nickname" label="ニックネーム" />
                  </v-row>
                  <v-row>
                    <v-switch
                      v-model="editedItem.isAdmin"
                      color="red"
                      label="管理者"
                    ></v-switch>
                    <v-switch
                      v-model="editedItem.isTeacher"
                      color="orange"
                      label="講師"
                    ></v-switch>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="close">
                  キャンセル
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.edit`]="data">
        <v-icon
          small
          class="mr-2"
          @click="editItem(data.item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(data.item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #[`item.avatar`]="data">
        <v-img width="50" :src="data.item.img" />
      </template>
      <template #[`item.isAdmin`]="data">
        <v-icon
          v-if="data.item.isAdmin"
          class="mr-2"
        >mdi-account-wrench</v-icon>
        <v-icon
          v-if="data.item.isTeacher"
          class="mr-2"
        >mdi-account-school</v-icon>
      </template>
      <template #no-data>
        明細はありません
      </template>
    </v-data-table>
  </v-container>
</body>
</template>
<script>
import Users from '@/plugins/firestore/users'
import appError, { ApplicationError } from '@/plugins/firestore/appError'

export default {
  layout: 'admin',
  data () {
    return {
      dialog: false,
      fields: [
        { value: 'edit', text: '編集' },
        { value: 'isAdmin', text: '権限' },
        { value: 'area', text: 'エリア' },
        { value: 'avatar', text: 'アバター' },
        { value: 'birth', text: '誕生日' },
        { value: 'gender', text: '性別' },
        { value: 'name', text: '氏名' },
        { value: 'nickname', text: 'ニックネーム' },
      ],
      rows: [],
      editedItem: {},
      defaultItem: {},
      editedIndex: -1,
      message: '',
      level: '',
      uploadImageUrl: null
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規登録' : '編集'
    }
  },
  async mounted () {
    await this.getRows()
  },
  methods: {
    async getRows () {
      try {
        console.log('in getRows')
        const ret = await Users.getAllItems()
        this.rows = ret
        this.message = ''
        return ret
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          this.message = 'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'notifyList:getRows')
        }
      }
    },
    editItem (item) {
      this.editedIndex = this.rows.indexOf(item)
      this.editedItem = item
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        await Users.delete(item.id)
        return await this.getRows()
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          this.message = 'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'notifyList:delRow')
        }
      }
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save () {
      const doc = {
        area: this.editedItem.area,
        avatar: this.editedItem.avatar,
        birth: this.editedItem.birth,
        gender: this.editedItem.gender,
        name: this.editedItem.name,
        nickname: this.editedItem.nickname,
        isAdmin: this.editedItem.isAdmin,
        isTeacher: this.editedItem.isTeacher
      }
      await Users.save(this.editedItem.id, doc)
      this.close()
      this.uploadImageUrl = null
      return await this.getRows()
    },
    onImagePicked (file) {
      if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.ImgB64Resize(fr.result, 100,
            (imgB64) => {
            // Destination Image
              console.log('uploadImageUrl:', imgB64)
              this.uploadImageUrl = imgB64
            }
          )
        })
      } else {
        this.uploadImageUrl = null
      }
    },
    // Resize Base64 Image
    //   img_base64_src: string "data:image/png;base64,xxxxxxxx"
    ImgB64Resize (imgB64Src, width, callback) {
    // Image Type
      const imgType = imgB64Src.substring(5, imgB64Src.indexOf(';'))
      // Source Image
      const img = new Image()
      img.onload = function () {
        // New Canvas
        const height = img.height * (width / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        // Draw (Resize)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // Destination Image
        const imgB64Dst = canvas.toDataURL(imgType)
        callback(imgB64Dst)
      }
      img.src = imgB64Src
    }
  }
}
</script>
<style scoped>
html {
  font-size: 16px;
}
.v-data-table {
    font-size: 16px;
}
</style>
