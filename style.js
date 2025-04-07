
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da UI
    const questionContainer = document.getElementById('questionContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');
    const resultsModal = document.getElementById('resultsModal');
    const resultsContent = document.getElementById('resultsContent');
    const closeModal = document.getElementById('closeModal');
    const btnRestart = document.getElementById('btnRestart');
    
    // Estado do aplicativo
    let currentQuestion = 0;
    let answers = {};
    
    // Perguntas do questionário baseadas em Hallawell
    const questions = [
        {
            id: 'gender',
            title: 'Com qual gênero você mais se identifica?',
            type: 'option',
            options: [
                { text: 'Mulher', value: 'mulher' },
                { text: 'Homem', value: 'homem' },
                { text: 'Não-binário', value: 'nao-binario' }
            ]
        },
        {
            id: 'faceShape',
            title: 'Qual o formato predominante do seu rosto?',
            type: 'option',
            options: [
                { text: 'Oval (proporcional)', value: 'oval' },
                { text: 'Redondo (curvas suaves)', value: 'redondo' },
                { text: 'Quadrado (ângulos marcados)', value: 'quadrado' },
                { text: 'Retangular (comprido)', value: 'retangular' },
                { text: 'Triangular (queixo estreito)', value: 'triangular' },
                { text: 'Diamante (maior largura nos ossos)', value: 'diamante' }
            ]
        },
        {
            id: 'features',
            title: 'Quais seus traços faciais mais marcantes?',
            type: 'option',
            multiple: true,
            options: [
                { text: 'Olhos grandes', value: 'olhos-grandes' },
                { text: 'Nariz proeminente', value: 'nariz-proeminente' },
                { text: 'Lábios carnudos', value: 'labios-carnudos' },
                { text: 'Testa larga', value: 'testa-larga' },
                { text: 'Queixo forte', value: 'queixo-forte' },
                { text: 'Maçãs do rosto altas', value: 'macas-altas' }
            ]
        },
        {
            id: 'styleArchetype',
            title: 'Qual arquétipo de estilo mais combina com você?',
            type: 'option',
            options: [
                { text: 'Clássico (elegância atemporal)', value: 'classico' },
                { text: 'Romântico (suave e delicado)', value: 'romantico' },
                { text: 'Dramático (impactante e ousado)', value: 'dramatico' },
                { text: 'Natural (despojado e orgânico)', value: 'natural' },
                { text: 'Criativo (inovador e artístico)', value: 'criativo' },
                { text: 'Sedutor (sensual e misterioso)', value: 'sedutor' }
            ]
        },
        {
            id: 'contrast',
            title: 'Qual o nível de contraste entre seus traços?',
            type: 'option',
            options: [
                { text: 'Alto contraste (ex: pele clara + cabelo escuro)', value: 'alto' },
                { text: 'Médio contraste', value: 'medio' },
                { text: 'Baixo contraste (tons próximos)', value: 'baixo' }
            ]
        },
        {
            id: 'hairType',
            title: 'Qual a textura natural do seu cabelo?',
            type: 'option',
            options: [
                { text: 'Liso', value: 'liso' },
                { text: 'Ondulado', value: 'ondulado' },
                { text: 'Cacheado', value: 'cacheado' },
                { text: 'Crespo', value: 'crespo' }
            ]
        },
        {
            id: 'hairLength',
            title: 'Qual comprimento de cabelo você prefere?',
            type: 'option',
            options: [
                { text: 'Curto', value: 'curto' },
                { text: 'Médio', value: 'medio' },
                { text: 'Longo', value: 'longo' }
            ]
        },
        {
            id: 'colors',
            title: 'Quais cores você mais usa no guarda-roupa?',
            type: 'option',
            multiple: true,
            options: [
                { text: 'Neutras (preto, branco, cinza, bege)', value: 'neutras' },
                { text: 'Quentes (vermelho, laranja, amarelo)', value: 'quentes' },
                { text: 'Friais (azul, verde, roxo)', value: 'frias' },
                { text: 'Pastéis', value: 'pasteis' },
                { text: 'Vivas/fluorescentes', value: 'vivas' },
                { text: 'Terrosas', value: 'terrosas' }
            ]
        }
    ];
    
    // Função para renderizar a pergunta atual
    function renderQuestion() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
        
        const question = questions[currentQuestion];
        
        let questionHTML = `
            <div class="question-card">
                <h2 class="question-title">${question.title}</h2>
                <div class="options-container">
        `;
        
        if (question.type === 'option') {
            question.options.forEach(option => {
                const isSelected = question.multiple 
                    ? (answers[question.id] && answers[question.id].includes(option.value))
                    : (answers[question.id] === option.value);
                    
                questionHTML += `
                    <button class="option-btn ${isSelected ? 'selected' : ''}" 
                            data-value="${option.value}">
                        ${option.text}
                    </button>
                `;
            });
        }
        
        questionHTML += `</div></div>`;
        questionContainer.innerHTML = questionHTML;
        
        if (question.type === 'option') {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (question.multiple) {
                        if (!answers[question.id]) answers[question.id] = [];
                        
                        const index = answers[question.id].indexOf(this.dataset.value);
                        if (index === -1) {
                            answers[question.id].push(this.dataset.value);
                        } else {
                            answers[question.id].splice(index, 1);
                        }
                        
                        this.classList.toggle('selected');
                    } else {
                        document.querySelectorAll('.option-btn').forEach(b => {
                            b.classList.remove('selected');
                        });
                        
                        this.classList.add('selected');
                        answers[question.id] = this.dataset.value;
                    }
                    
                    btnNext.disabled = question.multiple 
                        ? (answers[question.id] && answers[question.id].length === 0)
                        : !answers[question.id];
                });
            });
        }
        
        btnBack.disabled = currentQuestion === 0;
        btnNext.disabled = question.type === 'option' && 
            (question.multiple 
                ? (!answers[question.id] || answers[question.id].length === 0)
                : !answers[question.id]);
    }
    
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            showResults();
        }
    }
    
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    }
    
    function showResults() {
        let resultsHTML = `
            <div class="result-item">
                <h3 class="result-title">Seu Perfil de Visagismo</h3>
                <p class="result-value">${getProfileDescription()}</p>
            </div>
            
            <div class="result-item">
                <h3 class="result-title">Formato do Rosto</h3>
                <p class="result-value">${answers.faceShape || 'Não informado'}</p>
            </div>
            
            <div class="result-item">
                <h3 class="result-title">Arquétipo de Estilo</h3>
                <p class="result-value">${answers.styleArchetype || 'Não informado'}</p>
            </div>
            
            <div class="result-item">
                <h3 class="result-title">Nível de Contraste</h3>
                <p class="result-value">${answers.contrast || 'Não informado'}</p>
            </div>
            
            <div class="result-item">
                <h3 class="result-title">Tipo e Comprimento de Cabelo</h3>
                <p class="result-value">${answers.hairType || 'Não informado'} - ${answers.hairLength || 'Não informado'}</p>
            </div>
            
            <div class="result-item">
                <h3 class="result-title">Cores Preferidas</h3>
                <p class="result-value">${answers.colors ? answers.colors.join(', ') : 'Não informado'}</p>
            </div>
        `;
        
        // Recomendações baseadas em Hallawell
        resultsHTML += `<div class="recommendation"><h3>Recomendações de Visagismo</h3>`;
        
       // Formato do rosto - Análise expandida
switch(answers.faceShape) {
    case 'redondo':
        resultsHTML += `<p><strong>Rosto Redondo:</strong> Se beneficia de cortes que criam ângulos e alongamento visual</p>`;
        resultsHTML += `<p>- Franjas laterais ou cortes assimétricos quebram a circularidade</p>`;
        resultsHTML += `<p>- Comprimentos médios a longos (acima do queixo) esticam a silhueta</p>`;
        resultsHTML += `<p>- Camadas angulares criam estrutura óssea aparente</p>`;
        resultsHTML += `<p>- Evite cortes arredondados ou bob cuts que acentuam a redondeza</p>`;
        break;
        
    case 'quadrado':
        resultsHTML += `<p><strong>Rosto Quadrado:</strong> Recomenda-se suavizar os ângulos marcantes</p>`;
        resultsHTML += `<p>- Franjas arredondadas ou cortes em camadas suaves</p>`;
        resultsHTML += `<p>- Longos layers laterais criam movimento que distrai da estrutura angular</p>`;
        resultsHTML += `<p>- Volume na altura do queixo equilibra a mandíbula</p>`;
        resultsHTML += `<p>- Evite cortes retos ou franjas retas que reforçam as linhas quadradas</p>`;
        break;
        
    case 'oval':
        resultsHTML += `<p><strong>Rosto Oval:</strong> O formato mais versátil e proporcional</p>`;
        resultsHTML += `<p>- Pode experimentar desde curtos pixie até longos layers</p>`;
        resultsHTML += `<p>- Proporção equilibrada permite todos os tipos de franja</p>`;
        resultsHTML += `<p>- Mantenha o equilíbrio natural - evite volumes extremos em uma área só</p>`;
        resultsHTML += `<p>- Cortes simétricos ou assimétricos funcionam igualmente bem</p>`;
        break;
        
    case 'retangular':
        resultsHTML += `<p><strong>Rosto Retangular:</strong> Necessita de cortes que encurtam visualmente</p>`;
        resultsHTML += `<p>- Franjas grossas criam quebra horizontal</p>`;
        resultsHTML += `<p>- Cortes na altura do queixo ou acima equilibram proporções</p>`;
        resultsHTML += `<p>- Camadas volumosas nas laterais aumentam a largura aparente</p>`;
        resultsHTML += `<p>- Evite cortes muito longos ou volumes no topo que alongam mais</p>`;
        break;
        
    case 'triangular':
        resultsHTML += `<p><strong>Rosto Triangular:</strong> Volume superior equilibra o queixo estreito</p>`;
        resultsHTML += `<p>- Franjas laterais preenchem a testa mais larga</p>`;
        resultsHTML += `<p>- Cortes em A ou long layers criam harmonia</p>`;
        resultsHTML += `<p>- Volume no topo compensa a mandíbula estreita</p>`;
        resultsHTML += `<p>- Evite volumes excessivos na região da mandíbula</p>`;
        break;
        
    case 'diamante':
        resultsHTML += `<p><strong>Rosto Diamante:</strong> Foco em suavizar ossos proeminentes</p>`;
        resultsHTML += `<p>- Volume nas têmporas equilibra maçãs do rosto largas</p>`;
        resultsHTML += `<p>- Franjas laterais ou cortes assimétricos funcionam bem</p>`;
        resultsHTML += `<p>- Comprimento médio com camadas suaves é ideal</p>`;
        resultsHTML += `<p>- Evite cortes muito curtos que acentuam a angularidade</p>`;
        break;
}

// Arquétipo de estilo - Análise expandida
if(answers.styleArchetype === 'classico') {
    resultsHTML += `<p><strong>Estilo Clássico:</strong> Elegância atemporal e estruturada</p>`;
    resultsHTML += `<p>- Cortes simétricos com linhas limpas</p>`;
    resultsHTML += `<p>- Cabelos médios a longos com acabamento impecável</p>`;
    resultsHTML += `<p>- Tons naturais (castanhos, lores naturais, pretos)</p>`;
    resultsHTML += `<p>- Evite cortes avant-garde ou cores artificiais extremas</p>`;
    
} else if(answers.styleArchetype === 'dramatico') {
    resultsHTML += `<p><strong>Estilo Dramático:</strong> Impacto visual e ousadia</p>`;
    resultsHTML += `<p>- Cortes geométricos com ângulos marcantes</p>`;
    resultsHTML += `<p>- Cores contrastantes (ex: mechas platinadas em base escura)</p>`;
    resultsHTML += `<p>- Cortes assimétricos ou undercuts são interessantes</p>`;
    resultsHTML += `<p>- Evite cortes muito suaves ou desestruturados</p>`;
    
} else if(answers.styleArchetype === 'romantico') {
    resultsHTML += `<p><strong>Estilo Romântico:</strong> Movimento e suavidade</p>`;
    resultsHTML += `<p>- Ondas naturais e camadas fluidas</p>`;
    resultsHTML += `<p>- Franjas suaves e cortes em cascata</p>`;
    resultsHTML += `<p>- Tons quentes (caramelos, vermelhos profundos)</p>`;
    resultsHTML += `<p>- Evite cortes muito angulares ou rígidos</p>`;
}

// Contraste - Análise expandida
if(answers.contrast === 'alto') {
    resultsHTML += `<p><strong>Alto Contraste:</strong> Permite combinações ousadas</p>`;
    resultsHTML += `<p>- Cores vibrantes e contrastes marcantes</p>`;
    resultsHTML += `<p>- Mechas contrastantes criam efeito impactante</p>`;
    resultsHTML += `<p>- Cores saturadas e profundas realçam seus traços</p>`;
    resultsHTML += `<p>- Evite tons médios ou pastéis que podem parecer sem vida</p>`;
    
} else if(answers.contrast === 'baixo') {
    resultsHTML += `<p><strong>Baixo Contraste:</strong> Harmonia e gradientes suaves</p>`;
    resultsHTML += `<p>- Tons próximos na mesma família cromática</p>`;
    resultsHTML += `<p>- Técnicas como balayage ou sombre</p>`;
    resultsHTML += `<p>- Mudanças graduais de cor complementam sua delicadeza</p>`;
    resultsHTML += `<p>- Evite contrastes extremos que podem parecer artificiais</p>`;
}

resultsHTML += `</div>`;
        
        // Arquétipo de estilo
        if(answers.styleArchetype === 'classico') {
            resultsHTML += `<p>- Como clássico, recomenda-se cortes bem estruturados e cores naturais</p>`;
        } else if(answers.styleArchetype === 'dramatico') {
            resultsHTML += `<p>- Seu perfil dramático combina com cortes geométricos e cores contrastantes</p>`;
        } else if(answers.styleArchetype === 'romantico') {
            resultsHTML += `<p>- Seu estilo romântico pede cortes com movimento e linhas suaves</p>`;
        }
        
        // Contraste
        if(answers.contrast === 'alto') {
            resultsHTML += `<p>- Seu alto contraste permite cores vibrantes e contrastes marcantes</p>`;
        } else if(answers.contrast === 'baixo') {
            resultsHTML += `<p>- Seu baixo contraste fica melhor com tons próximos e gradientes suaves</p>`;
        }
        
        resultsHTML += `</div>`;
        
        // Exemplos visuais
        resultsHTML += `
            <div class="visual-examples">
                <h3>Inspirações para Você</h3>
                <div class="example-grid">
                    <img src="https://i.pinimg.com/736x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg" alt="Exemplo de corte">
                    <img src="https://i.pinimg.com/736x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg" alt="Exemplo de corte">
                    <img src="https://i.pinimg.com/736x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg" alt="Exemplo de corte">
                </div>
            </div>
            
            <div class="recommendation">
                <h3>Produtos Recomendados</h3>
                <p>Baseado no seu perfil, recomendamos:</p>
                <ul>
                    <li><strong>Shampoo e Condicionador:</strong> ${getProductRecommendation('haircare')}</li>
                    <li><strong>Produto para Estilização:</strong> ${getProductRecommendation('styling')}</li>
                    <li><strong>Tratamento:</strong> ${getProductRecommendation('treatment')}</li>
                </ul>
            </div>
        `;
        
        resultsContent.innerHTML = resultsHTML;
        
        // Adiciona o visagismo premium no final do blog
        const premiumOfferHTML = `
            <div class="premium-offer">
                <h3>Consulta de Visagismo Premium</h3>
                <p>Receba uma análise completa personalizada com:</p>
                <ul>
                    <li>Análise detalhada do seu biótipo</li>
                    <li>Paleta de cores ideal</li>
                    <li>Guia de cortes e penteados</li>
                    <li>Recomendações de maquiagem</li>
                    <li>1 hora de consultoria online</li>
                </ul>
                
                <button class="btn btn-accent" id="btnBuy">Quero minha consultoria</button>
            </div>
        `;
        
        resultsContent.insertAdjacentHTML('beforeend', premiumOfferHTML);
        
        document.getElementById('btnBuy')?.addEventListener('click', function() {
            alert('Você será redirecionado para completar sua compra');
        });
        
        resultsModal.style.display = 'flex';
    }
    
    function getProfileDescription() {
        let description = '';
        
        if (answers.styleArchetype === 'classico') {
            description = 'Perfil Clássico - Elegância atemporal e sofisticação';
        } else if (answers.styleArchetype === 'dramatico') {
            description = 'Perfil Dramático - Impactante e cheio de personalidade';
        } else if (answers.styleArchetype === 'romantico') {
            description = 'Perfil Romântico - Suave, delicado e feminino';
        } else {
            description = 'Perfil Versátil - Combina elementos de vários estilos';
        }
        
        return description;
    }
    
    function getProductRecommendation(type) {
        if (type === 'haircare') {
            if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
                return '<a href="https://mercadolivre.com/sec/18uy8jS" target="_blank">Shampoo para cuidados dos cachos (ex: Loreal Shampoo)</a>';
            } else if (answers.hairType === 'liso') {
                return '<a href="https://mercadolivre.com/sec/1jKirLi" target="_blank">Shampoo sem sal para brilho (ex: Kérastase Densifique)</a>';
            } else {
                return '<a href="https://mercadolivre.com/sec/1wFbYxw" target="_blank">Shampoo hidratante (ex: Loreal Shampoo)</a>';
            }
        } else if (type === 'styling') {
            if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
                return '<a href="https://mercadolivre.com/sec/1siypwP" target="_blank">Creme de pentear definidor (ex: Loreal Leave-in)</a>';
            } else if (answers.hairType === 'liso') {
                return '<a href="https://mercadolivre.com/sec/29z4Pnp" target="_blank">Óleo de argan para brilho (ex: Moroccanoil)</a>';
            } else {
                return '<a href="https://mercadolivre.com/sec/16FfURj" target="_blank">Mousse ou spray texturizador (ex: Wella Professionals)</a>';
            }
        } else if (type === 'treatment') {
            if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
                return '<a href="https://mercadolivre.com/sec/12UwAdP" target="_blank">Máscara de hidratação profunda (ex: Curl Expression Máscara)</a>';
            } else if (answers.hairType === 'liso') {
                return '<a href="https://mercadolivre.com/sec/2356nrv" target="_blank">Máscara de reconstrução (ex: Kérastase Resistance)</a>';
            } else {
                return '<a href="https://mercadolivre.com/sec/1HhvTKM" target="_blank">Máscara nutritiva (ex: Loreal Professionnel Nutrioil)</a>';
            }
        }
        
        return '<a href="https://www.example.com" target="_blank">Produto adequado para seu tipo de cabelo</a>';
    }
    
    // Event Listeners
    btnNext.addEventListener('click', nextQuestion);
    btnBack.addEventListener('click', prevQuestion);
    closeModal.addEventListener('click', () => {
        resultsModal.style.display = 'none';
    });
    btnRestart.addEventListener('click', () => {
        resultsModal.style.display = 'none';
        currentQuestion = 0;
        answers = {};
        renderQuestion();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === resultsModal) {
            resultsModal.style.display = 'none';
        }
    });
    
    // Inicia o questionário
    renderQuestion();
});

// Adiciona funcionalidade ao footer de contato
const contactFooter = document.querySelector('.contact-footer');

contactFooter.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.includes('instagram.com')) {
        alert('Você será redirecionado para o Instagram do Hair by Marcio.');
    }
});
