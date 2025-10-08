import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcademicService, Course, ScheduleItem } from '../../../services/academic.service';

// --- CUSTOM VALIDATORS ---

function endDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');
  if (startDate && endDate && startDate.value && endDate.value && new Date(endDate.value) <= new Date(startDate.value)) {
    return { 'endDateInvalid': true };
  }
  return null;
}

function timeRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const startHour = control.get('startHour')?.value;
  const startMinute = control.get('startMinute')?.value;
  const startPeriod = control.get('startPeriod')?.value;
  const endHour = control.get('endHour')?.value;
  const endMinute = control.get('endMinute')?.value;
  const endPeriod = control.get('endPeriod')?.value;

  if (!startHour || !startMinute || !startPeriod || !endHour || !endMinute || !endPeriod) {
    return null;
  }

  let startTotalMinutes = (parseInt(startHour, 10) % 12) * 60 + parseInt(startMinute, 10);
  if (startPeriod === 'PM') startTotalMinutes += 12 * 60;
  if (startHour === '12' && startPeriod === 'AM') startTotalMinutes -= 12 * 60;

  let endTotalMinutes = (parseInt(endHour, 10) % 12) * 60 + parseInt(endMinute, 10);
  if (endPeriod === 'PM') endTotalMinutes += 12 * 60;
  if (endHour === '12' && endPeriod === 'AM') endTotalMinutes -= 12 * 60;

  if (startTotalMinutes >= endTotalMinutes) {
    return { 'timeRangeInvalid': true };
  }
  return null;
}


@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.css']
})
export class ClassManagementComponent implements OnInit {
  courseForm: FormGroup;
  courses: Course[] = [];
  isEditMode = false;
  currentCourseId: string | null = null;
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  periods = ['AM', 'PM'];

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
    private datePipe: DatePipe
  ) {
    this.minDate = new Date().toISOString().split('T')[0];

    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      courseId: ['', Validators.pattern(/^[a-zA-Z0-9-]*$/)],
      instructor: ['', Validators.pattern(/^[a-zA-Z\s.]*$/)],
      dates: this.fb.group({
        startDate: [''],
        endDate: ['']
      }, { validator: endDateValidator }),
      schedule: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  get courseName() { return this.courseForm.get('courseName'); }
  get courseId() { return this.courseForm.get('courseId'); }
  get instructor() { return this.courseForm.get('instructor'); }
  get schedule() { return this.courseForm.get('schedule') as FormArray; }
  get dates() { return this.courseForm.get('dates'); }

  createScheduleItem(): FormGroup {
    return this.fb.group({
      day: ['', Validators.required],
      startHour: ['', Validators.required],
      startMinute: ['', Validators.required],
      startPeriod: ['', Validators.required],
      endHour: ['', Validators.required],
      endMinute: ['', Validators.required],
      endPeriod: ['', Validators.required],
    }, { validator: timeRangeValidator });
  }

  addScheduleItem(): void {
    this.schedule.push(this.createScheduleItem());
  }

  removeScheduleItem(index: number): void {
    this.schedule.removeAt(index);
  }

  loadCourses(): void {
    this.isLoading = true;
    this.academicService.getCourses().subscribe({
      next: (data) => {
        // --- SORTING LOGIC ADDED HERE ---
        data.forEach(course => {
          if (course.schedule && course.schedule.length > 0) {
            course.schedule.sort((a, b) => {
              const dayIndexA = this.daysOfWeek.indexOf(a.day);
              const dayIndexB = this.daysOfWeek.indexOf(b.day);
              // First, sort by day of the week
              if (dayIndexA !== dayIndexB) {
                return dayIndexA - dayIndexB;
              }
              // If days are the same, sort by start time
              return a.startTime.localeCompare(b.startTime);
            });
          }
        });
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => this.handleError('Failed to load courses.')
    });
  }

  onSubmitCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    const rawValue = this.courseForm.getRawValue();
    const transformedSchedule = rawValue.schedule.map((item: any) => ({
      day: item.day,
      startTime: this.convert12hrTo24hr(item.startHour, item.startMinute, item.startPeriod),
      endTime: this.convert12hrTo24hr(item.endHour, item.endMinute, item.endPeriod)
    }));
    
    const finalPayload = {
      courseName: rawValue.courseName,
      courseId: rawValue.courseId,
      instructor: rawValue.instructor,
      startDate: rawValue.dates.startDate || null,
      endDate: rawValue.dates.endDate || null,
      schedule: transformedSchedule
    };

    const apiCall = this.isEditMode
      ? this.academicService.updateCourse(this.currentCourseId!, finalPayload)
      : this.academicService.addCourse(finalPayload);

    apiCall.subscribe({
      next: () => {
        this.handleSuccess(`Course successfully ${this.isEditMode ? 'updated' : 'added'}.`);
        this.loadCourses(); // Reloading will also apply the new sorting
        this.resetForm();
      },
      error: (err) => this.handleError(`Failed to ${this.isEditMode ? 'update' : 'add'} course.`)
    });
  }

  onEdit(course: Course): void {
    this.isEditMode = true;
    this.currentCourseId = course._id!;
    this.courseForm.patchValue({
      courseName: course.courseName,
      courseId: course.courseId,
      instructor: course.instructor,
      dates: {
        startDate: this.datePipe.transform(course.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(course.endDate, 'yyyy-MM-dd')
      }
    });
    
    this.schedule.clear();
    course.schedule.forEach((item: ScheduleItem) => {
      const start = this.convert24hrTo12hr(item.startTime);
      const end = this.convert24hrTo12hr(item.endTime);
      
      this.schedule.push(this.fb.group({
        day: [item.day, Validators.required],
        startHour: [start.hour, Validators.required],
        startMinute: [start.minute, Validators.required],
        startPeriod: [start.period, Validators.required],
        endHour: [end.hour, Validators.required],
        endMinute: [end.minute, Validators.required],
        endPeriod: [end.period, Validators.required],
      }, { validator: timeRangeValidator }));
    });
    window.scrollTo(0, 0);
  }

  onDelete(courseId: string | undefined): void {
    if (!courseId) return;
    if (confirm('Are you sure you want to delete this course and all its data?')) {
      this.isLoading = true;
      this.academicService.deleteCourse(courseId).subscribe({
        next: () => { this.handleSuccess('Course deleted successfully.'); this.loadCourses(); },
        error: (err) => this.handleError('Failed to delete course.')
      });
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentCourseId = null;
    this.courseForm.reset();
    this.schedule.clear();
  }
  
  public convert24hrTo12hr(time: string): { hour: string; minute: string; period: string } {
    if (!time) return { hour: '', minute: '', period: 'AM' };
    const [h, m] = time.split(':').map(s => parseInt(s, 10));
    const period = h >= 12 ? 'PM' : 'AM';
    let hour = h % 12;
    if (hour === 0) hour = 12;
    return {
      hour: hour.toString().padStart(2, '0'),
      minute: m.toString().padStart(2, '0'),
      period: period
    };
  }

  private convert12hrTo24hr(hour: string, minute: string, period: string): string {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h.toString().padStart(2, '0') + ':' + minute;
  }
  
  private handleError(message: string): void { this.errorMessage = message; this.isLoading = false; setTimeout(() => this.errorMessage = '', 5000); }
  private handleSuccess(message: string): void { this.successMessage = message; this.isLoading = false; setTimeout(() => this.successMessage = '', 3000); }
}