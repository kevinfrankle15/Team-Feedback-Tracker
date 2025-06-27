from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum('manager', 'employee', name='user_roles'), nullable=False)
    team_id = db.Column(db.String(36), db.ForeignKey('teams.id'), nullable=True)
    manager_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'teamId': self.team_id,
            'managerId': self.manager_id
        }

class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    manager_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship('User', backref='team', lazy=True, foreign_keys=[User.team_id])

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.String(36), primary_key=True)
    manager_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    employee_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    strengths = db.Column(db.Text, nullable=False)
    areas_to_improve = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.Enum('positive', 'neutral', 'negative', name='sentiment_types'), nullable=False)
    acknowledged = db.Column(db.Boolean, default=False)
    acknowledged_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    manager = db.relationship('User', foreign_keys=[manager_id], backref='given_feedback')
    employee = db.relationship('User', foreign_keys=[employee_id], backref='received_feedback')

    def to_dict(self):
        return {
            'id': self.id,
            'managerId': self.manager_id,
            'employeeId': self.employee_id,
            'managerName': self.manager.name if self.manager else '',
            'employeeName': self.employee.name if self.employee else '',
            'strengths': self.strengths,
            'areasToImprove': self.areas_to_improve,
            'sentiment': self.sentiment,
            'acknowledged': self.acknowledged,
            'acknowledgedAt': self.acknowledged_at.isoformat() if self.acknowledged_at else None,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }