import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Create Professional Resumes in Minutes
              </h1>
              <p className="text-lg text-gray-600">
                Upload your template, fill in your details, and get a perfectly formatted resume that stands out from the crowd.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/resume-hero.svg"
                alt="Resume Builder"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Template</h3>
              <p className="text-gray-600">
                Upload your favorite resume template or choose from our collection of professional designs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fill Your Information</h3>
              <p className="text-gray-600">
                Enter your personal, educational, and professional details in our structured, easy-to-use forms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Download Your Resume</h3>
              <p className="text-gray-600">
                Preview your resume and download a high-quality PDF ready to impress potential employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;This tool saved me hours of formatting. I uploaded my template and had a professional resume in minutes!&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;The structured forms made it easy to organize my experience and skills. I got three interview calls within a week!&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Recent Graduate</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;As a student, I wasn&apos;t sure how to create a professional resume. This tool guided me through the entire process.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Professional Resume?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs with our resume builder.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">CV Designer</h3>
              <p className="text-gray-400 mt-2">Create professional resumes with ease</p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/templates" className="text-gray-400 hover:text-white">Templates</Link></li>
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Account</h4>
                <ul className="space-y-2">
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Login</Link></li>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} CV Designer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
