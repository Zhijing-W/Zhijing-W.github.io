window.SITE_CONTENT = {
  version: "2026-05-07-edit-a1",
  github: {
    owner: "Zhijing-W",
    repo: "Zhijing-W.github.io",
    branch: "main",
    path: "data/site-content.js",
  },
  profile: {
    topName: "Zhijing Wu",
    kicker: "Personal Homepage",
    name: "Zhijing Wu",
    nameCn: "吴止境",
    subtitle: "M.S. Computer Science, Columbia University",
    photo: {
      src: "assets/profile-960.jpg",
      srcset: "assets/profile-480.jpg 480w, assets/profile-960.jpg 960w, assets/profile-original.jpg 4032w",
      sizes: "(min-width: 1180px) 280px, (min-width: 768px) 13rem, 9rem",
      width: "960",
      height: "720",
      alt: "Portrait of Zhijing Wu by the ocean",
    },
    nav: [
      { label: "About Me", href: "#about" },
      { label: "Education", href: "#education" },
      { label: "Work", href: "#work" },
      { label: "Projects", href: "#projects" },
      { label: "Research", href: "#research" },
      { label: "Skills", href: "#skills" },
      { label: "Certificates", href: "#certificates" },
      { label: "Life", href: "life.html" },
    ],
    links: [
      { icon: "email", href: "mailto:zw3155@columbia.edu", label: "Email Zhijing Wu" },
      { icon: "resume", href: "files/Wu_Zhijing_Resume.pdf", label: "Open resume or CV" },
      { icon: "github", href: "https://github.com/Zhijing-W", label: "GitHub profile" },
      { icon: "linkedin", href: "https://www.linkedin.com/in/zhijing-philip-wu", label: "LinkedIn profile" },
    ],
  },
  home: {
    title: "Zhijing Wu 吴止境 | Personal Homepage",
    description: "Zhijing Wu (吴止境) is a Columbia M.S. Computer Science student with an applied mathematics background, focused on software systems, data infrastructure, and applied machine learning.",
    sections: [
      {
        id: "about",
        type: "about",
        title: "About Me",
        paragraphs: [
          "Hi, I am Zhijing Wu, a M.S. Computer Science student at Columbia University. I have a dual-degree background in applied mathematics from the University of Birmingham and Jinan University.",
          "My interests sit at the intersection of <em>software systems</em>, <em>data infrastructure</em>, and <em>applied machine learning</em>. I enjoy work that combines clean engineering, mathematical thinking, and practical user-facing impact.",
        ],
        newsTitle: "🔥 News 🔥",
        news: [
          { date: "May 2026", datetime: "2026-05", text: "Joined Microsoft as a Cloud Solution Architect (CSA)." },
          { date: "Aug. 2025", datetime: "2025-08", text: "Joined Columbia University as an M.S. student in Computer Science." },
        ],
      },
      {
        id: "education",
        type: "timeline",
        title: "Education",
        items: [
          {
            date: "Aug. 2025 - Dec. 2026",
            title: "Columbia University",
            text: "M.S. in Computer Science | New York, NY",
            featured: true,
          },
          {
            date: "Sept. 2021 - Jun. 2025",
            title: "University of Birmingham",
            text: "B.Sc. in Applied Mathematics with Mathematics | First Class Honours",
          },
          {
            date: "Sept. 2021 - Jun. 2025",
            title: "Jinan University",
            text: "B.Sc. in Mathematics and Applied Mathematics",
          },
        ],
      },
      {
        id: "work",
        type: "cards",
        title: "Work",
        items: [
          {
            meta: "Jul. 2023 - Sept. 2023 | Hefei, China",
            title: "System Maintenance and Data Intern, iFLYTEK Co., Ltd",
            bullets: [
              "Engineered a Python/Pandas ETL pipeline to standardize 12,000+ City Supplementary Health Insurance records and improve data integrity to 98%.",
              "Designed a ClickHouse OLAP schema and materialized views for pre-aggregated market share, premium trend, and financial metrics.",
              "Wrote analytical SQL with window functions and array functions to support competitor intelligence and 2 product iterations.",
            ],
          },
        ],
      },
      {
        id: "projects",
        type: "folds",
        title: "Projects",
        cardClass: "project-card",
        items: [
          {
            meta: "Aug. 2025 - Present | Full-Stack",
            title: "Real-Time Job Search Tracker",
            brief: "Ruby on Rails platform for managing 100+ job applications across 7 pipeline stages.",
            codeUrl: "https://github.com/Real-Time-Job-Search-Tracker/proj-iter1",
            codeLabel: "Open Real-Time Job Search Tracker code",
            bullets: [
              "Built canonical URL anchoring across LinkedIn, Handshake, Indeed, and other job platforms.",
              "Implemented RSpec and Cucumber tests, reaching 95% SimpleCov coverage across 100+ workflow cases.",
              "Generated Sankey diagrams to visualize application flow and reduce manual tracking overhead.",
            ],
            tags: ["Ruby on Rails", "RSpec", "Cucumber", "Data Visualization"],
          },
          {
            meta: "Sept. 2025 - Present | Distributed Systems",
            title: "Community Trading Microservices System",
            brief: "Distributed trading platform on GCP with 5 microservices, 30+ REST endpoints, and 4 databases.",
            codeUrl: "https://github.com/CloudComputing-Arknights",
            codeLabel: "Open Community Trading Microservices System code",
            bullets: [
              "Deployed services across Cloud Run and Compute Engine with Cloud SQL and VM-hosted MySQL.",
              "Integrated OAuth 2.0, JWT authentication, API Gateway, eTag, HATEOAS patterns, and asynchronous processing.",
              "Engineered idempotent transaction endpoints with request deduplication to protect consistency.",
            ],
            tags: ["GCP", "Microservices", "REST APIs", "JWT"],
          },
          {
            meta: "Sept. 2025 - Dec. 2025 | Data Engineering",
            title: "Financial Portfolio Analytics Platform",
            brief: "PostgreSQL and GCP analytics platform for tracking multi-platform trading activity, ROI, and realized PnL.",
            codeUrl: "https://github.com/Zhijing-W/CSGO2_TransactionData_Platform",
            codeLabel: "Open Financial Portfolio Analytics Platform code",
            bullets: [
              "Engineered a 70-line SQL query using CTEs and window functions to aggregate multi-platform transaction data, tracking $10K+ portfolio value and computing ROI and realized PnL.",
              "Designed a normalized PostgreSQL schema with 6 tables, ACID-compliant transactions, and database triggers for real-time O(1) user activity tracking.",
              "Deployed the analytics engine on Google Cloud Platform, enabling users to visualize price history, holdings breakdown, top movers, and comparative platform pricing.",
            ],
            tags: ["PostgreSQL", "SQL", "GCP", "Analytics"],
          },
        ],
      },
      {
        id: "research",
        type: "folds",
        title: "Research",
        cardClass: "research-card",
        items: [
          {
            meta: "May 2023 - May 2025 | Research Assistant, Jinan University | Guangzhou, CN",
            title: "Optimizing Compressed Sensing and Hard Thresholding Algorithms",
            brief: "Research with Prof. Jinming Wen on compressed sensing algorithms and accelerated iterative methods.",
            bullets: [
              "Conducted a literature review on compressed sensing and analyzed over 20 papers, leading lab discussions on recent developments and robustness strategies.",
              "Developed open-source code using TensorFlow and PyTorch for PGD-GAN, quantized compressed sensing, and related compressed sensing algorithms.",
              "Enhanced iterative functions in NSIHT and NSHTP algorithms through identity transformation and accelerated algorithms with pre-computation.",
              "Improved computational complexity, making the new algorithms O(n²/m²) times faster than NSIHT and NSHTP.",
            ],
          },
          {
            meta: "Jul. 2024 - Oct. 2024 | Summer Research Assistant, Carnegie Mellon University | Shanghai, CN",
            title: "Using Temporal Transformers and Spatial Data Simulating Physical Climate Models",
            brief: "Research with Prof. David P. Woodruff on transformer-based climate simulation.",
            bullets: [
              "Presented a transformer model for climate simulation, combining 5 remote sensing spatial features with climate time series to mirror real-world dynamics.",
              "Reduced model complexity by 15% by removing mask attention and adding self-attention to the decoder.",
              "Evaluated model effectiveness, outperforming traditional algorithms with 16.16% higher accuracy than LSTM and 4.06% higher than Random Forest.",
            ],
          },
          {
            meta: "Jan. 2022 - Oct. 2024 | Anhui University",
            title: "An Electric Vehicle Sales Hybrid Forecasting Method",
            brief: "Research Assistant with Prof. Jinpei Liu.",
            bullets: [
              "Built automated data collection pipelines with BeautifulSoup and Requests for EV sales data and 10,000+ customer reviews across 20 EV companies.",
              "Developed a BERT + Bi-LSTM sentiment analysis model to improve domain adaptability on customer review data.",
              "Achieved R2 of 0.9971, outperforming XGBoost by 15.71% and non-decomposed models by 11.31%.",
            ],
          },
        ],
      },
      {
        id: "skills",
        type: "skills",
        title: "Technical Skills",
        items: [
          { title: "Languages", text: "Python, C++, Java, SQL, JavaScript, Ruby, HTML/CSS, C, Bash/Shell, R, Matlab" },
          { title: "Infrastructure & Data", text: "GCP, Docker, Kubernetes, Kafka, PostgreSQL, MySQL, Redis, ClickHouse, Spark, TCP/IP, BGP, IS-IS, OSI model" },
          { title: "Frameworks & Tools", text: "Spring Boot, Ruby on Rails, microservices, REST APIs, Git, CI/CD, UNIX/Linux, object-oriented design" },
        ],
      },
      {
        id: "certificates",
        type: "certificates",
        title: "Certificates",
        groups: [
          {
            issuer: "Coursera",
            items: [
              {
                title: "Neural Networks and Deep Learning",
                href: "https://www.coursera.org/account/accomplishments/verify/E7CZ3C76UX4E",
                date: "Jul. 2023",
                datetime: "2023-07",
              },
              {
                title: "SQL for Data Science",
                href: "https://www.coursera.org/account/accomplishments/verify/QSBL9BCUAVE4",
                date: "Feb. 2024",
                datetime: "2024-02",
              },
            ],
          },
        ],
      },
    ],
  },
  life: {
    title: "Zhijing Wu 吴止境 | Life & Notes",
    description: "Life notes, student leadership, honors, and blog records for Zhijing Wu (吴止境).",
    nav: [
      { label: "About Me", href: "index.html#about" },
      { label: "Life & Blog", href: "#life-log" },
      { label: "Student Leadership", href: "#leadership" },
      { label: "Honors", href: "#honors-life" },
    ],
    hero: {
      id: "life-top",
      kicker: "Daily / Blog / Beyond Coursework",
      title: "Life & Notes",
    },
    sections: [
      {
        id: "life-log",
        type: "lifeGrid",
        title: "Life & Blog",
        items: [
          {
            meta: "Coming Soon",
            title: "Campus Notes",
            text: "Short records about student life, events, volunteering, and communities.",
          },
          {
            meta: "Coming Soon",
            title: "Learning Journal",
            text: "Notes on systems, cloud computing, data, and things worth remembering.",
          },
        ],
      },
      {
        id: "leadership",
        type: "lifeEntry",
        title: "Student Leadership",
        entry: {
          meta: "Jun. 2022 - Jun. 2023 | Guangzhou, CN",
          title: "Head, Department of Overseas Students (DOS), Jinan University Student Union",
          bullets: [
            "Organized the “Overseas Students Cup” over three months, coordinating logistics, activity scheduling, and volunteer support for 20+ teams and 100 participants.",
            "Executed the University’s 115th Anniversary Celebration and Cultural Festival activities with student clubs and associations.",
            "Built an SQL-based database system for the student union to streamline financial management.",
          ],
        },
      },
      {
        id: "honors-life",
        type: "honors",
        title: "Honors",
        items: [
          "Second Prize Scholarship, Jinan University, 2023 and 2024",
          "Silver Medal, China Internet+ Innovation & Entrepreneurship Competition, 2023",
          "Excellent Volunteer, Guangzhou Volunteer System, 188 certified hours, 2023",
          "Excellent Student Leader, Jinan University, 2023",
        ],
      },
    ],
  },
};
