//Объект HTML
var yandexMap=document.getElementById("FrameMap");
try{
yandexMap.src = "https://yandex.ru/map-widget/v1/?um=constructor%3A4db2f5cf2a5ef3547e94c650ae07c6faefe62fd5c9ef88628e4c98cabe1c57f5&source=constructor";
}
catch{console.log(ex)}
