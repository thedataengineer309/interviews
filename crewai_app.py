"""
CrewAI Interview Analysis Application
Analyzes interview experiences and generates practice questions
"""

import os
import glob
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown

# Load environment variables
load_dotenv()

console = Console()


class InterviewAnalyzer:
    """Analyzes interview text files and extracts structured information"""
    
    def __init__(self):
        self.interview_files = []
        self.load_interviews()
    
    def load_interviews(self):
        """Load all interview files from the repository"""
        # Find all .txt files in subdirectories
        for txt_file in glob.glob("**/*.txt", recursive=True):
            # Skip test files and other non-interview files
            if "interview" not in txt_file.lower() and not any(
                char.isupper() for char in os.path.basename(os.path.dirname(txt_file))
            ):
                continue
            
            # Get directory (first letter of company)
            dir_name = os.path.basename(os.path.dirname(txt_file))
            if len(dir_name) == 1 and dir_name.isalpha():
                self.interview_files.append(txt_file)
    
    def read_interview_file(self, file_path: str) -> str:
        """Read content of an interview file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"
    
    def get_all_interviews_content(self) -> str:
        """Get concatenated content of all interview files"""
        all_content = []
        for file_path in self.interview_files:
            file_name = os.path.basename(file_path)
            content = self.read_interview_file(file_path)
            all_content.append(f"=== {file_name} ===\n{content}\n")
        return "\n".join(all_content)


# Initialize analyzer
analyzer = InterviewAnalyzer()


# Define CrewAI Agents
interview_analyst = Agent(
    role='Senior Interview Analyst',
    goal='Analyze interview experiences and extract key patterns, topics, and question types',
    backstory="""You are an expert in analyzing technical interviews, especially for Data Engineering roles.
    You have years of experience understanding what makes a good interview question and identifying
    common themes across different companies and roles.""",
    verbose=True,
    allow_delegation=False
)

question_generator = Agent(
    role='Practice Question Generator',
    goal='Generate realistic practice questions based on interview patterns and topics',
    backstory="""You are a skilled educator who creates practice questions that help candidates
    prepare for real interviews. You understand the difficulty levels and can create questions
    that cover various aspects of data engineering, from basics to advanced topics.""",
    verbose=True,
    allow_delegation=False
)

study_guide_creator = Agent(
    role='Study Guide Creator',
    goal='Create comprehensive study guides and recommendations based on interview analysis',
    backstory="""You are an expert learning advisor who helps candidates prepare effectively.
    You can identify knowledge gaps and create structured learning paths based on what
    interviewers commonly ask.""",
    verbose=True,
    allow_delegation=False
)


def analyze_interviews_crew():
    """Create a crew to analyze interviews"""
    interviews_content = analyzer.get_all_interviews_content()
    
    analysis_task = Task(
        description=f"""Analyze the following interview experiences and extract:
        1. Most common topics/themes
        2. Question difficulty patterns
        3. Company-specific focus areas
        4. Role-specific requirements (AWS Data Engineer, etc.)
        5. Key skills frequently tested
        
        Interview Content:
        {interviews_content}
        
        Provide a comprehensive analysis with insights and trends.""",
        agent=interview_analyst,
        expected_output="A detailed analysis report with topics, patterns, and insights"
    )
    
    crew = Crew(
        agents=[interview_analyst],
        tasks=[analysis_task],
        process=Process.sequential,
        verbose=True
    )
    
    return crew


def generate_practice_questions_crew(topic: str = None, difficulty: str = "medium"):
    """Create a crew to generate practice questions"""
    interviews_content = analyzer.get_all_interviews_content()
    
    topic_filter = f"Focus on: {topic}" if topic else "Cover various topics"
    
    question_task = Task(
        description=f"""Based on the following interview experiences, generate practice questions:
        
        {topic_filter}
        Difficulty level: {difficulty}
        
        Interview Content Reference:
        {interviews_content[:2000]}...  # Truncated for context
        
        Generate 5-10 practice questions that:
        1. Match the style and difficulty of real interviews
        2. Cover important topics
        3. Include both theoretical and practical questions
        4. Provide suggested approaches/answers
        
        Format each question with:
        - Question text
        - Suggested approach
        - Key points to cover
        - Difficulty level""",
        agent=question_generator,
        expected_output="A list of practice questions with approaches and key points"
    )
    
    crew = Crew(
        agents=[question_generator],
        tasks=[question_task],
        process=Process.sequential,
        verbose=True
    )
    
    return crew


def create_study_guide_crew():
    """Create a crew to generate study guides"""
    interviews_content = analyzer.get_all_interviews_content()
    
    study_guide_task = Task(
        description=f"""Based on the interview analysis, create a comprehensive study guide:
        
        Interview Content:
        {interviews_content}
        
        Create a study guide that includes:
        1. Priority topics to study (ranked by frequency)
        2. Recommended learning path
        3. Resources and focus areas
        4. Common pitfalls to avoid
        5. Practice recommendations
        
        Make it actionable and structured for someone preparing for Data Engineering interviews.""",
        agent=study_guide_creator,
        expected_output="A comprehensive, structured study guide with actionable recommendations"
    )
    
    crew = Crew(
        agents=[study_guide_creator],
        tasks=[study_guide_task],
        process=Process.sequential,
        verbose=True
    )
    
    return crew


def main():
    """Main application interface"""
    console.print(Panel.fit(
        "[bold cyan]CrewAI Interview Analysis Application[/bold cyan]\n"
        "Analyze interviews and generate practice questions",
        border_style="cyan"
    ))
    
    while True:
        console.print("\n[bold]Options:[/bold]")
        console.print("1. Analyze all interviews")
        console.print("2. Generate practice questions")
        console.print("3. Create study guide")
        console.print("4. Exit")
        
        choice = console.input("\n[cyan]Select an option (1-4): [/cyan]")
        
        if choice == "1":
            console.print("\n[bold yellow]Analyzing interviews...[/bold yellow]")
            crew = analyze_interviews_crew()
            result = crew.kickoff()
            console.print("\n[bold green]Analysis Complete:[/bold green]")
            console.print(Panel(Markdown(str(result)), title="Interview Analysis"))
        
        elif choice == "2":
            topic = console.input("[cyan]Enter topic (or press Enter for all topics): [/cyan]")
            difficulty = console.input("[cyan]Difficulty (easy/medium/hard) [medium]: [/cyan]") or "medium"
            console.print("\n[bold yellow]Generating practice questions...[/bold yellow]")
            crew = generate_practice_questions_crew(topic if topic else None, difficulty)
            result = crew.kickoff()
            console.print("\n[bold green]Questions Generated:[/bold green]")
            console.print(Panel(Markdown(str(result)), title="Practice Questions"))
        
        elif choice == "3":
            console.print("\n[bold yellow]Creating study guide...[/bold yellow]")
            crew = create_study_guide_crew()
            result = crew.kickoff()
            console.print("\n[bold green]Study Guide Created:[/bold green]")
            console.print(Panel(Markdown(str(result)), title="Study Guide"))
        
        elif choice == "4":
            console.print("[bold green]Goodbye![/bold green]")
            break
        
        else:
            console.print("[bold red]Invalid option. Please try again.[/bold red]")


if __name__ == "__main__":
    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        console.print("[bold red]Error: OPENAI_API_KEY not found in environment variables[/bold red]")
        console.print("Please create a .env file with: OPENAI_API_KEY=your_key_here")
        console.print("Or set it as an environment variable.")
    else:
        main()

