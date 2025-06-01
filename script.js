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

// Função para atualizar a barra de progresso
function atualizarProgresso(atual) {
  const percentual = (atual / totalPerguntas) * 100;
  progressBar.style.width = percentual + "%";
}

// Função para mostrar próxima pergunta
function mostrarPergunta(index) {
  if (index < totalPerguntas) {
    const proxPergunta = document.getElementById(`pergunta${index + 1}`);
    if (proxPergunta) {
      proxPergunta.style.display = "block";
    }
  } else {
    // Todas respondidas, mostrar botão enviar
    document.getElementById("submitBtn").style.display = "block";
  }
}

// Inicialização: só mostra a primeira pergunta
for (let i = 2; i <= totalPerguntas; i++) {
  const p = document.getElementById(`pergunta${i}`);
  if (p) p.style.display = "none";
}
document.getElementById("submitBtn").style.display = "none";
atualizarProgresso(0);

// Adicionar evento de mudança para cada select
perguntas.forEach((id, idx) => {
  const select = document.getElementById(id);
  select.addEventListener("change", () => {
    // Caso selecione "sim" em lesão, mostrar aviso e bloquear
    if (id === "lesao" && select.value === "sim") {
      resultadoDiv.innerHTML = `
        <h2>Aviso Importante</h2>
        <p style="color: red; font-weight: bold;">
          Não é possível gerar uma ficha de treino personalizada em caso de lesão.
          Recomendamos que você procure um profissional da saúde ou um educador físico.
        </p>
      `;
      // Esconder perguntas posteriores e botão enviar
      for (let i = idx + 1; i < totalPerguntas; i++) {
        const p = document.getElementById(`pergunta${i + 1}`);
        if (p) p.style.display = "none";
      }
      document.getElementById("submitBtn").style.display = "none";
      // Atualizar barra até essa pergunta
      atualizarProgresso(idx + 1);
      return; // para não liberar próximas perguntas
    } else {
      // Limpa aviso se lesão não for "sim"
      if (id === "lesao") {
        resultadoDiv.innerHTML = "";
      }
    }

    // Atualizar barra
    let respondidas = 0;
    for (let i = 0; i < totalPerguntas; i++) {
      const val = document.getElementById(perguntas[i]).value;
      if (val !== "") respondidas++;
    }
    atualizarProgresso(respondidas);

    // Mostrar próxima pergunta se atual respondida e não for lesão "sim"
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

// Submit - mantém a lógica original da ficha
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
fichaCards.innerHTML = ""; // Limpa conteúdo anterior

ficha.forEach((dia, index) => {
  const card = document.createElement("div");
  card.classList.add("ficha-card");
  card.innerHTML = `<h3>Dia ${index + 1}</h3>`;
  
  const ul = document.createElement("ul");
  dia.forEach(exercicio => {
    const li = document.createElement("li");
    li.textContent = exercicio;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      mostrarDescricaoExercicio(exercicio);
    });
    ul.appendChild(li);
  });

  card.appendChild(ul);
  fichaCards.appendChild(card);
});

function mostrarDescricaoExercicio(exercicio) {
  const descricao = descricoesExercicios[exercicio] || "Descrição não disponível para este exercício.";
  
  // Criar o pop-up básico
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#fff";
  popup.style.border = "2px solid #000";
  popup.style.padding = "20px";
  popup.style.zIndex = 1000;
  popup.style.maxWidth = "300px";
  popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  
  popup.innerHTML = `
    <h3>${exercicio}</h3>
    <p>${descricao}</p>
    <button id="fecharPopup">Fechar</button>
  `;

  document.body.appendChild(popup);

  document.getElementById("fecharPopup").addEventListener("click", () => {
    popup.remove();
  });
}

const popup = document.getElementById("popupDescricao");
const descricaoTexto = document.getElementById("descricaoTexto");
const fecharPopup = document.getElementById("fecharPopup");

function mostrarDescricaoExercicio(exercicio) {
  const descricao = descricoesExercicios[exercicio] || "Descrição não disponível.";
  descricaoTexto.textContent = descricao;
  
  // Adiciona classe para mostrar o pop-up com transição
  popup.classList.add("show");
}

// Fecha o pop-up com transição
fecharPopup.addEventListener("click", () => {
  popup.classList.remove("show");
});

// Fecha o pop-up ao clicar fora do conteúdo
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.classList.remove("show");
  }
});


  resultadoDiv.innerHTML = html;
});
