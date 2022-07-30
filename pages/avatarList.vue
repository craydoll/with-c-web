<template>
  <v-container>
    <v-data-table
      :headers="fields"
      :items="rows"
      sort-by="id"
      fixed-header
      hide-default-footer
      disable-pagination
      :height="$vuetify.breakpoint.height - 250"
    >
      <template #top>
        <v-toolbar flat color="white">
          <v-toolbar-title>アバター一覧</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn
                color="green"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                新規登録
              </v-btn>
            </template>
            <v-card>
              <v-form v-model="valid">
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-text-field v-model="editedItem.order" :rules="[rules.required,]" label="No." />
                    </v-row>
                    <v-row>
                      <v-file-input v-model="file" accept="image/*" show-size label="アバター画像" @change="onImagePicked" />
                      <img v-if="uploadImageUrl" :src="uploadImageUrl" width="100">
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.name" :rules="[rules.required,]" label="アバター名" />
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.belief" :rules="[rules.required,]" label="信条" />
                    </v-row>
                    <v-row>
                      <v-textarea v-model="editedItem.summary" :rules="[rules.required,]" label="説明" />
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.sdgs" :rules="[rules.required,]" label="担当SDGS項目" />
                    </v-row>
                    <v-row>
                      <v-file-input v-model="file" accept="image/*" show-size label="SDGS画像" @change="onImagePicked2" />
                      <img v-if="sdgsImageUrl" :src="sdgsImageUrl" width="100">
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
              </v-form>
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
      <template #[`item.summary`]="data">
        <pre class="pre"> {{data.item.summary}} </pre>
      </template>
      <template #[`item.img`]="data">
        {{data.item.name}}
        <v-img :src="data.item.img" width="100"/>
      </template>
      <template #[`item.sdgs`]="data">
        {{data.item.sdgs}}
        <v-img :src="data.item.sdgs_img" width="50" />
      </template>
      <template #no-data>
        明細はありません
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import Avatars from '@/plugins/firestore/avatars'
import appError, { ApplicationError } from '@/plugins/firestore/appError'

export default {
  components: {
  },
  layout: 'admin',
  data () {
    return {
      dialog: false,
      fields: [
        { value: 'edit', text: '編集', width:'7%' },
        { value: 'order', text: 'NO.' },
        { value: 'img', text: '画像', class:'img'},
        { value: 'name', text: '名称'},
        { value: 'belief', text: '信条', width:'15%' },
        { value: 'summary', text: '説明', width: '40%' },
        { value: 'sdgs', text: '担当SDGS項目' },
      ],
      rows: [],
      editedItem: {},
      defaultItem: {},
      editedIndex: -1,
      message: '',
      level: '',
      uploadImageUrl: null,
      sdgsImageUrl: null,
      file: [],
      rules: {
        required: value => !!value || '必須です',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || '不正なメール形式です'
        },
      },
      valid: true,      
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規登録' : '編集'
    }
  },
  mounted () {
    this.getRows()
  },
  methods: {
    async getRows () {
      try {
        const ret = await Avatars.getAllItems()
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
      this.sdgsImageUrl = null
      this.uploadImageUrl = null
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        await Avatars.delete(item.id)
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
        name: this.editedItem.name,
        belief: this.editedItem.belief,
        summary: this.editedItem.summary,
        sdgs: this.editedItem.sdgs,
      }
      if (this.uploadImageUrl) {
        doc.img = this.uploadImageUrl
      }
      if (this.sdgsImageUrl) {
        doc.sdgs_img = this.sdgsImageUrl
      }
      await Avatars.save(this.editedItem.id, doc)
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
    onImagePicked2 (file) {
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
              this.sdgsImageUrl = imgB64
            }
          )
        })
      } else {
        this.sdgsImageUrl = null
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
.pre {
  white-space:pre-wrap;
  word-wrap:break-word;
}
.img {
  vertical-align: middle;
}
</style>
