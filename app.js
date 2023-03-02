const fs = require('fs');

// Função para ler um arquivo JSON
function lerArquivo(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}

// Função para corrigir os nomes de marca e veículo
function corrigirNome(item) {
  const replacements = [
    { from: 'æ', to: 'a' },
    { from: 'ø', to: 'o' },
  ];
  if (item['nome']) {
    replacements.forEach((replacement) => {
      item['nome'] = item['nome'].replace(new RegExp(replacement.from, 'g'), replacement.to);
    });
  }
  return item;
}


// Função para corrigir o tipo de dado de vendas
function corrigirVendas(item) {
  if (item.vendas) {
    item.vendas = parseInt(item.vendas);
  }
  return item;
}

// Função para corrigir todo o banco de dados
function fixDatabase(data) {
  return data.map((item) => corrigirVendas(corrigirNome(item)));
}

// Função para exportar um arquivo JSON
function exportarJSON(data, filePath) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data);
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Exemplo de uso das funções
async function example() {
  // Ler o arquivo JSON
  const data = await lerArquivo('broken_database_1.json');

  // Corrigir o banco de dados
  const fixedData = fixDatabase(data);

  // Exportar o arquivo JSON corrigido
  await exportarJSON(fixedData, 'banco_corrigido_1.json');
}

example();
