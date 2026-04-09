const API = "http://localhost:3000";
let todosChamados = [];

function selecionarMarca(marca) {
  
    document.getElementById("marcaInversor").value = marca;
    
   
    const botoes = document.querySelectorAll('.btn-marca');
    
    botoes.forEach(btn => {
      
        if (btn.innerText.trim().toLowerCase() === marca.toLowerCase()) {
            btn.classList.add('ativo');
        } else {
            btn.classList.remove('ativo');
        }
    });
}


function formatarTelefone(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 10) {
        input.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 5) {
        input.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else if (v.length > 2) {
        input.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else {
        input.value = v;
    }
}


async function salvarChamado() {
    const id = document.getElementById("idChamado").value;
    const dados = {
        cliente: document.getElementById("cliente").value,
        telefone: document.getElementById("telefone").value,
        problema: document.getElementById("problema").value,
        cidade: document.getElementById("cidade").value,
        marcaInversor: document.getElementById("marcaInversor").value
    };

    if (!dados.cliente || !dados.telefone) return alert("Preencha nome e telefone!");

    const url = id ? `${API}/chamado/${id}` : `${API}/chamado`;
    const metodo = id ? "PUT" : "POST";

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    limparFormulario();
    carregarChamados();
}


async function carregarChamados() {
    const res = await fetch(API + "/chamados");
    todosChamados = await res.json();
    filtrarChamados();
}


function filtrarChamados() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const filtroCidade = document.getElementById("filtroCidade").value;
    const filtroMarca = document.getElementById("filtroMarca").value;
    const ordem = document.getElementById("ordenar").value;

    let filtrados = todosChamados.filter(c => {
        const bateNome = c.cliente.toLowerCase().includes(termo);
        const bateCidade = filtroCidade === "" || c.cidade === filtroCidade;
        const bateMarca = filtroMarca === "" || c.marcaInversor === filtroMarca;
        return bateNome && bateCidade && bateMarca;
    });

    if (ordem === "nome") {
        filtrados.sort((a, b) => a.cliente.localeCompare(b.cliente));
    } else {
        filtrados.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    renderizar(filtrados);
}

function renderizar(listaChamados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    listaChamados.forEach(c => {
        const foneLimpo = c.telefone.replace(/\D/g, "");
        const linkWhats = `https://wa.me/55${foneLimpo}`;

        lista.innerHTML += `
            <div class="card">
                <div class="info">
                    <b>${c.cliente}</b> 
                    <a href="${linkWhats}" target="_blank" style="color: #25d366; text-decoration: none; margin-left:10px;">📱 WhatsApp</a><br>
                    <small>${c.telefone} | ${c.cidade}</small><br>
                    <strong>Problema:</strong> ${c.problema}<br>
                    <span class="tag-marca">${c.marcaInversor || "Não informado"}</span>
                </div>
                <div class="acoes">
                    <button class="btn-editar" onclick="prepararEdicao('${c._id}')">Editar</button>
                    <button class="btn-resolvido" onclick="deletar('${c._id}')">Resolvido</button>
                </div>
            </div>
        `;
    });
}


function prepararEdicao(id) {
    const c = todosChamados.find(item => item._id === id);
    
    document.getElementById("idChamado").value = c._id;
    document.getElementById("cliente").value = c.cliente;
    document.getElementById("telefone").value = c.telefone;
    document.getElementById("problema").value = c.problema;
    document.getElementById("cidade").value = c.cidade;
    
    
    selecionarMarca(c.marcaInversor || "");

    document.getElementById("btnSalvar").innerText = "Atualizar Chamado";
    document.getElementById("btnCancelar").style.display = "block";
    window.scrollTo(0, 0);
}


function limparFormulario() {
    document.getElementById("idChamado").value = "";
    document.getElementById("cliente").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("marcaInversor").value = "";
    
    
    document.querySelectorAll('.btn-marca').forEach(btn => btn.classList.remove('ativo'));

    document.getElementById("btnSalvar").innerText = "Criar Chamado";
    document.getElementById("btnCancelar").style.display = "none";
}


async function deletar(id) {
    if (confirm("Deseja marcar como resolvido?")) {
        await fetch(API + "/chamado/" + id, { method: "DELETE" });
        carregarChamados();
    }
}


carregarChamados();