
const key = "94f10ed07e7ff9a1894c7c9624792902"

function colocarDadosNaTela(dados){
    console.log(dados)
document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C"
document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description
document.querySelector(".umidade").innerHTML = dados.main.humidity + "%"
document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`

}
async function buscarCidade(cidade){

    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`).then( resposta => resposta.json())
    https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    colocarDadosNaTela(dados)
}


function cliqueiNoBotao() {
    const cidade = document.querySelector(".input-cidade").value

     buscarCidade(cidade)
}