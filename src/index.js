import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function (requisicao, resposta) {
  resposta.status(200);
  resposta.send("Bem vindo a minha primeira API!");
})

const usuarios = [{nome: "teste",
email: "teste@teste.com",
senha: "12345",
}];
let identificadorUnicoUsuario = 0;

const recados = [{titulo: "teste1",
descricao: "Boa noite growdever",
identificador: 0,
},
{titulo: "teste2",
descricao: "Boa tarde growdever",
identificador: 1,
},
{titulo: "teste3",
descricao: "Bom dia growdever",
identificador: 2,
},
{titulo: "teste4",
descricao: "Boa noite growdever",
identificador: 3,
},
{titulo: "teste5",
descricao: "Boa tarde growdever",
identificador:4,
},
{titulo: "teste6",
descricao: "Bom dia growdever",
identificador: 5,
},
{titulo: "teste7",
descricao: "Boa noite growdever",
identificador: 6,
},
{titulo: "teste8",
descricao: "Boa tarde growdever",
identificador: 7,
},
{titulo: "teste9",
descricao: "Bom dia growdever",
identificador: 8,
}];
let identificadorUnicoRecado = 0;


app.post("/usuarios", function (requisicao, resposta) {


  const bodyInvalido =
    !requisicao.body.nome || !requisicao.body.senha || !requisicao.body.email;
  
  const existeEmail = usuarios.some(function (usuario) {
    return usuario.email === requisicao.body.email;
  });
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else if (existeEmail) {
    resposta.status(400);
    resposta.send("Email já cadastrado");
  } else {
   
    const novoUsuario = {
      nome: requisicao.body.nome,
      senha: requisicao.body.senha,
      email: requisicao.body.email,
    };
    novoUsuario.identificador = identificadorUnicoUsuario;
    identificadorUnicoUsuario++;
    usuarios.push(novoUsuario);
    resposta.json({
      mensagem: "Usuário criado com sucesso",
      usuario: novoUsuario,
    });
  }
});

app.post("/usuarios/login", function (requisicao, resposta) {
  const email = requisicao.body.email;
  const senha = requisicao.body.senha;

  const usuarioEncontrado = usuarios.find(function (usuario) {
    return usuario.email === email && usuario.senha === senha;
  });
  if (usuarioEncontrado) {
    resposta.json({
      mensagem: "Usuário logado com sucesso",
      usuario: usuarioEncontrado,
    });
  } else {
    resposta.status(401);
    resposta.send("Email ou senha inválidos");
  }
});

app.post("/recados", function (requisicao, resposta) {
  const bodyInvalido = !requisicao.body.titulo || !requisicao.body.descricao;
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else {
    const novoRecado = {
      titulo: requisicao.body.titulo,
      descricao: requisicao.body.descricao,
    };
    novoRecado.identificador = identificadorUnicoRecado;
    identificadorUnicoRecado++;
    recados.push(novoRecado);
    resposta.json({
      mensagem: "Recado criado com sucesso",
      recado: novoRecado,
    });
  }
});

app.get("/recados", function (requisicao, resposta) {

  const page = requisicao.query.page; 
  if (page < 1) {
    return resposta.status(400).send("Página inválida") 
  }
 
  const recadosPorPagina = 5;
  const maxPage =  Math.ceil(recados.length/recadosPorPagina);
  if (page > maxPage) {
    return resposta.status(400).send("Página inválida"); 
  }
  const messages = recados.slice((page-1)*recadosPorPagina, page*recadosPorPagina);
  
  
  resposta.json({
    quantidade: recados.length,
    recados: messages,
  });
});

app.get("/recados/:id", function (requisicao, resposta) {
  const id = parseInt(requisicao.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (recadoEncontrado) {
    resposta.json({
      mensagem: "Recado encontrado",
      recado: recadoEncontrado,
    });
  } else {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  }

});


app.put("/recados/:id", function (requisicao, resposta) {
  const bodyInvalido = !requisicao.body.titulo || !requisicao.body.descricao;
  // atualizar um recado
  const id = parseInt(requisicao.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else if (!recadoEncontrado) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recadoEncontrado.titulo = requisicao.body.titulo;
    recadoEncontrado.descricao = requisicao.body.descricao;
    resposta.json({
      mensagem: "Recado atualizado com sucesso",
      recado: recadoEncontrado,
    });
  }
});

app.delete("/recados/:id", function (requisicao, resposta) {
  const id = parseInt(requisicao.params.id);
  const indice = recados.findIndex(function (recado) {
    return recado.identificador === id;
  });
  if (indice === -1) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recados.splice(indice, 1);
    resposta.json({
      mensagem: "Recado removido com sucesso",
    });
  }
});

app.listen(3000, function () {
  console.log("servidor rodando na porta 3000: url https://api-crud-de-recados.onrender.com");
});
