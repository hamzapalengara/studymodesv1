import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface FilterOption {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  resourceType: string;
  grade: string;
  subject: string;
  topic: string;
  title: string;
  description: string;
  imageUrl: string;
  resourceUrl: string;
  answersUrl: string | null;
  tipsUrl: string | null;
}

export interface FilterData {
  resourceTypes: FilterOption[];
  grades: FilterOption[];
  subjects: FilterOption[];
  topics: FilterOption[];
  resources: Resource[];
}

export function readFilters(): FilterData {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'filters.csv');
    console.log('Reading file from:', filePath);
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log('File content:', fileContent);
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    console.log('Parsed records:', records);

    // Create Sets to store unique values
    const resourceTypesSet = new Set<string>();
    const gradesSet = new Set<string>();
    const subjectsSet = new Set<string>();
    const topicsSet = new Set<string>();
    const resources: Resource[] = [];

    records.forEach((record: any) => {
      resourceTypesSet.add(record.resource_type);
      gradesSet.add(record.grade);
      subjectsSet.add(record.subject);
      topicsSet.add(record.topic);

      resources.push({
        id: record.id,
        resourceType: record.resource_type,
        grade: record.grade,
        subject: record.subject,
        topic: record.topic,
        title: record.title,
        description: record.description,
        imageUrl: record.image_url,
        resourceUrl: record.resource_url,
        answersUrl: record.answers_url || null,
        tipsUrl: record.tips_url || null
      });
    });

    const filters: FilterData = {
      resourceTypes: Array.from(resourceTypesSet).map(type => ({
        id: type.toLowerCase().replace(/\s+/g, '_'),
        name: type
      })),
      grades: Array.from(gradesSet).map(grade => ({
        id: grade.toLowerCase().replace(/\s+/g, '_'),
        name: grade
      })),
      subjects: Array.from(subjectsSet).map(subject => ({
        id: subject.toLowerCase().replace(/\s+/g, '_'),
        name: subject
      })),
      topics: Array.from(topicsSet).map(topic => ({
        id: topic.toLowerCase().replace(/\s+/g, '_'),
        name: topic
      })),
      resources
    };

    console.log('Processed filters:', filters);
    return filters;
  } catch (error) {
    console.error('Error reading filters:', error);
    return {
      resourceTypes: [],
      grades: [],
      subjects: [],
      topics: [],
      resources: []
    };
  }
} 