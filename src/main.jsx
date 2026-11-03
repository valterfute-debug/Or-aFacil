import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

class AppErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('OrçaFácil encontrou um erro ao renderizar:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return <main style={{ maxWidth: 720, margin: '12vh auto', padding: 28, color: '#172b4d', fontFamily: 'Segoe UI, sans-serif' }}>
        <h1 style={{ fontSize: 24 }}>Não foi possível abrir o OrçaFácil</h1>
        <p style={{ color: '#68768c' }}>Recarregue a página. Se o problema continuar, envie esta mensagem para o suporte:</p>
        <pre style={{ padding: 16, background: '#fff1f0', color: '#a33', borderRadius: 8, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{this.state.error.message}</pre>
        <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 8, padding: '10px 16px', background: '#4169ec', color: 'white', fontWeight: 700 }}>Recarregar página</button>
      </main>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>)
