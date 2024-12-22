
# Investment Income Tax Project

## Опис

Цей проект реалізує систему розрахунку податків з інвестиційного доходу, включаючи процеси CI/CD, автоматизацію тестування та розгортання у різних середовищах.

---

## Запуск проекту

### Вимоги

- **Node.js**: Версія 20+
- **Yarn**: Для встановлення залежностей
- **Docker**: Для розгортання додатка

### Інструкція запуску

1. **Встановіть залежності:**
   ```bash
   yarn install
   ```

2. **Запустіть сервер для розробки:**
   ```bash
   yarn start
   ```

3. **Запустіть всі тести:**
   ```bash
   yarn test
   ```

4. **Запустіть лінтер для перевірки стилю коду:**
   ```bash
   yarn lint
   ```

5. **Збірка проекту для продакшну:**
   ```bash
   yarn build:all:prod
   ```

6. **Запустіть проект у Docker:**
   ```bash
   docker build -t investment-income-tax .
   docker run -p 3000:3000 investment-income-tax
   ```

---

## CI/CD

### Опис

Процеси CI/CD побудовані на базі GitHub Actions та охоплюють такі етапи:

1. **Перевірка якості коду (Lint/Test/Build):**
    - Використовується `yarn nx affected` для запуску лише змінених компонентів.
    - Конфігурація: `.github/workflows/lint-test-build.yml`.

2. **Тести на вразливості:**
    - Використовується `Snyk`.
    - Конфігурація: `.github/workflows/vulnerabilities-test.yml`.

3. **CI/CD для QA, DEV, PROD середовищ:**
    - DEV: `.github/workflows/ci-cd-dev.yml`.
    - QA: `.github/workflows/ci-cd-qa.yml`.
    - PROD: `.github/workflows/ci-cd-prod.yml`.

4. **Performance тести:**
    - Використовується `artillery`.
    - Конфігурація: `.github/workflows/performance-test.yml`.

### Запуск workflow вручну

1. Відкрийте вкладку **Actions** у репозиторії GitHub.
2. Виберіть потрібний workflow.
3. Натисніть **Run workflow** і вкажіть потрібні параметри.

---

## Тестування

### Юніт-тести

- Використовується `Jest`.
- Запуск:
  ```bash
  yarn test
  ```

### E2E-тести

- Використовуються `nestjs/testing` та `supertest`.
- Запуск:
  ```bash
  yarn e2e
  ```

### Performance-тести

- Використовується `artillery`.
- Конфігурація знаходиться в `tools/perf/tax-calculate.perf.yml`.
- Запуск:
  ```bash
  yarn perf
  ```

---

## Документація

### CI/CD

Документація процесів CI/CD доступна у файлах `.github/workflows/`.  
Основні процеси:
- Lint/Test/Build Workflow
- Vulnerabilities Test Workflow
- CI/CD QA, DEV, PROD Workflows
- Performance Test Workflow

### API

- Відкрийте документацію API за адресою: `http://localhost:3000/docs`.

---

## Секрети та змінні середовища

### Необхідні секрети для CI/CD:

- `AWS_ROLE_TO_ASSUME`
- `SNYK_TOKEN`

### Файли `.env` для локального запуску

Створіть файл `.env` у корені проекту:
```env
NODE_ENV=development
PORT=3000
API_ROOT_PREFIX=api
DOCS_ROOT_PREFIX=docs
```