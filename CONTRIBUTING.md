# Contributing Guidelines

Thank you for your interest in contributing to the POS Phone Shop System!

## Branch Naming Convention

Please use the following naming convention for your branches:
- Feature: `feature/S<Sprint>-<Ticket>-<short-description>` (e.g., `feature/S2-1-product-crud`)
- Bugfix: `bugfix/<issue>-<short-description>`
- Hotfix: `hotfix/<issue>-<short-description>`

## Commit Message Convention

We follow conventional commits:
- `feat:` for a new feature
- `fix:` for a bug fix
- `chore:` for maintenance tasks, dependencies, etc.
- `docs:` for documentation updates
- `refactor:` for code refactoring

Example: `feat(products): add IMEI tracking for phones`

## Pull Request Checklist

Before submitting a Pull Request, please ensure you have completed the following:

- [ ] Code compiles without errors (`npm run type-check`).
- [ ] No `console.log` statements are left in the code.
- [ ] You have used `zod` for validation where applicable.
- [ ] Database schema changes include a Prisma migration.
- [ ] `eslint` passes without warnings.
- [ ] You have tested the changes locally, including responsive layouts.

## Reporting Issues

If you find a bug, please create an issue detailing:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Any relevant logs or screenshots
