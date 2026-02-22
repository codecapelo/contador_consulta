# App Contagem de Consultas

Aplicativo web para registrar consultas por clique, calcular faturamento e acompanhar produtividade por dia, semana e mês.

## Como usar

1. Faça login ou crie cadastro na tela inicial.
2. Clique em `Adulto`, `Pediatria`, `One` ou `Plantão` para registrar um atendimento com horário.
3. Use `Adicionar atendimento manual` para lançar atendimentos em qualquer data/hora/tipo.
4. Na lista `Registros do dia`, use `Editar` para ajustar horário/tipo/data ou `Excluir` para remover um item.
5. Ajuste `Jornada alvo (h)`, `Pausa acima de (min)` e `Meta de <mês> (R$)` para calibrar as métricas.
6. Clique nos dias do calendário para ver histórico e métricas de cada data.

## Arquitetura de dados

- Frontend estático (`index.html`, `app.js`, `styles.css`).
- Backend em Netlify Functions (`netlify/functions/*`).
- Banco em Neon (PostgreSQL) com tabela `users`.
- Sessão por cookie `HttpOnly` assinado com JWT.
- Senhas com hash (`bcrypt`), nunca em texto puro no banco.

## Variáveis de ambiente (Netlify)

Configure no projeto do Netlify:

- `DATABASE_URL` = string de conexão do Neon.
- `JWT_SECRET` = chave forte para assinar sessão.
- `ADMIN_EMAIL` = e-mail do administrador.
- `ADMIN_PASSWORD` = senha inicial do administrador.

Referência de variáveis: `.env.example`.

## Banco (Neon)

Arquivo de apoio do schema: `db/neon_schema.sql`.

As Functions também criam tabela automaticamente no primeiro acesso (`CREATE TABLE IF NOT EXISTS`) e garantem a conta admin.

## Regras de valor

- `Adulto = R$ 15`
- `Pediatria = R$ 20`
- `One = R$ 20`
- `Plantão = R$ 20`

## Cálculos principais

- **Faturamento do dia**: soma por tipo de atendimento.
- **Produtividade bruta (clock time)**:
  - `R$/hora bruta = faturamento / (último atendimento - primeiro atendimento)`
  - `Atendimentos/hora bruta = total / (último atendimento - primeiro atendimento)`
- **Produtividade líquida (active time)**:
  - ignora intervalos acima do limiar de pausa
  - `R$/hora líquida = faturamento / tempo ativo`
  - `Atendimentos/hora líquida = total / tempo ativo`
  - `Taxa de ocupação = tempo ativo / tempo total`
- **Distribuição de intervalos**: mediana, P25-P75 e P90.
- **Pausas**: quantidade, duração total e maior pausa acima do limiar configurado.
- **Estimativa no fim da jornada**: recalculada a cada bloco de 10 atendimentos.
- **Regra de estabilidade**: médias/hora e ocupação só aparecem a partir do 5º atendimento do dia.
- **Meta mensal**:
  - você define um valor em R$ para o mês da data selecionada
  - o app mostra o acumulado do mês, progresso (%) e quanto falta para bater a meta
  - o valor restante diminui automaticamente conforme novos atendimentos entram no mês

## Migração de dados legados

Na primeira sessão em cada usuário, o frontend tenta migrar dados antigos do `localStorage` para o Neon quando o banco desse usuário ainda está vazio.
