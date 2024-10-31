import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Book, GamepadIcon, FileText, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FilterData, readFilters } from '@/utils/csvReader'
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface HomeProps extends FilterData {}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const filters = readFilters()
  return {
    props: filters,
    revalidate: 10 // Revalidate every 10 seconds
  }
}

export default function Home({ resourceTypes, grades, subjects, topics, resources }: FilterData) {
  const [selectedFilters, setSelectedFilters] = useState({
    resourceType: '',
    grade: '',
    subject: '',
    topic: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState(resources);

  // Function to handle search
  const handleSearch = () => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = resources.filter(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.subject.toLowerCase().includes(query) ||
        resource.topic.toLowerCase().includes(query) ||
        resource.grade.toLowerCase().includes(query) ||
        resource.resourceType.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (selectedFilters.resourceType) {
      filtered = filtered.filter(resource => resource.resourceType === selectedFilters.resourceType);
    }
    if (selectedFilters.grade) {
      filtered = filtered.filter(resource => resource.grade === selectedFilters.grade);
    }
    if (selectedFilters.subject) {
      filtered = filtered.filter(resource => resource.subject === selectedFilters.subject);
    }
    if (selectedFilters.topic) {
      filtered = filtered.filter(resource => resource.topic === selectedFilters.topic);
    }

    setFilteredResources(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));

    // Apply all filters including the new one
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.subject.toLowerCase().includes(query) ||
        resource.topic.toLowerCase().includes(query) ||
        resource.grade.toLowerCase().includes(query) ||
        resource.resourceType.toLowerCase().includes(query)
      );
    }

    // Apply dropdown filters with the new value
    const newFilters = {
      ...selectedFilters,
      [filterName]: value
    };

    if (newFilters.resourceType) {
      filtered = filtered.filter(resource => resource.resourceType === newFilters.resourceType);
    }
    if (newFilters.grade) {
      filtered = filtered.filter(resource => resource.grade === newFilters.grade);
    }
    if (newFilters.subject) {
      filtered = filtered.filter(resource => resource.subject === newFilters.subject);
    }
    if (newFilters.topic) {
      filtered = filtered.filter(resource => resource.topic === newFilters.topic);
    }

    setFilteredResources(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({
      resourceType: '',
      grade: '',
      subject: '',
      topic: ''
    });
    setSearchQuery('');
    setFilteredResources(resources);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to Edu Modes
          </h1>
          <p className="text-base md:text-lg mb-4">
            Discover a world of learning resources for students of all ages
          </p>
          <Button 
            variant="secondary" 
            size="default"
            className="text-blue-600 bg-white hover:bg-gray-50"
          >
            Get Started
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4">Find Materials</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type
                  </label>
                  <select 
                    value={selectedFilters.resourceType}
                    onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {resourceTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select 
                    value={selectedFilters.grade}
                    onChange={(e) => handleFilterChange('grade', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Grades</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.name}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select 
                    value={selectedFilters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <select 
                    value={selectedFilters.topic}
                    onChange={(e) => handleFilterChange('topic', e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Topics</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.name}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch}
                    className="w-full"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="mb-4 text-gray-600">
              Showing {filteredResources.length} of {resources.length} resources
            </div>
            {filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <Link 
                    key={resource.id}
                    href={`/resources/${resource.id}`}
                    className="block transition-transform hover:scale-105"
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-3">
                        <div className="aspect-[21/9] relative mb-3 rounded-md overflow-hidden">
                          <Image
                            src={resource.imageUrl}
                            alt={resource.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {resource.resourceType}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              {resource.grade}
                            </span>
                          </div>
                          <h3 className="font-semibold text-base line-clamp-1">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-gray-500">
                              {resource.subject} • {resource.topic}
                            </span>
                            <div className="text-blue-600 text-xs font-medium flex items-center">
                              View
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
