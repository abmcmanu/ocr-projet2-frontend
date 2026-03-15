import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  student: Student | null = null;
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.student = student;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Étudiant introuvable.';
          this.loading = false;
        }
      });
  }

  goToEdit(): void {
    this.router.navigate(['/students', this.student!.id, 'edit']);
  }

  goToList(): void {
    this.router.navigate(['/students']);
  }
}