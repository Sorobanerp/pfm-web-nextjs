## Resumo

<!-- O que muda e por quê. Fluxo: `feature/*` -> `develop`. -->

## Identificação

- **ID da Tarefa (ex.: INF-04, PFM-123):** 
- **Tipo:** feat | fix | chore | docs | refactor | test

## Checklist de Qualidade (obrigatório)

- [ ] ID da tarefa informado no título e na descrição
- [ ] Cobertura de testes >= 95% (Quality Gate SonarCloud verde)
- [ ] Zero `float`/`double` em valores monetários (`BigDecimal` / `shopspring/decimal` / `Decimal` / `string` decimal)
- [ ] Row-Level Security (RLS) e isolamento multitenant (`tenant_id`) preservados
- [ ] SAST limpo (Semgrep) e Gitleaks sem findings (sem segredos/PII)
- [ ] Trivy sem CVEs `CRITICAL`/`HIGH` (quando aplicável)
- [ ] Documentação atualizada (`pfm-docs`) quando houver mudança de contrato/porta/arquitetura
- [ ] Sem mudança destrutiva de schema (Expand & Contract)

## Evidências

<!-- Links de execução do CI, prints, saídas de testes. -->
