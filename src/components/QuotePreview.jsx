import React from 'react'
import { FileText } from 'lucide-react'
import { currency, dateBR, totals } from '../utils/quote'

export default function QuotePreview({ quote, professional }) {
  const { subtotal, discount, total } = totals(quote)
  return <article className="paper">
    <header className="paper-head"><div className="paper-brand">{professional.logo ? <img src={professional.logo} alt="Logo profissional" /> : <span className="paper-brand-icon"><FileText size={20} /></span>}<div><strong>{professional.name || 'Seu negócio'}</strong><small>{[professional.phone, professional.email, professional.address].filter(Boolean).join(' · ') || 'Seus dados profissionais'}</small></div></div><div className="paper-number"><span>ORÇAMENTO</span><strong>#{String(quote.number).padStart(4, '0')}</strong><small>{dateBR(quote.createdAt)}</small></div></header>
    <div className="paper-client"><span className="eyebrow">PREPARADO PARA</span><strong>{quote.client.name || 'Nome do cliente'}</strong><span>{quote.client.phone || 'Telefone do cliente'}{quote.client.email ? ` · ${quote.client.email}` : ''}</span>{quote.client.address && <span>{quote.client.address}</span>}</div>
    <div className="paper-description"><span className="eyebrow">SOBRE ESTE ORÇAMENTO</span><p>{quote.serviceDescription || 'Descreva brevemente o serviço ou projeto.'}</p></div>
    <div className="preview-table"><div className="preview-row preview-th"><span>DESCRIÇÃO</span><span>QTD.</span><span>UNITÁRIO</span><span>TOTAL</span></div>{quote.items.map(item => <div className="preview-row" key={item.id}><span>{item.description || 'Novo item'}</span><span>{item.quantity || 0}</span><span>{currency(item.price)}</span><strong>{currency((item.quantity || 0) * (item.price || 0))}</strong></div>)}</div>
    <div className="paper-totals"><div><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>{discount > 0 && <div><span>Desconto</span><strong>− {currency(discount)}</strong></div>}<div className="paper-grand"><span>Total</span><strong>{currency(total)}</strong></div></div>
    {(quote.validity || quote.payment || quote.notes) && <footer className="paper-footer">{quote.validity && <div><span className="eyebrow">VÁLIDO ATÉ</span><span>{dateBR(quote.validity)}</span></div>}{quote.payment && <div><span className="eyebrow">PAGAMENTO</span><span>{quote.payment}</span></div>}{quote.notes && <div><span className="eyebrow">OBSERVAÇÕES</span><span>{quote.notes}</span></div>}</footer>}
    <div className="paper-signoff">Obrigado pela oportunidade. Será um prazer trabalhar com você.</div>
  </article>
}
