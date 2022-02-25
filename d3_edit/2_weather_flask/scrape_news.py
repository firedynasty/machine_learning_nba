from splinter import Browser
from bs4 import BeautifulSoup as bs
import time

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)

def scrape_info():
    browser = init_browser()

    url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"

    browser.visit(url)

    time.sleep(1)

    html = browser.html
    soup = bs(html, "html.parser")

    results = soup.find_all('li', class_='slide')

    results_title = results[0].find_all('h3')[0].text

    results_paragraph = results[0].find_all('div', 'rollover_description_inner')[0].text

    news_data = {
    	"title": results_title,
    	"paragraph": results_paragraph

    }

    browser.quit()

    return news_data