# Plugin WhatsApp Notifications

Plugin para envio de notificações via WhatsApp no sistema Furry Friends Agenda.

## Funcionalidades

- ✅ Notificações automáticas de agendamento criado
- ✅ Confirmação de agendamento concluído
- ✅ Notificações de pagamento confirmado
- ✅ Lembretes automáticos configuráveis
- ✅ Integração segura com APIs WhatsApp

## Instalação

1. Copie a pasta do plugin para `plugins/whatsapp-notifications/`
2. Instale via interface administrativa ou API
3. Configure as credenciais da API WhatsApp

## Configuração

```json
{
  "apiUrl": "https://api.whatsapp.com/send",
  "apiKey": "your-api-key-here",
  "fromNumber": "+5511999999999",
  "enableReminders": true
}
```

## APIs Suportadas

- **Twilio WhatsApp API**
- **360Dialog WhatsApp Business API**
- **Meta WhatsApp Business API**
- **Outras APIs REST compatíveis**

## Eventos Monitorados

- `appointment.created` - Novo agendamento
- `appointment.completed` - Agendamento finalizado
- `payment.completed` - Pagamento confirmado

## Exemplo de Uso

```javascript
// O plugin é ativado automaticamente quando eventos ocorrem
// Não é necessário código adicional no sistema principal
```

## Logs

Os logs do plugin são armazenados na tabela `PluginLog` e podem ser visualizados na interface administrativa.

## Segurança

- Validação rigorosa de configurações
- Sanitização de dados enviados
- Controle de permissões por plugin
- Isolamento de execução em sandbox

## Suporte

Para suporte técnico, entre em contato com a equipe Furry Friends.

---

**Versão:** 1.0.0
**Compatibilidade:** Furry Friends Agenda 1.0+
