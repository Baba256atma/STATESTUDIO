# Security Policy

The Nexora project takes security seriously and welcomes the responsible disclosure of vulnerabilities. If you believe you have found a security issue, please report it privately so it can be investigated and fixed before public disclosure.

## Supported Versions

Security fixes are applied to the actively maintained development line.

| Version | Supported |
| ------- | --------- |
| `main` | yes |
| older versions | no |

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Instead, contact the project maintainers directly at:

`security@nexora.dev`

When reporting a vulnerability, please include:

- a clear description of the issue
- reproduction steps
- affected components or files
- potential impact
- any suggested mitigation if available

Reports with concrete technical detail are easier to investigate and resolve quickly.

## Response Process

When a security report is received, maintainers will typically:

1. acknowledge the report
2. investigate and validate the issue
3. develop and test a fix
4. publish a patch or mitigation

Responsible disclosure is appreciated. Please avoid publicly sharing exploit details until the issue has been reviewed and an appropriate response is in place.

## Security Principles

- Protect user and system data
- Avoid storing secrets in the repository
- Encourage responsible disclosure
- Maintain secure defaults where practical
- Keep the codebase understandable and reviewable

## AI System Considerations

Nexora includes AI reasoning components, chat-driven endpoints, and simulation-oriented system state processing. Security work in this project includes protecting system state data, preventing abuse of AI-facing endpoints, and handling model and runtime configuration safely.

Because the platform processes structured state and decision context, input handling and output shaping matter. The project should continue to treat system state integrity, prompt handling, and environment configuration as core security concerns.

## Infrastructure Notes

Environment secrets should be stored in local `.env` files and must not be committed to the repository. Developers should use the provided `.env.example` files as templates when setting up local environments.

For the backend, copy:

```bash
cp backend/.env.example backend/.env
```

This helps keep local configuration explicit while preventing real secrets from being checked into source control.
