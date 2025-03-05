from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup: Launch browser
driver = webdriver.Chrome()
driver.get("https://www.imdb.com")


# Step 1: Find the search box and enter a movie name

search_box = driver.find_element(By.CSS_SELECTOR, "input[type='text']")
assert search_box.is_displayed(), "Test Failed: Search Box not found!"
print('Search box present!')
search_box.send_keys("The Batman")
search_box.send_keys(Keys.RETURN)  # Press Enter

time.sleep(2)  # Wait for results to load

# Step 2: Click the first search result
first_result = driver.find_element(By.CLASS_NAME, "ipc-metadata-list-summary-item__t")

print(f'First search result: {first_result.text}')

# TODO Assert finding 'The Batman' Movie 
# Step 1: Click on the first search result to open the movie page
first_result.click()

# Step 2: Wait for the page to fully load with explicit wait
wait = WebDriverWait(driver, 10)

try:
    # Try multiple possible selectors for the title
    selectors = [
        "h1[data-testid='hero__title']",
        "h1.sc-b73cd867-0",  # Common IMDb class pattern
        ".title_title",
        "h1.hero__primary-text"
    ]
    
    movie_title = None
    for selector in selectors:
        try:
            movie_title = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            print(f"Found title using selector: {selector}")
            break
        except:
            continue
    
    if not movie_title:
        # Fallback to any h1 element
        movie_title = wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
        print("Used fallback h1 selector")
    
    # Verify that the movie title matches the original search query
    assert "Batman" in movie_title.text, f"Test Failed: Expected 'Batman' in title, but got '{movie_title.text}'"
    print(f"Movie title found: {movie_title.text}")
    print("Test Passed: IMDb search works correctly!")

except Exception as e:
    print(f"Test failed: {str(e)}")

finally:
    # Cleanup: Close the browser
    driver.quit()