import requests

TOKEN = "6751171075:AAFAtsMDqbiGuqd2RGFBBkrG9VPMoYY70c8"  # Замените на токен вашего бота
WEBHOOK_URL = "https://66e826fd23e3232744881047--fghs123.netlify.app/"  # Замените на URL от Serveo

response = requests.post(f"https://api.telegram.org/bot{TOKEN}/setWebhook", data={"url": WEBHOOK_URL})
print(response.json())

