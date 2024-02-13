// function generateImages() {
//   const e = document.getElementById("excelInput"),
//     t = (document.getElementById("result"), e.files[0]);
//   if (!t) return void alert("Please upload an Excel/CSV file.");
//   const a = new FileReader();
//   (a.onload = function (e) {
//     const t = XLSX.read(e.target.result, { type: "binary" });
//     generateImagesWithData(XLSX.utils.sheet_to_json(t.Sheets[t.SheetNames[0]]));
//   }),
//     a.readAsBinaryString(t);
// }
function generateImagesWithData(e) {
    const t = new Image();
t.src = "bus.jpg";
    new Promise((e) => {
        t.onload = e;
    }).then(() => {
        e.forEach((e) => {
            const a = e.x || 900,
                n = e.y || 470,
                o = document.createElement("canvas"),
                s = o.getContext("2d");
            (o.width = t.width),
                (o.height = t.height),
                s.drawImage(t, 0, 0, o.width, o.height),
                (s.font = '60px "Bebas Neue"'),
                (s.fillStyle = "#950c0a"),
                s.fillText(e.Name, a, n),
                (s.font = '140px "Bebas Neue"'),
                s.fillText(`${e["Bus No"]}`, a + 915, n - 110),
                (s.font = '60px "Bebas Neue"'),
                s.fillText(`${e["Bus Captain"]} - ${e.Contact}`, a, n + 95);
            const i = o.toDataURL("image/jpeg"),
                l = document.createElement("a");
            (l.href = i),
                (l.download = `Bus No ${e["Bus No"]} - ${e.Name} Boarding Pass.jpeg`),
                l.click();
        });
    });
}
