
import os
import sys
import argparse
import time
import hashlib
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv
import google.generativeai as genai
from pdf2image import convert_from_path

# Load environment variables
load_dotenv()
load_dotenv(".env.local")

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    print("[ERROR] GEMINI_API_KEY or GOOGLE_API_KEY not found in environment.")
    sys.exit(1)

genai.configure(api_key=API_KEY)

# Configuration
MODEL_NAME = "gemini-flash-latest" 

def process_page_vision(image, page_num):
    """Process a single page image with Gemini Vision to extract formatted messages."""
    model = genai.GenerativeModel(MODEL_NAME)
    
    prompt = """
    You are an AI assistant processing message logs.
    Your goal is to extract messages and format them as HTML divs based on their alignment in the image to reconstruct the conversation flow.

    Instructions:
    1. Identify all message bubbles on the page.
    2. If a message is visually on the RIGHT side (usually outgoing/blue), format it as:
       <div style="text-align: right; margin: 5px; color: #0066cc;">[CONTENT]</div>
    3. If a message is visually on the LEFT side (usually incoming/gray), format it as:
       <div style="text-align: left; margin: 5px; color: #333;">[CONTENT]</div>
    4. If there is a timestamp, format it with the same alignment as the associated message.
    5. IGNORE page headers or footers like "Page X of Y", "iMessage", "extract by DigiDNA", etc.
    6. Output ONLY the HTML strings, one per line. Do not wrap in markdown code blocks.
    """
    
    # Relax safety settings for forensic document analysis
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]
    
    max_retries = 3
    base_delay = 5 
    
    for attempt in range(max_retries):
        try:
            response = model.generate_content([prompt, image], safety_settings=safety_settings)
            
            # Check for block reasons
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                 print(f"  [WARN] Page {page_num} blocked: {response.prompt_feedback.block_reason}")
            
            return response.text
        except Exception as e:
            print(f"  [WARN] Error processing page {page_num} (Attempt {attempt+1}/{max_retries}): {e}")
            
            delay = base_delay * (attempt + 1)
            if "429" in str(e) or "Resource exhausted" in str(e):
                print("   [INFO] Rate limit hit. Waiting 30s...")
                delay = 30
                
            if attempt < max_retries - 1:
                time.sleep(delay)
            else:
                return f"<!-- Error processing page {page_num}: {e} -->"

def process_pdf(pdf_path, output_file_path):
    """Process a full PDF."""
    pdf_name = Path(pdf_path).stem
    output_path = Path(output_file_path)
    
    if output_path.exists():
        print(f"[SKIP] {pdf_name} (already exists)")
        return

    print(f"[PDF] Processing: {pdf_name}")
    
    try:
        images = convert_from_path(str(pdf_path), dpi=200) # 200 DPI is sufficient for text
    except Exception as e:
        print(f"[ERROR] Converting PDF to images: {e}")
        return

    # Initialize file with header
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"<!-- Source: {pdf_name} -->\n\n")
    
    for i, image in enumerate(tqdm(images, desc=f"   Pages")):
        page_num = i + 1
        page_text = process_page_vision(image, page_num)
        
        # Append to file
        with open(output_path, "a", encoding="utf-8") as f:
            f.write(f"\n<!-- Page {page_num} -->\n")
            f.write(page_text + "\n")
            
        time.sleep(0.5) # Reduced safety delay since we have retries

def main():
    parser = argparse.ArgumentParser(description="Process PDF message logs with Gemini Vision.")
    parser.add_argument("--file", required=True, help="Path to input PDF file")
    parser.add_argument("--output", required=True, help="Path to output Markdown file")
    
    args = parser.parse_args()
    
    input_path = Path(args.file)
    output_path = Path(args.output)
    
    if not input_path.exists():
        print(f"[ERROR] Input file not found: {input_path}")
        sys.exit(1)
        
    print(f"[INFO] Processing {input_path.name} -> {output_path.name}")
    process_pdf(input_path, output_path)

if __name__ == "__main__":
    main()
