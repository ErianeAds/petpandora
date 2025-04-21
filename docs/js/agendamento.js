const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = "login.html";
}

const lista = document.getElementById("listaAgendamentos");

document.getElementById("formAgendar").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const pet = document.getElementById("pet").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;

  await fetch("http://localhost:3000/api/agendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuario.id, pet, servico, data })
  });

  e.target.reset();
  carregarAgendamentos();
});

async function carregarAgendamentos() {
  lista.innerHTML = '';
  const res = await fetch(`http://localhost:3000/api/listar_agendamentos?usuario_id=${usuario.id}`);
  const dados = await res.json();

  dados.forEach(ag => {
    const item = document.createElement("li");
    item.innerHTML = `${ag.pet} - ${ag.servico} em ${ag.data} 
      <button onclick="deletarAgendamento(${ag.id})">Excluir</button>`;
    lista.appendChild(item);
  });
}

async function deletarAgendamento(id) {
  await fetch("http://localhost:3000/api/deletar_agendamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  carregarAgendamentos();
}

carregarAgendamentos();
