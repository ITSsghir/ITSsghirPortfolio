const ANAS_PROFILE = {
    personal: {
        name: "Anas Sghir",
        status: "Étudiant en Master 2 MIAGE",
        specialization: "Ingénierie des Données et Protection (IDP)",
        university: "Université Toulouse III - Paul Sabatier",
        availability: "À partir de septembre 2025",
        email: "anas.sghir.2912@gmail.com",
        location: "Toulouse, France"
    },
    
    skills: {
        programming: ["C", "Java", "Python", "R", "JavaScript", "HTML", "CSS"],
        frameworks: ["Django", "TensorFlow", "PyTorch", "React Native"],
        dataScience: ["SQL", "NoSQL", "Python", "Machine Learning", "Deep Learning"],
        visualization: ["Tableau", "Power BI", "DataGrip"],
        databases: ["MySQL", "PostgreSQL", "MongoDB", "Dataiku"],
        cloud: ["IBM", "AWS"],
        security: ["OpenSSL", "RSA", "AES"],
        projectManagement: ["SCRUM", "GANTT", "TOGAF", "ARCHIMATE"],
        design: ["MERISE", "UML", "SysML"],
        tools: ["IntelliJ IDEA", "Visual Studio", "Docker", "R Studio", "VirtualBox", "PostMan"]
    },
    
    languages: ["Français", "Anglais", "Arabe"],
    
    experience: [
        {
            title: "Stage Product Owner / Data Engineer",
            company: "La Banque Postale",
            location: "Toulouse",
            period: "2025 - En cours",
            tasks: [
                "Documentation technique et métier des données",
                "Modélisation logique des données et lineage complet",
                "Tableaux de bord avec Tableau & Power BI",
                "Recettes SQL et Python sur Dataiku",
                "Optimisation des requêtes sur gros volumes"
            ]
        },
        {
            title: "Projet académique",
            company: "Université Toulouse III",
            location: "Toulouse",
            period: "2023 - 2024",
            tasks: [
                "Développement d'une application de calcul d'empreinte carbone",
                "Technologies: Python, React Native",
                "Reconnaissance caméra et vocale (APIs Google)",
                "Gestion complète du projet"
            ]
        },
        {
            title: "Alternance Chef de Projet IT",
            company: "SHL",
            location: "Marseille",
            period: "2022 - 2023",
            tasks: [
                "Développement full-stack d'une interface d'administration",
                "Leadership et gestion d'équipe multidisciplinaire"
            ]
        },
        {
            title: "Freelance Web",
            company: "Indépendant",
            location: "Aix-en-Provence",
            period: "2021 - 2022",
            tasks: [
                "Conception et développement de sites web multisecteurs"
            ]
        }
    ],
    
    education: [
        {
            degree: "Master 2 MIAGE - IDP",
            school: "Université Toulouse III",
            period: "2023 - 2025",
            specialization: "Ingénierie des Données et Protection"
        },
        {
            degree: "Licence Informatique MIAGE",
            school: "Université Aix-Marseille",
            period: "2021 - 2023"
        }
    ],
    
    certifications: [
        "Core Designer — Dataiku"
    ],
    
    projects: {
        current: "Application de calcul d'empreinte carbone avec IA",
        portfolio: "Site web personnel avec chatbot intelligent",
        interests: ["Intelligence Artificielle", "Data Science", "Automatisation", "Cybersécurité"]
    }
};

const FREQUENT_QUESTIONS = {
    identity: {
        keywords: [
            // Questions directes sur l'identité
            'qui es-tu', 'qui êtes-vous', 'qui es tu', 'qui etes vous',
            'qui tu es', 'tu es qui', 't\'es qui', 'tes qui', 'tés qui',
            'c\'est qui', 'c est qui', 'cest qui',
            
            // Demandes de présentation
            'présente-toi', 'présentez-vous', 'présente toi', 'presentez vous',
            'peux-tu te présenter', 'pouvez-vous vous présenter',
            'dis-moi qui tu es', 'dites-moi qui vous êtes',
            'parle-moi de toi', 'parlez-moi de vous',
            
            // Noms et références
            'qui', 'anas', 'sghir', 'anas sghir',
            
            // Questions informelles
            'ton nom', 'votre nom', 'comment tu t\'appelles',
            'comment vous vous appelez', 'tu t\'appelles comment',
            
            // Variations familières
            'toi', 'vous', 'about you', 'about yourself',
            'who are you', 'introduce yourself'
        ],
        responses: [
            "Je suis Anas Sghir, étudiant en Master 2 MIAGE spécialisé en Ingénierie des Données et Protection à l'Université Toulouse III. Actuellement en stage chez La Banque Postale en tant que Product Owner/Data Engineer.",
            "Bonjour ! Je m'appelle Anas Sghir, passionné de Data Science et d'Intelligence Artificielle. Je termine mon Master MIAGE et je travaille sur des projets innovants en analyse de données.",
            "Salut ! Anas ici, futur diplômé MIAGE avec une expertise en Python, TensorFlow et Dataiku. Mon parcours mélange technique et gestion de projet.",
            "Je me présente : Anas Sghir, 25 ans, spécialiste Data Science en formation. Entre Toulouse pour mes études et mes projets IA, je construis mon expertise technique et managériale.",
            "Enchanté ! Anas Sghir, étudiant-ingénieur passionné par l'IA et les données. Mon objectif : devenir un expert en Data Science avec une vision produit."
        ]
    },
    
    skills: {
        keywords: [
            // Compétences générales
            'compétences', 'compétence', 'technologies', 'technologie', 'skills', 'skill',
            'savoir-faire', 'savoir faire', 'expertise', 'capacités', 'capacité',
            
            // Questions sur les compétences
            'tes compétences', 'vos compétences', 'quelles compétences',
            'tu maîtrises', 'vous maîtrisez', 'tu connais', 'vous connaissez',
            'tu sais faire', 'vous savez faire', 'capable de',
            
            // Technologies spécifiques
            'python', 'java', 'javascript', 'sql', 'nosql', 'r',
            'dataiku', 'tensorflow', 'pytorch', 'tableau', 'power bi',
            'machine learning', 'deep learning', 'ia', 'intelligence artificielle',
            
            // Expressions familières
            'qu\'est-ce que tu sais', 'qu est ce que tu sais',
            'dans quoi tu es bon', 'ton niveau', 'tes outils',
            'stack technique', 'tech stack', 'programming languages'
        ],
        responses: [
            "Mes compétences principales incluent Python, TensorFlow et PyTorch pour le Machine Learning, ainsi que Tableau et Power BI pour la visualisation. Je suis certifié Dataiku Core Designer et j'ai une solide expérience en gestion de projet SCRUM.",
            "Je maîtrise un large éventail de technologies : Python, Java, R pour la programmation, SQL/NoSQL pour les bases de données, et des outils cloud comme AWS et IBM. Ma spécialité reste la Data Science et l'IA.",
            "Côté technique, j'excelle en Python, TensorFlow, PyTorch, et j'ai une expertise particulière sur Dataiku. Je connais aussi bien le développement web (Django, JavaScript) que la cybersécurité (OpenSSL, RSA, AES).",
            "Mon arsenal technique : Python (expert), TensorFlow/PyTorch pour l'IA, Dataiku pour les pipelines, SQL pour les données, et SCRUM pour la gestion de projet. Un mix parfait technique/management !",
            "Stack technique : Data Science (Python, R, ML), Développement (Java, JS, Django), Cloud (AWS, IBM), Visualisation (Tableau, Power BI), et Sécurité (OpenSSL, RSA). Plutôt polyvalent, non ?"
        ]
    },
    
    experience: {
        keywords: [
            // Expérience générale
            'expérience', 'experience', 'expériences', 'experiences',
            'travail', 'job', 'emploi', 'boulot', 'poste', 'postes',
            'parcours', 'professionnel', 'carrière', 'carriere',
            
            // Types d'expérience
            'stage', 'stages', 'alternance', 'freelance', 'free-lance',
            'projet', 'projets', 'mission', 'missions', 'contrat',
            
            // Entreprises et lieux
            'banque postale', 'la banque postale', 'lbp',
            'shl', 'toulouse', 'marseille', 'aix-en-provence',
            
            // Rôles et responsabilités
            'product owner', 'data engineer', 'chef de projet',
            'développement', 'developpement', 'gestion', 'management',
            
            // Questions sur l'expérience
            'ton expérience', 'votre expérience', 'tu as travaillé où',
            'vous avez travaillé où', 'où tu travailles', 'où vous travaillez',
            'ton parcours', 'votre parcours', 'tes jobs', 'vos emplois'
        ],
        responses: [
            "Actuellement en stage chez La Banque Postale comme Product Owner/Data Engineer, je travaille sur la documentation des données, la modélisation logique et l'optimisation de requêtes SQL/Python sur Dataiku.",
            "Mon parcours inclut un stage actuel à La Banque Postale, une alternance comme Chef de Projet IT chez SHL à Marseille, et du freelance en développement web. J'ai aussi mené des projets académiques innovants.",
            "J'ai une expérience variée : de chef de projet IT chez SHL au développement d'applications mobiles (calcul d'empreinte carbone avec IA), en passant par du freelance web et mon stage actuel en Data Engineering.",
            "Progression logique : Freelance web (2021-2022) → Chef de Projet IT chez SHL Marseille (2022-2023) → Stage Product Owner/Data Engineer à La Banque Postale (2025). Du dev à la data en passant par le management !",
            "Expérience progressive : started with freelance web dev, puis alternance management IT, maintenant stage Data Engineering. Chaque étape m'a appris quelque chose de nouveau !"
        ]
    },
    
    formation: {
        keywords: [
            // Formation générale
            'formation', 'formations', 'études', 'etudes', 'diplôme', 'diplômes', 'diplome', 'diplomes',
            'cursus', 'parcours', 'scolaire', 'académique', 'educación', 'education',
            
            // Institutions et lieux
            'université', 'universite', 'fac', 'faculté', 'ecole', 'école',
            'toulouse', 'aix-marseille', 'aix marseille', 'marseille',
            'paul sabatier', 'sabatier', 'toulouse 3', 'toulouse iii',
            
            // Diplômes et niveaux
            'miage', 'master', 'licence', 'bac', 'l3', 'm1', 'm2',
            'ingénierie des données', 'ingenierie des donnees', 'idp',
            'protection', 'data engineering', 'informatique',
            
            // Questions sur la formation
            'tes études', 'vos études', 'tu as étudié où', 'vous avez étudié où',
            'ta formation', 'votre formation', 'quel diplôme', 'quels diplômes',
            'école d\'ingénieur', 'ecole d ingenieur', 'ton cursus', 'votre cursus'
        ],
        responses: [
            "Je suis en Master 2 MIAGE spécialisé en Ingénierie des Données et Protection à l'Université Toulouse III. J'ai fait ma licence Informatique MIAGE à Aix-Marseille.",
            "Mon parcours académique : Licence Informatique MIAGE à Aix-Marseille (2021-2023), puis Master MIAGE-IDP à Toulouse III (2023-2025). La formation MIAGE allie parfaitement informatique et gestion.",
            "Diplômé d'une licence MIAGE à Aix-Marseille, je termine actuellement mon Master 2 MIAGE-IDP à Toulouse, une formation qui m'a donné une double compétence technique et managériale.",
            "Formation MIAGE sur 5 ans : 3 ans à Aix-Marseille pour la licence, puis 2 ans à Toulouse III pour le Master IDP. Un cursus parfait pour allier tech et business !",
            "Parcours : Licence MIAGE (Aix-Marseille 2021-2023) → Master MIAGE-IDP (Toulouse III 2023-2025). MIAGE = Méthodes Informatiques Appliquées à la Gestion des Entreprises. Le mix parfait !"
        ]
    },
    
    contact: {
        keywords: ['contact', 'email', 'cv', 'recrutement', 'embauche', 'disponible', 'recruter'],
        responses: [
            "Je serai disponible à partir de septembre 2025 pour un poste en Data Science ou ingénierie des données. Vous pouvez me contacter via ce portfolio ou par email.",
            "Actuellement en fin de Master, je recherche des opportunités en Data Science/ML Engineer pour septembre 2025. N'hésitez pas à me contacter pour discuter de collaborations.",
            "Disponible dès septembre 2025 pour des postes en Data Science, ML Engineering ou Product Owner Data. Mon profil mélange technique et gestion de projet."
        ]
    },
    
    dataiku: {
        keywords: ['dataiku', 'certification', 'core designer'],
        responses: [
            "Je suis certifié Dataiku Core Designer. J'utilise cette plateforme dans mon stage actuel à La Banque Postale pour créer des recettes SQL et Python, optimiser des requêtes sur de gros volumes de données.",
            "Dataiku est un outil que je maîtrise bien - je suis même certifié Core Designer. C'est parfait pour l'automatisation des pipelines de données et la collaboration entre équipes techniques et métier.",
            "Ma certification Dataiku Core Designer me permet de créer des flux de données robustes. J'utilise beaucoup cette plateforme pour la modélisation et l'optimisation de données dans mon travail actuel."
        ]
    },
    
    projects: {
        keywords: ['projets', 'projet', 'application', 'carbone', 'empreinte', 'reconnaissance', 'vocale'],
        responses: [
            "Mon projet phare est une application de calcul d'empreinte carbone développée en Python et React Native. Elle intègre la reconnaissance caméra et vocale via les APIs Google. C'était un projet académique complet que j'ai géré de A à Z.",
            "J'ai plusieurs projets intéressants : l'application d'empreinte carbone avec IA, ce portfolio avec chatbot intelligent, et divers projets web pendant mon freelance. Chaque projet m'a appris de nouvelles technologies.",
            "Mes projets mélangent IA et développement : reconnaissance vocale, calcul automatique d'empreinte carbone, interfaces d'administration full-stack. J'aime créer des solutions innovantes qui ont un impact concret."
        ]
    },
    
    availability: {
        keywords: ['disponible', 'disponibilité', 'emploi', 'job', 'poste', 'recruter', 'embauche'],
        responses: [
            "Je serai disponible à partir de septembre 2025 après la fin de mon Master. Je recherche des opportunités en Data Science, ML Engineering, ou Product Owner Data dans des entreprises innovantes.",
            "Disponible dès septembre 2025 ! Je vise des postes de Data Scientist, ML Engineer, ou Product Owner Data. Mon profil hybride technique/gestion est parfait pour faire le lien entre équipes tech et métier.",
            "Fin de Master en septembre 2025 = début de ma carrière professionnelle ! Je suis ouvert aux opportunités en Data Science, Intelligence Artificielle, ou ingénierie des données. N'hésitez pas à me contacter pour discuter !"
        ]
    },
    
    // Nouvelle catégorie : Salutations informelles et références directes
    casual_references: {
        keywords: [
            // Références informelles à la personne
            'mec', 'gars', 'type', 'personne', 'individu',
            'lui', 'ce type', 'ce mec', 'ce gars',
            
            // Questions très informelles
            'quoi', 'hein', 'comment', 'what', 'huh',
            'alors', 'bon', 'ok', 'ouais', 'oui',
            
            // Références au portfolio/site
            'site', 'portfolio', 'page', 'cv en ligne',
            'profil', 'about', 'info', 'informations'
        ],
        responses: [
            "Hey ! Je suis Anas Sghir, le créateur de ce portfolio. Étudiant en Data Science et passionné d'IA, je partage ici mon parcours et mes projets. Que veux-tu savoir sur moi ?",
            "Salut ! C'est mon portfolio que tu consultes. Je suis Anas, spécialiste Data Science en formation. Pose-moi des questions sur mon parcours, mes compétences, ou mes projets !",
            "Yo ! Tu es sur le portfolio d'Anas Sghir (c'est moi !). Future Data Scientist, actuellement en Master MIAGE à Toulouse. Qu'est-ce qui t'intéresse dans mon profil ?"
        ]
    },
    
    // Nouvelle catégorie : Questions sur l'âge et details personnels
    personal_details: {
        keywords: [
            'âge', 'age', 'années', 'annees', 'vieux', 'jeune',
            'quel âge', 'combien d\'années', 'né quand', 'naissance',
            'birthday', 'born', 'old', 'young'
        ],
        responses: [
            "J'ai 25 ans ! Parfait timing pour démarrer ma carrière en Data Science après mes études. L'âge idéal pour être à la fois énergique et suffisamment expérimenté.",
            "25 ans, né en 1999. Generation Z tech-native, j'ai grandi avec le numérique et je vis la révolution IA en direct. L'avantage de la jeunesse !",
            "Quarter-century ! 25 ans exactement. Assez jeune pour apprendre vite, assez mature pour gérer des projets complexes. Le sweet spot pour une carrière tech !"
        ]
    },
    
    // Nouvelle catégorie : Localisation et géographie
    location: {
        keywords: [
            'où', 'ou', 'lieu', 'ville', 'région', 'pays',
            'habite', 'vis', 'résides', 'basé', 'localisation',
            'france', 'français', 'francais', 'toulousain',
            'where', 'location', 'based', 'from'
        ],
        responses: [
            "Je suis basé à Toulouse pour mes études, mais j'ai vécu à Aix-en-Provence et Marseille. La France du Sud, j'adore ! Toulouse est parfaite pour la tech avec Airbus, Thales, etc.",
            "Actuellement à Toulouse pour mon Master, mais mon parcours m'a fait voyager : Aix-Marseille pour la licence, retour Sud-Ouest pour la spécialisation. Mobile géographiquement !",
            "Toulouse, la Ville Rose ! Parfait écosystème tech avec l'aérospatiale et les start-ups. Avant ça : Aix-en-Provence et Marseille. Je reste dans le Sud, question de lifestyle !"
        ]
    }
};

const GENERAL_RESPONSES = {
    greetings: {
        keywords: [
            // Salutations classiques
            'bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'hey',
            'coucou', 'yo', 'wesh', 'cc', 'slt',
            
            // Salutations formelles
            'bonne journée', 'bonne soirée', 'good morning', 'good evening',
            'enchanté', 'ravi', 'pleasure',
            
            // Salutations avec questions
            'comment ça va', 'comment allez-vous', 'ça va',
            'how are you', 'what\'s up', 'quoi de neuf'
        ],
        responses: [
            "Bonjour ! Je suis l'assistant IA d'Anas Sghir. Comment puis-je vous aider à en savoir plus sur son profil ?",
            "Salut ! Ravi de vous accueillir sur le portfolio d'Anas. Que souhaitez-vous découvrir sur son parcours ?",
            "Hello ! Bienvenue ! Je suis là pour répondre à vos questions sur Anas Sghir et son expertise en Data Science.",
            "Hey ! Super de vous voir ici ! Je suis le chatbot d'Anas, prêt à vous parler de son parcours en Data Science. Qu'est-ce qui vous intéresse ?",
            "Yo ! Welcome sur le portfolio d'Anas ! Je peux vous renseigner sur ses compétences, projets, expérience... Fire away avec vos questions !"
        ]
    },
    
    help: {
        keywords: ['aide', 'help', 'comment', 'que faire', 'assistance'],
        responses: [
            "Je suis là pour vous aider à découvrir le profil d'Anas ! Voici comment m'utiliser :\n\n🔍 **Questions directes :**\n• \"Qui es-tu ?\" - Présentation générale\n• \"Tes compétences ?\" - Technologies et expertise\n• \"Ton expérience ?\" - Parcours professionnel\n• \"Ta formation ?\" - Études et diplômes\n\n🎯 **Questions spécifiques :**\n• \"Tu connais Python ?\" - Compétence particulière\n• \"C'est quoi Dataiku ?\" - Outil spécialisé\n• \"La Banque Postale ?\" - Stage actuel\n• \"Comment te contacter ?\" - Informations de contact\n\n💡 **Astuce :** Plus votre question est précise, plus ma réponse sera détaillée !",
            
            "Parfait ! Je vais vous guider pour découvrir Anas Sghir. Choisissez ce qui vous intéresse :\n\n📋 **Menu principal :**\n\n1️⃣ **Présentation :** \"Qui es-tu ?\"\n2️⃣ **Compétences :** \"Tes compétences ?\" ou \"Tu connais Python ?\"\n3️⃣ **Expérience :** \"Ton expérience ?\" ou \"Ton stage actuel ?\"\n4️⃣ **Formation :** \"Ta formation ?\" ou \"Le Master MIAGE ?\"\n5️⃣ **Projets :** \"Tes projets ?\" ou \"Application carbone ?\"\n6️⃣ **Contact :** \"Comment te contacter ?\"\n\n🗣️ **Ou posez directement votre question !** Je ferai de mon mieux pour y répondre.",
            
            "Je suis votre guide pour explorer le profil professionnel d'Anas ! Voici mes suggestions :\n\n⭐ **Questions recommandées pour commencer :**\n• \"Présente-toi\" - Vue d'ensemble du profil\n• \"Quelles sont tes compétences ?\" - Expertise technique\n• \"Parle-moi de ton expérience\" - Parcours pro\n\n🔥 **Questions populaires :**\n• \"Tu travailles où ?\" - Stage La Banque Postale\n• \"Tes certifications ?\" - Dataiku Core Designer\n• \"Tu es disponible quand ?\" - Opportunités\n\n📝 **Conseil :** Vous pouvez aussi me poser des questions ouvertes comme \"Raconte-moi ton parcours\" ou très spécifiques comme \"Tes compétences en Machine Learning ?\""
        ]
    },
    
    thanks: {
        keywords: ['merci', 'thanks', 'thank you', 'super', 'parfait', 'excellent'],
        responses: [
            "De rien ! N'hésitez pas si vous avez d'autres questions sur le profil d'Anas.",
            "Avec plaisir ! Y a-t-il autre chose que vous aimeriez savoir sur Anas ?",
            "Content d'avoir pu vous aider ! N'hésitez pas pour d'autres questions."
        ]
    },
    
    unknown: {
        responses: [
            "Je ne suis pas sûr de comprendre votre question. Voici quelques suggestions pour découvrir le profil d'Anas :\n\n💼 **Questions sur son parcours :**\n• \"Qui es-tu ?\"\n• \"Présente-toi\"\n• \"Ton parcours professionnel ?\"\n\n🎓 **Formation et études :**\n• \"Ta formation ?\"\n• \"Tes études ?\"\n• \"Pourquoi MIAGE ?\"\n\n💻 **Compétences techniques :**\n• \"Tes compétences ?\"\n• \"Tu connais Python ?\"\n• \"C'est quoi Dataiku ?\"\n\n🚀 **Expérience et projets :**\n• \"Ton expérience ?\"\n• \"Tes projets ?\"\n• \"La Banque Postale ?\"\n\n📧 **Contact :**\n• \"Comment te contacter ?\"\n• \"Tu es disponible quand ?\"",
            
            "Je me spécialise dans les questions sur Anas Sghir. Essayez une de ces questions :\n\n🎯 **Questions populaires :**\n• \"Qui es-tu ?\" - Pour une présentation complète\n• \"Quelles sont tes compétences ?\" - Technologies maîtrisées\n• \"Parle-moi de ton expérience\" - Parcours professionnel\n• \"Ta formation ?\" - Études et diplômes\n• \"Tu travailles où ?\" - Stage actuel\n• \"Comment te contacter ?\" - Informations de contact\n\n💡 **Conseil :** Soyez précis dans vos questions pour obtenir des réponses détaillées !",
            
            "Il semble que votre question sorte de mon domaine d'expertise. Je connais tout sur Anas Sghir ! Voici ce que vous pouvez me demander :\n\n👨‍💻 **Profil professionnel :**\n• \"Qui es-tu ?\" ou \"Présente-toi\"\n• \"Tes compétences en Data Science ?\"\n• \"Ton expertise Python ?\"\n\n🏢 **Expérience :**\n• \"Ton stage actuel ?\"\n• \"Tes projets précédents ?\"\n• \"Ton rôle chez SHL ?\"\n\n🎓 **Formation :**\n• \"Tes études ?\"\n• \"Le Master MIAGE ?\"\n• \"Tes certifications ?\"\n\n📞 **Contact et opportunités :**\n• \"Comment te joindre ?\"\n• \"Tu cherches un emploi ?\"\n\nN'hésitez pas à reformuler ou à choisir une question ci-dessus !"
        ]
    }
};

module.exports = {
    ANAS_PROFILE,
    FREQUENT_QUESTIONS,
    GENERAL_RESPONSES
}; 