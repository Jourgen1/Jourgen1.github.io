# Портфолио Юрия Кашубы

Статическое портфолио: сайты, API, Telegram-боты и Python-автоматизация.

## Локальный запуск

```powershell
cd "C:\Users\Юрий\Desktop\FL\portfolio"
python -m http.server 4173 --bind 127.0.0.1
```

Откройте `http://127.0.0.1:4173`.

## Публикация

Сайт не требует сборки: загрузите содержимое папки `portfolio` в GitHub Pages, Netlify или на VPS.

Текущая публичная версия: https://jourgen1.github.io/

Перед подключением собственного домена обновите в `index.html` canonical URL и Open Graph URL, а также `robots.txt` и `sitemap.xml`.

## Файлы

- `index.html` — содержимое и структура страницы;
- `styles.css` — адаптивный дизайн;
- `script.js` — меню, мини-бриф, копирование контактов и интерактивные детали кейсов;
- `favicon.svg` — иконка вкладки.
- `robots.txt` и `sitemap.xml` — базовые инструкции для поисковых систем;
- `404.html` — брендированная страница несуществующего маршрута.
