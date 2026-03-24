import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonEntity, LessonQuestion } from '@core/entities/lesson.entity';
import { LessonProgressEntity } from '@core/entities/lesson-progress.entity';
import { LessonsService } from '../services/lessons.service';
import { FeedbackModalComponent } from '@pages/feedback/feedback-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FeedbackModalComponent],
  providers: [LessonsService],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent implements OnInit {
  lesson: LessonEntity | undefined;
  currentQuestion = 0;
  selectedAnswer: string | null = null;
  answers: Record<number, string> = {};
  answered = false;
  score = 0;
  correctAnswersCount = 0;
  question: LessonQuestion | undefined;
  isSubmitting = false;
  showHint = false;
  showFeedbackModal = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly lessonsService: LessonsService,
    private readonly toast: HotToastService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.lessonsService.initialize();
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    this.lessonsService
      .getLesson(id)
      .pipe(untilDestroyed(this))
      .subscribe((lesson) => {
        if (!lesson) {
          this.router.navigate(['/lessons']);
          return;
        }

        this.lesson = new LessonEntity(lesson);
        this.updateQuestion();
      });
  }

  updateQuestion(): void {
    if (!this.lesson?.content.questions?.length) {
      return;
    }

    this.question = this.lesson.content.questions[this.currentQuestion];
    this.selectedAnswer = this.answers[this.currentQuestion] || null;
    this.showHint = false;
  }

  selectAnswer(optionId: string): void {
    this.selectedAnswer = optionId;
  }

  nextQuestion(): void {
    if (!this.selectedAnswer || !this.lesson) {
      return;
    }

    this.answers[this.currentQuestion] = this.selectedAnswer;

    if (this.currentQuestion < this.lesson.content.questions.length - 1) {
      this.currentQuestion += 1;
      this.updateQuestion();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion === 0) {
      return;
    }

    this.currentQuestion -= 1;
    this.updateQuestion();
  }

  toggleHint(): void {
    this.showHint = !this.showHint;
  }

  getProgressPercentage(): number {
    if (!this.lesson) {
      return 0;
    }

    return Math.round(((this.currentQuestion + 1) / this.lesson.content.questions.length) * 100);
  }

  getQuestionCounter(): string {
    if (!this.lesson) {
      return '';
    }

    return `${this.currentQuestion + 1} de ${this.lesson.content.questions.length}`;
  }

  getScoreClass(): string {
    if (this.score >= 90) {
      return 'score-excellent';
    }

    if (this.score >= 75) {
      return 'score-good';
    }

    if (this.score >= 60) {
      return 'score-ok';
    }

    return 'score-low';
  }

  getScoreMessage(): string {
    if (this.score >= 90) {
      return 'Dominas muy bien este tema y puedes explicarlo con seguridad.';
    }

    if (this.score >= 75) {
      return 'Buen trabajo. Estás cerca de dominarlo por completo.';
    }

    if (this.score >= 60) {
      return 'Hay base, pero todavía conviene reforzar algunas ideas clave.';
    }

    return 'Este resultado es una guía para practicar mejor, no un freno para seguir.';
  }

  async submitAnswers(): Promise<void> {
    if (!this.lesson || !this.selectedAnswer) {
      return;
    }

    this.isSubmitting = true;
    this.answers[this.currentQuestion] = this.selectedAnswer;

    let correctCount = 0;

    for (const [index, question] of this.lesson.content.questions.entries()) {
      if (this.answers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    }

    this.correctAnswersCount = correctCount;
    this.score = Math.round((correctCount / this.lesson.content.questions.length) * 100);
    this.answered = true;

    const progress = new LessonProgressEntity({
      lessonId: this.lesson.id,
      score: this.score,
      answers: this.answers,
      completedAt: new Date(),
      synced: false,
    });

    try {
      await this.lessonsService.saveProgress(progress);
      this.toast.success(this.score >= 75 ? 'Muy buen trabajo, sigue así' : 'Progreso guardado');
    } catch (error) {
      this.toast.error('No se pudo guardar el progreso');
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  restartLesson(): void {
    this.currentQuestion = 0;
    this.selectedAnswer = null;
    this.answers = {};
    this.answered = false;
    this.score = 0;
    this.correctAnswersCount = 0;
    this.showHint = false;
    this.showFeedbackModal = false;
    this.updateQuestion();
  }

  backToLessons(): void {
    this.router.navigate(['/lessons']);
  }

  openFeedback(): void {
    this.showFeedbackModal = true;
  }

  closeFeedback(): void {
    this.showFeedbackModal = false;
  }

  isCorrect(question: LessonQuestion, index: number): boolean {
    return this.answers[index] === question.correctAnswer;
  }

  getSelectedOption(question: LessonQuestion, index: number): string {
    const selected = question.options.find((option) => option.id === this.answers[index]);
    return selected?.text || 'Sin respuesta';
  }

  getCorrectOption(question: LessonQuestion): string {
    return question.options.find((option) => option.id === question.correctAnswer)?.text || 'Sin dato';
  }

  @HostListener('document:keydown.arrowRight')
  onArrowRight(): void {
    if (!this.answered && this.currentQuestion < (this.lesson?.content.questions.length || 0) - 1) {
      this.nextQuestion();
    }
  }

  @HostListener('document:keydown.arrowLeft')
  onArrowLeft(): void {
    if (!this.answered && this.currentQuestion > 0) {
      this.previousQuestion();
    }
  }
}
