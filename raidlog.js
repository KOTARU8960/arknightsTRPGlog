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
		const ab =
			/^(?:(?:X|x|rep|repeat)(\d+)(?: +|　+|<br>))?[0-9()+-/*FCUR]*[aA][bB](?:100)?&lt;=[0-9()+-/*FCUR]+(?:SNIPER)? .*(?:#1|\([\d]+AB(?:100)?&lt;=\d+(?:--SNIPER)?\) ＞ \[[\d,]+\] ＞ [\d]+\+[\d]+C-[\d]+E(?:\+[01]\(SNIPER\))? ＞ 成功数([-\d]))+$/

		const rollresult =
			/\([\d]+AB(?:100)?&lt;=\d+(?:--SNIPER)?\) ＞ \[[\d,]+\] ＞ [\d]+\+[\d]+C-[\d]+E(?:\+[01]\(SNIPER\))? ＞ 成功数([-\d])+$/
		const debug = /成功数(\d+)/
		const repeat = /^(?:X|x|rep|repeat)(\d+)(?: +|　+|<br>)/
		const p = /^<p/
		const span = /<\/span>/
		const pl = /<br>プレイヤー名：(.+)<br>/
		var error = []
		var debugresult = 0
		var arts = 0
		var attack = 0
		var artsresult = 0
		var atackresult = 0 
		var All = 0
		var type = 0
		var csv = "PL名,OP名,ダメージ属性,ダメージ量,ロールしたダイス<br>"
		const pre = document.getElementById('pre1')

		function findPL(name,text) {
			var name = new RegExp("コードネーム："+name)
			for (let i = 0; i < text.length; i++) {
				if (name.test(text[i])) {
					return text[i].match(pl)[1]
				}
			}
			return "不明"
		}

		reader.onload = () => {
			const text = reader.result.split('\n')

			if (text[6] != "    <title>ccfolia - logs</title>") {
				pre.innerHTML = "<h2>ccfoliaのログファイルではありません</h2>"
				return
			}

			for (let i = 0; i < text.length; i++) {
				if (debug.test(text[i])) {
					debugresult += Number(text[i].match(debug)[1])
				}

				if (!p.test(text[i].trim()) || text[i+1]!="  <span> [main]</span>") {
					continue
				}
				let textlen = text[i + 4].trim()

				if (!ab.test(textlen)) {
					err = textlen
					k = i+4
					while (true){
						k++
						if (text[k].match(span)) {
							break
						}
						err += "<br>"+text[k].trim()
					}
				error.push(err)
				}	

				if (ab.test(textlen)) {
					let namelen = text[i + 2]
					let name = namelen.substring(namelen.indexOf(">") + 1, namelen.lastIndexOf("<"))
					let PLname = findPL(name,text)
					csv += PLname + "," + name + ","

					let rep = textlen.match(ab)[1]
					if (!rep) {
						rep = "1"
					}
					rep = Number(rep)
					let ABresultlen = ""
					let repnum = ""
					if (textlen.indexOf("アーツ攻撃判定") != -1) {
						type = 1
						csv += "アーツ,"
					}
					else {
						type = 0
						csv += "物理,"
					}
					let result = 0
					for (let k = 0; k < rep; k++) {
						if (!textlen.match(ab)[1]) {
							ABresultlen = text[i + 4].trim()
							repnum = ""
						} else {
							ABresultlen = text[i + 5 + (k * 3)].trim()
							repnum = textlen.slice(0, -3).replace(ab, "")
						}
						let roll = ABresultlen.match(rollresult)
						if (roll == null) {
							break;
						}
						
						if (type) {
							artsresult += Number(roll[1])
							result += Number(roll[1])
							arts += 1
						}
						else if (!type) {
							atackresult += Number(roll[1])
							result += Number(roll[1])
							attack += 1
						}
					}
					All += rep
					csv += result + "<br>"
				}
			}
			csv += ",,,<br>,,,<br>,,,"
			

			let ret = ""
			ret += "<h2>総攻撃回数："+All+"</h2>"
			ret += "<h2>物理攻撃回数："+attack+"</h2>"
			ret += "<h3>物理攻撃成功数："+atackresult+"</h3>"
			ret += "<h2>アーツ攻撃回数："+arts+"</h2>"
			ret += "<h3>アーツ攻撃成功数："+artsresult+"</h3>"
			ret += "成功数累計(debug)："+debugresult+"<br><br>"

			ret += "<h2>集計外判定になった物</h2>"
			for (let i = 0; i < error.length; i++) {
				ret += error[i] + "<br><br>"
			}
			ret += "<h2>csvファイルの中身です、ダウンロードは未実装</h2>"
			ret += csv


			pre.innerHTML = ret
		}



		reader.readAsText(file)
	})
})
