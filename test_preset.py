from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    print("Launching chromium...")
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("Navigating to http://localhost:3000...")
    page.goto('http://localhost:3000')
    
    print("Waiting for network idle...")
    page.wait_for_load_state('networkidle')
    
    # Wait for the preset buttons to be visible
    print("Waiting for quick style buttons...")
    page.wait_for_selector('button[data-group=\"quickStyle\"]')
    
    # Click the second quick style ('Cinematic Scene' or similar)
    print("Clicking a quick style button...")
    buttons = page.locator('button[data-group=\"quickStyle\"]').all()
    if len(buttons) > 1:
        buttons[1].click()
    else:
        print("Couldn't find preset buttons.")
        
    # Wait a tiny bit for the UI to update
    time.sleep(1)
    
    # Check outputs
    prompt_text = page.locator('#promptOutput').text_content()
    json_text = page.locator('#jsonOutput').text_content()
    
    print(f"\n--- RESULTS ---")
    print(f"Prompt Length: {len(prompt_text)}")
    if len(prompt_text) > 0:
        print(f"Sample Prompt: {prompt_text[:100]}...")
        
    print(f"JSON Length: {len(json_text)}")
    if len(json_text) > 0:
        print(f"Sample JSON: {json_text[:100]}...")
        
    # Look for console errors just in case
    print("\nCheck finished.")
    browser.close()
