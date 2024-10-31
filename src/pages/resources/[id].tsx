import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Download, ArrowLeft, Eye, Lightbulb } from 'lucide-react'
import { readFilters, Resource } from '@/utils/csvReader'
import jsPDF from 'jspdf'
// ... (import all the components from your example)

interface ResourcePageProps {
  resource: Resource
  relatedResources: Resource[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { resources } = readFilters()
  
  const paths = resources.map((resource) => ({
    params: { id: resource.id }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<ResourcePageProps> = async ({ params }) => {
  const { resources } = readFilters()
  const resource = resources.find(r => r.id === params?.id)
  
  if (!resource) {
    return {
      notFound: true
    }
  }

  // Get related resources (same subject or topic)
  const relatedResources = resources
    .filter(r => 
      r.id !== resource.id && 
      (r.subject === resource.subject || r.topic === resource.topic)
    )
    .slice(0, 3)

  return {
    props: {
      resource,
      relatedResources
    }
  }
}

export default function ResourcePage({ resource, relatedResources }: ResourcePageProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [answers, setAnswers] = useState<string>('')
  const [tips, setTips] = useState<string>('')

  const handleDownload = () => {
    // Create a link to the PDF
    const link = document.createElement('a');
    link.href = resource.resourceUrl;
    link.target = '_blank';
    link.download = resource.title.toLowerCase().replace(/\s+/g, '-') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to fetch text content
  const fetchTextContent = async (url: string) => {
    try {
      const response = await fetch(url)
      const text = await response.text()
      return text
    } catch (error) {
      console.error('Error fetching content:', error)
      return 'Content could not be loaded.'
    }
  }

  // Load answers and tips when dialogs open
  const handleAnswersClick = async () => {
    if (resource.answersUrl && !answers) {
      const content = await fetchTextContent(resource.answersUrl)
      setAnswers(content)
    }
    setShowAnswers(true)
  }

  const handleTipsClick = async () => {
    if (resource.tipsUrl && !tips) {
      const content = await fetchTextContent(resource.tipsUrl)
      setTips(content)
    }
    setShowTips(true)
  }

  const handleAnswersPdfDownload = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 255) // Blue color for title
    doc.text('Answer Key', 20, 20)
    doc.text(resource.title, 20, 35)
    
    // Add subtitle
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100) // Gray color for subtitle
    doc.text('Generated from Edu Modes', 20, 45)
    
    // Add answers
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0) // Black color for content
    const answersArray = answers.split('\n')
    let yPosition = 60

    answersArray.forEach((answer, index) => {
      if (yPosition > 270) { // Check if we need a new page
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${index + 1}. ${answer}`, 20, yPosition)
      yPosition += 10
    })

    // Save the PDF
    doc.save(`${resource.title.toLowerCase().replace(/\s+/g, '-')}-answers.pdf`)
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        {/* Update grid layout with custom column widths */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - Resource info and buttons (30%) */}
          <div className="lg:col-span-4 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{resource.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {resource.resourceType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {resource.subject}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {resource.grade}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6 flex-grow">{resource.description}</p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Material
              </Button>
              {resource.answersUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleAnswersClick}
                  className="w-full bg-blue-50 hover:bg-blue-100"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Answers
                </Button>
              )}
              {resource.tipsUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleTipsClick}
                  className="w-full"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Solving Tips
                </Button>
              )}
            </div>
          </div>

          {/* Right side - PDF viewer (70%) */}
          <div className="lg:col-span-8 w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <object 
              data={resource.resourceUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <p>Unable to display PDF file. <a href={resource.resourceUrl} download>Download</a> instead.</p>
            </object>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Related Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedResources.map((related) => (
            <Card key={related.id} className="p-4">
              <h3 className="font-semibold mb-2">{related.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{related.description}</p>
              <Link href={`/resources/${related.id}`}>
                <Button variant="outline" size="sm">View Resource</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Update Dialogs */}
      <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-2xl text-blue-600 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Answer Key
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Answer key for {resource.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 bg-white">
            {answers.split('\n').map((answer, index) => (
              <div 
                key={index} 
                className="mb-4 last:mb-0 p-4 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-800">{answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 bg-white space-y-3">
            <Button 
              onClick={handleAnswersPdfDownload}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Answer Key as PDF
            </Button>
            <DialogClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-white border-b pb-4">
            <DialogTitle className="text-2xl text-green-600 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Solving Tips
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Helpful tips for solving {resource.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 bg-white">
            {tips.split('\n').map((tip, index) => (
              <div 
                key={index} 
                className="mb-4 last:mb-0 p-4 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-medium text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-800">{tip}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 bg-white">
            <DialogClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 