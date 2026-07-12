export function getUseCase(techName: string, categories: string[]): string {
  // Try specific tools first
  const specificMappings: Record<string, string> = {
    "React": "Used to build interactive user interfaces using reusable components.",
    "Vue.js": "Progressive framework for building user interfaces and single-page applications.",
    "Next.js": "React framework for production-grade server-side rendering and static site generation.",
    "FastAPI": "High-performance backend framework for building REST APIs with Python.",
    "Express": "Fast, unopinionated backend framework for Node.js.",
    "Nginx": "High-performance web server, reverse proxy, and load balancer.",
    "Apache": "Robust, widely-used open-source HTTP web server.",
    "Tailwind CSS": "Utility-first CSS framework for rapid UI styling.",
    "Bootstrap": "Component-based CSS framework for responsive design.",
    "WordPress": "The most popular Content Management System for building blogs and sites.",
    "Shopify": "E-commerce platform for online stores and retail point-of-sale systems.",
    "Google Analytics": "Tracks and reports website traffic and user behavior.",
    "Supabase": "Open source Firebase alternative for database, auth, and storage.",
    "Firebase": "Platform developed by Google for creating mobile and web applications.",
    "MySQL": "Open-source relational database management system.",
    "PostgreSQL": "Advanced open-source relational database system.",
    "MongoDB": "NoSQL document database for scalable applications.",
    "Vercel": "Cloud platform for static sites and Serverless Functions.",
    "Cloudflare": "Provides CDN, DNS, DDoS protection and security.",
    "Amazon Web Services": "Comprehensive, evolving cloud computing platform provided by Amazon.",
  };

  if (specificMappings[techName]) {
    return specificMappings[techName];
  }

  // Fallback to categories
  const catString = categories.join(' ').toLowerCase();
  
  if (catString.includes('web framework') || catString.includes('javascript framework')) {
    return "Used for structuring and building the underlying logic and interfaces of the application.";
  }
  if (catString.includes('analytics')) {
    return "Used for tracking user behavior, site traffic, and generating performance statistics.";
  }
  if (catString.includes('database')) {
    return "Used for persistently storing, querying, and managing application data.";
  }
  if (catString.includes('cms') || catString.includes('content management')) {
    return "Used for creating, managing, and modifying digital content without extensive technical knowledge.";
  }
  if (catString.includes('server') || catString.includes('web server')) {
    return "Used to serve web pages to clients and handle HTTP requests securely.";
  }
  if (catString.includes('cdn') || catString.includes('content delivery')) {
    return "Used to deliver content rapidly and securely from servers closest to the user's location.";
  }
  if (catString.includes('ecommerce') || catString.includes('e-commerce')) {
    return "Used to facilitate online transactions, product management, and online store operations.";
  }
  if (catString.includes('ui framework') || catString.includes('css framework') || catString.includes('styling')) {
    return "Used to style the visual presentation and ensure responsive design across devices.";
  }
  if (catString.includes('payment')) {
    return "Used to securely process online payments and financial transactions.";
  }
  if (catString.includes('security')) {
    return "Used to protect the application from vulnerabilities, DDoS attacks, and unauthorized access.";
  }
  if (catString.includes('programming language')) {
    return "The core language used to write the application's underlying code and algorithms.";
  }
  if (catString.includes('tag manager')) {
    return "Used to manage and deploy marketing tags (snippets of code or tracking pixels).";
  }

  // Default fallback
  if (categories.length > 0) {
    return `Provides ${categories[0].toLowerCase()} capabilities to the application stack.`;
  }

  return "Part of the application's technology stack infrastructure.";
}
