# Dependency maintenance audit

Repository: `mshams999/personal-blog`
Base branch: `main`
Audit date: 2026-11-07

## Confirmed baseline

The committed manifests and lockfiles contain three npm projects: the frontend, `functions/`, and `mail/`.

### Frontend notable versions in package-lock.json

| Package | Locked version | Notes |
|---|---:|---|
| vite | 4.5.14 | Old major; migration should be staged with @vitejs/plugin-react |
| @vitejs/plugin-react | 4.7.0 | Verify compatibility with selected Vite major |
| eslint | 8.57.1 | ESLint 8 is end-of-life |
| react / react-dom | 18.3.1 | React 19 is a major migration |
| lucide-react | 0.294.0 | Large version gap; verify icon exports |
| date-fns | 2.30.0 | Major migration to v4 |
| tailwindcss | 3.4.18 | Tailwind 4 is a migration, not a routine bump |
| react-router-dom | 6.30.1 | React Router 7+ migration requires review |
| firebase | 11.10.0 | Review current SDK release and app compatibility |

### Firebase Functions

- `functions/`: firebase-admin 12.7.0, firebase-functions 5.1.1, resend 3.5.0; Node engine 20.
- `mail/`: firebase-admin 12.7.0, firebase-functions 6.3.2; Node engine 22.

The separate functions project is behind the frontend's Firebase Admin and Functions SDK versions. Align only after reviewing APIs used in each service.

## Safety notes

- No dependency versions or lockfiles have been changed in this PR.
- Do not hand-edit lockfiles. Regenerate each with npm using the intended Node/npm version.
- Do not upgrade React, Vite, Tailwind, ESLint, Firebase, or date-fns major versions in one batch.
- Review source usage and breaking changes before removing or upgrading a package.
- The direct dependency named `package` at `^1.0.1` is suspicious and should be checked for imports before removal.
- No successful `npm audit`, install, lint, build, or Firebase deployment has been run in this remote-only pass. CI added by this PR will provide install/lint/build validation once GitHub Actions runs.

## Current-source references

- Vite 8 release line: https://www.npmjs.com/package/vite
- React 19 release line: https://www.npmjs.com/package/react
- ESLint support status: https://eslint.org/version-support/
- Firebase SDK release notes: https://firebase.google.com/support/releases

## Follow-up migration sequence

1. Capture CI baseline and audit findings.
2. Upgrade Vite and its React plugin in a dedicated change.
3. Upgrade icon library and verify every imported icon.
4. Upgrade Firebase Admin / Functions independently in each backend.
5. Upgrade Resend and test mail delivery.
6. Migrate React and routing.
7. Migrate date-fns.
8. Migrate Tailwind and lint tooling in separate changes.
