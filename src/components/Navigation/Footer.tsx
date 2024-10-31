import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">About Edu Modes</h3>
            <p className="text-gray-300">Edu Modes is your one-stop platform for high-quality educational resources, designed to support students in their learning journey.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-blue-400">Home</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-400">Resources</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-400">Subjects</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-blue-400">Grades</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="text-gray-300">
              <p>Email: info@edumodes.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2024 Edu Modes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 