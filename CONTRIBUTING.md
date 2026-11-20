# Guia de Contribuição & Governança Gitflow — `pfm-web-nextjs`

Este repositório faz parte da plataforma **PFM Core Banking** (`Sorobanerp`) e segue estritamente os padrões de engenharia descritos em [pfm-docs](https://sorobanerp.github.io/pfm-docs/).

---

## 1. Fluxo Gitflow Obrigatório

```text
feat/* ou fix/* ──(PR + CI/SAST)──> develop ──(PR)──> release/vX.Y.Z ──(PR + GMUD)──> main (Tag vX.Y.Z)
```

- **`develop`**: Branch de integração contínua. Todo desenvolvimento parte de `develop` e retorna via Pull Request.
- **`release/vX.Y.Z`**: Branch de estabilização, atualização de `CHANGELOG.md` e preparação da GMUD.
- **`main`**: Branch de produção estrita. **Commits diretos são proibidos.**

---

## 2. Padrão de Commits (Conventional Commits)

Todos os títulos de Pull Request e mensagens de commit devem seguir o padrão **Conventional Commits**:

```text
<tipo>[escopo opcional]: <descrição curta no imperativo>
```

Tipos permitidos:
- `feat:` Nova funcionalidade (`MINOR` no SemVer 2.0.0)
- `fix:` Correção de bug (`PATCH` no SemVer 2.0.0)
- `docs:` Alterações exclusivamente de documentação
- `refactor:` Refatoração sem mudança de comportamento funcional
- `perf:` Melhoria de performance ou eficiência FinOps
- `test:` Adição ou correção de testes unitários/integração/BDD
- `ci:` Alterações em pipelines GitHub Actions / Quality Gates
- `chore:` Manutenção de dependências, build ou tooling
- `revert:` Reversão de commit anterior

Para mudanças incompatíveis (*Breaking Changes*), adicione `!` após o tipo/escopo (ex.: `feat(api)!: altera contrato gRPC`) — incrementa `MAJOR` no SemVer 2.0.0.

---

## 3. Quality Gates (DoD V3)

Antes de abrir Pull Request para `develop`:
1. Zero segredos ou dados pessoais (PII) no código/logs (`gitleaks`).
2. Análise estática limpa (`semgrep`, `trivy` para IaC/containers e **SonarCloud Portfolio Gate $\ge 95\%$**).
3. Testes unitários e de integração (incluindo PostgreSQL RLS quando aplicável) 100% aprovados.
