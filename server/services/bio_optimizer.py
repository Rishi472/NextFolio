import sys
import json
import io
import re
import os
import urllib.request
import urllib.error
import random

import urllib.parse

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8', errors='replace')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def correct_spelling(text):
    try:
        url = "https://api.languagetool.org/v2/check"
        data = urllib.parse.urlencode({'language': 'en-US', 'text': text}).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            matches = sorted(res_data.get('matches', []), key=lambda x: x['offset'], reverse=True)
            for match in matches:
                replacements = match.get('replacements', [])
                if replacements:
                    best_replacement = replacements[0]['value']
                    offset = match['offset']
                    length = match['length']
                    text = text[:offset] + best_replacement + text[offset + length:]
        return text
    except Exception:
        return text

def optimize_bio(resume_data):
    personal = resume_data.get('personal', {})
    skills = resume_data.get('skills', [])
    experience = resume_data.get('experience', [])
    
    current_bio = personal.get('summary', '').strip()
    full_name = personal.get('fullName', 'A dedicated professional')
    
    skill_names = [s if isinstance(s, str) else s.get('name', '') for s in skills]
    skill_names = [s for s in skill_names if s]
    
    job_titles = [e.get('jobTitle', '') for e in experience if e.get('jobTitle')]
    companies = [e.get('company', '') for e in experience if e.get('company')]
    
    primary_title = job_titles[0] if job_titles else "Professional"
    
    # Try calling OpenAI API if key exists
    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            if current_bio:
                prompt = f"Please professionally optimize, summarize, and thoroughly correct any spelling or grammatical errors in the following resume bio. Enhance its impact but keep the core message intact. Do not add fictitious experience. It must be strictly under 600 characters:\n\n'{current_bio}'"
            else:
                prompt = f"Write a highly professional, engaging resume bio/summary for a {primary_title}. "
                if skill_names:
                    prompt += f"Include these key skills seamlessly: {', '.join(skill_names[:5])}. "
                if companies:
                    prompt += f"Mention their experience at {companies[0]}. "
                prompt += "The bio must be written in the first person (or third person without pronouns) and strictly under 600 characters."
            
            data = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 150,
                "temperature": 0.7
            }
            
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                optimized_bio = res_data['choices'][0]['message']['content'].strip()
                
                # Remove quotes if the AI wrapped it
                if optimized_bio.startswith('"') and optimized_bio.endswith('"'):
                    optimized_bio = optimized_bio[1:-1]
                    
                if len(optimized_bio) > 600:
                    truncated = optimized_bio[:597]
                    last_space = truncated.rfind(' ')
                    return (truncated[:last_space] + ".") if last_space > 0 else (truncated + ".")
                return optimized_bio
        except Exception as e:
            pass # Fallback to local generation on error

    # Non-repetitive fallback using dynamic templates
    if current_bio:
        # Just optimize/summarize the existing bio
        optimized_bio = correct_spelling(current_bio).strip()
        if not optimized_bio.endswith('.'):
            optimized_bio += '.'
        optimized_bio = optimized_bio[0].upper() + optimized_bio[1:]
        
        # Add a dynamic closing statement to "optimize" it slightly
        closings = [
            " Adapt at collaborating with cross-functional teams to bring strategic vision into reality.",
            " Committed to continuous improvement and eager to bring hands-on execution to a dynamic team.",
            " Always looking to leverage technical prowess and innovative thinking to conquer the next big challenge."
        ]
        if len(optimized_bio) < 450: # Only add if there is room
            optimized_bio += random.choice(closings)
    else:
        # Generate from scratch if no bio is provided
        openings = [
            f"Highly motivated and results-driven {primary_title} with a passion for delivering innovative solutions.",
            f"Accomplished {primary_title} known for driving business success and achieving strategic goals.",
            f"Dynamic {primary_title} equipped with a proven track record of solving complex problems."
        ]
        
        optimized_bio = random.choice(openings) + " "
            
        if companies:
            comps = " and ".join(companies[:2])
            mid_sections = [
                f"Previously demonstrated excellence at organizations like {comps}.",
                f"Brings valuable insights gained from impactful tenures at {comps}.",
                f"Consistently surpassed expectations while contributing to the growth of {comps}."
            ]
            optimized_bio += random.choice(mid_sections) + " "
            
        if skill_names:
            if len(skill_names) > 3:
                top_skills = ", ".join(skill_names[:5])
                skill_sections = [
                    f"Possesses deep technical expertise, particularly proficient in {top_skills}.",
                    f"Leverages a strong command of {top_skills} to drive successful outcomes.",
                    f"Recognized for advanced proficiency in areas such as {top_skills}."
                ]
                optimized_bio += random.choice(skill_sections) + " "
                
        closings = [
            "Adapts at collaborating with cross-functional teams to bring strategic vision into reality.",
            "Committed to continuous improvement and eager to bring hands-on execution to a dynamic team.",
            "Always looking to leverage technical prowess and innovative thinking to conquer the next big challenge."
        ]
        optimized_bio += random.choice(closings)
    
    if len(optimized_bio) > 600:
        truncated = optimized_bio[:597]
        last_space = truncated.rfind(' ')
        if last_space > 0:
            optimized_bio = truncated[:last_space] + "."
        else:
            optimized_bio = truncated + "."
            
    return optimized_bio

if __name__ == '__main__':
    input_text = sys.stdin.read()
    if not input_text:
        print(json.dumps({'error': 'No input text provided'}))
        sys.exit(1)
        
    try:
        data = json.loads(input_text)
        optimized = optimize_bio(data)
        print(json.dumps({'data': optimized}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
