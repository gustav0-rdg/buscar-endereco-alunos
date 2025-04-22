const btnPesquisarCEP = document.getElementById('consulta');
const btnNovaConsulta = document.querySelector('#novaConsulta');
const form = document.getElementById('consultaForm')

// Adiciona o evento no submit do formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o envio do formulário

    resultContainer = document.getElementById('result');
    const estado = document.getElementById('uf').value;
    const cidade = document.getElementById('cidade').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim();
    resultContainer.innerHTML = "";
    if (estado === 'SEXO'){
        await Swal.fire({
            icon: 'error',
            title: 'Estado inválido', 
            text: 'selecione um estado válido',
            confirmButtonColor: '#117000'
        });
        return;
    }
    if (cidade.length < 3 || logradouro.length <3){
        await Swal.fire({
            icon: 'question',
            title: 'Digitos insuficientes',
            text: 'O minimo de caracteres para essa pesquisa é 3',
            confirmButtonColor: '#117000'
        });
    }
    try {
        Swal.fire({
            title: 'Consultando endereço...',
            allowOutsideClick: false,
            timer: 5,
            didOpen: () =>{
                Swal.showLoading();
            }
        })

        const cidadeEncoded = encodeURIComponent(cidade);
        const logradouroEncoded = encodeURIComponent(logradouro);
        const url = `https://viacep.com.br/ws/${estado}/${cidadeEncoded}/${logradouroEncoded}/json/`;
        console.log(url);
        const data = await consultaViaCep(url);
        console.log(data);
        // Usa await para aguardar os dados da API
        Swal.close();
        
        // garante que a variavel existe e que ela é uma Array
        if (data && data.length > 0) {
            // exibirResultados(data); // Função opcional pra mostrar os dados na tela
            // console.log(data);
            const table = document.createElement('table');
            table.className = 'results__table';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Colunas da tabela
            const headers = ['CEP', 'Logradouro', 'Bairro']
            headers.forEach(headerText =>{
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Criar o corpo da tablea (tbody) para os dados

            const tbody = document.createElement('tbody');

            // Iterar sobre os endereços retornados pela api
            
            data.forEach(item =>{
                // Criar nova linha para cada endereço
                const row = document.createElement('tr');

                // Criar e preencher a celula do CEP
                const cellCep = document.createElement('td');
                cellCep.textContent = item.cep;
                row.appendChild(cellCep);

                const cellLog = document.createElement('td');
                cellLog.textContent = item.logradouro;
                row.appendChild(cellLog);

                const cellBairro = document.createElement('td');
                cellBairro.textContent = item.bairro;
                row.appendChild(cellBairro);

                tbody.appendChild(row);
            })

            table.appendChild(tbody);
            resultContainer.appendChild(table);

        } else {
            await Swal.fire('Nenhum resultado encontrado','Não foram encontrados endereços com os critérios informados','info'); // Às vezes ViaCEP retorna 1 objeto, não array
        }
    }
    
    catch(error){
        console.log(error);
        await Swal.fire({
            title: 'Erro na consulta',
            text: 'Ocorreu um erro ao consultar o endereço. Tente novamente!',
            icon: 'error'
        })
    }
});

btnNovaConsulta.addEventListener('click', async ()=>{
    form.reset();
    resultContainer = document.getElementById('result').innerHTML = '';
    await Swal.fire({
        icon: 'success',
        title: 'Formulário limpo',
        text: 'Você pode realizar uma nova consulta.',
        confirmButtonColor: '#117000',
        timer: 4000,
        timerProgressBar: true
    })
})

async function consultaViaCep(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Erro na requisição '+ response.status);
        }
        return await response.json();
    }
    catch(error){
        throw error;
    }    
}

// // Função opcional para exibir dados no HTML
// function exibirResultados(dadosArray) {
//     const container = document.getElementById('result');
//     container.innerHTML = ''; // Limpa o conteúdo anterior

//     // Cabeçalho da tabela
//     let tabelaHTML = ` 
//         <table class="results__table">
//             <thead>
//                 <tr>
//                     <th>CEP</th>
//                     <th>Logradouro</th>
//                     <th>Bairro</th>
//                     <th>Cidade</th>
//                     <th>Estado</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     // Linhas da tabela com os dados
//     // para cada item na array, cria uma linha da tabela
//     dadosArray.forEach(dado => {
//         tabelaHTML += `
//             <tr>
//                 <td>${dado.cep || '-'}</td>
//                 <td>${dado.logradouro || '-'}</td>
//                 <td>${dado.bairro || '-'}</td>
//                 <td>${dado.localidade || '-'}</td>
//                 <td>${dado.uf || '-'}</td>
//             </tr>
//         `;
//     });

//     tabelaHTML += `
//             </tbody>
//         </table>
//     `;

//     container.innerHTML = tabelaHTML;
// }