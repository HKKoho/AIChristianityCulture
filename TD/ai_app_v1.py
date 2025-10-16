import gradio as gr
import langgraph
from langchain.chat_models import ChatOpenAI

# Initialize GPT-4o model
gpt4o = ChatOpenAI(model_name="gpt-4o")

# Agent Definitions
def planning_agent(topic):
    prompt = f"""You are a planning agent tasked with creating a comprehensive course outline. 
    Topic: {topic}
    Generate:
    - An introduction to the course
    - A structured outline of key areas to cover
    - Research notes on relevant content"""
    return gpt4o.invoke(prompt)

def course_design_agent(plan):
    prompt = f"""You are a course design agent specializing in creating comprehensive educational content. 
    Given the following plan:
    {plan}

    Develop:
    - Detailed content incorporating business service management principles
    - Sustainable development goals
    - AI integration concepts
    - Self-management learning techniques"""
    return gpt4o.invoke(prompt)

def reflection_agent(content):
    prompt = f"""You are a reflection agent tasked with evaluating course content. 
    Review the following content:
    {content}

    Provide:
    - Feedback on learning objectives alignment
    - Suggestions for enhancing self-learning techniques
    - Recommendations for improving sustainable business principles
    - Analysis of AI integration effectiveness"""
    return gpt4o.invoke(prompt)

# State Management
class CourseState:
    def __init__(self):
        self.topic = ""
        self.plan = ""
        self.content = ""
        self.history = []

    def save(self):
        self.history.append((self.topic, self.plan, self.content))

state = CourseState()

# Graph Setup
graph = langgraph.Graph()
graph.add_node("planning", planning_agent)
graph.add_node("design", course_design_agent)
graph.add_node("reflection", reflection_agent)

graph.add_edge("planning", "design")
graph.add_edge("design", "reflection")

graph.add_output("reflection")

# Gradio Interface
def process_course(topic):
    state.topic = topic
    plan = planning_agent(topic)
    state.plan = plan

    content = course_design_agent(plan)
    state.content = content

    feedback = reflection_agent(content)
    state.save()

    return plan, content, feedback

iface = gr.Interface(
    fn=process_course,
    inputs=["text"],
    outputs=["text", "text", "text"],
    title="AI-Powered Course Builder",
    description="Input a course topic and generate a comprehensive course plan, content, and iterative feedback."
)

if __name__ == "__main__":
    iface.launch()