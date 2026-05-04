import sys
import json
import io

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8', errors='replace')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def calculate_ats_score(resume_data):
    score = 0
    improvements = []
    
    personal = resume_data.get('personal', {})
    
    # Personal Info
    if personal.get('fullName'):
        score += 5
    else:
        improvements.append({"title": "Add Full Name", "desc": "Your name is missing or could not be parsed."})

    if personal.get('email'):
        score += 5
    else:
        improvements.append({"title": "Add Email Address", "desc": "Ensure your email address is included so recruiters can contact you."})

    if personal.get('phone'):
        score += 5
    else:
        improvements.append({"title": "Add Phone Number", "desc": "Include a valid phone number for direct communication."})

    summary = personal.get('summary', '')
    if summary and len(summary) > 50:
        score += 10
    elif summary:
        score += 5
        improvements.append({"title": "Expand Professional Summary", "desc": "Your summary is quite short. Expand it to 3-4 sentences highlighting your core strengths and career goals."})
    else:
        improvements.append({"title": "Add a Professional Summary", "desc": "A strong summary helps ATS algorithms and recruiters quickly understand your value proposition."})

    if personal.get('linkedin') or personal.get('github'):
        score += 5
    else:
        improvements.append({"title": "Add Professional Links", "desc": "Including your LinkedIn or GitHub profile adds credibility and provides more context to your application."})

    # Experience
    experience = resume_data.get('experience', [])
    if experience and len(experience) > 0:
        score += 10
        if len(experience) > 1:
            score += 10
        
        short_descriptions = False
        missing_dates = False
        for exp in experience:
            desc = exp.get('description', '')
            if not desc or len(desc) < 50:
                short_descriptions = True
            if not exp.get('startDate') or not exp.get('endDate'):
                missing_dates = True

        if short_descriptions:
            improvements.append({"title": "Elaborate on Work Experience", "desc": "Some of your experience descriptions are brief. Use bullet points and quantify your achievements with metrics."})
        if missing_dates:
            improvements.append({"title": "Complete Employment Dates", "desc": "Ensure all your work experiences have clear start and end dates (e.g., MM/YYYY) so the ATS can calculate your total years of experience."})
    else:
        improvements.append({"title": "Add Work Experience", "desc": "Include relevant work history. If you are an entry-level candidate, include internships, volunteer work, or relevant academic projects."})

    # Education
    education = resume_data.get('education', [])
    if education and len(education) > 0:
        score += 15
    else:
        improvements.append({"title": "Add Education Details", "desc": "Include your educational background. Many ATS systems filter candidates based on degree requirements."})

    # Skills
    skills = resume_data.get('skills', [])
    if skills and len(skills) > 0:
        skill_count = len(skills)
        if skill_count >= 10:
            score += 20
        elif skill_count >= 5:
            score += 10
            improvements.append({"title": "Add More Skills", "desc": "You have a good start, but adding more relevant keywords to your skills section will improve your ATS match rate."})
        else:
            score += 5
            improvements.append({"title": "Expand Skills Section", "desc": "Your skills section is quite sparse. Add both technical and soft skills relevant to your target role."})
    else:
        improvements.append({"title": "Add a Skills Section", "desc": "A dedicated skills section is crucial for keyword matching in ATS systems."})

    # Projects
    projects = resume_data.get('projects', [])
    if projects and len(projects) > 0:
        score += 15
        short_proj_descriptions = False
        for proj in projects:
            desc = proj.get('description', '')
            if not desc or len(desc) < 50:
                short_proj_descriptions = True
        if short_proj_descriptions:
            improvements.append({"title": "Detail Your Projects", "desc": "Expand the descriptions of your projects to explain the technologies used and the outcomes achieved."})
    else:
        improvements.append({"title": "Add Personal/Academic Projects", "desc": "Including projects is a great way to showcase practical application of your skills, especially if you have limited work experience."})

    # Cap score at 100
    score = min(score, 100)

    if score >= 80:
        message = "This is a high-quality, professional resume. It is clean, well-structured, and rich in technical keywords which makes it very readable for automated systems."
    elif score >= 60:
        message = "Your resume is decent, but has room for improvement. Addressing the suggested areas will help your resume pass through ATS filters more consistently."
    else:
        message = "Your resume might struggle to pass through ATS filters. We highly recommend implementing the suggestions below to improve its structure and content."

    # Default improvements if everything is perfect
    if len(improvements) == 0:
        improvements.append({"title": "Tailor Keywords to the Job Description", "desc": "Your resume is excellent! To maximize your chances, carefully review the job description for each application and ensure matching keywords are present in your resume."})
        improvements.append({"title": "Quantify Achievements", "desc": "Even with a great resume, you can always improve by adding more numbers and metrics to your experience descriptions (e.g., 'improved performance by 15%')."})

    return {"score": score, "message": message, "improvements": improvements}

if __name__ == '__main__':
    input_text = sys.stdin.read()
    if not input_text:
        print(json.dumps({'error': 'No input provided'}))
        sys.exit(1)
        
    try:
        resume_data = json.loads(input_text)
        result = calculate_ats_score(resume_data)
        print(json.dumps({'data': result}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
