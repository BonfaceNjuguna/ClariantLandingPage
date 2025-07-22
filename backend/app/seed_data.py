from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.app_entry import AppEntry
from app.models.user import User

def seed_apps(db: Session):
    data = [
    {
        "name": "PDF Information Extraction Tool",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "/pdfinfo/",
        "port": "9999",
        "status": "Inactive",
    },
    {
        "name": "Voice Analysis",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "/voice/",
        "port": "9998",
        "status": "Active",
    },
    {
        "name": "CLARITA - Your Chemistry Chatbot",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "/langchain-test/",
        "port": "9997",
        "status": "Active",
    },
    {
        "name": "CDS Data Science Dashboard",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "/dashboard/",
        "port": "8501",
        "status": "Active",
    },
    {
        "name": "Kibana Logs",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://localhost:5601/",
        "port": "5601",
        "status": "Active",
    },
    {
        "name": "Chatbot Copilot",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8502/",
        "port": "8502",
        "status": "Active",
    },
    {
        "name": "Clarita GenAI Chatbot",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8503/",
        "port": "8503",
        "status": "Active",
    },
    {
        "name": "Chemical Composition Predictor",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8504/",
        "port": "8504",
        "status": "Active",
    },
    {
        "name": "Analytics Chatbot",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8505/",
        "port": "8505",
        "status": "Active",
    },
    {
        "name": "Data Lake Chatbot",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8506/",
        "port": "8506",
        "status": "Active",
    },
    {
        "name": "Chemistry Language Model",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8507/",
        "port": "8507",
        "status": "Active",
    },
    {
        "name": "ChemDataSpace",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8508/",
        "port": "8508",
        "status": "Active",
    },
    {
        "name": "ChemAI Model Trainer",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8509/",
        "port": "8509",
        "status": "Active",
    },
    {
        "name": "ChemAI Pipeline Visualizer",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8510/",
        "port": "8510",
        "status": "Active",
    },
    {
        "name": "ChemAI Config Editor",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8511/",
        "port": "8511",
        "status": "Active",
    },
    {
        "name": "Clarita Frontend",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:5173/",
        "port": "5173",
        "status": "Active",
    },
    {
        "name": "Clarita Backend",
        "owner": "Dennis Heitmann (dheitman)",
        "description": None,
        "url": "http://10.72.97.155:8000/",
        "port": "8000",
        "status": "Active",
    },
    {
        "name": "LCA App",
        "owner": "Bhumika",
        "description": None,
        "url": "http://10.72.97.155:8585/",
        "port": "8585",
        "status": "Active",
    },
    {
        "name": "Clarita ST App",
        "owner": "Bhumika",
        "description": None,
        "url": "http://10.72.97.155:8587/",
        "port": "8587",
        "status": "Active",
    },
    {
        "name": "MegaPage App",
        "owner": "Bhumika",
        "description": None,
        "url": "http://10.72.97.155:8589/",
        "port": "8589",
        "status": "Active",
    },
]

    for entry in data:
        exists = db.query(AppEntry).filter_by(name=entry["name"]).first()
        if not exists:
            app = AppEntry(**entry)
            db.add(app)
    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    seed_apps(db)
    print("✅ App data seeded.")
