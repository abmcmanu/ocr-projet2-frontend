import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { StudentRequest } from '../../../core/models/StudentRequest';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentForm: FormGroup = new FormGroup({});
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  editId: number | null = null;

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  get form() {
    return this.studentForm.controls;
  }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.loadStudent(this.editId);
    }
  }

  private loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email
          });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Erreur lors du chargement.';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.studentForm.invalid) return;

    this.loading = true;

    const payload: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };

    const request$ = this.isEditMode
      ? this.studentService.update(this.editId!, payload)
      : this.studentService.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur lors de l\'enregistrement.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}