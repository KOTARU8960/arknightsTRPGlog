window.addEventListener('load', () => {
    const f = document.getElementById('file1')
    f.addEventListener('change', evt => {
      let input = evt.target
      if (input.files.length == 0) {
        console.log('No file selected')
        return
      }
      const file = input.files[0]
      const reader = new FileReader()
      const ab = /^(?:(?:x|rep|repeat)(\d+) )?[0-9()+-/*FCUR]*[aA][bB](?:100)?&lt;=[0-9()+-/*FCUR]+ /
      const ad = /^(?:(?:x|rep|repeat)(\d+) )?[0-9()+-/*FCUR]*[aA][dD](?:100)?&lt;=[0-9()+-/*FCUR]* /
      const p = /^<p/
      const rollresult = /\(([\d]{1,})AB&lt;=\d+\) ＞ \[[\d,]{1,}\] ＞ [\d]{1,}\+([\d]{1,})C-([\d]{1,})E ＞ 成功数[\d]{1,}$/
      reader.onload = () => {
        var names = []
        var result = []
        const pre = document.getElementById('pre1')
        const text = reader.result.split('\n')

        if (text[6] != "    <title>ccfolia - logs</title>") {
            pre.innerHTML = "<h2>ccfoliaのログファイルではありません</h2>"
            return
        }

        for ( let i = 0;  i < text.length;  i++  ){
            if(!p.test(text[i].trim())){
                continue
            }
            let textlen = text[i+4].trim()
            if(ad.test(textlen)){
                let rep = textlen.match(ad)[1]
                let namelen = text[i+2]
                let name = namelen.substring(namelen.indexOf(">")+1,namelen.lastIndexOf("<"))
                if (!names.includes(name)){
                    names.push(name)
                    result.push([[0],[0],0])
                }
                if(!rep){
                    rep = "1"
                }
                rep = Number(rep)
                result[names.indexOf(name)][2]+=rep
                let resultlen = ""
                let repnum = ""
                for(let k=0; k<rep; k++){
                    if(!textlen.match(ad)[1]){
                        resultlen = text[i+4].trim()
                        repnum = ""
                    }
                    else{
                        resultlen = text[i+5+(k*3)].trim()
                        repnum = textlen+"#"+(k+1)
                    }
                    if(resultlen.endsWith("クリティカル！")){
                        result[names.indexOf(name)][0].push(repnum+resultlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                        result[names.indexOf(name)][0][0]++
                    }
                    if(resultlen.endsWith("エラー")){
                        result[names.indexOf(name)][1].push(repnum+resultlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                        result[names.indexOf(name)][1][0]++
                    }
                }
            }

            if(ab.test(textlen)){
                let rep = textlen.match(ab)[1]
                let namelen = text[i+2]
                let name = namelen.substring(namelen.indexOf(">")+1,namelen.lastIndexOf("<"))
                if (!names.includes(name)){
                    names.push(name)
                    result.push([[0],[0],0])
                }
                if(!rep){
                    rep = "1"
                }
                rep = Number(rep)
                let resultlen = ""
                let repnum = ""
                for(let k=0; k<rep; k++){
                    if(!textlen.match(ab)[1]){
                        resultlen = text[i+4].trim()
                        repnum = ""
                    }
                    else{
                        resultlen = text[i+5+(k*3)].trim()
                        repnum = textlen.slice( 0, -3 )+" #"+(k+1)
                    }
                    let roll = resultlen.match(rollresult)
                    if (roll == null){
                        break;
                    }
                    result[names.indexOf(name)][2]+=Number(roll[1])
                    if(!Number(roll[2])){
                        result[names.indexOf(name)][0].push(repnum+resultlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                        result[names.indexOf(name)][0][0]+=Number(roll[2])
                    }
                    if(!Number(roll[3])){
                        result[names.indexOf(name)][1].push(repnum+resultlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                        result[names.indexOf(name)][1][0]+=Number(roll[3])
                    }
                }
            }
        }

        let ret = ""
        for (  let i = 0;  i < names.length;  i++  ){
        ret = ret+"<h2>## "+names[i]+"(ロール回数："+result[i][2]+"回)</h2>"

            if(!(result[i][0].length+result[i][1].length-2)){
                ret = ret+"<p>クリエラ無し！</p>"
                continue
            }
            ret = ret+"<p>```</p>"
            if(result[i][0].length-1){
                ret = ret+"<p>クリティカル : "+result[i][0][0]+"回("+Math.round((result[i][0][0]*100)/result[i][2])+"%)</p><br>"
                for (  let k = 1;  k < result[i][0].length;  k++  ){
                    ret = ret+"<p>"+result[i][0][k]+"</p>"
                }
            }

            if((result[i][0].length-1)&&(result[i][1].length-1)){
                ret = ret+"<p>``````</p>"
            }

            if(result[i][1].length-1){
                ret = ret+"<p>エラー : "+result[i][1][0]+"回("+Math.round((result[i][1][0]*100)/result[i][2])+"%)</p><br>"
                for (  let k = 1;  k < result[i][1].length;  k++  ){
                    ret = ret+"<p>"+result[i][1][k]+"</p>"
                }
            }
            ret = ret+"<p>```</p>"
        }
        
        pre.innerHTML = ret
    }
  
      reader.readAsText(file)
    })
  })
