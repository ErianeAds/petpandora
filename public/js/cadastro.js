document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch("/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha })
  });

  const dados = await res.json();
  document.getElementById("mensagem").textContent = dados.mensagem;

  if (dados.sucesso) {
    setTimeout(() => window.location.href = "login.html", 2000);
  }
});
