
const key = "94f10ed07e7ff9a1894c7c9624792902"

function colocarDadosNaTela(dados){
    console.log(dados)
document.querySelector(".cidade").innerHTML = dados.name
document.querySelector(".temp").innerHTML =  Math.floor(dados.main.temp) + "°c";
document.querySelector(".temp-min .valor").innerHTML = Math.floor(dados.main.temp_min) + "°";
document.querySelector(".temp-max .valor").innerHTML = Math.floor(dados.main.temp_max) + "°";
document.querySelector(".sensacao").innerHTML = Math.floor(dados.main.feels_like) + "°C";
document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description;

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

function aplicarTemaDiaNoite() {
  const hora = new Date().getHours();
  const body = document.body;
  const lupa = document.querySelector(".img-busca");

  if (hora >= 6 && hora < 18) {
    body.classList.add('tema-dia');
    body.classList.remove('tema-noite');
    if (lupa) {
      lupa.src = "./assets/lupa-dia.svg";
    }
  } else {
    body.classList.add('tema-noite');
    body.classList.remove('tema-dia');
    if (lupa) {
      lupa.src = "./assets/lupa-noite.svg";
    }
  }
}

document.addEventListener("DOMContentLoaded", aplicarTemaDiaNoite);

function atualizarRelogio() {
  const agora = new Date();

  const diasSemana = [
    "Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."
  ];

  const dia = diasSemana[agora.getDay()];
  const horas = agora.getHours().toString().padStart(2, '0');
  const minutos = agora.getMinutes().toString().padStart(2, '0');

  const horarioFormatado = `${dia} ${horas}:${minutos}`;

  const relogioEl = document.getElementById('relogio');
  if (relogioEl) {
    relogioEl.textContent = horarioFormatado;
  }
}

// Atualiza ao carregar
document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaDiaNoite();  // já existia
  atualizarRelogio();     // novo
  setInterval(atualizarRelogio, 1000); // atualiza a cada segundo
});