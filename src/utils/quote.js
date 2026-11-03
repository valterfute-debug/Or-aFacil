export const currency = (value = 0) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0)
export const dateBR = (value) => value ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : '—'
export const today = () => new Date().toISOString().slice(0, 10)
export const blankItem = () => ({ id: crypto.randomUUID(), description: '', quantity: 1, price: 0 })
export const blankQuote = (number = 1) => ({
  id: crypto.randomUUID(), number, createdAt: today(), validity: '', serviceDescription: '', notes: '', payment: '',
  client: { name: '', phone: '', email: '', address: '' }, items: [blankItem()], discountType: 'percent', discount: 0, status: 'Rascunho'
})
export function totals(quote) {
  const subtotal = (quote.items || []).reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.price) || 0), 0)
  const rawDiscount = Math.max(0, Number(quote.discount) || 0)
  const discount = Math.min(subtotal, quote.discountType === 'percent' ? subtotal * Math.min(100, rawDiscount) / 100 : rawDiscount)
  return { subtotal, discount, total: Math.max(0, subtotal - discount) }
}
export const STORAGE = { professional: 'orcafacil.professional.v1', quotes: 'orcafacil.quotes.v1', draft: 'orcafacil.draft.v1' }
export function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
