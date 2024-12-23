const reflexoesSalvas = [];

        function adicionarTexto() {
            const referencia = document.getElementById("referencia").value.trim();
            const textosArea = document.getElementById("textosSelecionados");

            if (!referencia) {
                alert("Insira o texto bíblico (livro, capítulo e versículo)!");
                return;
            }

            if (textosArea.value) {
                textosArea.value += `, ${referencia}`;
            } else {
                textosArea.value = referencia;
            }

            document.getElementById("referencia").value = "";
        }

        function salvarDevocional() {
            const nome = document.getElementById("nome").value.trim();
            const data = document.getElementById("data").value;
            const textos = document.getElementById("textosSelecionados").value;
            const reflexao = document.getElementById("reflexao").value;
          
            if (!nome || !data || !textos || !reflexao) {
              alert("Preencha todos os campos antes de salvar!");
              return;
            }
          
            // Formatando os dados para o arquivo TXT (com separadores)
            const conteudoTXT = `Nome: ${nome}
          Data: ${data}
          Hora: ${new Date().toLocaleTimeString()}
          Textos: ${textos}
          Reflexão: ${reflexao}`;
          
            // Criando o Blob com tipo 'text/plain'
            const nomeArquivo = `${nome}_${data.replace(/-/g, '_')}_${new Date().toLocaleTimeString().replace(/:/g, '_')}.txt`;
            const blob = new Blob([conteudoTXT], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
          
            reflexoesSalvas.push({ nome, data, url, nomeArquivo });
            /*atualizarListaReflexoes();*/
          
            const a = document.createElement("a");
            a.href = url;
            a.download = nomeArquivo;
            a.click();
            URL.revokeObjectURL(url);
          
            alert("Devocional salvo com sucesso!");
          }
         
          
          




        function carregarArquivo() {
            document.getElementById("carregarDevocional").click();
        }

        function lerArquivo(event) {
            const arquivo = event.target.files[0];
            if (!arquivo) {
              alert("Nenhum arquivo selecionado!");
              return;
            }
          
            const leitor = new FileReader();
            leitor.onload = function (e) {
              const conteudo = e.target.result;
              carregarDevocional(conteudo); 
            };
            leitor.readAsText(arquivo);
          }

          function carregarDevocional(conteudoTXT) {
            // Dividir o texto em linhas
            const linhas = conteudoTXT.split('\n');
            
            // Extrair os valores de cada linha
            const nome = linhas[0].split(': ')[1];
            const data = linhas[1].split(': ')[1];
            const textos = linhas[3].split(': ')[1];
            
            // A reflexão pode conter várias linhas; juntá-las
            const reflexao = linhas.slice(4).join('\n').replace('Reflexão: ', '').trim();
            
            // Preencher os campos do formulário
            document.getElementById("nome").value = nome;
            document.getElementById("data").value = data;
            document.getElementById("textosSelecionados").value = textos;
            document.getElementById("reflexao").value = reflexao;
        }

        function atualizarListaReflexoes() {
            const listaReflexoes = document.getElementById("listaReflexoes");
            listaReflexoes.innerHTML = "";

            reflexoesSalvas.forEach(reflexao => {
                const item = document.createElement("div");
                const link = document.createElement("a");
                link.href = reflexao.url;
                link.download = reflexao.nomeArquivo;
                link.textContent = `Baixar Devocional de ${reflexao.nome} (${reflexao.data})`;
                link.style.display = "block";
                link.style.margin = "5px 0";

                item.appendChild(link);
                listaReflexoes.appendChild(item);
            });
        }
        const microfoneBtn = document.getElementById('microfoneBtn');
        const reflexaoArea = document.getElementById('reflexao');


if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;

    let gravando = false;

    microfoneBtn.onclick = function () {
        if (!gravando) {
            recognition.start();
            gravando = true;
            microfoneBtn.style.backgroundImage = "url('img/Mic2.png')";
        } else {
            recognition.stop();
            gravando = false;
            microfoneBtn.style.backgroundImage = "url('img/Mic_PT_BC.png')";
        }
    };

    recognition.onresult = function (event) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                const resultado = event.results[i][0].transcript;
                reflexaoArea.value += resultado + " ";
            }
        }
    };
} else {
    alert('Seu navegador não suporta reconhecimento de fala.');
}

        recognition.onstart = function () {
            microfoneBtn.classList.add('gravando');
        };

        recognition.onend = function () {
            microfoneBtn.classList.remove('gravando');
        };
