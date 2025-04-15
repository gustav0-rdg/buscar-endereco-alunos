const btnPesquisarCEP = document.getElementById('consulta');
const form = document.getElementById('consultaForm')

// Adiciona o evento no submit do formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o envio do formulário

    const estado = document.getElementById('uf').value;
    const cidade = document.getElementById('cidade').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim();
    if (uf === 'SEXO'){
        await Swal.fire({
            icon: 'error',
            title: 'Faltam caracteres puto', 
            text: 'Adicione mais caracteres seu puto',
            confirmButtonColor: '#117000'
        });
        return;
    }
    if (cidade.length < 3 || logradouro.length <3){
        await Swal.fire({
            icon: 'question',
            title: 'mas e aí?',
            text: 'vc ta endauldi agrummgit',
            confirmButtonColor: '#117000'
        });
    }
    try {
        Swal.fire({
            title: 'Consultando endereço...',
            allowOutsieClick: false,
            didOpen: () =>{
                Swal.showLoading();
            }
        })

        const url = `https://viacep.com.br/ws/${estado}/${cidade}/${logradouro}/json/`;
        const data = await consultaViaCep(url);
        // Usa await para aguardar os dados da API
        Swal.close();
        // garante que a variavel existe e que ela é uma Array
        if (dados && Array.isArray(dados) || data && data.length > 0) {
            exibirResultados(dados); // Função opcional pra mostrar os dados na tela
            const table = document.createElement('table');
            table.className = 'results__table';
            
        } else if (dados) {
            exibirResultados([dados]); // Às vezes ViaCEP retorna 1 objeto, não array
        }
    }
    
    catch{
        Swal.fire({
            title: 'Deu erro pivete',
            text: 'Conserte aí negão vá',
            icon: 'error'
        })
    }
});

// Função opcional para exibir dados no HTML
function exibirResultados(dadosArray) {
    const container = document.getElementById('result');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    // Cabeçalho da tabela
    let tabelaHTML = ` 
        <table class="results__table">
            <thead>
                <tr>
                    <th>CEP</th>
                    <th>Logradouro</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Linhas da tabela com os dados
    // para cada item na array, cria uma linha da tabela
    dadosArray.forEach(dado => {
        tabelaHTML += `
            <tr>
                <td>${dado.cep || '-'}</td>
                <td>${dado.logradouro || '-'}</td>
                <td>${dado.bairro || '-'}</td>
                <td>${dado.localidade || '-'}</td>
                <td>${dado.uf || '-'}</td>
            </tr>
        `;
    });

    tabelaHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tabelaHTML;
}