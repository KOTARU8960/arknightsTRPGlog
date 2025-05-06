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
			/^(?:(?:x|X|rep|repeat)(\d+)(?: |　|<br>))?[0-9()+-/*FCUR]*[aA][bB](?:100)?&lt;=[0-9()+-/*FCUR]+(?:SNIPER)?/
		const ad =
			/^(?:(?:x|X|rep|repeat)(\d+)(?: |　|<br>))?[0-9()+-/*FCUR]*[aA][dD](?:100)?&lt;=[0-9()+-/*FCUR]+/
		const p = /^<p/
		const rollresult =
			/\(([\d]+)AB(?:100)?&lt;=\d+(?:--SNIPER)?\) ＞ \[[\d,]+\] ＞ [\d]+\+([\d]+)C-([\d]+)E(?:\+[01]\(SNIPER\))? ＞ 成功数[-\d]+$/
		var names = []
		var ABresult = []
		var ADresult = []
		const pre = document.getElementById('pre1')
		const namecheckbox = document.getElementById("namecheckbox")

		function Output(name, ABresult, ADresult) {
			let result
			if(document.getElementById("AB").checked) result = ABresult
			else if(document.getElementById("AD").checked) result = ADresult
			else result = [[ADresult[0][0]+ABresult[0][0],ADresult[0][1]+ABresult[0][1]], 
							ADresult[1].concat(ABresult[1]), ADresult[2].concat(ABresult[2]), ABresult[3] + ADresult[3]]
			if(!result[3]) return ""
			let ret = "<h2>## " + name + "(ロール回数：" + result[3] + "回)</h2>"

			if (!(result[0][0] + result[0][1])) {
				ret = ret + "<p>クリエラ無し！</p>"
				return ret
			}
			ret = ret + "<p>```</p>"
			if (result[0][0]) {
				ret = ret + "<p>クリティカル : " + result[0][0] + "回(" + Math.round((
					result[0][0] * 100) / result[3]) + "%)</p><br>"
				for (let k = 0; k < result[1].length; k++) {
					ret = ret + "<p>" + result[1][k] + "</p>"
				}
			}

			if ((result[0][0]) && (result[0][1])) {
				ret = ret + "<p>``````</p>"
			}

			if (result[0][1]) {
				ret = ret + "<p>エラー : " + result[0][1] + "回(" + Math.round((result
					[0][1] * 100) / result[3]) + "%)</p><br>"
				for (let k = 0; k < result[2].length; k++) {
					ret = ret + "<p>" + result[2][k] + "</p>"
				}
			}
			ret = ret + "<p>```</p>"
			return ret
		}

        function reload(){
			if (names.length == 0) return
            let ret = ""
            for (let i = 0; i < names.length; i++) {
                if(document.getElementById('name_'+i).checked)
                    ret += Output(names[i],ABresult[i],ADresult[i])
			}
            pre.innerHTML = ret
        }
        window.reload = reload;

		reader.onload = () => {
			const text = reader.result.split('\n')

			if (text[6] != "    <title>ccfolia - logs</title>") {
				pre.innerHTML = "<h2>ccfoliaのログファイルではありません</h2>"
				return
			}

			for (let i = 0; i < text.length; i++) {
				if (!p.test(text[i].trim())) {
					continue
				}
				let textlen = text[i + 4].trim()
				if (ad.test(textlen)) {
					let rep = textlen.match(ad)[1]
					let namelen = text[i + 2]
					let name = namelen.substring(namelen.indexOf(">") + 1, namelen.lastIndexOf(
						"<"))
					if (!names.includes(name)) {
						names.push(name)
						ABresult.push([
							[0,0],
							[],
							[], 0
						])
						ADresult.push([
							[0,0],
							[],
							[], 0
						])
					}
					if (!rep) {
						rep = "1"
					}
					rep = Number(rep)
					ADresult[names.indexOf(name)][3] += rep
					let ADresultlen = ""
					let repnum = ""
					for (let k = 0; k < rep; k++) {
						if (!textlen.match(ad)[1]) {
							ADresultlen = text[i + 4].trim()
							repnum = ""
						} else {
							ADresultlen = text[i + 5 + (k * 3)].trim()
							repnum = textlen.slice(0, -3).replace(ad, "")
						}
						if (ADresultlen.endsWith("クリティカル！")) {
							ADresult[names.indexOf(name)][1].push(repnum + ADresultlen.replace(ad,
								"").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
							ADresult[names.indexOf(name)][0][0]++
						}
						if (ADresultlen.endsWith("エラー")) {
							ADresult[names.indexOf(name)][2].push(repnum + ADresultlen.replace(ad,
								"").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
							ADresult[names.indexOf(name)][0][1]++
						}
					}
				}

				if (ab.test(textlen)) {
					let rep = textlen.match(ab)[1]
					let namelen = text[i + 2]
					let name = namelen.substring(namelen.indexOf(">") + 1, namelen.lastIndexOf(
						"<"))
					if (!names.includes(name)) {
						names.push(name)
						ABresult.push([[0,0],[],[], 0])
						ADresult.push([[0,0],[],[], 0])
					}
					if (!rep) {
						rep = "1"
					}
					rep = Number(rep)
					let ABresultlen = ""
					let repnum = ""
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
						ABresult[names.indexOf(name)][3] += Number(roll[1])
						if (Number(roll[2])) {
							ABresult[names.indexOf(name)][1].push(repnum + ABresultlen.replace(ab,
								"").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
							ABresult[names.indexOf(name)][0][0] += Number(roll[2])
						}
						if (Number(roll[3])) {
							ABresult[names.indexOf(name)][2].push(repnum + ABresultlen.replace(ab,
								"").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
							ABresult[names.indexOf(name)][0][1] += Number(roll[3])
						}
					}
				}
			}

			let ch = "<fieldset>"
			for (let i = 0; i < names.length; i++) {
				ch += '<input type="checkbox" name="name" value="' + names[i] +
					'" id="name_' + i +'"onchange="reload()" checked>' + '<label for="name_' + i + '">' +
					names[i] + '</label><br>';
			}
			ch += "</fieldset>"
			namecheckbox.innerHTML = ch

			let ret = ""
			for (let i = 0; i < names.length; i++) {
                ret += Output(names[i],ABresult[i],ADresult[i])
			}

			pre.innerHTML = ret
		}



		reader.readAsText(file)
	})
})
