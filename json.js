window.addEventListener('load', () => {
  // HTML要素取得
  const btn = document.getElementById('btn');
  

  if (!btn) {
    return false;
  }

  // コピー処理（btnがクリックされたらtxtをコピーする）
  btn.addEventListener('click', async() => {
    console.log('btn clicked!');
    if (!navigator.clipboard) {
      alert("エラーが発生しました、別ブラウザでご利用ください。");
      return;
    }

    var text = await navigator.clipboard.readText();
    console.log(text);
    text = text.slice(0, -1);
    text = text.slice(1);
    text = text.replace(/""/g, '"')
    text = text.replace('color":",', 'color":"",')

    navigator.clipboard.writeText(text).then(
      () => {
        alert('完了');
      });
  });
})