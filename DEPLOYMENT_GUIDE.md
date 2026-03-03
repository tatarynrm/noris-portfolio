# 🚀 Інструкція: Деплой Next.js Портфоліо на Ubuntu VPS

Ця інструкція створена спеціально для вашого проекту порфоліо. Додаток буде працювати в Docker-контейнері на порту **3001** за Nginx (який буде роздавати його на 80 та 443 портах з HTTPS).

---

## 🛠 Крок 1: Підготовка Сервера (VPS)

Зайдіть на ваш сервер через SSH:
```bash
ssh root@IP_ВАШОГО_СЕРВЕРА
```

### 1.1. Оновлення системи
```bash
apt update && apt upgrade -y
```

### 1.2. Встановлення Docker та Docker Compose
```bash
# Встановлення необхідних пакетів
apt install -y apt-transport-https ca-certificates curl software-properties-common git

# Завантаження ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Додавання репозиторію
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Встановлення Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

---

## 📥 Крок 2: Завантаження та Запуск Проекту

### 2.1. Клонування репозиторію
Спочатку потрібно стягнути ваш код з GitHub (або іншого сервісу) на сервер.
```bash
git clone ПОСИЛАННЯ_НА_ВАШ_РЕПОЗИТОРІЙ noris-portfolio
cd noris-portfolio
```

### 2.2. Запуск через Docker Compose
Ми вже налаштували `Dockerfile` та `docker-compose.yml` на порт **3001**.
```bash
docker compose up -d --build
```
*Docker самостійно встановить всі залежності (Node.js 20), скомпілює Next.js додаток (`npm run build`) і запустить його.*

Перевірте, чи працює контейнер:
```bash
docker ps
```
Ви маєте побачити табличку, де `noris_portfolio` працює на порту `3001`.

---

## 🌐 Крок 3: Налаштування Домену та Nginx

Щоб сайт відкривався по назві домену (наприклад, `noris.dev`), а не по IP:3001, нам потрібен Nginx.

### 3.1. Прив'язка домену (в панелі реєстратора доменів)
Переконайтесь, що в панелі керування вашим доменом ви додали **A-запис** (A-record), який вказує на IP-адресу вашого VPS (наприклад: `noris.dev -> IP` та `www.noris.dev -> IP`). Зробіть це **до** наступних кроків.

### 3.2. Встановлення Nginx
```bash
apt install -y nginx
```

### 3.3. Налаштування Nginx
Створіть файл конфігурації для вашого сайту:
```bash
nano /etc/nginx/sites-available/noris
```

Вставте туди наступний код (замініть `ВАШ_ДОМЕН.com` на реальний домен):
```nginx
server {
    listen 80;
    server_name ВАШ_ДОМЕН.com www.ВАШ_ДОМЕН.com;

    location / {
        proxy_pass http://localhost:3001; # Зверніть увагу на порт 3001!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
*(Збережіть та закрийте файл: `Ctrl+O`, `Enter`, `Ctrl+X`)*

### 3.4. Активація конфігурації Nginx
```bash
ln -s /etc/nginx/sites-available/noris /etc/nginx/sites-enabled/
nginx -t     # Перевірка на помилки
systemctl reload nginx
```

Після цього ваш сайт вже має відкриватися за адресою `http://ВАШ_ДОМЕН.com`.

---

## 🔒 Крок 4: Захист сайту (HTTPS / SSL сертифікат)

Встановіть Certbot, щоб отримати безкоштовний SSL сертифікат від Let's Encrypt.

```bash
apt install -y certbot python3-certbot-nginx

# Отримання сертифікату (Certbot автоматично оновить Nginx конфіг)
certbot --nginx -d ВАШ_ДОМЕН.com -d www.ВАШ_ДОМЕН.com
```

Під час запуску Certbot:
1. Введіть свій email (для сповіщень про закінчення терміну дії).
2. Погодьтесь з правилами (Y).
3. Якщо запитає, чи робити редирект з HTTP на HTTPS — вибирайте цифру **2 (Redirect)**. Це обов'язково для безпеки.

🎉 **Готово! Сайт задеплоєно і захищено.**

---

## 🔄 Як оновлювати сайт після змін коду?

Коли ви напишете новий код на своєму ПК і заллєте його на GitHub, на сервері потрібно просто ввести 3 команди:

```bash
cd /root/noris-portfolio
git pull
docker compose up -d --build
```
І сайт оновиться!
