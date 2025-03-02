import { Component, OnInit } from '@angular/core';
import { SujetPfe } from 'src/app/models/sujetpfe';
import { OuruserService } from 'src/app/shared/service/ouruser/ouruser.service';
import { routes } from 'src/app/shared/service/routes/routes';
import { SujetPfeService } from 'src/app/shared/service/sujetpfe/sujetpfe.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any; 
@Component({
  selector: 'app-sujetpfe-frontoffice',
  
  templateUrl: './sujetpfe-frontoffice.component.html',
  styleUrl: './sujetpfe-frontoffice.component.scss'
})
export class SujetpfeFrontoffice implements OnInit{

  sujets: SujetPfe[] = [];
  userId: number = 3; // ID de l'utilisateur connecté
  projetsPostules: SujetPfe[] = [];
  projetsAffectes: SujetPfe[] = [];  // Liste des projets affectés
  selectedSujet: SujetPfe | null = null;  // Sujet sélectionné pour afficher dans le modal
  selectedFile: File | null = null;
  selectedFileName: string = "";
  selectedSujetRapport: SujetPfe | null = null; // Sujet sélectionné pour l'upload
  searchTerm: string = ""; // Terme de recherche
  activeTab: string = "sujets-nonpostules"; // Onglet actif

  sujetsNonPostulesOriginal: any[] = [];
  sujetsPostulesOriginal: any[] = [];
  sujetsAffectesOriginal: any[] = [];


  constructor(private sujetPfeService: SujetPfeService, private http: HttpClient,private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.loadSujetsNonPostules();
    }
    
    loadSujetsNonPostules(): void {
      this.sujetPfeService.getSujetsNonPostules(this.userId).subscribe((data) => {
        this.sujets = data;
        this.sujetsNonPostulesOriginal = [...data]; // Stocker une copie originale pour éviter les problèmes de filtrage
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
        this.sujetsPostulesOriginal = [...data];
      });
    }

    loadProjetsAffectes(): void {
      this.sujetPfeService.getProjetsAffectes(this.userId).subscribe((data) => {
        this.projetsAffectes = data;
        this.sujetsAffectesOriginal = [...data];
      });
    }

    ouvrirDetails(sujet: SujetPfe): void {
      this.selectedSujet = sujet;
  }

    // Méthode pour ouvrir le modal de dépôt du rapport
    ouvrirDeposerRapportModal(sujet: SujetPfe) {
      this.selectedSujetRapport = sujet;
      this.selectedFile = null;
      this.selectedFileName = "";
      const modal = document.getElementById("deposerRapportModal");
      if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }

    // Méthode pour gérer la sélection de fichier
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        if (file.type !== "application/pdf") {
          alert("Veuillez sélectionner un fichier PDF.");
          return;
        }

        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
    }

    // Méthode pour envoyer le rapport au backend
    uploadRapport() {
      if (!this.selectedFile || !this.selectedSujetRapport) {
        this.toastr.error('Veuillez sélectionner un fichier.', 'Erreur', {
          positionClass: 'toast-top-right',
          timeOut: 5000,
          progressBar: true,
          toastClass: 'toast-error-custom'
        });
        return;
      }
    
      // Utiliser le service pour télécharger le fichier
      if (this.selectedFile && this.selectedSujetRapport.id) {
        this.sujetPfeService.uploadRapport(this.selectedSujetRapport.id, this.selectedFile).subscribe({
          next: (response) => {
            if (response.message) {
              this.toastr.success(response.message, 'Succès', {
                positionClass: 'toast-top-right',
                timeOut: 5000,
                progressBar: true,
                toastClass: 'toast-success-custom'
              });
    
              // Récupérer le modal et le fermer après le dépôt du rapport
              const modal = document.getElementById("deposerRapportModal");
              if (modal) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal); // Utiliser getInstance pour récupérer l'instance existante
                bootstrapModal.hide();
              }
            } else if (response.error) {
              this.toastr.error(response.error, 'Erreur', {
                positionClass: 'toast-top-right',
                timeOut: 5000,
                progressBar: true,
                toastClass: 'toast-error-custom'
              });
            }
          },
          error: (err) => {
            this.toastr.error('Erreur lors du dépôt du rapport.', 'Erreur', {
              positionClass: 'toast-top-right',
              timeOut: 5000,
              progressBar: true,
              toastClass: 'toast-error-custom'
            });
            console.error(err);
          },
        });
      }
    }

    filtrerSujets(): void {
      const termeRecherche = this.searchTerm.toLowerCase();
    
      if (this.activeTab === "sujets-nonpostules") {
        this.sujets = this.sujetsNonPostulesOriginal.filter(sujet => sujet.titre.toLowerCase().includes(termeRecherche));
      } else if (this.activeTab === "sujets-postules") {
        this.projetsPostules = this.sujetsPostulesOriginal.filter(sujet => sujet.titre.toLowerCase().includes(termeRecherche));
      } else if (this.activeTab === "sujets-affectes") {
        this.projetsAffectes = this.sujetsAffectesOriginal.filter(sujet => sujet.titre.toLowerCase().includes(termeRecherche));
      }
    }
    
    onTabChange(tabId: string): void {
      this.activeTab = tabId;
      this.searchTerm = ""; // Réinitialiser le terme de recherche lors du changement d'onglet
    
      if (tabId === "sujets-nonpostules") {
        this.loadSujetsNonPostules();
      } else if (tabId === "sujets-postules") {
        this.loadProjetsPostules();
      } else if (tabId === "sujets-affectes") {
        this.loadProjetsAffectes();
      }
    }
  }
