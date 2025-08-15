/*Código disponibilizado pelo desafio do curso:*/
let price = 19.5;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

/*Código desenvolvido para a solução:*/
const priceElement = document.getElementById("price");
const userInput = document.getElementById("cash");
const botaoCompra = document.getElementById("purchase-btn");
const trocoParaOCliente = document.getElementById("change-due");
const botaoDarkMode = document.getElementById("dark-mode-btn");

priceElement.innerText = `$${price}`;

const checarInput = () => {
    const floatInput = parseFloat(userInput.value)

    if (floatInput < price)
    {
        alert("Customer does not have enough money to purchase the item");
        return;
    }
    else if (floatInput === price)
    {
        trocoParaOCliente.innerHTML = "<p>No change due - customer paid with exact cash</p>";
        return;
    }
    else
    {
        calcularTroco(floatInput, price);
    }
};

const calcularTroco = (dinheiro, preço) => {
    let troco = (dinheiro - preço) * 100;

    //Inverter o CID e transformar todos os valores em centavos
    const cidReverso = [...cid].reverse().map(([nomeDenominação, quantidade]) => [
        nomeDenominação, 
        Math.round(quantidade * 100)
    ]);

    const denominações = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1]; //Todos os valores já convertidos em centavos
    const resultado = {status: "OPEN", trocoSeparado: []};
    const totalDoCID = cidReverso.reduce((totalPrev, [_, quantidade]) => totalPrev + quantidade, 0);

    //checar se totalDoCID é menor que o troco
    if (totalDoCID < troco)
    {
        trocoParaOCliente.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
        return;
    }

    //checar se totalDoCID é exatamente igual ao troco
    if (totalDoCID === troco)
    {
        resultado.status = "CLOSED";

        //Retorna o cid original
        const trocoOriginal = [...cid].filter(([_, quantidade]) => quantidade > 0); //Retorna apenas as denominações com dinheiro
        gerarResultados(resultado.status, trocoOriginal);
        atualizarCID(trocoOriginal); // Limpa o caixa
        return;
    }

    //Lógica para calcular e retornar troco:
    for (let i = 0; i <= cidReverso.length; i++) {
        if (troco >= denominações[i] && troco > 0)
        {
            const [nomeDenominação, quantidade] = cidReverso[i];
            const trocoPossivel = Math.min(quantidade, troco);
            const contagem = Math.floor(trocoPossivel / denominações[i]);
            const quantidadeParaTroco = contagem * denominações[i];
            troco -= quantidadeParaTroco;

            if (contagem > 0)
            {
                resultado.trocoSeparado.push([nomeDenominação, quantidadeParaTroco / 100]);
            }
        }
    }

    if (troco > 0)
    {
        trocoParaOCliente.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
        return;
    }

    console.log(totalDoCID);
    gerarResultados(resultado.status, resultado.trocoSeparado);
    atualizarCID(resultado.trocoSeparado);
};

const gerarResultados = (status, troco) => {
    trocoParaOCliente.innerHTML = `<p>Status: ${status}</p>`;

    for (let i = 0; i < troco.length; i++)
    {
        troco[i][0] = formatarNome(troco[i][0]);
    }

    trocoParaOCliente.innerHTML += troco.map(
        ([nomeDenominação, quantidade]) => `<p>${nomeDenominação}: $${quantidade}</p>`
    ).join('');
};

const atualizarCID = trocoArray => {
    //Atualizar CID apenas quando houver algum troco
    if (trocoArray)
    {
        trocoArray.forEach(([denominaçãoTroco, quantidadeTroco]) => {
            const arraySelecionado = cid.find(
                ([nomeDenominação]) => nomeDenominação === denominaçãoTroco.toUpperCase()
            );
            arraySelecionado[1] = (Math.round(arraySelecionado[1] * 100) - Math.round(quantidadeTroco * 100)) / 100;
        });

        mostrarDinheiroNoCaixa(cid);
    }
};

//Função para atualizar o HTML do dinheiro do caixa:
function mostrarDinheiroNoCaixa(cidArray) {
    const container = document.getElementById("cash-in-register");
    container.innerHTML = "";

    cidArray.forEach(([denominacao, quantidade]) => {
        const nomeFormatado = formatarNome(denominacao);
        const p = document.createElement("p");
        p.textContent = `${nomeFormatado}: $${quantidade.toFixed(2)}`;
        container.appendChild(p);
    });
}

//Função para formatar as denominações
function formatarNome(nome) {
    return nome.toLowerCase().split(" ").map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join(" ");
}

botaoCompra.addEventListener("click", checarInput);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
    {
        checarInput();
    }
});

botaoDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});