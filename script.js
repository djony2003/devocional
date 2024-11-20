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

            const devocional = {
                nome,
                data,
                hora: new Date().toLocaleTimeString(),
                textos: textos.split(", ").map(texto => texto.trim()),
                reflexao
            };

            const nomeArquivo = `${nome}_${data.replace(/-/g, '_')}_${Date.now()}.json`;
            const blob = new Blob([JSON.stringify(devocional, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            reflexoesSalvas.push({ nome, data, url, nomeArquivo });
            atualizarListaReflexoes();

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
                const conteudo = JSON.parse(e.target.result);
                carregarDevocional(conteudo);
            };
            leitor.readAsText(arquivo);
        }

        function carregarDevocional(devocional) {
            document.getElementById("nome").value = devocional.nome || "";
            document.getElementById("data").value = devocional.data || "";
            document.getElementById("textosSelecionados").value = devocional.textos.join(", ") || "";
            document.getElementById("reflexao").value = devocional.reflexao || "";

            /*alert("Devocional carregado com sucesso!");*/
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

            // Configurar o idioma para português brasileiro
            recognition.lang = 'pt-BR';

            recognition.onspeechend = function () {
                recognition.start(); // Reinicia o reconhecimento
            };

            recognition.continuous = true;

            let gravando = false; // Variável de controle


            microfoneBtn.onclick = function () {
                if (!gravando) {
                    recognition.start();
                    gravando = true;
                    // Corrigido: Usando aspas duplas dentro da url()
                    microfoneBtn.style.backgroundImage = "url('Mic2.png')";
                } else {
                    recognition.stop();
                    gravando = false;
                    // Corrigido: Usando aspas duplas dentro da url()
                    microfoneBtn.style.backgroundImage = "url('Mic_PT_BC.png')";
                }
            };

            recognition.onresult = function (event) {
                for (let i = event.resultIndex; i < event.results.length; i++) { // Percorre todos os resultados
                    if (event.results[i].isFinal) {
                        const resultado = event.results[i][0].transcript; // Declara a variável dentro do loop
                        reflexaoArea.value += resultado + " "; // Adiciona o resultado à área de texto
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