// Função que atualiza o horário na tela

function atualizarHorario() {
    // Pega o elemento HTML com o ID "horario"
    const elemento = document.querySelector(".header__datetime");
    const agora = new Date();
    const horarioFormatado = agora.toLocaleTimeString(); // Formato HH:MM:SS
  
    elemento.textContent = `Horário atual: ${horarioFormatado}`;
  }
  
  // Atualiza o horário a cada 1000 milissegundos (1 segundo)
  setInterval(atualizarHorario, 1000);
  
  // Chama uma vez para exibir o horário imediatamente ao carregar
  atualizarHorario();