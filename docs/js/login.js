document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
  
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
  
    const dados = await res.json();
    
    if (dados.sucesso) {
      sessionStorage.setItem("usuario", JSON.stringify(dados.usuario));
      window.location.href = "agendamentos.html";
    } else {
      document.getElementById("erro").textContent = dados.mensagem;
    }
  });
  