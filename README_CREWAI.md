# CrewAI Interview Analysis Application

A multi-agent AI application built with CrewAI that analyzes interview experiences and helps candidates prepare for Data Engineering interviews.

## Features

🤖 **Three AI Agents:**
- **Interview Analyst**: Analyzes interview patterns, topics, and trends
- **Practice Question Generator**: Creates realistic practice questions based on real interviews
- **Study Guide Creator**: Generates comprehensive study guides and learning paths

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up API Key

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**Get your API key from:** [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Run the Application

```bash
python crewai_app.py
```

## Usage

The application provides an interactive menu with three main options:

1. **Analyze all interviews**
   - Analyzes all interview files in the repository
   - Extracts common topics, patterns, and insights
   - Identifies company-specific focus areas

2. **Generate practice questions**
   - Creates practice questions based on real interview patterns
   - You can specify a topic and difficulty level
   - Questions include suggested approaches and key points

3. **Create study guide**
   - Generates a comprehensive study guide
   - Prioritizes topics by frequency
   - Provides learning paths and recommendations

## How It Works

The application uses CrewAI's multi-agent framework:

1. **Interview Analyzer** reads all interview files from subdirectories
2. **Agents** process the content using LLM capabilities
3. **Results** are formatted and displayed in a user-friendly interface

## Example Output

When you select "Analyze all interviews", you'll get insights like:
- Most frequently asked topics (e.g., Spark, AWS, SQL)
- Difficulty patterns across companies
- Role-specific requirements
- Key skills commonly tested

## Notes

- The application automatically discovers all `.txt` files in letter-named directories (E/, P/, etc.)
- Make sure you have interview files in the repository before running analysis
- The application uses OpenAI's API by default (you can configure other providers)

## Troubleshooting

**Error: OPENAI_API_KEY not found**
- Make sure you've created a `.env` file with your API key
- Check that the `.env` file is in the same directory as `crewai_app.py`

**No interviews found**
- Ensure interview files follow the naming convention: `company_role_experience_month_year.txt`
- Files should be in folders named with a single letter (e.g., E/, P/, T/)

