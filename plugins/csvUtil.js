import moment from 'moment'

export default {
  // csvToArray CSVテキストから、オブジェクトの配列を作って返す
  // reader:  (csvファイル)
  // position: 取り出す列位置(pos)と属性名(name)の配列
  csvToArray (reader, position) {
    const csvData = []
    const lines = reader.result.split('\n') // 改行毎にデータを分ける
    lines.shift() // csvファイルの先頭（ヘッダ）を削除
    // csvファイルの各行をcsvDataにオブジェクトとしてpushする
    lines.forEach((element, index) => {
      // 改行削除
      let workerData = element.replace(/\r/g, '')
      workerData = workerData.split(',') // 区切り文字はカンマ
      // CSVファイルのposition.num 番目の項目を、属性position.nameとしてオブジェクトに追加
      const obj = {}
      position.forEach((element, index) => {
        obj[element.name] = workerData[element.pos]
      })
      if (obj.id) {
        csvData.push(obj)
      }
    })
    return csvData
  },
  // arrayToCsv 行ごとの配列から、CSVテキストを作って返す
  // objArray: 行のオブジェクトの配列
  // itemList: CSVにする項目名の配列(key:属性名,label:csv列名,type:なし、date、time)
  arrayToCsv (objArray, itemList) {
    let csvString = ''
    // ヘッダを出力
    itemList.forEach((items) => {
      csvString += items.label + ','
    })
    csvString += '\r\n'
    // 中身を出力
    objArray.forEach((row) => {
      let rowString = ''
      // 指定された属性のみ書き出す
      itemList.forEach((item) => {
        if (item.type === 'fix') { // 固定値はkeyの値そのまま
          rowString += item.key
        } else if (row[item.key] != null) {
          // 日付
          if (item.type === 'date') { // dateはTimeStamp
            if (row[item.key]) {
              const tmpDate = row[item.key]
              rowString += moment(tmpDate).format('YYYY/MM/DD HH:mm')
            }
          // 時刻
          } else if (item.type === 'time') { // timeはミリ秒
            if (row[item.key]) {
              const tmpMs = row[item.key]
              const h = String(Math.floor(tmpMs / (1000 * 60 * 60)))
              const m = ('0' + Math.floor((tmpMs - h * (1000 * 60 * 60)) / (60 * 1000))).slice(-2)
              rowString += h + ':' + m
            }
          // 固定値
          } else { // それ以外はそのまま
            rowString += row[item.key]
          }
        }
        rowString += ','
      })
      csvString += rowString + '\r\n'
    })
    return csvString
  }
}
