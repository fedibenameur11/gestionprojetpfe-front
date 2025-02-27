import { Component, OnInit } from '@angular/core';
import { SujetPfe } from 'src/app/models/sujetpfe';
import { OuruserService } from 'src/app/shared/service/ouruser/ouruser.service';
import { routes } from 'src/app/shared/service/routes/routes';
import { SujetPfeService } from 'src/app/shared/service/sujetpfe/sujetpfe.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-courses',
  
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.scss'
})
export class StudentCoursesComponent implements OnInit{

  sujets: SujetPfe[] = [];  // Liste des sujets
  userId: number = 3; // ID de l'utilisateur connecté
  projetsPostules: SujetPfe[] = [];
  projetsAffectes: SujetPfe[] = [];  // Liste des projets affectés

  constructor(private sujetPfeService: SujetPfeService, private ourUserService: OuruserService,private toastr: ToastrService) {}
  
  ngOnInit(): void {
    this.loadSujetsNonPostules();
  }
  
  loadSujetsNonPostules(): void {
    this.sujetPfeService.getSujetsNonPostules(this.userId).subscribe((data) => {
      this.sujets = data;
      console.log("Sujets non postulés : ", data);
    });
  }
  postuler(sujet: SujetPfe): void {
    if (sujet.id) {
      this.sujetPfeService.postulerSujetPfe(sujet.id, this.userId).subscribe({
        next: () => {
          this.toastr.success('Postulation réussie !', 'Succès', {
            positionClass: 'toast-top-right', // Affichage en haut à droite
            timeOut: 5000, // Durée 5 secondes
            progressBar: true, // Barre de progression
            toastClass: 'toast-success-custom' // Classe personnalisée pour le fond vert
          });
        },
        error: () => {
          this.toastr.error('Erreur lors de la postulation.', 'Erreur', {
            positionClass: 'toast-top-right', // Affichage en haut à droite
            timeOut: 5000, // Durée 5 secondes
            progressBar: true, // Barre de progression
          });
        }
      });
    }
    this.loadSujetsNonPostules();
  }
  
  
  

    loadProjetsPostules(): void {
      this.sujetPfeService.getProjetsPostules(this.userId).subscribe((data) => {
        this.projetsPostules = data;
      });
    }

    loadProjetsAffectes(): void {
      this.sujetPfeService.getProjetsAffectes(this.userId).subscribe((data) => {
        this.projetsAffectes = data;
      });
    }

}
