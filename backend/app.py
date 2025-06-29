from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from models import db, User, Team, Feedback
from config import Config
import uuid
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# CORS(app)

CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"])

db.init_app(app)
jwt = JWTManager(app)
@app.route('/')
def index():
    return " Flask server running with PostgreSQL!"
@app.before_request
def create_tables_once():
    if not getattr(app, '_tables_created', False):
        db.create_all()
        seed_data()
        app._tables_created = True

def seed_data():
    if User.query.first():
        return

    manager = User(
        id=str(uuid.uuid4()),
        name='Sarah Johnson',
        email='sarah@company.com',
        role='manager'
    )
    manager.set_password('password')
    db.session.add(manager)
    db.session.commit()

    team = Team(
        id=str(uuid.uuid4()),
        name='Development Team',
        manager_id=manager.id
    )
    db.session.add(team)
    db.session.commit()

    employees = [
        User(id=str(uuid.uuid4()), name='Mike Chen', email='mike@company.com', role='employee', manager_id=manager.id),
        User(id=str(uuid.uuid4()), name='Emily Davis', email='emily@company.com', role='employee', manager_id=manager.id),
        User(id=str(uuid.uuid4()), name='John Smith', email='john@company.com', role='employee', manager_id=manager.id)
    ]

    for emp in employees:
        emp.set_password('password')
        emp.team_id = team.id

    db.session.add_all(employees)
    db.session.commit()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        })

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/feedback', methods=['GET'])
@jwt_required()
def get_feedback():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'manager':
        feedbacks = Feedback.query.filter_by(manager_id=user_id).all()
    else:
        feedbacks = Feedback.query.filter_by(employee_id=user_id).all()

    return jsonify([f.to_dict() for f in feedbacks])

@app.route('/api/feedback', methods=['POST'])
@jwt_required()
def create_feedback():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'manager':
        return jsonify({'message': 'Only managers can create feedback'}), 403

    data = request.get_json()

    feedback = Feedback(
        id=str(uuid.uuid4()),
        manager_id=user_id,
        employee_id=data['employeeId'],
        strengths=data['strengths'],
        areas_to_improve=data['areasToImprove'],
        sentiment=data['sentiment']
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify(feedback.to_dict()), 201

@app.route('/api/feedback/<feedback_id>', methods=['PUT'])
@jwt_required()
def update_feedback(feedback_id):
    user_id = get_jwt_identity()
    feedback = Feedback.query.get_or_404(feedback_id)

    if feedback.manager_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    feedback.strengths = data.get('strengths', feedback.strengths)
    feedback.areas_to_improve = data.get('areasToImprove', feedback.areas_to_improve)
    feedback.sentiment = data.get('sentiment', feedback.sentiment)

    db.session.commit()
    return jsonify(feedback.to_dict())

@app.route('/api/feedback/<feedback_id>/acknowledge', methods=['POST'])
@jwt_required()
def acknowledge_feedback(feedback_id):
    user_id = get_jwt_identity()
    feedback = Feedback.query.get_or_404(feedback_id)

    if feedback.employee_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    feedback.acknowledged = True
    feedback.acknowledged_at = datetime.utcnow()

    db.session.commit()
    return jsonify(feedback.to_dict())

@app.route('/api/team/members', methods=['GET'])
@jwt_required()
def get_team_members():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'manager':
        return jsonify({'message': 'Only managers can view team members'}), 403

    members = User.query.filter_by(manager_id=user_id).all()
    return jsonify([member.to_dict() for member in members])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
