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
    
      // Réinitialiser les listes avant de filtrer
      if (this.activeTab === "sujets-nonpostules") {
        this.sujets = [...this.sujetsNonPostulesOriginal];
        this.sujets = this.sujets.filter(sujet => 
          sujet.titre && sujet.titre.toLowerCase().includes(termeRecherche) // Vérifier que sujet.titre existe
        );
        console.log("Sujets non postulés filtrés :", this.sujets); // Log pour déboguer
      } else if (this.activeTab === "sujets-postules") {
        this.projetsPostules = [...this.sujetsPostulesOriginal];
        this.projetsPostules = this.projetsPostules.filter(sujet => 
          sujet.titre && sujet.titre.toLowerCase().includes(termeRecherche) // Vérifier que sujet.titre existe
        );
        console.log("Sujets postulés filtrés :", this.projetsPostules); // Log pour déboguer
      } else if (this.activeTab === "sujets-affectes") {
        this.projetsAffectes = [...this.sujetsAffectesOriginal];
        this.projetsAffectes = this.projetsAffectes.filter(sujet => 
          sujet.titre && sujet.titre.toLowerCase().includes(termeRecherche) // Vérifier que sujet.titre existe
        );
        console.log("Sujets affectés filtrés :", this.projetsAffectes); // Log pour déboguer
      }
    }
    
    onTabChange(tabId: string): void {
      console.log("Onglet actif :", tabId); // Vérifiez la valeur de tabId
      this.activeTab = tabId;
      this.searchTerm = ""; // Réinitialiser le terme de recherche
    
      if (tabId === "sujets-nonpostules") {
        this.loadSujetsNonPostules();
      } else if (tabId === "sujets-postules") {
        this.loadProjetsPostules();
      } else if (tabId === "sujets-affectes") {
        this.loadProjetsAffectes();
      }
    }

    loadSujetsNonPostules(): void {
      this.sujetPfeService.getSujetsNonPostules(this.userId).subscribe((data) => {
        this.sujets = data;
        this.sujetsNonPostulesOriginal = [...data];
        console.log("Sujets non postulés chargés :", this.sujetsNonPostulesOriginal); // Log pour déboguer
      });
    }
    
    loadProjetsPostules(): void {
      this.sujetPfeService.getProjetsPostules(this.userId).subscribe((data) => {
        this.projetsPostules = data;
        this.sujetsPostulesOriginal = [...data];
        console.log("Sujets postulés chargés :", this.sujetsPostulesOriginal); // Log pour déboguer
      });
    }
    
    loadProjetsAffectes(): void {
      this.sujetPfeService.getProjetsAffectes(this.userId).subscribe((data) => {
        this.projetsAffectes = data;
        this.sujetsAffectesOriginal = [...data];
        console.log("Sujets affectés chargés :", this.sujetsAffectesOriginal); // Log pour déboguer
      });
    }
  }
