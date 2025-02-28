import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/service/data/data.service';
import { routes } from 'src/app/shared/service/routes/routes';
import { instructorCourse, instructorCourseList } from 'src/app/models/model';
import { DemandeStatus, SujetPfe } from 'src/app/models/sujetpfe';
import { SujetPfeService } from 'src/app/shared/service/sujetpfe/sujetpfe.service';
import { OuruserService } from 'src/app/shared/service/ouruser/ouruser.service';

declare var bootstrap: any; 
@Component({
  selector: 'app-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrls: ['./instructor-course.component.scss'],
})
export class InstructorCourseComponent implements OnInit {
  sujets: SujetPfe[] = [];  // Liste des sujets
  selectedSujet!: SujetPfe; // Sujet en cours d'édition
  selectedImage: string | ArrayBuffer | null = null;
  moderators: any[] = []; // Liste des modérateurs
  newSujet: SujetPfe = {
    titre: '',
    description: '',
    technologie: '',
    demandeStatus: DemandeStatus.PENDING,
    moderator: null,  // Initialiser à null
    userAttribue: null,  // Initialiser à null
    demandeurs: []
  };
  

  constructor(private sujetPfeService: SujetPfeService, private ourUserService: OuruserService) {}

  ngOnInit(): void {
    this.loadSujets();
    this.loadModerators(); // Charger les modérateurs lors de l'initialisation
  }

  loadSujets(): void {
    this.sujetPfeService.getAllSujets().subscribe((data) => {
      this.sujets = data;
      console.log("this is : ",data)
    });
  }
  openEditModal(sujet: SujetPfe): void {
    this.selectedSujet = { ...sujet };
    const modalElement = document.getElementById('editSujetModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  updateSujet(): void {
    if (!this.selectedSujet || this.selectedSujet.id === undefined) return;

    this.sujetPfeService.modifierSujet(this.selectedSujet.id, this.selectedSujet)
      .subscribe(() => {
        if (this.selectedSujet.moderator && this.selectedSujet.id ) {
          this.sujetPfeService.affecterModerateur(this.selectedSujet.id, this.selectedSujet.moderator.id)
            .subscribe(() => {
              this.loadSujets();  // Recharger la liste des sujets
              const modal = bootstrap.Modal.getInstance(document.getElementById('addSujetModal'));
              modal.hide();  // Fermer le modal après l'ajout
            });
        }
        this.loadSujets();
        this.closeEditModal();
      });
  }

  closeEditModal(): void {
    const modalElement = document.getElementById('editSujetModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  openDeleteModal(sujet: SujetPfe): void {
    this.selectedSujet = sujet;
    const modalElement = document.getElementById('deleteSujetModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteSujet(): void {
    if (!this.selectedSujet || this.selectedSujet.id === undefined) return;

    this.sujetPfeService.supprimerSujet(this.selectedSujet.id).subscribe(() => {
      this.sujets = this.sujets.filter(s => s.id !== this.selectedSujet!.id);
      this.closeDeleteModal();
    });
  }

  closeDeleteModal(): void {
    const modalElement = document.getElementById('deleteSujetModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
  onFileSelectedAjout(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Utiliser le nom du fichier pour l'image dans la base de données
      this.selectedImage = file.name; // Le nom du fichier sans chemin complet
      
      // Assigner le nom du fichier à l'objet 'selectedSujet'
      if (this.newSujet) {
        this.newSujet.image = file.name; // Enregistrez uniquement le nom de l'image
      }
    }
    
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Utiliser le nom du fichier pour l'image dans la base de données
      this.selectedImage = file.name; // Le nom du fichier sans chemin complet
      
      // Assigner le nom du fichier à l'objet 'selectedSujet'
      if (this.selectedSujet) {
        this.selectedSujet.image = file.name; // Enregistrez uniquement le nom de l'image
      }
    }
    
  }
  openAddModal() {
    // Réinitialiser l'objet pour éviter de pré-remplir les champs
    this.newSujet = {
      titre: '',
      description: '',
      technologie: '',
      image: '',
      demandeStatus: DemandeStatus.PENDING,
      moderator: null,
      userAttribue: null,
      demandeurs: []
    };
    
    const modal = new bootstrap.Modal(document.getElementById('addSujetModal'));
    modal.show();
  }
  

  // Ajouter un nouveau sujet
  addSujet() {
    this.sujetPfeService.ajouterSujet(this.newSujet).subscribe((sujetAjoute) => {
      // sujetAjoute contient le sujet nouvellement ajouté avec son ID
      if (this.newSujet.moderator && sujetAjoute.id) {
        this.sujetPfeService.affecterModerateur(sujetAjoute.id, this.newSujet.moderator.id)
          .subscribe(() => {
            this.loadSujets();  // Recharger la liste des sujets
            const modal = bootstrap.Modal.getInstance(document.getElementById('addSujetModal'));
            modal.hide();  // Fermer le modal après l'ajout
          });
      } else {
        this.loadSujets();  // Recharger la liste des sujets même si aucun modérateur n'est affecté
        const modal = bootstrap.Modal.getInstance(document.getElementById('addSujetModal'));
        modal.hide();  // Fermer le modal après l'ajout
      }
    });
  }

  loadModerators(): void {
    this.ourUserService.getAllModerators().subscribe((data) => {
      this.moderators = data; // Remplir la liste des modérateurs
    });
  }

}
