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
      reader.onload = () => {
        var names = [];
        var result = []
        const pre = document.getElementById('pre1');
        const text = reader.result.split('\n');
        const index = ( text.length - 14) / 8;

        for ( let i = 0;  i < index;  i++  ){
            let textlen = text[16 + i*8].trim()
            if(ad.test(textlen)){
                let namelen = text[14 + i*8];
                let name = namelen.substring(namelen.indexOf(">")+1,namelen.lastIndexOf("<"))
                if(textlen.endsWith("クリティカル！")){
                    if (!names.includes(name)){
                        names.push(name);
                        result.push([[],[]]);
                    }
                    result[names.indexOf(name)][0].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                }
                if(textlen.endsWith("エラー")){
                    if (!names.includes(name)){
                        names.push(name);
                        result.push([[],[]]);
                    }
                    result[names.indexOf(name)][1].push(textlen.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
                }
            }
        }

        let ret = ""
        for (  let i = 0;  i < names.length;  i++  ){
        ret = ret+"<h1># "+names[i]+"<br></h1>";

            if(result[i][0].length){
                ret = ret+"<p>```</p>";
                ret = ret+"<p>クリティカル : "+result[i][0].length+"回</p><br>";
                for (  let k = 0;  k < result[i][0].length;  k++  ){
                    ret = ret+"<p>"+result[i][0][k]+"</p>";
                }
                ret = ret+"<p>```</p>";
            }

            if(result[i][1].length){
                ret = ret+"<p>```</p>";
                ret = ret+"<p>エラー : "+result[i][1].length+"回</p><br>";
                for (  let k = 0;  k < result[i][1].length;  k++  ){
                    ret = ret+result[i][1][k];
                }
                ret = ret+"<p>```</p>";
            }
        }
        pre.innerHTML = ret;
    };
  
      reader.readAsText(file);
    });
  });