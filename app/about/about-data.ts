// About page data - centralized for easy editing
export const aboutData = {
  // About Section
  intro: {
    title: "About",
    description: "I love building software that people actually use. I studied Computer Science and Industrial Engineering, but honestly, engineering is just how I think. I get excited about niche problems that nobody else noticed and everyday annoyances that everyone just accepts.",
    additionalInfo: "I've shipped AI assistants, smart home systems, crypto wallets, and blockchain prototypes. I've raised money, grown teams, and taken products from nothing to real users. The common thread is the same: I like turning ideas into things that work and watching them create value for someone.",
    // personalNote: "I'm looking for a place where I can build products that matter. Not features for features' sake. If you have a hard problem and need someone who will own it from start to finish, let's talk."
  },

  // Featured Projects Section
  featuredProjects: {
    title: "Featured Projects",
    projects: [
      {
        name: "Solace Technology Inc",
        description: "AI-driven conversational platform transforming complex digital processes into natural human dialogues. Launched two AI-native products with multilingual voice technology and enterprise integrations.",
        technologies: ["Python", "FastAPI", "LangChain", "WebSockets", "React", "Next.js"],
        role: "CEO & Co-founder",
        status: "Launched",
        website: "https://www.solace.com.tr/tr",
        detailedDescription: "Solace transforms complex interfaces into natural conversations using AI-powered voice infrastructure. The platform enables organizations to move their digital touchpoints to natural speech, where users ask questions instead of clicking, and brands gain multilingual interaction and instant data feedback.",
        achievements: [
          "Raised $250K in funding and secured TÜBİTAK 1507 grant",
          "Built multilingual conversation AI engine",
          "Deployed scalable CI/CD with Docker and GitHub Actions",
          "Scaled team from 4 to 8f engineers"
        ]
      },
      {
        name: "Ensi - Smart Home Assistant",
        description: "AI-native smart home assistant with natural language understanding and automated home environment control. Manages all smart devices with a single voice interface and mobile application.",
        technologies: ["Python", "FastAPI", "LangChain", "WebSockets", "IoT", "STT/TTS"],
        role: "Product Lead & Full-Stack Engineer",
        status: "Launched",
        website: "https://ensihome.solace.com.tr",
        images: [
          "/images/featured-projects/ensi.png"
        ],
        detailedDescription: "Ensi enables seamless smart home control through natural conversation. Turn on lights, adjust thermostats, or play music with contextual understanding and human-like interaction flows.",
        achievements: [
          "Contextual conversation understanding for smart home control",
          "Real-time STT/TTS agent implementation",
          "WebSocket-based real-time communication",
          "Integration with multiple IoT platforms"
        ]
      },
      {
        name: "EMA - Interactive Customer Assistant",
        description: "B2B conversational AI assistant bridging digital and physical stores. Provides instant product discovery and personalized shopping experiences through natural language.",
        technologies: ["Python", "LangChain", "LangGraph", "RAG", "Next.js", "PostgreSQL"],
        role: "Product Lead & Full-Stack Engineer",
        status: "Launched",
        website: "https://ema.solace.com.tr",
        images: [
          "/images/featured-projects/ema.png"
        ],
        detailedDescription: "EMA connects customers with businesses through natural conversation, enabling instant product discovery, personalized shopping recommendations, and seamless integration across digital and physical retail environments.",
        achievements: [
          "Agentic flows with LLM orchestration using RAG",
          "Real-time business logic pipelines",
          "CRM system integrations",
          "Multilingual customer support capabilities"
        ]
      },
      {
        name: "Primo Chat - LLM Customer Support Platform",
        description: "LLM-based dialogue system integrated into a SaaS customer support platform for social media channels like WhatsApp, Instagram, and Twitter. Features automated contextual responses, sentiment detection, and escalation workflows.",
        technologies: ["Python", "LLM Integration", "REST API", "PostgreSQL", "WebSockets", "Social Media APIs"],
        role: "Product Lead & Full-Stack Engineer",
        status: "Active",
        images: [
          "/images/featured-projects/primo.png"
        ],
        detailedDescription: "Primo Chat is an ongoing project that integrates LLM-based dialogue systems into a SaaS customer support platform. Built for social media channels like WhatsApp, Instagram, and Twitter, the platform automates contextual response generation, sentiment detection, and escalation workflows. I am designing the system's backend architecture to support high concurrency and latency-sensitive interaction. Key components include REST API integration, multi-turn conversation history tracking, and customizable AI workflows for enterprise users.",
        achievements: [
          "High-concurrency backend architecture design",
          "Multi-turn conversation history tracking",
          "Real-time sentiment detection and analysis",
          "Automated escalation workflows for complex queries",
          "REST API integration with social media platforms",
          "Customizable AI workflows for enterprise users",
          "Latency-optimized response generation"
        ]
      },
      {
        name: "AI Chess Arena - Local Gemma 3 Fine-Tuned",
        description: "Local AI chess arena where fine-tuned Gemma 3 models battle each other. Features hardware-adaptive training, real-time inference server, and professional GUI with beautiful SVG-based pieces. Optimized for Intel integrated graphics.",
        technologies: ["Python", "Gemma 3", "LoRA Fine-tuning", "FastAPI", "Pygame", "PyTorch", "PEFT", "Intel GPU Optimization"],
        role: "AI Engineer & Full-Stack Developer",
        status: "Complete",
        github: "https://github.com/its-meseba/gemma-3-local-fine-tuned-chess",

        images: [
          "/images/featured-projects/chess-arena.png"
        ],
        detailedDescription: "AI Chess Arena is a complete local AI system that fine-tunes Google's Gemma 3 270m model on chess instruction data and creates AI vs AI battles. The project features intelligent hardware detection with automatic fallback training methods (Unsloth for NVIDIA, standard transformers for most hardware, Intel-optimized for integrated graphics). Built a FastAPI inference server for real-time move prediction and a professional Pygame GUI with SVG-converted chess pieces. Everything runs locally without cloud dependencies, showcasing the power of consumer hardware for AI applications.",
        achievements: [
          "Successfully fine-tuned Gemma 3 270m on chess data using LoRA",
          "Implemented hardware-adaptive training with automatic fallback systems",
          "Built real-time FastAPI inference server for move prediction",
          "Created professional chess GUI with SVG-based piece graphics",
          "Optimized for Intel Iris Xe and integrated graphics compatibility",
          "Developed unified launcher system for seamless project management",
          "Achieved smooth AI vs AI gameplay with configurable thinking speeds",
          "Implemented complete local AI pipeline from training to visualization"
        ]
      },
      {
        name: "MPC Wallet",
        description: "Cross-platform self-custody wallet using multi-party computation for secure key management, eliminating single points of failure in crypto asset storage.",
        technologies: ["Flutter", "Go", "Dart FFI", "MPC", "Cryptography", "Go"],
        role: "Research Engineer",
        status: "Completed",
        github: "https://github.com/its-meseba/mpc-wallet",
        detailedDescription: "A secure cryptocurrency wallet that distributes trust through multi-party computation, removing single points of failure traditional wallets face. Built with clean separation between UI (Flutter) and cryptographic core (Go via FFI).",
        achievements: [
          "Clean separation of UX and cryptographic concerns",
          "Portable native crypto integration across platforms",
          "Modular FFI plugin architecture for easier testing",
          "Enhanced security through distributed key management"
        ]
      },
      {
        name: "Ethereum Network & NFT Creation Platform",
        description: "Designed and deployed a private Ethereum blockchain network and built a full-stack NFT creation web application, including custom payment logic and smart contract integration.",
        technologies: ["Ethereum", "Solidity", "TypeScript", "React", "Node.js", "Web3.js", "Blockchain"],
        role: "Full-Stack Blockchain Developer",
        status: "Completed",
        detailedDescription: "Led the end-to-end development of a private Ethereum network and a web-based NFT creation platform. Implemented the blockchain backend, deployed and tested smart contracts, and built a user-friendly frontend for minting NFTs. Developed an internal payment system for NFT transactions and ensured seamless integration between the blockchain layer and the web application.",
        achievements: [
          "Deployed and managed a private Ethereum blockchain network",
          "Developed and audited custom NFT smart contracts",
          "Built a full-stack web app for NFT creation and management",
          "Implemented an internal payment and transaction system",
          "Integrated frontend and backend with Web3.js for real-time blockchain interaction"
        ]
      },
      {
        name: "YOLOv4 Optimization Pipeline",
        description: "Boosted computer vision detection pipeline throughput from 36 to 140 FPS by optimizing YOLOv4 with TensorRT/TKDNN for autonomous systems.",
        technologies: ["YOLOv4", "TensorRT", "TKDNN", "PyTorch", "Computer Vision"],
        role: "Deep Learning Engineer",
        status: "Completed",
        detailedDescription: "Led performance optimization of computer vision pipeline for autonomous vehicle systems, achieving 289% performance improvement through advanced GPU acceleration techniques.",
        achievements: [
          "289% performance improvement (36→140 FPS)",
          "TensorRT and TKDNN optimization implementation",
          "Dataset operations and quality assurance",
          "Tableau-based evaluation pipeline"
        ]
      },
      {
        name: "T3 Vakfı HR Control System",
        description: "OCR-powered system for document detection, automated scoring, and Excel report generation. Processed and visualized 600K+ HR records to streamline TEKNOFEST operations.",
        technologies: ["Python", "OCR", "Excel", "Data Visualization", "Tableau"],
        role: "Volunteer Developer",
        status: "Completed",
        detailedDescription: "Built a comprehensive HR management system for Turkey's largest technology competition, TEKNOFEST. The system automated document processing, candidate scoring, and generated detailed analytics reports.",
        achievements: [
          "Processed and visualized 600K+ HR records",
          "Automated document detection and scoring",
          "Streamlined TEKNOFEST operations and candidate evaluation",
          "Built comprehensive Excel reporting and analytics"
        ]
      },
      {
        name: "AESK Inference Optimization",
        description: "Enhanced YOLOv4-based detection pipeline throughput from 36 FPS to 140 FPS using TensorRT/TKDNN, improving AI model deployment speed and efficiency for autonomous systems.",
        technologies: ["YOLOv4", "TensorRT", "TKDNN", "PyTorch", "Computer Vision", "CUDA"],
        role: "Deep Learning Engineer",
        status: "Completed",
        detailedDescription: "Led performance optimization initiative for autonomous vehicle computer vision pipeline, achieving 289% performance improvement through advanced GPU acceleration and model optimization techniques.",
        achievements: [
          "289% performance improvement (36→140 FPS)",
          "Advanced TensorRT and TKDNN optimization",
          "GPU acceleration and memory optimization",
          "Enhanced AI model deployment efficiency"
        ]
      },
      {
        name: "Hesapp - Restaurant QR Ordering System",
        description: "QR code-based restaurant ordering and payment system that eliminates waiting times for menu, waiter service, and bill payment. Complete ecosystem with customer app, owner interface, and landing website.",
        technologies: ["React", "Node.js", "QR Code", "Payment Integration", "Mobile App", "TypeScript"],
        role: "Co-founder & Full-Stack Engineer",
        status: "Completed",
        website: "https://hesap-landing-website.vercel.app/",
        github: [
          "https://github.com/its-meseba/hesapp",
          "https://github.com/its-meseba/Hesap-owner-interface",
          "https://github.com/its-meseba/Hesap-landing-website"
        ],
        images: [
          "/images/featured-projects/hesap-interface.png"
        ],
        detailedDescription: "A comprehensive restaurant technology solution featuring QR code ordering, instant payment processing, and real-time order management. Customers scan QR codes at tables to access menus, place orders, and pay without waiting for service staff.",
        achievements: [
          "Complete restaurant digitization ecosystem",
          "QR code-based ordering and payment system",
          "Real-time order tracking and management",
          "Multiple business models: Standard, Premium, and Analytics",
          "Eliminated waiting times for menu, service, and payment",
          "Owner dashboard with analytics and order management"
        ]
      },
      {
        name: "NoteNook",
        description: "Note-taking ecosystem with TypeScript web app and Chrome extension for instant capture and seamless sync, reducing friction in idea preservation.",
        technologies: ["TypeScript", "Chrome Extension APIs", "Web APIs"],
        role: "Personal Project",
        status: "Completed",
        github: "https://github.com/its-meseba/note-nook",
        detailedDescription: "A unified note-taking platform combining web app and browser extension for frictionless idea capture. Features instant context preservation and seamless synchronization across devices.",
        achievements: [
          "Unified TypeScript codebase across web and extension",
          "Browser-native capture with context preservation",
          "Real-time sync between web app and extension",
          "Type-safe architecture for maintainability"
        ]
      },
      {
        name: "Wakely - Spotify Alarm App",
        description: "Alarm application that wakes users up with personalized Spotify songs, improving wake-up adherence and mood through music integration.",
        technologies: ["Flutter", "Spotify API", "OAuth 2.0", "Mobile Development"],
        role: "Personal Project",
        status: "Completed",
        github: "https://github.com/its-meseba/wakely",
        detailedDescription: "A personalized alarm app that integrates with Spotify to wake users with their favorite music. Features OAuth authentication, playlist management, and cross-platform mobile support.",
        achievements: [
          "Spotify Web API integration and OAuth 2.0 flow",
          "Cross-platform mobile alarm functionality",
          "Personalized music wake-up experience",
          "Background playback and scheduling orchestration"
        ]
      },
      {
        name: "Cevapp - English Speaking Practice",
        description: "English-speaking app that asks random questions, records voice responses, and stores them for practice and reflection, turning passive study into active speaking practice.",
        technologies: ["Flutter", "Python", "Jupyter Notebooks", "Linguistics"],
        role: "Personal Project",
        status: "Completed",
        github: "https://github.com/its-meseba/cevapp",
        detailedDescription: "An innovative language learning app that transforms passive English study into active speaking practice through voice capture and AI-driven question generation.",
        achievements: [
          "End-to-end voice capture and storage flow",
          "Random question generation system",
          "Cross-disciplinary mobile and ML integration",
          "Evidence-driven pedagogy through data analysis"
        ]
      },
      {
        name: "Listele Waitlist App",
        description: "Lightweight launch/waitlist application for collecting sign-ups and measuring early interest, optimized for rapid iteration and conversion tracking.",
        technologies: ["TypeScript", "Web Development", "Analytics"],
        role: "Personal Project",
        status: "Completed",
        github: "https://github.com/its-meseba/listele-wep-app",
        detailedDescription: "A focused landing page and waitlist system designed for early product validation, featuring conversion optimization and rapid deployment capabilities.",
        achievements: [
          "Conversion-optimized landing experience",
          "Early product validation and demand measurement",
          "Rapid deployment and iteration capabilities",
          "Analytics integration for user behavior insights"
        ]
      },
      {
        name: "Ochtarcus - AI-Powered Knowledge Hub",
        description: "AI-powered knowledge platform for entrepreneurs featuring intelligent search, curated content library, and expert community. Built with Python backend and TypeScript frontend for scalable architecture.",
        technologies: ["Python", "TypeScript", "AI Search", "React", "API Design", "LLM Integration", "RAG", "Gen-AI"],
        role: "Personal Project",
        status: "Active",
        website: "https://ochtarcus.com",
        github: "https://github.com/its-meseba/ochtarcus",
        detailedDescription: "Ochtarcus is a comprehensive knowledge platform that combines AI-powered search with curated entrepreneurial content. The platform enables entrepreneurs to access expert knowledge through natural language queries, browse a rich library of blogs and videos, and connect with a community of innovators. Features include unlimited AI search, personalized recommendations, and integration with leading entrepreneurial organizations like Y Combinator and a16z.",
        achievements: [
          "AI-powered search with natural language processing",
          "Curated knowledge library from industry experts",
          "Community-driven content sharing platform",
          "Integration with leading entrepreneurial organizations",
          "Freemium model with premium features",
          "Clean separation of backend AI services and frontend"
        ]
      },

    ]
  },

  // Experience Section
  experience: {
    title: "Experience",
    positions: [
      {
        company: "Solace Technology Inc",
        role: "CEO & Co-founder",
        period: "Nov 2023 - Aug 2025",
        location: "Istanbul, Turkey",
        description: "Launched two AI products—Ensi (smart home) and EMA (B2B assistant)—leading full-stack development across mobile, web, and backend systems. Built Python/FastAPI backends with WebSockets, deployed CI/CD with Docker and GitHub Actions. Raised $250K, secured TÜBİTAK 1507 grant, scaled team from 4 to 8 engineers, and drove GTM strategy including positioning and investor relations."
      },
      {
        company: "TÜBİTAK (Scientific and Technological Research Council of Turkey)",
        role: "Part-Time Researcher",
        period: "Aug 2023 - Dec 2023",
        location: "Kocaeli, Turkey",
        description: "Built a secure cross-platform MPC Wallet in Flutter+Go to eliminate single-key custody risk. Contributed to a Go crypto library and simulated adversarial attacks to test protocol resilience for blockchain security research."
      },
      {
        company: "TÜBİTAK BİLGEM",
        role: "STAR Presidential Research Intern",
        period: "Jan 2022 - Jul 2022",
        location: "Gebze, Turkey",
        description: "Built CBDC smart contracts with Hyperledger Fabric, Solidity, and TypeScript for Turkey's Central Bank. Developed and deployed a regulated NFT prototype to test digital asset flows internally as part of national digital currency research."
      },
      {
        company: "Baykar Defense / Cezeri AI",
        role: "Project Management Intern",
        period: "2021 - 2022",
        location: "Turkey",
        description: "Benchmarked CI/CD tools, built containerized pipelines, and proposed a DevOps roadmap including early-stage static analysis and deployment KPIs for AI and robotics applications in defense technology."
      },
      {
        company: "Yıldız Technical University - Autonomous Systems Club",
        role: "Deep Learning Engineer",
        period: "Nov 2020 - Aug 2021",
        location: "Istanbul, Turkey",
        description: "Boosted detection pipeline throughput (YOLOv4 → TensorRT/TKDNN) from 36 to 140 FPS. Led dataset operations and launched Tableau reviews to ensure labeling and evaluation quality for autonomous vehicle systems."
      }
    ]
  },

  // Education Section
  education: {
    title: "Education",
    degrees: [
      {
        institution: "Yıldız Technical University",
        degree: "Bachelor of Science in Industrial Engineering",
        period: "2018 - 2024",
        location: "Istanbul, Turkey",
        gpa: "3.32",
        highlights: ["Systems Optimization", "Operations Research", "Project Management", "Lean Manufacturing"]
      },
      {
        institution: "Yıldız Technical University",
        degree: "Bachelor of Science in Computer Science (Double Major)",
        period: "2020 - 2024",
        location: "Istanbul, Turkey",
        gpa: "3.05",
        highlights: ["Software Engineering", "Algorithms & Data Structures", "AI/ML Fundamentals", "Distributed Systems"]
      }
    ],
    research: {
      title: "Research & Publications",
      publication: "Beyond Synthetic Benchmarks: Assessing Recent LLMs for Code Generation",
      publicationUrl: "https://www.researchgate.net/publication/384070868_Beyond_Synthetic_Benchmarks_Assessing_Recent_LLMs_for_Code_Generation"
    }
  },

  // Achievements Section
  achievements: {
    title: "Achievements",
    items: [
      {
        title: "Successful Product Launches",
        description: "Led two AI-native products from concept to market launch with measurable user adoption and revenue generation."
      },
      {
        title: "Team Leadership",
        description: "Built and scaled engineering teams from ground up, establishing development processes and technical standards."
      },
      {
        title: "Research Contributions",
        description: "Contributed to blockchain research at Turkey's leading technology research institute (TÜBİTAK BİLGEM)."
      },
      {
        title: "AI/ML Systems Architecture",
        description: "Designed and implemented scalable AI pipelines using LangChain, FastAPI, and vector databases for real-time conversational AI systems."
      },
      {
        title: "Full-Stack Development Excellence",
        description: "Built production-grade applications with modern tech stack: TypeScript, React, Next.js, Python, and PostgreSQL with 99.9% uptime."
      },
      {
        title: "Microservices & API Design",
        description: "Architected RESTful and GraphQL APIs serving thousands of daily requests with comprehensive documentation and automated testing."
      },
      {
        title: "DevOps & Infrastructure",
        description: "Implemented CI/CD pipelines, containerization with Docker, and cloud deployment strategies on AWS and Vercel."
      },
      {
        title: "Performance Optimization",
        description: "Achieved performance improvements through code optimization, database indexing, and efficient algorithm implementation in the roles I have had a part with."
      },
      {
        title: "Security & Data Privacy",
        description: "Implemented robust security protocols including JWT authentication, data encryption, GDPR compliance, and secure API endpoints."
      },
      {
        title: "Cross-Functional Leadership",
        description: "Successfully managed product development, go-to-market strategy, and investor relations simultaneously."
      }
    ]
  }
};
