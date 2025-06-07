# CV Designer - Professional Resume Builder

CV Designer is a web application that allows users to create professional resumes with ease. The system enables users to upload a resume template (image or PDF), analyze its design and layout, and then provide a structured form for the user to input their personal, educational, professional, and skill details.

## Features

- **Template Upload**: Upload your own resume template or choose from our collection
- **Structured Data Input**: Easy-to-use forms for entering your personal information, education, work experience, and skills
- **PDF Generation**: Generate a high-quality PDF resume based on your data and template
- **User Accounts**: Create an account to save and manage your resumes
- **Modern UI**: Clean, intuitive, and responsive user interface

## Technology Stack

- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma
- **PDF Processing**: pdf-lib, html2canvas, jsPDF
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cvdesigner.git
   cd cvdesigner
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The application uses the following database tables:

- **users**: Managed by NextAuth.js
- **templates**: Stores resume templates
- **resumes**: Stores user resumes with references to templates

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
