# OrçaFácil

Crie orçamentos profissionais, salve seu histórico no navegador e exporte propostas em PDF para compartilhar com seus clientes. O OrçaFácil é um MVP sem cadastro e sem backend.

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm

## Instalar e executar

```bash
npm install
npm run dev
```

O Vite mostrará o endereço local no terminal (normalmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos de produção são gerados na pasta `dist/`.

## Publicar gratuitamente no Cloudflare Workers

1. Envie este repositório para uma conta GitHub ou GitLab.
2. Instale as dependências com `npm install` e autentique o Wrangler com `npx wrangler login`, se necessário.
3. Rode `npm run deploy:dry-run` para compilar e validar a configuração sem publicar.
4. Rode `npm run deploy` para compilar e publicar o Worker. O `wrangler.jsonc` aponta para `dist/` e configura o fallback SPA nativo do Workers.

O projeto usa Workers com Static Assets; não configure uma regra catch-all em `_redirects`. O fallback `single-page-application` entrega `index.html` para rotas da aplicação que não correspondem a arquivos estáticos.

## Armazenamento e privacidade

O perfil profissional, o rascunho atual, a logo e os orçamentos ficam no `localStorage` deste navegador e dispositivo. O app não envia esses campos para um servidor, mas o `localStorage` não é criptografado pelo OrçaFácil e pode ser acessado por quem usar o mesmo perfil do navegador. Use um dispositivo confiável, cadastre somente dados necessários e apague as propostas quando não precisar mais delas. **Apagar todos os dados** remove os registros locais do OrçaFácil.

A logo opcional é selecionada como arquivo PNG ou JPG de até 400 KB e permanece local; o app não baixa imagens de terceiros. O app não inclui analytics nem fontes remotas. Ao escolher o botão do WhatsApp, o OrçaFácil baixa o PDF e abre o WhatsApp com uma mensagem preenchida com dados que você inseriu; você revisa e decide se envia, e precisa anexar o PDF manualmente.

O profissional que prepara a proposta deve definir a finalidade e a base legal para usar os dados do cliente, informar as pessoas envolvidas e atender solicitações aplicáveis. Evite inserir dados pessoais sensíveis. O OrçaFácil oferece armazenamento local e transparência, mas não certifica conformidade legal do uso que cada profissional faz dos dados. Consulte o [guia de segurança da ANPD para agentes de tratamento de pequeno porte](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte) e a [Resolução CD/ANPD nº 2/2022](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022).

## Limitações do MVP

- Não há conta, sincronização na nuvem, colaboração ou recuperação de dados entre dispositivos.
- O compartilhamento pelo WhatsApp baixa o PDF e abre uma mensagem preenchida; por limitação do navegador, a pessoa precisa anexar o arquivo baixado manualmente.
- O histórico é específico do navegador. Status e dados podem ser apagados ao limpar o armazenamento local.
- A versão atual foi pensada para propostas de serviços e produtos simples, sem impostos, emissão fiscal ou assinatura eletrônica.
