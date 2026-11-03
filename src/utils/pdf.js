import { jsPDF } from 'jspdf'
import { currency, dateBR, totals } from './quote.js'

const PAGE_W = 210
const PAGE_H = 297
const LEFT = 17
const RIGHT = 193
const BODY_BOTTOM = 274
const COLORS = { navy: [20, 39, 70], blue: [57, 96, 230], ink: [35, 52, 78], muted: [111, 125, 148], line: [229, 234, 242], pale: [245, 247, 251], white: [255, 255, 255] }

function setText(doc, size, color, weight = 'normal') {
  doc.setFont('helvetica', weight)
  doc.setFontSize(size)
  doc.setTextColor(...color)
}

function drawPageHeader(doc, quote, professional) {
  doc.setFillColor(...COLORS.navy)
  doc.rect(0, 0, PAGE_W, 48, 'F')
  let brandX = LEFT
  if (/^data:image\/(png|jpeg);base64,/i.test(professional.logo || '')) {
    try {
      doc.addImage(professional.logo, LEFT, 11, 22, 22)
      brandX = LEFT + 29
    } catch { /* An invalid optional logo must not break the quote. */ }
  }
  setText(doc, 16, COLORS.white, 'bold')
  doc.text(professional.name || 'Orçamento profissional', brandX, 20, { maxWidth: 107 })
  const contact = [professional.phone, professional.email, professional.document, professional.address].filter(Boolean).join('  |  ')
  if (contact) {
    setText(doc, 8, [214, 222, 237])
    doc.text(doc.splitTextToSize(contact, 112), brandX, 27)
  }
  setText(doc, 8, [180, 196, 222], 'bold')
  doc.text('PROPOSTA COMERCIAL', RIGHT, 13, { align: 'right' })
  setText(doc, 12, COLORS.white, 'bold')
  doc.text(`#${String(quote.number).padStart(4, '0')}`, RIGHT, 21, { align: 'right' })
  setText(doc, 8, [214, 222, 237])
  doc.text(`Emitido em ${dateBR(quote.createdAt)}`, RIGHT, 28, { align: 'right' })
}

function drawFooter(doc, page, pageCount) {
  doc.setDrawColor(...COLORS.line)
  doc.line(LEFT, 284, RIGHT, 284)
  setText(doc, 7.5, COLORS.muted)
  doc.text('Orçamento para avaliação do cliente', LEFT, 290)
  doc.text(`Página ${page} de ${pageCount}`, RIGHT, 290, { align: 'right' })
}

export function downloadQuote(quote, professional) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const { subtotal, discount, total } = totals(quote)
  let y = 58
  let page = 1
  drawPageHeader(doc, quote, professional)

  const ensureSpace = (height) => {
    if (y + height <= BODY_BOTTOM) return
    doc.addPage()
    page += 1
    drawPageHeader(doc, quote, professional)
    y = 58
  }
  const drawTableHeader = () => {
    doc.setFillColor(...COLORS.pale)
    doc.roundedRect(LEFT, y, RIGHT - LEFT, 10, 2.5, 2.5, 'F')
    setText(doc, 7.5, COLORS.muted, 'bold')
    doc.text('DESCRIÇÃO', LEFT + 4, y + 6.5)
    doc.text('QTD.', 122, y + 6.5, { align: 'right' })
    doc.text('UNITÁRIO', 157, y + 6.5, { align: 'right' })
    doc.text('TOTAL', RIGHT - 4, y + 6.5, { align: 'right' })
    y += 12
  }
  const sectionLabel = (text) => {
    setText(doc, 8, COLORS.muted, 'bold')
    doc.text(text.toLocaleUpperCase('pt-BR'), LEFT, y)
  }

  // Client card
  const clientLines = [quote.client.phone && `Telefone: ${quote.client.phone}`, quote.client.email && `E-mail: ${quote.client.email}`, quote.client.address].filter(Boolean)
  const clientContactLines = clientLines.length ? doc.splitTextToSize(clientLines.join('  |  '), RIGHT - LEFT - 12) : []
  const clientNameLines = doc.splitTextToSize(quote.client.name || 'Cliente', RIGHT - LEFT - 12)
  const clientHeight = Math.max(25, 9 + clientNameLines.length * 5 + (clientContactLines.length ? 4 + clientContactLines.length * 4.5 : 0) + 5)
  ensureSpace(clientHeight + 10)
  doc.setFillColor(...COLORS.pale)
  doc.roundedRect(LEFT, y, RIGHT - LEFT, clientHeight, 3, 3, 'F')
  setText(doc, 7, COLORS.muted, 'bold')
  doc.text('PREPARADO PARA', LEFT + 6, y + 7)
  setText(doc, 12, COLORS.ink, 'bold')
  doc.text(clientNameLines, LEFT + 6, y + 14, { maxWidth: RIGHT - LEFT - 12 })
  setText(doc, 8.5, COLORS.muted)
  if (clientContactLines.length) doc.text(clientContactLines, LEFT + 6, y + 14 + clientNameLines.length * 5, { maxWidth: RIGHT - LEFT - 12 })
  y += clientHeight + 10

  // Service summary
  const serviceLines = doc.splitTextToSize(quote.serviceDescription || 'Serviços e produtos descritos nesta proposta.', RIGHT - LEFT)
  ensureSpace(12 + serviceLines.length * 4.5)
  sectionLabel('Sobre o serviço')
  y += 5
  setText(doc, 9, COLORS.ink)
  doc.text(serviceLines, LEFT, y, { maxWidth: RIGHT - LEFT })
  y += Math.max(7, serviceLines.length * 4.5) + 7

  // Item table
  ensureSpace(17)
  drawTableHeader()

  for (const item of quote.items || []) {
    const description = doc.splitTextToSize(item.description || 'Item', 86)
    const rowHeight = Math.max(10, description.length * 4.3 + 4)
    if (y + rowHeight + 2 > BODY_BOTTOM) {
      doc.addPage()
      page += 1
      drawPageHeader(doc, quote, professional)
      y = 58
      drawTableHeader()
    }
    setText(doc, 8.5, COLORS.ink)
    doc.text(description, LEFT + 4, y + 4, { maxWidth: 86 })
    doc.text(String(item.quantity || 0), 122, y + 4, { align: 'right' })
    doc.text(currency(item.price), 157, y + 4, { align: 'right' })
    setText(doc, 8.5, COLORS.ink, 'bold')
    doc.text(currency((Number(item.quantity) || 0) * (Number(item.price) || 0)), RIGHT - 4, y + 4, { align: 'right' })
    y += rowHeight
    doc.setDrawColor(...COLORS.line)
    doc.line(LEFT, y, RIGHT, y)
  }

  // Aligned summary: a fixed label column prevents the total label and amount from colliding.
  y += 5
  ensureSpace(40)
  const summaryLabelX = 116
  const summaryAmountX = RIGHT - 4
  const drawSummaryRow = (label, amount, emphasized = false) => {
    setText(doc, emphasized ? 10.5 : 8.5, emphasized ? COLORS.blue : COLORS.muted, emphasized ? 'bold' : 'normal')
    doc.text(label, summaryLabelX, y + 5, { maxWidth: 57 })
    doc.text(amount, summaryAmountX, y + 5, { align: 'right' })
    y += emphasized ? 14 : 7
  }
  drawSummaryRow('Subtotal', currency(subtotal))
  if (discount > 0) drawSummaryRow('Desconto', `- ${currency(discount)}`)
  doc.setFillColor(239, 243, 255)
  doc.roundedRect(summaryLabelX - 5, y, RIGHT - summaryLabelX + 5, 15, 2, 2, 'F')
  setText(doc, 10, COLORS.navy, 'bold')
  doc.text('TOTAL DO ORÇAMENTO', summaryLabelX, y + 9.5, { maxWidth: 53 })
  setText(doc, 12, COLORS.blue, 'bold')
  doc.text(currency(total), summaryAmountX, y + 9.5, { align: 'right' })
  y += 22

  const detailBlocks = [
    ['VALIDADE', quote.validity ? dateBR(quote.validity) : ''],
    ['CONDIÇÕES DE PAGAMENTO', quote.payment],
    ['OBSERVAÇÕES', quote.notes],
  ].filter(([, text]) => text)
  for (const [label, text] of detailBlocks) {
    const lines = doc.splitTextToSize(text, RIGHT - LEFT)
    const height = 8 + Math.max(5, lines.length * 4.5)
    ensureSpace(height + 2)
    setText(doc, 7, COLORS.muted, 'bold')
    doc.text(label, LEFT, y)
    y += 5
    setText(doc, 8.5, COLORS.ink)
    doc.text(lines, LEFT, y, { maxWidth: RIGHT - LEFT })
    y += Math.max(5, lines.length * 4.5) + 4
  }

  if (y + 10 <= BODY_BOTTOM) {
    setText(doc, 8, COLORS.muted)
    doc.text('Agradecemos a oportunidade. Ficamos à disposição para esclarecer dúvidas.', LEFT, y + 2, { maxWidth: RIGHT - LEFT })
  }

  const pageCount = doc.getNumberOfPages()
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber)
    drawFooter(doc, pageNumber, pageCount)
  }

  const safeClient = (quote.client.name || 'cliente').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  doc.save(`orcamento-${String(quote.number).padStart(4, '0')}-${safeClient || 'cliente'}.pdf`)
  return doc
}
