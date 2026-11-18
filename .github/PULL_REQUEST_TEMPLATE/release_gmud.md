# GMUD - Gestão de Mudança (Release `release/*` -> `main`)

- **Número da GMUD:** GMUD-AAAA-NNNN
- **Versão (SemVer):** vX.Y.Z

## Tarefas Incorporadas

<!-- Liste IDs e PRs incorporados nesta release. -->
- [ ] INF-04 - #PR
- [ ] ...

## Avaliação de Blast Radius

- **Serviços/Repos impactados:** 
- **Impacto em dados/schema (migrações Flyway/SQL):** 
- **Impacto em tenants/usuários:** 
- **Classificação de risco:** Baixo | Médio | Alto

## Plano de Rollback (alvo < 5 min)

- [ ] Imagem/tag anterior documentada: `...`
- [ ] Migrações retrocompatíveis (Expand & Contract; sem `DROP` imediato)
- [ ] Procedimento: redeploy da tag anterior (Helm/ECS) e validação de health checks
- [ ] Tempo estimado de rollback: ___ min (deve ser < 5)

## Janela de Implantação

- **Data/hora (BRT):** 
- **Responsável pela execução:** 
- **Comunicação a stakeholders:** 

## Evidências do Quality Gate

- [ ] Gitleaks: 0 segredos
- [ ] Semgrep SAST: 0 findings bloqueantes
- [ ] Trivy: 0 CVEs CRITICAL/HIGH
- [ ] SonarCloud: cobertura >= 95% e Quality Gate aprovado
- [ ] Testes E2E/carga executados na release (quando aplicável)

## Aprovação do Change Advisory

- [ ] Tech Lead / Arquiteto: @fcd007
- [ ] SRE on-call: 
- [ ] Aprovado em: ____/____/______
