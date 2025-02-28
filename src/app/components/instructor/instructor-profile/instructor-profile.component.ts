import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { instructorProfile, instructorProfileEducation, instructorProfileExperience, instructorProfileCourses, instructorProfileReviews, instructorProfileOverview, instructorProfileContactDetails } from 'src/app/models/model';
import { DemandeStatus, SujetPfe } from 'src/app/models/sujetpfe';
import { OurUsers } from 'src/app/models/users';
import { DataService } from 'src/app/shared/service/data/data.service';
import { routes } from 'src/app/shared/service/routes/routes';
import { SujetPfeService } from 'src/app/shared/service/sujetpfe/sujetpfe.service';
import { ToastrService } from 'ngx-toastr';

interface data {
  active?:boolean;
}
@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss']
})
export class InstructorProfileComponent implements OnInit{
  sujetPfe!: SujetPfe;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sujetPfeService: SujetPfeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const sujetId = this.route.snapshot.paramMap.get('id');
    if (sujetId) {
      this.sujetPfeService.getSujetById(+sujetId).subscribe((sujet) => {
        this.sujetPfe = sujet;
  
        // Récupérer les demandeurs associés
        this.sujetPfeService.getDemandeurs(+sujetId).subscribe((demandeurs) => {
          this.sujetPfe.demandeurs = demandeurs;
        });
      });
    }
  }
  

  accepterDemande(demandeur: OurUsers) {
    if (this.sujetPfe && this.sujetPfe.id) {
      this.sujetPfeService.accepterPostulation(this.sujetPfe.id, demandeur.id).subscribe({
        next: (updatedSujet) => {
          this.sujetPfe = updatedSujet;
          this.toastr.success(`Le sujet a été attribué à ${demandeur.name}`, 'Succès', {
            positionClass: 'toast-top-right',
            timeOut: 5000,
            progressBar: true,
            toastClass: 'toast-success-custom'
          });
        },
        error: () => {
          this.toastr.error('Erreur lors de l’acceptation de la demande.', 'Erreur', {
            positionClass: 'toast-top-right',
            timeOut: 5000,
            progressBar: true
          });
        }
      });
    }
  }

  refuserDemande(demandeur: OurUsers) {
    if (this.sujetPfe && this.sujetPfe.id) {
      this.sujetPfeService.refuserPostulation(this.sujetPfe.id, demandeur.id).subscribe({
        next: (updatedSujet) => {
          this.sujetPfe = updatedSujet;
          this.toastr.success(`La demande de ${demandeur.name} a été refusée.`, 'Succès', {
            positionClass: 'toast-top-right',
            timeOut: 5000,
            progressBar: true
          });
        },
        error: () => {
          this.toastr.error('Erreur lors du refus de la demande.', 'Erreur', {
            positionClass: 'toast-top-right',
            timeOut: 5000,
            progressBar: true
          });
        }
      });
    }
  }

  }
