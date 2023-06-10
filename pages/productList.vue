<template>
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
          <v-toolbar-title>商品一覧</v-toolbar-title>
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
              <v-form v-model="valid" lazy-validation>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-text-field v-model="editedItem.name" :rules="[rules.required,]" label="商品名" />
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.point" :rules="[rules.required,]" label="交換ポイント" suffix="ポイント" />
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.market_price" :rules="[rules.required,]" label="市場価格" suffix="円"/>
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.stock" :rules="[rules.required,]" label="在庫" suffix="個"/>
                    </v-row>
                    <v-row>
                      <v-text-field v-model="editedItem.donor" :rules="[rules.required,]" label="提供者" />
                    </v-row>
                    <v-row>
                      <v-select
                        v-model="placeObj"
                        item-text="name"
                        :items="placeList"
                        label="引換会場"
                        return-object
                        dense
                        required
                        :rules="[rules.required,]"
                      ></v-select>
                    </v-row>
                    <v-row>
                      <v-select
                        v-model="editedItem.category"
                        :items="categoryList"
                        label="商品カテゴリ"
                        dense
                        required
                        :rules="[rules.required,]"
                      ></v-select>
                    </v-row>
                    <v-row>
                      <DatePicker
                        label="消費期限"
                        :adate="expiration"
                        @ok="setExpiration"
                      />
                    </v-row>
                    <v-row>
                      <v-file-input v-model="imgFile" accept="image/*" show-size label="画像" @change="onImagePicked" />
                      <img :src="uploadImageUrl" width="100" />
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="close">
                    キャンセル
                  </v-btn>
                  <v-btn color="blue darken-1" :disabled="!valid" text @click="save">
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
      <template #[`item.img`]="data">
        <v-img width="50" :src="data.item.img" />
      </template>
      <template #[`item.expiration`]="data">
        {{ data.item.expiration | format-date }}
      </template>
      <template #no-data>
        明細はありません
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import Prizes from '@/plugins/firestore/prizes'
import Places from '@/plugins/firestore/places'
import appError, { ApplicationError } from '@/plugins/firestore/appError'
import DatePicker from '@/components/datePicker'
import moment from '@/plugins/moment-ja'

export default {
  components: {
    DatePicker
  },
  layout: 'productAdmin',
  data () {
    return {
      dialog: false,
      fields: [
        { value: 'edit', text: '編集' },
        { value: 'img', text: '画像' },
        { value: 'name', text: '名称' },
        { value: 'point', text: 'ポイント' },
        { value: 'market_price', text: '価格' },
        { value: 'stock', text: '在庫' },
        { value: 'donor', text: '提供者' },
        { value: 'place', text: '引換会場' },
        { value: 'category', text: '商品カテゴリ' },
        { value: 'expiration', text: '消費期限' , },
      ],
      rows: [],
      editedItem: { img: [] },
      defaultItem: {},
      editedIndex: -1,
      message: '',
      level: '',
      uploadImageUrl: null,
      imgFile: [],
      placeList: [],
      placeObj: null,
      categoryList: [
        '食材',
        '教材',
        'その他'
      ],
      rules: {
        required: value => !!value || '必須です',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || '不正なメール形式です'
        },
      },
      valid: false,      
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規登録' : '編集'
    },
    expiration() {
      return this.editedItem.expiration?moment(this.editedItem.expiration).format('YYYY-MM-DD'):''
    }
  },
  async mounted () {
    await this.getRows()
    this.placeList = await Places.getAllItems()
  },
  methods: {
    async getRows () {
      try {
        const ret = await Prizes.getAllItems()
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
      this.uploadImageUrl = this.editedItem.img
      this.placeObj = this.placeList.find((v) => v.id === this.editedItem.place_id);   
      this.dialog = true
      console.log('item:' + JSON.stringify(this.editedItem))
    },
    async deleteItem (item) {
      try {
        await Prizes.delete(item.id)
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
    async save() {
      
      const doc = {
        name: this.editedItem.name,
        point: parseInt(this.editedItem.point),
        market_price: parseInt(this.editedItem.market_price),
        stock: parseInt(this.editedItem.stock),
        donor: this.editedItem.donor,
        place: this.placeObj.name,
        place_id: this.placeObj.id,
        category: this.editedItem.category,
        expiration: this.editedItem.expiration?this.editedItem.expiration:null,
        reg_date: new Date()
      }
      if (this.uploadImageUrl) {
        doc.img = this.uploadImageUrl
      }
      console.log('in save:' + JSON.stringify(doc))
      await Prizes.save(this.editedItem.id, doc)
      this.close()
      this.uploadImageUrl = null
      return await this.getRows()
    },
    onImagePicked(file) {
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
    },
    setExpiration(date) {
      this.editedItem.expiration = new Date(date)
    }
  }
}
</script>
<style scoped>
.td {
  font-size: 16px !important;
}
.pre {
  white-space:pre-wrap;
  word-wrap:break-word;
}
</style>
