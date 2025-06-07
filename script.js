const perguntas = [
  "genero",
  "experiencia",
  "condicao",
  "lesao",
  "dias",
  "academia"
];

const totalPerguntas = perguntas.length;
const progressBar = document.getElementById("progressBar");
const formulario = document.getElementById("formulario");
const resultadoDiv = document.getElementById("resultado");

// Atualiza a barra de progresso
function atualizarProgresso(atual) {
  const percentual = (atual / totalPerguntas) * 100;
  progressBar.style.width = percentual + "%";
}

// Mostra a próxima pergunta
function mostrarPergunta(index) {
  if (index < totalPerguntas) {
    const proxPergunta = document.getElementById(`pergunta${index + 1}`);
    if (proxPergunta) {
      proxPergunta.style.display = "block";
    }
  } else {
    document.getElementById("submitBtn").style.display = "block";
  }
}

// Oculta todas as perguntas exceto a primeira
for (let i = 2; i <= totalPerguntas; i++) {
  const p = document.getElementById(`pergunta${i}`);
  if (p) p.style.display = "none";
}
document.getElementById("submitBtn").style.display = "none";
atualizarProgresso(0);

// Eventos de mudança nos selects
perguntas.forEach((id, idx) => {
  const select = document.getElementById(id);
  select.addEventListener("change", () => {
    if (id === "lesao" && select.value === "sim") {
      resultadoDiv.innerHTML = `
        <h2>Aviso Importante</h2>
        <p style="color: red; font-weight: bold;">
          Não é possível gerar uma ficha de treino personalizada em caso de lesão.
          Recomendamos que você procure um profissional da saúde ou um educador físico.
        </p>
      `;
      for (let i = idx + 1; i < totalPerguntas; i++) {
        const p = document.getElementById(`pergunta${i + 1}`);
        if (p) p.style.display = "none";
      }
      document.getElementById("submitBtn").style.display = "none";
      atualizarProgresso(idx + 1);
      return;
    } else {
      if (id === "lesao") resultadoDiv.innerHTML = "";
    }

    let respondidas = 0;
    for (let i = 0; i < totalPerguntas; i++) {
      const val = document.getElementById(perguntas[i]).value;
      if (val !== "") respondidas++;
    }
    atualizarProgresso(respondidas);

    if (select.value !== "") {
      mostrarPergunta(idx + 1);
    } else {
      for (let i = idx + 1; i < totalPerguntas; i++) {
        const p = document.getElementById(`pergunta${i + 1}`);
        if (p) p.style.display = "none";
      }
      document.getElementById("submitBtn").style.display = "none";
      atualizarProgresso(idx);
    }
  });
});

// Submit do formulário
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const genero = document.getElementById("genero").value;
  const experiencia = document.getElementById("experiencia").value;
  const condicao = document.getElementById("condicao").value;
  const lesao = document.getElementById("lesao").value;
  const dias = document.getElementById("dias").value;
  const academia = document.getElementById("academia").value;

  if (lesao === "sim") {
    resultadoDiv.innerHTML = `
      <h2>Aviso Importante</h2>
      <p style="color: red; font-weight: bold;">
        Não é possível gerar uma ficha de treino personalizada em caso de lesão.
        Recomendamos que você procure um profissional da saúde ou um educador físico.
      </p>
    `;
    return;
  }

  const chave = `${genero}-${experiencia}-${condicao}-${dias}-${academia}`;
  const ficha = fichas[chave];

  if (!ficha) {
    resultadoDiv.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível encontrar uma ficha para essa combinação. Tente novamente.</p>
    `;
    return;
  }

  let html = `<h2>Ficha de Treino - ${dias} dias/semana</h2>`;
  const fichaCards = document.getElementById("ficha-cards");
  fichaCards.innerHTML = "";

  ficha.forEach((dia, index) => {
    const card = document.createElement("div");
    card.classList.add("ficha-card");
    card.innerHTML = `<h3>Dia ${index + 1}</h3>`;

    const ul = document.createElement("ul");
    dia.forEach(exercicio => {
      const li = document.createElement("li");
      li.innerHTML = 
        `<span class="exercicio-nome">${exercicio}</span>
        <img class="flecha-direita" src="imagens/flecha.png" alt="→" />`
      ;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        mostrarDescricaoExercicio(exercicio);
      });
      ul.appendChild(li);
    });

    card.appendChild(ul);
    fichaCards.appendChild(card);
  });

  resultadoDiv.innerHTML = html;
});

// Pop-up da descrição
const popup = document.getElementById("popupDescricao");
const descricaoTexto = document.getElementById("descricaoTexto");
const fecharPopup = document.getElementById("fecharPopup");

function mostrarDescricaoExercicio(exercicio) {
  const descricao = descricoesExercicios[exercicio] || "Descrição não disponível.";
  const linksYoutube = {
    "Agachamento livre": "https://www.youtube.com/watch?v=1xMaFs0L3ao",
    "Leg press": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    "Supino reto": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    "Rosca direta": "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    "Elevação lateral": "https://www.youtube.com/watch?v=kDqklk1ZESo",
    "Panturrilha em pé": "https://www.youtube.com/watch?v=-M4-G8p8fmc",
    "Tríceps corda": "https://www.youtube.com/watch?v=vB5OHsJ3EME",
    "Stiff": "https://www.youtube.com/watch?v=3B2CAVOe3Fg",
    "Desenvolvimento com halteres": "https://www.youtube.com/watch?v=B-aVuyhvLHU",
    "Abdominal máquina": "https://www.youtube.com/watch?v=vPKXFarXbys",
    "Abdominal oblíquo": "https://www.youtube.com/watch?v=OSiN1iwu3A4",
    "Prancha": "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    "Prancha lateral": "https://www.youtube.com/watch?v=K2VljzCC16g"
  };
  const videoLink = linksYoutube[exercicio] || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  descricaoTexto.innerHTML = `
    <strong>${exercicio}</strong><br><br>
    ${descricao}<br><br>
    <label>Tutorial em vídeo:</label><br>
    <input type="text" class="video-link" value="${videoLink}" readonly onclick="window.open('${videoLink}', '_blank')" />
  `;

  popup.classList.add("show");
}

fecharPopup.addEventListener("click", () => {
  popup.classList.remove("show");
});

popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.classList.remove("show");
  }
});
