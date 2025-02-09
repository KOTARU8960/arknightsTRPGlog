window.addEventListener('load', () => {
    const f = document.getElementById('file1');
    f.addEventListener('change', evt => {
      let input = evt.target;
      if (input.files.length == 0) {
        console.log('No file selected');
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();
      const ab = /^[0-9()+-/*]{0,}AB&lt;=[0-9()+-/*]{0,}[ $]/;
      const ad = /^[0-9()+-/*]{0,}AD&lt;=[0-9()+-/*]{0,}[ $]/;
      const num = /[1-9]/
      reader.onload = () => {
        var names = [];
        var result = []
        const pre = document.getElementById('pre1');
        const text = reader.result.split('\n');
        const index = ( text.length - 14) / 8;

        if (text[6] != "    <title>ccfolia - logs</title>") {
            pre.innerHTML = "<h2>ccfoliaのログファイルではありません</h2>";
            return;
        }

        for ( let i = 0;  i < index;  i++  ){
            let textlen = text[16 + i*8].trim()

            if(ad.test(textlen)){
                let namelen = text[14 + i*8];
                let name = namelen.substring(namelen.indexOf(">")+1,namelen.lastIndexOf("<"))
                if (!names.includes(name)){
                    names.push(name);
                    result.push([[0],[0],0]);
                }
                result[names.indexOf(name)][2]++;
                if(textlen.endsWith("クリティカル！")){
                    result[names.indexOf(name)][0].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                    result[names.indexOf(name)][0][0]++;
                }
                if(textlen.endsWith("エラー")){
                    result[names.indexOf(name)][1].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                    result[names.indexOf(name)][1][0]++;
                }
            }

            if(ab.test(textlen)){
                let namelen = text[14 + i*8];
                let name = namelen.substring(namelen.indexOf(">")+1,namelen.lastIndexOf("<"))
                let cri = textlen[textlen.lastIndexOf("C")-1]
                let err = textlen[textlen.lastIndexOf("E")-1]
                if (!names.includes(name)){
                    names.push(name);
                    result.push([[0],[0],0]);
                }
                result[names.indexOf(name)][2]+=Number(textlen[textlen.lastIndexOf("AB")-1]);
                if(num.test(cri)){
                    result[names.indexOf(name)][0].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                    result[names.indexOf(name)][0][0]+=Number(cri);
                }
                if(num.test(err)){
                    result[names.indexOf(name)][1].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                    result[names.indexOf(name)][1][0]+=Number(err);
                }
            }
        }

        let ret = ""
        for (  let i = 0;  i < names.length;  i++  ){
        ret = ret+"<h1># "+names[i]+"(ロール回数："+result[i][2]+"回)</h1>";

            if(!(result[i][0].length+result[i][1].length-2)){
                ret = ret+"<p>クリエラ無し！</p>";
            }
            if(result[i][0].length-1){
                ret = ret+"<p>```</p>";
                ret = ret+"<p>クリティカル : "+result[i][0][0]+"回("+Math.round((result[i][0][0]*100)/result[i][2])+"%)</p><br>";
                for (  let k = 1;  k < result[i][0].length;  k++  ){
                    ret = ret+"<p>"+result[i][0][k]+"</p>";
                }
                ret = ret+"<p>```</p>";
            }

            if(result[i][1].length-1){
                ret = ret+"<p>```</p>";
                ret = ret+"<p>エラー : "+result[i][1][0]+"回("+Math.round((result[i][1][0]*100)/result[i][2])+"%)</p><br>";
                for (  let k = 1;  k < result[i][1].length;  k++  ){
                    ret = ret+"<p>"+result[i][1][k]+"</p>";
                }
                ret = ret+"<p>```</p>";
            }
        }
        
        pre.innerHTML = ret;
    };
  
      reader.readAsText(file);
    });
  });
