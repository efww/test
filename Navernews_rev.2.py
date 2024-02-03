import requests
from bs4 import BeautifulSoup
import pandas as pd
import openpyxl
from openpyxl.utils import get_column_letter

# 웹페이지의 내용을 추출하는 함수 (기존 섹션 헤드라인)
def scrape_section_headlines(url):
    headlines = []
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            items = soup.select('.sa_item._SECTION_HEADLINE, .sa_item._SECTION_HEADLINE.is_blind')
            for item in items:
                title_tag = item.find(class_='sa_text_strong')
                if title_tag:
                    title = title_tag.text.strip()
                    link = title_tag.parent['href']
                    headlines.append({'title': title, 'url': link})
    except Exception as e:
        print(f'Error fetching {url}: {e}')
    return headlines

# opinion_editorial_item 클래스에 대한 내용을 추출하는 함수
def scrape_editorial_opinions(url):
    opinions = []
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            items = soup.find_all(class_='opinion_editorial_item')
            for item in items:
                description = item.find(class_='description').text.strip()
                link = item.find('a')['href']
                press_name = item.find(class_='press_name').text.strip()
                opinions.append({'description': description, 'url': link, 'press_name': press_name})
    except Exception as e:
        print(f'Error fetching {url}: {e}')
    return opinions

# 엑셀 파일을 열고 시트를 선택하는 함수
def open_excel_file(filename, sheetname):
    try:
        workbook = openpyxl.load_workbook(filename)
        sheet = workbook[sheetname]
        return workbook, sheet
    except Exception as e:
        print(f'Error opening {filename}: {e}')
        return None, None

# 데이터를 엑셀 파일에 쓰는 함수 (확장됨)
def write_data_to_excel(workbook, sheet, data, start_row, title_col='E', url_col='F', press_name_col='G'):
    current_row = start_row
    for item in data:
        sheet[f'{title_col}{current_row}'] = item.get('title', item.get('description', ''))
        sheet[f'{url_col}{current_row}'] = item['url']
        if 'press_name' in item:
            sheet[f'{press_name_col}{current_row}'] = item['press_name']
        current_row += 1
    workbook.save('/Users/hyunseo/Downloads/240203 naver news.xlsx')

# 기존 엑셀 파일을 열고, 각 섹션과 에디토리얼 오피니언 데이터를 처리
workbook, sheet = open_excel_file('/Users/hyunseo/Downloads/(양식) naver news.xlsx', '모음')
if workbook is None or sheet is None:
    raise Exception("Failed to open the workbook or sheet.")

# 각 섹션별 시작 행 매핑
section_start_rows = {
    100: 4,
    101: 16,
    102: 28,
    103: 40,
    104: 64,
    105: 52,
}

base_url = 'https://news.naver.com/section/{}'
sections = range(100, 106)  # 100부터 105까지

for section in sections:
    section_url = base_url.format(section)
    data = scrape_section_headlines(section_url)
    if section in section_start_rows:
        start_row = section_start_rows[section]
        write_data_to_excel(workbook, sheet, data, start_row)

# 에디토리얼 오피니언 데이터 처리
editorial_opinions_url = 'https://news.naver.com/opinion/editorial'
editorial_opinions_data = scrape_editorial_opinions(editorial_opinions_url)
edi_sheet = workbook['edi']  # "edi" 시트 선택
write_data_to_excel(workbook, edi_sheet, editorial_opinions_data, start_row=3, title_col='E', url_col='F', press_name_col='G')

# 최종 파일 저장
workbook.save('/Users/hyunseo/Downloads/OUT naver news.xlsx')

