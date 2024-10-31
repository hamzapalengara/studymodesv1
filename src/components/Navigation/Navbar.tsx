import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react' // Import icons for mobile menu

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Edu Modes
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-8">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">Resources</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">Subjects</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">Grades</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">About</Link></li>
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex space-x-2">
            <Button variant="outline">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="#" className="text-gray-600 hover:text-blue-600">Resources</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">Subjects</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">Grades</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">About</Link>
            </nav>
            <div className="mt-4 flex flex-col space-y-2">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 
