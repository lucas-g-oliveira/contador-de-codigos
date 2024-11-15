// Função para carregar os dados do localStorage
function loadEANs() {
  const eans = JSON.parse(localStorage.getItem('eans')) || {};
  return eans;
}

// Função para salvar os dados no localStorage
function saveEANs(eans) {
  localStorage.setItem('eans', JSON.stringify(eans));
}

// Atualiza a lista de EANs exibida
function updateEANList() {
  const eans = loadEANs();
  const eanList = document.getElementById('eanList');
  const totalCount = document.getElementById('totalCount');
  
  eanList.innerHTML = '';  // Limpa a lista
  let total = 0;
  
  const sortedEans = Object.entries(eans).sort((a, b) => b[1] - a[1]);

  sortedEans.forEach(([ean, count]) => {
    total += count;
    
    const li = document.createElement('li');
    li.innerHTML = `${ean} <span>${count}</span>`;
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = () => openEditPopup(ean, count);
    
    li.appendChild(editButton);
    eanList.appendChild(li);
  });

  totalCount.textContent = total;
  toggleButtons(Object.keys(eans).length === 0);
}

// Função para adicionar um EAN
function addEAN(ean) {
  if (!isValidEAN(ean)) {
    alert('Por favor, insira um código EAN válido (somente números).');
    return;
  }

  const eans = loadEANs();
  eans[ean] = eans[ean] ? eans[ean] + 1 : 1;
  
  saveEANs(eans);
  updateEANList();
}

// Função para validar o EAN
// Alterado para aceitar apenas números (sem validação de quantidade de dígitos)
function isValidEAN(ean) {
  return /^[0-9]+$/.test(ean);  // Verifica se o EAN contém apenas números
}

// Função para abrir o popup de edição
function openEditPopup(ean, currentCount) {
  const editPopup = document.getElementById('editPopup');
  const editQuantity = document.getElementById('editQuantity');
  
  editQuantity.value = currentCount;
  editPopup.style.display = 'flex';
  
  document.getElementById('increaseQuantity').onclick = () => {
    editQuantity.value = parseInt(editQuantity.value) + 1;
  };

  document.getElementById('decreaseQuantity').onclick = () => {
    const newCount = parseInt(editQuantity.value) - 1;
    if (newCount >= 1) {
      editQuantity.value = newCount;
    }
  };

  document.getElementById('saveQuantity').onclick = () => {
    updateQuantity(ean, editQuantity.value);
    closeEditPopup();
  };

  document.getElementById('cancelEdit').onclick = closeEditPopup;
}

// Função para atualizar a quantidade do EAN
function updateQuantity(ean, newCount) {
  const eans = loadEANs();
  eans[ean] = parseInt(newCount);
  saveEANs(eans);
  updateEANList();
}

// Função para fechar o popup
function closeEditPopup() {
  document.getElementById('editPopup').style.display = 'none';
}

// Função para ativar/desativar os botões
function toggleButtons(isListEmpty) {
  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(button => {
    button.disabled = isListEmpty;
  });
}

// Função para exportar a lista para .txt
function exportToTXT() {
  const eans = loadEANs();
  let content = '';
  
  for (const [ean, count] of Object.entries(eans)) {
    content += `${ean}; ${count}\n`;
  }
  
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ean_list.txt';
  link.click();
}

// Função para copiar a lista para a área de transferência
function copyToClipboard() {
  const eans = loadEANs();
  let textToCopy = '';
  
  for (const [ean, count] of Object.entries(eans)) {
    textToCopy += `${ean}; ${count}\n`;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Lista copiada para a área de transferência!');
  }, () => {
    alert('Falha ao copiar a lista.');
  });
}

// Função para limpar a lista
function clearList() {
  if (confirm('Tem certeza de que deseja limpar a lista?')) {
    localStorage.removeItem('eans');
    updateEANList();
  }
}

/*
// Função para gerar a impressão de códigos de barras
// Função para gerar a impressão de códigos de barras
function generateBarcodePrint() {
  const eans = loadEANs();
  const barcodeList = document.getElementById('barcodeList');
  barcodeList.innerHTML = ''; // Limpa qualquer código de barras existente
  
  // Gera o código de barras para cada EAN
  for (const [ean, count] of Object.entries(eans)) {
    const barcodeContainer = document.createElement('div');
    barcodeContainer.classList.add('barcode-container');

    const barcodeElement = document.createElement('div');
    barcodeElement.classList.add('barcode');
    
    // Usa a biblioteca JsBarcode para gerar o código de barras
    JsBarcode(barcodeElement, ean, {
      format: 'EAN13',
      displayValue: true,
      fontSize: 16,
      margin: 10
    });
    
    const label = document.createElement('p');
    label.textContent = `${ean} - ${count}`;
    
    barcodeContainer.appendChild(barcodeElement);
    barcodeContainer.appendChild(label);
    barcodeList.appendChild(barcodeContainer);
  }

  // Exibe a seção de impressão
  document.getElementById('printSection').style.display = 'flex';

  // Inicia a impressão após gerar os códigos de barras
  window.print();

  // Fecha a seção de impressão automaticamente após imprimir
  setTimeout(() => {
    closePrintSection();
  }, 1000);
}

// Função para fechar a seção de impressão
function closePrintSection() {
  document.getElementById('printSection').style.display = 'none';
}
 */

// Adiciona os eventos para os botões
document.addEventListener('DOMContentLoaded', () => {
  updateEANList();
  document.getElementById('eanInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const ean = e.target.value.trim();
      if (ean) {
        addEAN(ean);
        e.target.value = '';
      }
    }
  });

  document.getElementById('exportBtn').addEventListener('click', exportToTXT);
  document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
  document.getElementById('clearBtn').addEventListener('click', clearList);
  document.getElementById('printBtn').addEventListener('click', generateBarcodePrint);
});
