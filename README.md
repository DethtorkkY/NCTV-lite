# NCTV — NIS Competitive Tournament Viewer

MVP платформы для школьных соревнований NIS. Первое мероприятие — шахматный турнир; матчи и другие соревнования публикует администратор. Стек: Next.js (React), Node.js Route Handlers и Neon PostgreSQL.

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

Для Vercel подключите Neon Postgres: интеграция добавляет переменную `nctv_POSTGRES_URL`; при первом запуске приложение сама создаёт таблицы и стартовые шахматные данные.
