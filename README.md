# NCTV — NIS Competitive Tournament Viewer

MVP платформы для школьных соревнований NIS. Первое мероприятие — шахматный турнир; матчи и другие соревнования публикует администратор. Стек: Next.js (React) и серверные Route Handlers Node.js. Данные MVP сохраняются локально в `data/nctv.json`.

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

## Учётная запись администратора

`admin@nctv.kz` / `Admin123!`

После первого запуска смените пароль в хранилище на безопасный: MVP использует локальный JSON-файл; для production его нужно заменить на PostgreSQL/SQLite и добавить восстановление пароля.
