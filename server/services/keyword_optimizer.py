import sys
import json
import re
import io

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8', errors='replace')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def optimize_keywords(resume_skills, job_description):
    jd_lower = job_description.lower()
    found_skills = [s.lower() for s in resume_skills]
    
    # In a real ML system, this would extract keywords dynamically using NLP/NER
    # For now, we simulate extraction with an extended list of technical keywords
    tech_keywords = [
        'react', 'node.js', 'typescript', 'aws', 'docker', 'graphql', 'sql', 
        'python', 'java', 'kubernetes', 'azure', 'gcp', 'javascript', 'html', 
        'css', 'mongodb', 'postgresql', 'redis', 'kafka', 'ci/cd', 'agile'
    ]
    
    missing_keywords = []
    for kw in tech_keywords:
        # Check if the keyword is present in the job description
        if re.search(r'\b' + re.escape(kw) + r'\b', jd_lower):
            # Check if the user already has this skill
            if kw not in found_skills:
                missing_keywords.append(kw)
                
    return missing_keywords

if __name__ == '__main__':
    input_text = sys.stdin.read()
    if not input_text:
        print(json.dumps({'error': 'No input provided'}))
        sys.exit(1)
        
    try:
        data = json.loads(input_text)
        resume_skills = data.get('skills', [])
        job_description = data.get('targetJobDescription', '')
        
        missing = optimize_keywords(resume_skills, job_description)
        print(json.dumps({'data': missing}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
