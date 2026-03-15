import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  students: Student[] = [];
  loading = false;
  errorMessage: string | null = null;
  displayedColumns = ['firstName', 'lastName', 'email', 'actions'];

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Erreur lors du chargement des étudiants.';
          this.loading = false;
        }
      });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/students', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/students', 'new']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  delete(id: number): void {
    if (!confirm('Confirmer la suppression ?')) return;

    this.studentService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadStudents(),
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Erreur lors de la suppression.';
        }
      });
  }
}