# 📋 Gerador de Ordem de Serviço (OS)

Uma solução web leve, rápida e intuitiva para criação e emissão de Ordens de Serviço em PDF diretamente pelo navegador, sem necessidade de instalação ou infraestrutura de servidor.

---

## ✨ Funcionalidades

* **Execução 100% Local:** Funciona diretamente no navegador, sem necessidade de backend, banco de dados ou configurações complexas.
* **Personalização da Marca:** Permite enviar o logotipo da sua empresa diretamente pelo formulário para estampar o documento.
* **Salvamento Automático:** Armazena os dados preenchidos no navegador (`LocalStorage`), agilizando o preenchimento de futuras ordens.
* **Exportação Instantânea em PDF:** Gera documentos prontos para impressão ou envio digital com apenas um clique.

---

## 🚀 Como usar

1. **Baixe e extraia** os arquivos do pacote `.zip` em uma pasta de sua preferência.
2. Abra o arquivo **`index.html`** em qualquer navegador moderno (Google Chrome, Microsoft Edge ou Mozilla Firefox).
3. Preencha os campos com as informações da **empresa**, **cliente**, **descrição do serviço** e **valores**.
4. *(Opcional)* Faça o upload da **logo da sua empresa** no campo indicado.
5. Clique no botão **Gerar PDF** para baixar ou imprimir sua Ordem de Serviço.

---

## 📁 Estrutura de Arquivos

```text
├── index.html          # Interface principal da aplicação
└── assets/             # Imagens do sistema e logotipo padrão
```

---

## ⚠️ Observações Importantes

* **Conexão com a Internet:** Embora a aplicação rode localmente, a exportação em PDF utiliza a biblioteca `html2pdf.js` via CDN. É necessário estar conectado à internet para que o download da biblioteca funcione.
* **Privacidade e Armazenamento:** Todos os dados salvos ficam armazenados exclusivamente no navegador e no dispositivo onde foram preenchidos. Nenhuma informação é enviada para servidores externos.
* **Personalização de Assets:** Caso deseje alterar a logo padrão de forma definitiva, basta substituir os arquivos dentro da pasta `assets/`.

---

Desenvolvido por RSDEV MOTTA 
