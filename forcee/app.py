from flask import Flask, render_template, request, jsonify
import telegram
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

# Инициализация Flask-приложения
app = Flask(__name__)

# Токен вашего бота от BotFather
TOKEN = "6751171075:AAFAtsMDqbiGuqd2RGFBBkrG9VPMoYY70c8"  # Замените на ваш токен от BotFather
bot = telegram.Bot(token=TOKEN)

# Главная страница с веб-приложением (HTML)
@app.route('/')
def index():
    return render_template('index.html')

# Вебхук для Telegram бота
@app.route('/webhook', methods=['POST'])
def webhook():
    update = telegram.Update.de_json(request.get_json(force=True), bot)
    
    chat_id = update.message.chat.id

    # Кнопка для открытия веб-приложения
    keyboard = [
        [InlineKeyboardButton("Открыть Web App", web_app=WebAppInfo("https://your-website.com"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    bot.send_message(chat_id=chat_id, text="Привет! Открой своё Web App!", reply_markup=reply_markup)
    
    return jsonify({"status": "ok"})

# Запуск Flask-приложения
if __name__ == '__main__':
    app.run(debug=True)
