const weatherCodeMap = {
  0: { text: "Céu limpo", icon: "☀️" },
  1: { text: "poucas nuvens", icon: "🌤️" },
  2: { text: "P. Nublado", icon: "⛅" },
  3: { text: "Nublado", icon: "☁️" },
  45: { text: "Neblina", icon: "🌫️" },
  48: { text: "Neblina congelante", icon: "🌫️❄️" },
  51: { text: "Chuvisco leve", icon: "🌦️" },
  53: { text: "Chuvisco moderado", icon: "🌧️" },
  55: { text: "Chuvisco forte", icon: "🌧️" },
  61: { text: "Chuva leve", icon: "🌧️" },
  63: { text: "Chuva moderada", icon: "🌧️" },
  65: { text: "Chuva forte", icon: "🌧️" },
  80: { text: "Pancadas leves", icon: "🌦️" },
  81: { text: "Pancadas moderadas", icon: "🌦️" },
  82: { text: "Pancadas fortes", icon: "⛈️" },
  95: { text: "Tempestade", icon: "⛈️" },
  96: { text: "Tempestade com granizo", icon: "🌩️❄️" },
  99: { text: "Tempestade forte com granizo", icon: "🌩️❄️" }
};

async function buscarCidade(nome) {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("Cidade não encontrada.");
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];
    document.querySelector("h2.cidade").textContent = name; 

    carregarPrevisao7Dias(latitude, longitude);
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
    alert("Erro ao buscar cidade.");
  }
}

async function carregarPrevisao7Dias(lat = -23.55, lon = -46.63) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&forecast_days=7&timezone=America%2FBahia`;
    const res = await fetch(url);
    const data = await res.json();

    const agora = new Date();
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const diaSemana = diasSemana[agora.getDay()];
    const hora = agora.getHours().toString().padStart(2, "0");
    const minuto = agora.getMinutes().toString().padStart(2, "0");
    document.getElementById("relogio").textContent = `${diaSemana}. ${hora}:${minuto}`;

    
    const tempAtual = Math.round(data.current_weather.temperature);
    document.querySelector(".temp").textContent = `${tempAtual}°C`;

    const tempMax = Math.round(data.daily.temperature_2m_max[0]);
    const tempMin = Math.round(data.daily.temperature_2m_min[0]);
    const weatherCode = data.daily.weathercode[0];
    const clima = weatherCodeMap[weatherCode] || { text: "Desconhecido", icon: "❓" };

    document.querySelector(".texto-previsao").textContent = clima.text;
    document.querySelector(".temp-max .valor").textContent = tempMax + "°";
    document.querySelector(".temp-min .valor").textContent = tempMin + "°";
    document.querySelector(".sensacao").textContent = `${tempAtual}°C`;

    const dias = data.daily.time;
    const tempMaxArr = data.daily.temperature_2m_max;
    const tempMinArr = data.daily.temperature_2m_min;
    const codClimaArr = data.daily.weathercode;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let indexDiaHTML = 0;

    for (let i = 0; i < dias.length; i++) {
      const dataPrevista = new Date(dias[i]);
      dataPrevista.setHours(0, 0, 0, 0);

      const elemento = document.querySelector(`.dia-${indexDiaHTML}`);
      if (!elemento) break;

      const nomeDiaCompleto = dataPrevista.toLocaleDateString("pt-BR", { weekday: "long" }); // "segunda-feira"
      const nomeDiaReduzido = nomeDiaCompleto.split("-")[0].trim();

      const climaDia = weatherCodeMap[codClimaArr[i]] || { text: "Desconhecido", icon: "❓" };

      elemento.querySelector(".nome-dia-completo").textContent = nomeDiaCompleto;
      elemento.querySelector(".nome-dia-reduzido").textContent = nomeDiaReduzido;
      elemento.querySelector(".temp-min1").textContent = `${Math.round(tempMinArr[i])}°`;
      elemento.querySelector(".temp-max1").textContent = `${Math.round(tempMaxArr[i])}°`;
      elemento.querySelector(".icone-clima").alt = climaDia.text;
      elemento.querySelector(".icone-clima").src = `./icones/${codClimaArr[i]}.png`;
      elemento.querySelector(".nome-clima").textContent = climaDia.text;

      indexDiaHTML++;
      if (indexDiaHTML > 6) break;
    }
  } catch (error) {
    console.error("Erro ao carregar previsão:", error);
    alert("Erro ao carregar previsão do tempo.");
  }
}

function cliqueiNoBotao() {
  const cidade = document.querySelector(".input-cidade").value.trim();
  if (cidade) {
    buscarCidade(cidade);
  } else {
    alert("Por favor, digite o nome de uma cidade.");
  }
}

window.addEventListener("load", () => {
  carregarPrevisao7Dias(-11.3033, -41.8535);
});

function cliqueiNoBotao() {
  const cidade = document.querySelector(".input-cidade").value;
  if (cidade) {
    buscarCidade(cidade);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaDiaNoite(); 
  atualizarRelogio();    
  setInterval(atualizarRelogio, 1000); 
});