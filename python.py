from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
# import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua_chave_secreta_aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    answers = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    meta_description = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    articles = Article.query.order_by(Article.created_at.desc()).limit(3).all()
    return render_template('index.html', articles=articles)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(username=username, email=email, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Conta criada com sucesso! Faça login.', 'success')
            return redirect(url_for('login'))
        except:
            flash('Erro ao criar conta. Email ou usuário já existente.', 'danger')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login falhou. Verifique seu email e senha.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/blog')
def blog():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return render_template('blog.html', articles=articles)

@app.route('/article/<string:slug>')
def article(slug):
    article = Article.query.filter_by(slug=slug).first_or_404()
    return render_template('article.html', article=article)

@app.route('/premium')
@login_required
def premium():
    return render_template('premium.html')

@app.route('/save_answers', methods=['POST'])
@login_required
def save_answers():
    if request.method == 'POST':
        current_user.answers = request.json
        db.session.commit()
        return jsonify({'status': 'success'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Criar alguns artigos de exemplo se não existirem
        if not Article.query.first():
            articles = [
                {
                    'title': 'Como descobrir seu tipo de rosto - Guia completo',
                    'slug': 'descobrir-tipo-rosto',
                    'content': 'Conteúdo detalhado sobre formatos de rosto...',
                    'meta_description': 'Aprenda a identificar seu formato de rosto e quais cortes de cabelo mais combinam com você.'
                },
                {
                    'title': 'Visagismo: Transforme sua autoestima através do cabelo',
                    'slug': 'visagismo-autoestima',
                    'content': 'Como o visagismo pode melhorar sua autoimagem...',
                    'meta_description': 'Descubra como o visagismo pode transformar sua aparência e aumentar sua confiança.'
                },
                {
                    'title': '5 Cortes de cabelo que valorizam seu formato facial',
                    'slug': '5-cortes-para-formato-facial',
                    'content': 'Lista dos melhores cortes para cada tipo de rosto...',
                    'meta_description': 'Confira os melhores cortes de cabelo para valorizar seu formato facial específico.'
                }
            ]
            
            for article_data in articles:
                article = Article(
                    title=article_data['title'],
                    slug=article_data['slug'],
                    content=article_data['content'],
                    meta_description=article_data['meta_description']
                )
                db.session.add(article)
            
            db.session.commit()
    
    app.run(debug=True)