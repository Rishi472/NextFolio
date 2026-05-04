import sys
import json
import re
import io

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8', errors='replace')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def sanitize_text(text):
    text = re.sub(r'[\u2018\u2019]', "'", text)
    text = re.sub(r'[\u201C\u201D]', '"', text)
    text = re.sub(r'[\u2013\u2014]', '-', text)
    text = re.sub(r'[\u2022\u25E6\u2023\u25B8\u25C2\u25AA\u25AB]', '-', text) # Preserve bullets
    text = re.sub(r'[\u2026]', '...', text)
    text = re.sub(r'[^\x00-\x7F]', '', text)
    text = re.sub(r'\r\n', '\n', text)
    return text.strip()

def parse_resume(text):
    cleaned_text = sanitize_text(text)
    lines = [l.strip() for l in cleaned_text.split('\n') if l.strip()]
    
    full_name = ''
    for line in lines:
        if not re.search(r'resume|cv|curriculum vitae', line, re.IGNORECASE) and len(line.split(' ')) <= 4:
            full_name = line
            break
    if not full_name and lines:
        full_name = lines[0]
        
    email_match = re.search(r'([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)', cleaned_text, re.IGNORECASE)
    email = email_match.group(1) if email_match else ''
    
    phone_match = re.search(r'(?:(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4})', cleaned_text)
    phone = phone_match.group(0) if phone_match else ''
    
    location_match = re.search(r'^([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}?)$', cleaned_text, re.MULTILINE)
    location = location_match.group(1) if location_match else ''
    
    linkedin_match = re.search(r'(?:linkedin\.com\/in\/)([a-zA-Z0-9_-]+)', cleaned_text, re.IGNORECASE)
    linkedin = linkedin_match.group(0) if linkedin_match else ''
    
    github_match = re.search(r'(?:github\.com\/)([a-zA-Z0-9_-]+)', cleaned_text, re.IGNORECASE)
    github = github_match.group(0) if github_match else ''
    
    def extract_section(pattern):
        match = re.search(pattern, cleaned_text, re.IGNORECASE)
        if match:
            after = cleaned_text[match.end():]
            next_header = re.search(r'\n\s*(Experience|Work Experience|Employment History|Education|Academic Background|Projects|Personal Projects|Skills|Technical Skills|Summary|Profile|Professional Summary|About Me|Bio|Certifications|Licenses|Languages|Achievements|Honors|Awards|Accomplishments)\s*\n', after, re.IGNORECASE)
            if next_header:
                section_content = after[:next_header.start()]
            else:
                section_content = after
            return section_content.strip()
        return ''
    
    def extract_section_raw(pattern):
        """Extract section keeping original line breaks"""
        match = re.search(pattern, cleaned_text, re.IGNORECASE)
        if match:
            after = cleaned_text[match.end():]
            next_header = re.search(r'\n\s*(Experience|Work Experience|Employment History|Education|Academic Background|Projects|Personal Projects|Skills|Technical Skills|Summary|Profile|Professional Summary|About Me|Bio|Certifications|Licenses|Languages|Achievements|Honors|Awards|Accomplishments)\s*\n', after, re.IGNORECASE)
            if next_header:
                section_content = after[:next_header.start()]
            else:
                section_content = after
            return section_content.strip()
        return ''
    
    def parse_education_entries(edu_text):
        """Parse multiple education entries from education section"""
        if not edu_text:
            return []
        
        entries = []
        degree_prefixes = [
            (r'sr\.?\s*sec\.?', 'Senior Secondary'),
            (r'senior\s+secondary', 'Senior Secondary'),
            (r'higher\s+secondary', 'Higher Secondary'),
            (r'intermediate', 'Intermediate'),
            (r'secondary', 'Secondary'),
            (r'matriculation', 'Matriculation'),
            (r'high\s+school', 'High School'),
            (r'class\s*xii|class\s*12', 'Class XII'),
            (r'class\s*x|class\s*10', 'Class X'),
        ]

        def tidy_school(value):
            value = re.sub(r'\b(University|College|Institute|School|Academy)([A-Z][a-z])', r'\1 \2', value or '')
            return re.sub(r'\s+', ' ', value).strip(' ,-|')

        def strip_degree_noise(value):
            value = value or ''
            value = re.sub(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\s*(?:-|to)\s*(?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}|Present|Current)', '', value, flags=re.IGNORECASE)
            value = re.sub(r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(?:19|20)\d{2}', '', value, flags=re.IGNORECASE)
            value = re.sub(r'(?:CGPA|GPA)\s*[:\-]?\s*\d+(?:\.\d+)?(?:\s*/\s*\d+(?:\.\d+)?)?', '', value, flags=re.IGNORECASE)
            value = re.sub(r'\d+(?:\.\d+)?\s*(?:%|percent|percentage)', '', value, flags=re.IGNORECASE)
            return re.sub(r'\s+', ' ', value).strip(' ,-|')

        def split_degree_from_school(school, degree):
            school = tidy_school(school)
            degree = strip_degree_noise(degree)
            if not degree and school:
                for pattern, label in degree_prefixes:
                    match = re.match(rf'^\s*({pattern})[\s,.-]*(.+)$', school, re.IGNORECASE)
                    if match:
                        degree = label
                        school = tidy_school(match.group(2))
                        break
            if not degree and re.search(r'\bSchool\b', school, re.IGNORECASE):
                degree = 'Secondary'
            return school, degree

        lines = [l.strip() for l in edu_text.split('\n') if l.strip()]
        if lines:
            grouped = []
            current = []
            institution_re = r'(University|College|Institute|School|Academy)'

            for line in lines:
                is_institution = re.search(institution_re, line, re.IGNORECASE)
                if is_institution and current:
                    grouped.append('\n'.join(current))
                    current = []
                current.append(line)

            if current:
                grouped.append('\n'.join(current))
        else:
            grouped = []

        # Fallback split by multiple newlines for unusual layouts
        blocks = grouped if grouped else re.split(r'\n\s*\n', edu_text)
        
        for block in blocks:
            block = block.strip()
            if not block or len(block) < 5:
                continue
            
            # Extract school/institution name (usually capitalized, longer text)
            school_match = re.search(r'^([A-Z][^,\n]*(?:University|College|Institute|School|Academy)[^,\n]*)', block, re.IGNORECASE)
            school = school_match.group(1).strip() if school_match else ''
            
            # Extract degree
            degree_match = re.search(r'(Bachelor(?:[ \t]+of[ \t]+[A-Za-z \t-]+)?|Master(?:[ \t]+of[ \t]+[A-Za-z \t-]+)?|PhD|Associate(?:[ \t]+of[ \t]+[A-Za-z \t-]+)?|Diploma(?:[ \t]+in[ \t]+[A-Za-z \t-]+)?|Certification(?:[ \t]+in[ \t]+[A-Za-z \t-]+)?|Senior[ \t]+Secondary|Higher[ \t]+Secondary|Intermediate|Secondary|Matriculation|Class[ \t]*(?:XII|12|X|10)|B\.?[ \t]?S\.?|B\.?[ \t]?A\.?|M\.?[ \t]?S\.?|M\.?[ \t]?B\.?[ \t]?A\.?|B\.?[ \t]?Tech(?:\.|nology)?[^,\n]*|M\.?[ \t]?Tech(?:\.|nology)?[^,\n]*|BCA|MCA|BBA|BCom|MCom|BE|ME)[^,\n]*', block, re.IGNORECASE)
            degree = degree_match.group(0).strip() if degree_match else ''

            if not degree:
                for line in [l.strip() for l in block.split('\n') if l.strip()]:
                    if re.search(r'\b(degree|technology|science|engineering|computer|arts|commerce|business|management|aiml|ai-ml)\b', line, re.IGNORECASE) and not re.search(r'(University|College|Institute|School|Academy)', line, re.IGNORECASE):
                        degree = line
                        break
            
            # Extract graduation date
            school, degree = split_degree_from_school(school, degree)

            range_match = re.search(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\s*(?:-|to)\s*(?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}|Present|Current)', block, re.IGNORECASE)
            date_match = range_match or re.search(r'(\d{4}|\d{1,2}/\d{1,2}/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4})', block, re.IGNORECASE)
            grad_date = date_match.group(0).strip() if date_match else ''

            result_match = re.search(r'((?:CGPA|GPA)\s*[:\-]?\s*\d+(?:\.\d+)?(?:\s*/\s*\d+(?:\.\d+)?)?|\d+(?:\.\d+)?\s*(?:%|percent|percentage))', block, re.IGNORECASE)
            result = result_match.group(0).strip() if result_match else ''
            
            if school or degree:
                entries.append({
                    'degree': degree,
                    'school': school,
                    'graduationDate': grad_date,
                    'result': result
                })
        
        return entries
    
    def parse_experience_entries(exp_text):
        """Parse multiple experience entries from experience section"""
        if not exp_text:
            return []
        
        entries = []
        # Split by multiple newlines or lines starting with a company/job (capitalized text)
        blocks = re.split(r'\n\s*\n|\n(?=[A-Z][A-Za-z0-9\s\&.,]*(?:\n|$))', exp_text)
        
        for block in blocks:
            block = block.strip()
            if not block or len(block) < 5:
                continue
            
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines:
                continue
            
            # First line is usually company name
            company = lines[0] if lines else ''
            
            # Extract job title (often on second line or after company)
            job_title = ''
            job_title_match = re.search(r'(Developer|Engineer|Manager|Designer|Analyst|Coordinator|Specialist|Lead|Head|Director|Senior|Junior|Intern|Consultant|Architect)', block, re.IGNORECASE)
            if job_title_match:
                # Try to get the full job title line
                for line in lines[1:]:
                    if re.search(r'(Developer|Engineer|Manager|Designer|Analyst|Coordinator|Specialist|Lead|Head|Director|Senior|Junior|Intern|Consultant|Architect)', line, re.IGNORECASE):
                        job_title = line
                        break
            
            # Extract dates (pattern: YYYY-YYYY or Mon YYYY - Mon YYYY)
            date_match = re.search(r'(\d{4}|\w+\s+\d{4})\s*(?:-|to)\s*(\d{4}|\w+\s+\d{4}|Present|Current)', block, re.IGNORECASE)
            start_date = date_match.group(1).strip() if date_match else ''
            end_date = date_match.group(2).strip() if date_match else ''
            
            # Get description (rest of the block minus company, title, and dates)
            description = ' '.join(lines[1:]) if len(lines) > 1 else ''
            # Remove dates from description
            description = re.sub(r'\d{4}.*?(?:-|to).*?(?:\d{4}|Present|Current)', '', description, flags=re.IGNORECASE).strip()
            
            if company or job_title:
                entries.append({
                    'jobTitle': job_title,
                    'company': company,
                    'startDate': start_date,
                    'endDate': end_date,
                    'description': description
                })
        
        return entries
        
    exp_raw = extract_section_raw(r'\n\s*(Experience|Work Experience|Employment History)\s*\n')
    edu_raw = extract_section_raw(r'\n\s*(Education|Academic Background)\s*\n')
    proj_raw = extract_section_raw(r'\n\s*(Projects|Personal Projects)\s*\n')
    achieve_raw = extract_section_raw(r'\n\s*(Achievements|Honors|Awards|Accomplishments)\s*\n')
    cert_raw = extract_section_raw(r'\n\s*(Certifications|Licenses)\s*\n')
    
    summary = extract_section(r'\n\s*(Summary|Profile|Professional Summary|About Me|Bio)\s*\n')
    
    if not summary:
        first_header_match = re.search(r'\n\s*(Experience|Work Experience|Employment History|Education|Academic Background|Projects|Personal Projects|Skills|Technical Skills|Certifications|Licenses|Languages|Achievements|Honors|Awards|Accomplishments)\s*\n', cleaned_text, re.IGNORECASE)
        if first_header_match:
            top_text = cleaned_text[:first_header_match.start()]
        else:
            top_text = cleaned_text
            
        for val in [full_name, email, phone, location, linkedin, github]:
            if val:
                top_text = top_text.replace(val, '')
        top_text = re.sub(r'resume|cv|curriculum vitae', '', top_text, flags=re.IGNORECASE)
        summary = re.sub(r'\s+', ' ', top_text).strip()
    
    # Extract skills from Technical Skills section
    skills_section = extract_section(r'\n\s*(Skills|Technical Skills)\s*\n')
    
    # Extract skills from projects section as well
    projects_section = extract_section(r'\n\s*(Projects|Personal Projects)\s*\n')
    
    # Common technical skills to look for
    common_skills = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Java', 'SQL', 'Docker', 'Kubernetes', 'TypeScript', 'HTML', 'CSS', 'Azure', 'GCP', 'Git', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'GraphQL', 'REST', 'API', 'ExpressJS', 'Django', 'Flask', 'Spring Boot', 'Vue.js', 'Angular', 'Flutter', 'Swift', 'Kotlin', 'C++', 'C#', '.NET', 'PHP', 'Ruby', 'Go', 'Rust', 'Linux', 'Windows', 'MacOS']
    
    # Find skills only in the Technical Skills section and Projects section
    found_skills = []
    combined_sections = (skills_section + ' ' + projects_section).lower()
    
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', combined_sections, re.IGNORECASE):
            found_skills.append({'name': skill, 'category': 'Technical'})
    
    # Remove duplicates while preserving order
    seen = set()
    found_skills = [s for s in found_skills if not (s['name'] in seen or seen.add(s['name']))]
    
    # Parse education entries
    education_entries = parse_education_entries(edu_raw)
    
    # Parse experience entries
    experience_entries = parse_experience_entries(exp_raw)
    
    def parse_projects_entries(proj_text):
        if not proj_text:
            return []
            
        # First try to split by double newlines if they exist
        blocks = re.split(r'\n\s*\n', proj_text)
        
        # If there's only 1 block, it means newlines were lost, we need line-by-line parsing
        if len(blocks) == 1:
            lines = [l.strip() for l in proj_text.split('\n') if l.strip()]
            entries_lines = []
            current_project = []
            
            action_verbs = r'^(Developed|Built|Created|Designed|Implemented|Integrated|Led|Managed|Optimized|Reduced|Increased|Collaborated|Worked|Wrote|Authored|Architected|Engineered|Spearheaded|Utilized|Used|Refactored|Maintained|Deployed)\b'
            
            for line in lines:
                is_new_project = False
                
                # If line is NOT a bullet point, AND previous lines were bullet points -> likely a new project title
                is_bullet = line.startswith('-') or line.startswith('*')
                
                if not is_bullet:
                    # Check if it looks like a title
                    if len(line) < 100 and not re.search(action_verbs, line, re.IGNORECASE) and not line.endswith('.') and not re.search(r'^(Tech|Technologies|Skills|Tools|Environment)\b', line, re.IGNORECASE):
                        if len(current_project) > 1:
                            is_new_project = True
                            
                if is_new_project and current_project:
                    entries_lines.append(current_project)
                    current_project = []
                    
                current_project.append(line)
                
            if current_project:
                entries_lines.append(current_project)
                
            blocks = ['\n'.join(p) for p in entries_lines]
            
        entries = []
        for block in blocks:
            block = block.strip()
            if not block or len(block) < 5:
                continue
                
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines:
                continue
                
            title = lines[0]
            # Clean bullet from title if it somehow got there
            title = re.sub(r'^[-*]\s*', '', title)
            
            date_match = re.search(r'(\d{4}|\w+\s+\d{4})\s*(?:-|to)\s*(\d{4}|\w+\s+\d{4}|Present|Current)', block, re.IGNORECASE)
            date = date_match.group(0).strip() if date_match else ''
            
            link_match = re.search(r'(https?://[^\s]+|github\.com[^\s]+)', block)
            link = link_match.group(0).strip() if link_match else ''
            
            description = ' '.join(lines[1:]) if len(lines) > 1 else ''
            if date:
                description = description.replace(date, '').strip()
            if link:
                description = description.replace(link, '').strip()
                
            description = re.sub(r'\s+', ' ', description).strip()
            
            entries.append({
                'title': title,
                'description': description,
                'link': link,
                'date': date
            })
            
        return entries

    def parse_achievements(text):
        if not text:
            return []
            
        blocks = re.split(r'\n\s*\n', text)
        if len(blocks) == 1:
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            entries_lines = []
            current_entry = []
            
            action_verbs = r'^(Developed|Built|Created|Designed|Implemented|Integrated|Led|Managed|Optimized|Reduced|Increased|Collaborated|Worked|Wrote|Authored|Architected|Engineered|Spearheaded|Utilized|Used|Refactored|Maintained|Deployed|Won|Awarded|Achieved|Received|Earned|Recognized)\b'
            
            for line in lines:
                is_bullet = line.startswith('-') or line.startswith('*')
                
                is_title = False
                if not is_bullet:
                    if len(line) < 80 and not re.search(action_verbs, line, re.IGNORECASE) and not line.endswith('.'):
                        is_title = True
                        
                if (is_bullet or (is_title and len(current_entry) >= 2)) and len(current_entry) > 0:
                    entries_lines.append(current_entry)
                    current_entry = []
                    
                current_entry.append(line)
                
            if current_entry:
                entries_lines.append(current_entry)
                
            blocks = ['\n'.join(p) for p in entries_lines]
            
        entries = []
        for block in blocks:
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines: continue
            # Try to grab title and description
            title = lines[0].strip('-* ')
            desc = ' '.join(lines[1:]) if len(lines) > 1 else ''
            
            # Simple date extraction
            date_match = re.search(r'\b(19|20)\d{2}\b', title + ' ' + desc)
            date = date_match.group(0) if date_match else ''
            
            if date and date in title:
                title = title.replace(date, '').strip(' -|,()')
                
            entries.append({'title': title, 'description': desc, 'date': date})
        return entries
        
    def parse_certifications(text):
        if not text:
            return []
            
        blocks = re.split(r'\n\s*\n', text)
        if len(blocks) == 1:
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            entries_lines = []
            current_entry = []
            
            action_verbs = r'^(Developed|Built|Created|Designed|Implemented|Integrated|Led|Managed|Optimized|Reduced|Increased|Collaborated|Worked|Wrote|Authored|Architected|Engineered|Spearheaded|Utilized|Used|Refactored|Maintained|Deployed|Won|Awarded|Achieved|Received|Earned|Recognized)\b'
            
            for line in lines:
                is_bullet = line.startswith('-') or line.startswith('*')
                
                is_title = False
                if not is_bullet:
                    if len(line) < 80 and not re.search(action_verbs, line, re.IGNORECASE) and not line.endswith('.'):
                        is_title = True
                        
                if (is_bullet or (is_title and len(current_entry) >= 2)) and len(current_entry) > 0:
                    entries_lines.append(current_entry)
                    current_entry = []
                    
                current_entry.append(line)
                
            if current_entry:
                entries_lines.append(current_entry)
                
            blocks = ['\n'.join(p) for p in entries_lines]
            
        entries = []
        for block in blocks:
            lines = [l.strip() for l in block.split('\n') if l.strip()]
            if not lines: continue
            
            name = lines[0].strip('-* ')
            issuer = lines[1] if len(lines) > 1 else ''
            # Simple date extraction
            date_match = re.search(r'\b(19|20)\d{2}\b', name + ' ' + issuer)
            date = date_match.group(0) if date_match else ''
            
            if date and date in name:
                name = name.replace(date, '').strip(' -|,()')
                
            # Verify certification: Check if it contains common cert keywords or is short and concise
            cert_keywords = ['certifi', 'aws', 'google', 'microsoft', 'cisco', 'comptia', 'ibm', 'oracle', 'azure', 'meta', 'coursera', 'udemy', 'edx', 'bootcamp', 'degree', 'diploma', 'course', 'training', 'professional', 'associate', 'practitioner', 'specialist', 'expert', 'architect', 'developer', 'engineer', 'scrum', 'agile', 'pmp', 'itil', 'hackerrank', 'freecodecamp', 'codecademy', 'nptel', 'academy']
            is_verified = any(kw in (name + ' ' + issuer).lower() for kw in cert_keywords)
            
            action_verbs = r'^(Developed|Built|Created|Designed|Implemented|Integrated|Led|Managed|Optimized|Worked)\b'
            if re.search(action_verbs, name, re.IGNORECASE):
                continue # Definitely not a certification name
                
            if not is_verified and len(name.split()) > 7:
                continue # If it's long and has no cert keywords, it's probably junk text
            
            entries.append({'name': name, 'issuer': issuer, 'date': date})
        return entries

    project_entries = parse_projects_entries(proj_raw)
    achievement_entries = parse_achievements(achieve_raw)
    certification_entries = parse_certifications(cert_raw)
    
    ai_parsed_data = {
        'personal': {
            'fullName': full_name or '',
            'email': email or '',
            'phone': phone or '',
            'location': location or '',
            'linkedin': linkedin or '',
            'github': github or '',
            'summary': summary or ''
        },
        'experience': experience_entries if experience_entries else [],
        'education': education_entries if education_entries else [],
        'projects': project_entries if project_entries else [],
        'achievements': achievement_entries if achievement_entries else [],
        'certifications': certification_entries if certification_entries else [],
        'skills': found_skills if found_skills else []
    }
    
    return ai_parsed_data

if __name__ == '__main__':
    input_text = sys.stdin.read()
    if not input_text:
        print(json.dumps({'error': 'No input text provided'}))
        sys.exit(1)
        
    try:
        parsed_data = parse_resume(input_text)
        print(json.dumps({'data': parsed_data}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
