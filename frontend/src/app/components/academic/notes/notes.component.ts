import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcademicService, Note, Course } from '../../../services/academic.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  course: Course | null = null;
  selectedNote: Note | null = null;
  isLoading = false;
  private courseId: string = '';

  constructor(
    private route: ActivatedRoute,
    private academicService: AcademicService
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    if (this.courseId) {
      this.loadNotes();
      this.academicService.getCourses().subscribe(courses => {
        this.course = courses.find(c => c._id === this.courseId) || null;
      });
    }
  }

  loadNotes(): void {
    this.isLoading = true;
    this.academicService.getNotesForCourse(this.courseId).subscribe(data => {
      this.notes = data;
      this.isLoading = false;
    });
  }

  selectNote(note: Note): void {
    this.selectedNote = { ...note };
  }

  createNewNote(): void {
    this.selectedNote = {
      title: 'New Note',
      content: '',
      course: this.courseId
    };
  }

  saveNote(): void {
    if (!this.selectedNote) return;
    this.isLoading = true;
    
    if (this.selectedNote._id) { // Update existing note
      this.academicService.updateNote(this.selectedNote._id, this.selectedNote).subscribe(updatedNote => {
        const index = this.notes.findIndex(n => n._id === updatedNote._id);
        if (index !== -1) this.notes[index] = updatedNote;
        this.selectedNote = { ...updatedNote };
        this.isLoading = false;
      });
    } else { // Add new note
      this.academicService.addNote(this.selectedNote).subscribe(newNote => {
        // THIS IS THE CORRECTED LOGIC
        // We add the newly created note (returned from the API) to the top of our local array.
        this.notes.unshift(newNote);
        this.selectedNote = newNote; // The new note is now the selected one
        this.isLoading = false;
      });
    }
  }

  deleteNote(): void {
    if (!this.selectedNote || !this.selectedNote._id) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      this.isLoading = true;
      this.academicService.deleteNote(this.selectedNote._id).subscribe(() => {
        this.notes = this.notes.filter(n => n._id !== this.selectedNote?._id);
        this.selectedNote = null;
        this.isLoading = false;
      });
    }
  }
}