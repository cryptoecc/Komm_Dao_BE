import logging
from telegram import Update, Document
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
import fitz
import re
import os
import tempfile
import openai
import requests
from googlesearch import search
from bs4 import BeautifulSoup


# OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")  # 환경 변수로부터 API 키를 가져오도록 변경

# Telegram 봇 토큰
TOKEN = '7440620872:AAFcgLb1s_47IAsnOenxiNZzEAeL8PUhNMU'

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# /start 명령어 처리 함수
async def start(update: Update, context: CallbackContext):
    logger.info("Start command received")
    await update.message.reply_text('Send me a PDF file or text to analyze.')

# PDF 파일 처리 함수
async def handle_document(update: Update, context: CallbackContext):
    logger.info("Document received")
    try:
        document: Document = update.message.document
        file = await document.get_file()
        logger.info(f"File info: {file}")
        file_name = document.file_name
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file_path = temp_file.name
            await file.download_to_drive(temp_file_path)
            logger.info("PDF downloaded")
        
        if os.path.exists(temp_file_path):
            await update.message.reply_text('PDF received. Analyzing...')
            text, links = extract_text_and_links_from_pdf(temp_file_path)
            #분석 후 파일 삭제
            os.remove(temp_file_path)
            analysis_result = await analyze_with_chatgpt(text, file_name, links)
            await update.message.reply_text(f'Extracted Info:\n\n{analysis_result}')
        else:
            logger.error("File download failed")
            await update.message.reply_text('File download failed.')
    except Exception as e:
        logger.error(f"Error in handle_document: {e}")
        await update.message.reply_text(f"Error in handle_document: {e}")

# 텍스트 메시지 처리 함수
async def handle_text(update: Update, context: CallbackContext):
    logger.info("Text received")
    try:
        text = update.message.text
        
        if(text == 'lecca'):
            chat_id = update.message.chat_id
            file_path = "C:/Deploy/Lecca/2024-08-22_lecca_output.csv"
            
            try:
                with open(file_path, 'rb') as file:
                    await context.bot.send_document(chat_id=chat_id, document=file)
            except Exception as e:
                print(f"An error occurred: {e}")
                
        #analysis_result = await analyze_with_chatgpt(text, "Text Input", [])
        #await update.message.reply_text(f'Extracted Info:\n\n{analysis_result}')
    except Exception as e:
        logger.error(f"Error in handle_text: {e}")
        await update.message.reply_text(f"Error in handle_text: {e}")

# PDF 파일에서 텍스트와 링크 추출 함수
def extract_text_and_links_from_pdf(file_path):
    text = ''
    links = []

    doc = fitz.open(file_path)
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()

        for link in page.get_links():
            if link['kind'] == fitz.LINK_URI:
                uri = link.get('uri', None)
                if uri:
                    links.append(uri)
        
        for annot in page.annots():
            if annot.info.get("uri"):
                links.append(annot.info["uri"])

    link_pattern = re.compile(r'https?://\S+|www\.\S+|\S+\.(com|io|net|org|co)')
    text_links = link_pattern.findall(text)
    links.extend([link if isinstance(link, str) else link[0] for link in text_links])

    return text, list(set(links))

# ChatGPT를 사용한 텍스트 분석 함수
async def analyze_with_chatgpt(text, file_name, links):
    prompt = (f"Analyze the following PDF text and extract the project_name, summary, category, website, Twitter(X), "
              f"Discord, Github, founders info, Linkedin, fundraising_amount, valuation, and investors:\n\n"
              f"{text}\n\n"
              f"File Name: {file_name}\n"
              f"Links: {', '.join(links)}\n\n"
              f"Extracted Information:\n"
              f"**Project Name:**\n"
              f"**Summary:**\n"
              f"**Category:**\n"
              f"**Website:**\n"
              f"**Twitter(X):**\n"
              f"**Discord:**\n"
              f"**Github:**\n"
              f"**Founders Info:**\n"
              f"**Linkedin:**\n"
              f"**Fundraising Amount:**\n"
              f"**Valuation:**\n"
              f"**Investors:**")

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    extracted_info = response['choices'][0]['message']['content'].strip()
    project_name = extract_project_name(extracted_info)
    if project_name:
        additional_info = get_project_info_from_google(project_name, extracted_info)
        if additional_info:
            extracted_info = update_extracted_info(extracted_info, additional_info)

    return extracted_info

# 구글 검색을 통한 추가 정보 추출
def google_search(query):
    links = []
    try:
        for result in search(query, num_results=5):
            links.append(result)
    except Exception as e:
        logger.error(f"Google search error: {e}")
    
    return links

def extract_info_from_link(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    info = {
        "Website": None,
        "Twitter": None,
        "Discord": None,
        "Github": None,
        "Linkedin": None
    }

    if "official" in url:
        info["Website"] = url

    twitter_link = soup.find('a', href=lambda href: href and "twitter.com" in href)
    if twitter_link:
        info["Twitter"] = twitter_link['href']

    discord_link = soup.find('a', href=lambda href: href and "discord.gg" in href)
    if discord_link:
        info["Discord"] = discord_link['href']

    github_link = soup.find('a', href=lambda href: href and "github.com" in href)
    if github_link:
        info["Github"] = github_link['href']

    return info

def get_project_info_from_google(project_name, extracted_info):
    info_to_search = {
        "Website": f"{project_name} official site",
        "Twitter": f"{project_name} twitter",
        "Discord": f"{project_name} discord",
        "Github": f"{project_name} github",
    }
    
    project_info = {}
    
    for key, query in info_to_search.items():
        links = google_search(query)
        if links:
            project_info[key] = links[0]

    # 창립자 LinkedIn 정보 추가 검색
    founder_names = re.findall(r'- ([^:]+)', extracted_info)
    for name in founder_names:
        links = google_search(f"{name} linkedin {project_name}")
        if links:
            project_info[f"Linkedin ({name})"] = links[0]

    return project_info

def update_extracted_info(extracted_info, additional_info):
    for key, value in additional_info.items():
        extracted_info = re.sub(rf"\*\*{key}:\*\* Not provided in the text", f"**{key}:** {value}", extracted_info)
    return extracted_info

def extract_project_name(extracted_info):
    match = re.search(r'\*\*Project Name:\*\*\s*(.*)', extracted_info)
    if match:
        return match.group(1).strip()
    return None

if __name__ == '__main__':
    logger.info("Starting bot")
    
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.Document.MimeType('application/pdf'), handle_document))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    application.run_polling()
    
    logger.info("Bot is polling")
