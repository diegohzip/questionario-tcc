document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const genero = document.getElementById("genero").value;
  const experiencia = document.getElementById("experiencia").value;
  const condicao = document.getElementById("condicao").value;
  const lesao = document.getElementById("lesao").value;
  const dias = document.getElementById("dias").value;
  const academia = document.getElementById("academia").value;
  const resultadoDiv = document.getElementById("resultado");

  // Se houver lesão, não monta a ficha
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
  ficha.forEach((dia, index) => {
    html += `<h3>Dia ${index + 1}</h3><ul>`;
    dia.forEach(exercicio => {
      html += `<li>${exercicio}</li>`;
    });
    html += `</ul>`;
  });

  resultadoDiv.innerHTML = html;
});
