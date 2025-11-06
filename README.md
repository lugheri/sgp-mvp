# SGP - CRM Multi-tenant com VoIP Dialer

Sistema de CRM escalável com integração de discador VoIP.

## Arquitetura

Microserviços separados por domínio:
- Account Service
- Security Service
- Contacts Service
- Sales Service
- Dialer Service
- Backoffice Service
- Messaging Service
- Metrics Service

## Setup

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- PostgreSQL

### Instalação

```bash
git clone https://github.com/lugheri/sgp-mvp.git
cd sgp-mvp
npm install
docker-compose up
