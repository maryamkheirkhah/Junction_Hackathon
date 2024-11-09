import pandas as pd
import os
from pydantic import BaseModel
from openai import OpenAI
from colorama import init, Fore, Style
import time
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define Pydantic model for structured translation response
class TranslationResult(BaseModel):
    translated_text: str

# Add these variables at the top level
last_update_time = time.time()
last_processed_text = ""

def translate_text(text, target_language="English"):
    """Translate text using structured output from GPT-4."""
    global last_update_time, last_processed_text
    
    if pd.isna(text) or text.strip() == "":
        return text  # Return as-is if empty or NaN
    
    # Progress update every 5 seconds
    current_time = time.time()
    if current_time - last_update_time >= 5:
        print(f"{Fore.GREEN}[{datetime.now().strftime('%H:%M:%S')}] Last processed: {last_processed_text[:50]}...{Style.RESET_ALL}")
        last_update_time = current_time
    
    try:
        # Request structured translation from GPT-4 with timeout
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "Translate the following text."},
                {"role": "user", "content": f"Translate to {target_language}: {text}"}
            ],
            response_format=TranslationResult,
            timeout=30  # 30 second timeout
        )
        translated_text = completion.choices[0].message.parsed.translated_text
        last_processed_text = text  # Store for progress updates
        return translated_text
    except Exception as e:
        print(f"{Fore.RED}Error translating text: {text[:50]}... - {e}{Style.RESET_ALL}")
        return text  # Return original text if an error occurs

def is_row_empty(row):
    """Check if a row is completely empty or contains only NaN/empty values."""
    return all(pd.isna(val) or (isinstance(val, str) and val.strip() == "") for val in row)

def process_sheet(df):
    """Process a sheet and return False if it should stop processing the workbook."""
    empty_row_count = 0
    
    # Check first 5 rows
    for i in range(min(5, len(df))):
        if is_row_empty(df.iloc[i]):
            print(f"{Fore.RED}⚠️  Warning: Empty row detected at position {i+1} in top 5 rows")
            print(f"{Fore.YELLOW}📋 Sheet contents up to this row:")
            print(f"{Fore.CYAN}{df.iloc[:i+1]}")
            print(f"{Fore.RED}🛑 Stopping all processing{Style.RESET_ALL}")
            return False
    
    # Process rows until we find 5 consecutive empty rows
    processed_df = pd.DataFrame(columns=df.columns)
    
    for idx, row in df.iterrows():
        if is_row_empty(row):
            empty_row_count += 1
            if empty_row_count >= 5:
                break
        else:
            empty_row_count = 0
            # Translate non-empty row
            translated_row = row.copy()
            for col in df.columns:
                val = row[col]
                if isinstance(val, str):
                    translated_row[col] = translate_text(val)
            processed_df.loc[idx] = translated_row
    
    return processed_df

# Load the input Excel file and get all sheet names
input_path = './Liite 3 Datahub Muutostoiveet 20240816.xlsx'
output_path = './english_translation.xlsx'
excel_data = pd.ExcelFile(input_path)
sheets = excel_data.sheet_names

# Iterate through each sheet, translate, and save the translated data
with pd.ExcelWriter(output_path) as writer:
    for sheet in sheets:
        print(f"Processing sheet: {sheet}")
        # Read the sheet into a DataFrame
        df = excel_data.parse(sheet)
        
        # Process the sheet
        processed_df = process_sheet(df)
        
        # If processing_df is False, stop all processing
        if processed_df is False:
            print("Stopping all sheet processing due to empty rows at the top")
            break
            
        # Write the translated DataFrame back to the Excel file
        processed_df.to_excel(writer, sheet_name=sheet, index=False)

print(f"Translation completed. Translated file saved as {output_path}")
