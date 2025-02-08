import re

path = "C:\\Users\\rl221\\Documents\\TRPG\\アークナイツテスト[main].html"

ab = re.compile(r'[0-9()+-/*]{0,}AB&lt;=[0-9()+-/*]{0,} ')
ad = re.compile(r'[0-9()+-/*]{0,}AD&lt;=[0-9()+-/*]{0,} ')

with open(path, 'r' ,encoding="UTF-8") as file:
  text = [s.rstrip("\n") for s in file.readlines()]

names = []
result = []
index = (len(text) - 14) // 8

for i in range(index):
    textlen = text[16 + i*8].strip(" ")

    if(ad.match(textlen)):
        namelen = text[14 + i*8]
        name = namelen[namelen.find(">")+1:namelen.rfind("<")]
        if name not in names:
            names.append(name)
            result.append([[],[]])
        if(textlen.endswith("クリティカル！")):
            result[names.index(name)][0].append(textlen.replace("&lt;","<").replace("&gt;",">"))
        if(textlen.endswith("エラー")):
            result[names.index(name)][1].append(textlen.replace("&lt;","<").replace("&gt;",">"))

for i in range(len(names)):
    print(f"# {names[i]}")

    if(len(result[i][0])):
        print("```")
        print(f"クリティカル : {len(result[i][0])}回")
        for k in result[i][0]:
            print(f"{k}\n")
        print("```")

    if(len(result[i][1])):
        print("```")
        print(f"エラー : {len(result[i][1])}回")
        for k in result[i][1]:
            print(f"{k}\n")
        print("```")