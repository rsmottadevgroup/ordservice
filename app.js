const $=id=>document.getElementById(id);
const fields=['empresa','empresaDoc','empresaTel','empresaEmail','responsavel','empresaEndereco','cliente','clienteDoc','clienteTel','clienteEmail','clienteEndereco','numero','data','previsao','status','tipo','local','descricao','execucao','observacoes','maoObra','desconto','despesas','pagamento','aceite','assinEmpresa','assinCliente'];
let logoData='', itemCounter=0;
const money=n=>(Number(n)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const val=id=>$(id).value.trim();
const today=new Date(); $('data').value=today.toISOString().slice(0,10); $('numero').value='OS-'+String(Date.now()).slice(-6);
$('assinEmpresa').value='';
function addItem(desc='',qty=1,price=0){
 const tr=document.createElement('tr');tr.dataset.item='1';
 tr.innerHTML=`<td><input class="item-desc" placeholder="Material ou serviço" value="${escapeHtml(desc)}"></td><td><input class="item-qty" type="number" min="0" step="0.01" value="${qty}"></td><td><input class="item-price" type="number" min="0" step="0.01" value="${price}"></td><td class="item-total">R$ 0,00</td><td><button type="button" class="remove-item" title="Remover">×</button></td>`;
 $('itemsBody').appendChild(tr);tr.querySelectorAll('input').forEach(i=>i.addEventListener('input',update));tr.querySelector('.remove-item').onclick=()=>{tr.remove();update()};update();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function items(){return [...$('itemsBody').querySelectorAll('tr')].map(tr=>({desc:tr.querySelector('.item-desc').value,qty:+tr.querySelector('.item-qty').value||0,price:+tr.querySelector('.item-price').value||0,total:(+tr.querySelector('.item-qty').value||0)*(+tr.querySelector('.item-price').value||0)}))}
function update(){
 const it=items(),materials=it.reduce((s,x)=>s+x.total,0),labor=+$('maoObra').value||0,discount=+$('desconto').value||0,extra=+$('despesas').value||0,total=Math.max(0,materials+labor+extra-discount);
 it.forEach((x,i)=>$('itemsBody').rows[i].querySelector('.item-total').textContent=money(x.total));
 $('totalDisplay').textContent=money(total);
 const set=(id,text,fallback='—')=>$(id).textContent=text||fallback;
 set('pEmpresa',val('empresa'),'Sua empresa');set('pEmpresaInfo',[val('empresaDoc'),val('empresaTel'),val('empresaEmail')].filter(Boolean).join(' • '),'CPF/CNPJ • Telefone • E-mail');set('pEmpresaEndereco',val('empresaEndereco'));
 set('pNumero',val('numero'),'OS-0001');set('pStatus',val('status').toUpperCase(),'ABERTA');
 set('pCliente',val('cliente'),'Nome do cliente');set('pClienteInfo',[val('clienteDoc'),val('clienteTel'),val('clienteEmail')].filter(Boolean).join(' • '));set('pClienteEndereco',val('clienteEndereco'));
 set('pData',formatDate(val('data')));set('pPrevisao',formatDate(val('previsao')));
 set('pTipo',[val('tipo'),val('local')].filter(Boolean).join(' • '));set('pDescricao',val('descricao'));set('pExecucao',val('execucao'));set('pObservacoes',val('observacoes'));
 $('pItems').innerHTML=it.length?it.map(x=>`<tr><td>${escapeHtml(x.desc||'Item')}</td><td>${x.qty}</td><td>${money(x.price)}</td><td>${money(x.total)}</td></tr>`).join(''):'<tr><td colspan="4">Nenhum item informado</td></tr>';
 set('pMateriais',money(materials));set('pMao',money(labor));set('pDespesas',money(extra));set('pDesconto',money(discount));set('pTotal',money(total));set('pPagamento',val('pagamento'));
 set('pAceite',val('aceite'));set('pAssEmpresa',val('assinEmpresa'),'Responsável técnico');set('pAssCliente',val('assinCliente'),'Cliente');
 set('pFooter',[val('empresa'),val('empresaTel'),val('empresaEmail')].filter(Boolean).join(' • '),'Sua empresa • contato');
}
function formatDate(s){if(!s)return '—';const [y,m,d]=s.split('-');return `${d}/${m}/${y}`}
$('logoInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/'))return alert('Selecione uma imagem válida.');const r=new FileReader();r.onload=()=>{logoData=r.result;$('previewLogo').innerHTML=`<img src="${logoData}" alt="Logo">`};r.readAsDataURL(f)});
$('addItem').onclick=()=>addItem();
fields.forEach(id=>$(id).addEventListener('input',update));
['maoObra','desconto','despesas'].forEach(id=>$(id).addEventListener('input',update));
function saveData(){const data={};fields.forEach(id=>data[id]=$(id).value);data.logo=logoData;data.items=items();localStorage.setItem('geradorOSData',JSON.stringify(data));alert('Dados salvos neste navegador!');}
$('saveBtn').onclick=saveData;
function loadData(){const raw=localStorage.getItem('geradorOSData');if(!raw)return;try{const d=JSON.parse(raw);fields.forEach(id=>{if(d[id]!==undefined)$(id).value=d[id]});logoData=d.logo||'';if(logoData)$('previewLogo').innerHTML=`<img src="${logoData}" alt="Logo">`;$('itemsBody').innerHTML='';(d.items||[]).forEach(x=>addItem(x.desc,x.qty,x.price));update()}catch(e){console.warn(e)}}
$('clearBtn').onclick=()=>{if(!confirm('Limpar todos os campos e itens?'))return;$('osForm').reset();$('itemsBody').innerHTML='';logoData='';$('previewLogo').innerHTML='<img src="assets/Logo_rs_r.png" alt="Logo da empresa">';$('data').value=today.toISOString().slice(0,10);$('numero').value='OS-'+String(Date.now()).slice(-6);addItem();update()};
async function generatePDF(){
 if(!$('osForm').reportValidity())return;
 update();const btns=[$('pdfBtn'),$('pdfBtn2')];btns.forEach(b=>{b.disabled=true;b.textContent='Gerando PDF...'});
 try{
    const filename=`${(val('numero')||'ordem-servico').replace(/[^\w-]/g,'_')}.pdf`;
    await window.html2pdf().set({
     filename,
     margin:0,
     image:{type:'png',quality:1},
     html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false},
     jsPDF:{orientation:'portrait',unit:'mm',format:'a4'},
     pagebreak:{mode:['css','legacy'],avoid:['.pdf-header','.pdf-meta','.pdf-detail','.pdf-table tr','.pdf-sums > div','.payline','.accept-text','.signatures','.pdf-footer']}
    }).from($('previewPaper')).save();
 }catch(err){console.error(err);alert('Não foi possível gerar o PDF. Verifique sua conexão e tente novamente.');}
 finally{btns.forEach((b,i)=>{b.disabled=false;b.innerHTML=i===0?'⬇ Gerar PDF':'Gerar PDF da OS ↗'})}
}
$('pdfBtn').onclick=generatePDF;$('pdfBtn2').onclick=generatePDF;
addItem();loadData();update();
