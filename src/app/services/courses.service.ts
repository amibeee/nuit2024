import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

@Injectable()
export class CoursesService {
  static readonly API_URL = 'assets/data'; // Local path to JSON files

  constructor(private http: HttpClient) {}

  // Fetch a single course by ID
  findCourseById(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${CoursesService.API_URL}/courses.json`).pipe(
      map(courses => {
        // Find and return the course with the matching ID
        return courses[courseId];
      })
    );
  }

  // Fetch all courses
  findAllCourses(): Observable<Course[]> {
    return this.http.get<{ [key: string]: Course }>(`${CoursesService.API_URL}/courses.json`).pipe(
      map(courses => {
        // Convert the courses object to an array
        return Object.values(courses);
      })
    );
  }

  // Fetch lessons for a specific course
  findAllCourseLessons(courseId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${CoursesService.API_URL}/lessons/${courseId}.json`);
  }
}
